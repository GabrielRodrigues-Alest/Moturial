# 08 - Performance Optimization (Otimização de Performance)

## 🎯 OBJETIVO
Garantir que todo código gerado pela IA seja otimizado para performance, escalabilidade e eficiência de recursos em ambiente de produção.

## ⚡ PRINCÍPIOS FUNDAMENTAIS

### 1. Performance by Design
- **SEMPRE** considerar performance desde o design inicial
- **NUNCA** otimizar prematuramente sem métricas
- **JAMAIS** sacrificar legibilidade por micro-otimizações

### 2. Measure, Don't Guess
- Profile primeiro, otimize depois
- Use métricas reais de produção
- Benchmark antes e depois de mudanças

## 📊 MÉTRICAS OBRIGATÓRIAS

### Web API Performance Targets
```typescript
// config/performance-targets.ts
export const PERFORMANCE_TARGETS = {
  // Response times (percentis)
  RESPONSE_TIME_P50: 100,    // 50% requests < 100ms
  RESPONSE_TIME_P95: 200,    // 95% requests < 200ms
  RESPONSE_TIME_P99: 500,    // 99% requests < 500ms
  
  // Throughput
  REQUESTS_PER_SECOND: 1000, // Mínimo 1k RPS
  CONCURRENT_USERS: 10000,   // Suporte a 10k usuários simultâneos
  
  // Resource usage
  CPU_USAGE_MAX: 70,         // Máximo 70% CPU usage
  MEMORY_USAGE_MAX: 80,      // Máximo 80% memory usage
  
  // Database
  DB_QUERY_TIME_MAX: 50,     // Queries < 50ms
  DB_CONNECTION_POOL_MIN: 10,
  DB_CONNECTION_POOL_MAX: 50,
  
  // Cache
  CACHE_HIT_RATIO_MIN: 80,   // Mínimo 80% cache hit ratio
  CACHE_TTL_DEFAULT: 300,    // 5 minutos TTL padrão
} as const;
```

### Performance Monitoring Implementation
```typescript
// utils/performance.ts
import { performance, PerformanceObserver } from 'perf_hooks';
import { logger } from '@/shared/infrastructure/logger';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observer: PerformanceObserver;

  private constructor() {
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > PERFORMANCE_TARGETS.RESPONSE_TIME_P95) {
          logger.warn('Slow operation detected', {
            name: entry.name,
            duration: entry.duration,
            type: entry.entryType
          });
        }
      });
    });
    
    this.observer.observe({ entryTypes: ['measure', 'function'] });
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const startMark = `${name}-start`;
      const endMark = `${name}-end`;
      
      performance.mark(startMark);
      
      try {
        const result = await fn();
        performance.mark(endMark);
        performance.measure(name, startMark, endMark);
        resolve(result);
      } catch (error) {
        performance.mark(endMark);
        performance.measure(name, startMark, endMark);
        reject(error);
      }
    });
  }

  measureSync<T>(name: string, fn: () => T): T {
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;
    
    performance.mark(startMark);
    
    try {
      const result = fn();
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
      return result;
    } catch (error) {
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
      throw error;
    }
  }
}

// Decorator for automatic performance monitoring
export function Measure(name?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const measureName = name || `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      const monitor = PerformanceMonitor.getInstance();
      
      if (originalMethod.constructor.name === 'AsyncFunction') {
        return monitor.measureAsync(measureName, () => originalMethod.apply(this, args));
      } else {
        return monitor.measureSync(measureName, () => originalMethod.apply(this, args));
      }
    };
    
    return descriptor;
  };
}
```

## 🗃️ DATABASE OPTIMIZATION

### Query Optimization Patterns
```typescript
// repositories/optimized-user.repository.ts
export class OptimizedUserRepository implements UserRepository {
  constructor(
    private prisma: PrismaClient,
    private redis: RedisClient,
    private logger: Logger
  ) {}

  // ✅ Efficient pagination with cursor-based approach
  async findUsersPaginated(params: PaginationParams): Promise<PaginatedResult<User>> {
    const { limit = 20, cursor } = params;
    
    const users = await this.prisma.user.findMany({
      take: limit + 1, // +1 to check if has next page
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        // Only select needed fields
      }
    });

    const hasNextPage = users.length > limit;
    const results = hasNextPage ? users.slice(0, -1) : users;
    const nextCursor = hasNextPage ? results[results.length - 1].id : null;

    return {
      data: results,
      pagination: {
        hasNextPage,
        nextCursor,
        total: await this.getCachedUserCount()
      }
    };
  }

  // ✅ Optimized search with full-text search
  async searchUsers(query: string, limit = 10): Promise<User[]> {
    const cacheKey = `search:users:${query}:${limit}`;
    
    // Check cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Use database full-text search capabilities
    const users = await this.prisma.$queryRaw<User[]>`
      SELECT id, email, name, ts_rank(search_vector, plainto_tsquery(${query})) as rank
      FROM users 
      WHERE search_vector @@ plainto_tsquery(${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `;

    // Cache results for 5 minutes
    await this.redis.setex(cacheKey, 300, JSON.stringify(users));
    
    return users;
  }

  // ✅ Batch operations to reduce database round-trips
  async createUsersBatch(usersData: CreateUserData[]): Promise<User[]> {
    return this.prisma.$transaction(async (tx) => {
      const createdUsers: User[] = [];
      
      // Use batch insert when possible
      const batchSize = 100;
      for (let i = 0; i < usersData.length; i += batchSize) {
        const batch = usersData.slice(i, i + batchSize);
        
        const batchResult = await tx.user.createMany({
          data: batch,
          skipDuplicates: true
        });
        
        // Get created users (if needed for return)
        const createdBatch = await tx.user.findMany({
          where: {
            email: { in: batch.map(u => u.email) }
          }
        });
        
        createdUsers.push(...createdBatch);
      }
      
      return createdUsers;
    });
  }

  // ✅ Optimized joins to prevent N+1 queries
  async getUsersWithPosts(userIds: string[]): Promise<UserWithPosts[]> {
    return this.prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Limit related records
        },
        _count: {
          select: { posts: true }
        }
      }
    });
  }

  private async getCachedUserCount(): Promise<number> {
    const cacheKey = 'users:count';
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return parseInt(cached, 10);
    }
    
    const count = await this.prisma.user.count();
    await this.redis.setex(cacheKey, 3600, count.toString()); // Cache for 1 hour
    
    return count;
  }
}
```

## 💾 CACHING STRATEGIES

### Multi-Level Caching Implementation
```typescript
// infrastructure/cache/cache-manager.ts
interface CacheConfig {
  ttl: number;
  maxSize?: number;
  strategy: 'lru' | 'fifo' | 'lfu';
}

export class CacheManager {
  private memoryCache: Map<string, { value: any; expires: number }>;
  private redis: RedisClient;
  private config: CacheConfig;

  constructor(redis: RedisClient, config: CacheConfig) {
    this.redis = redis;
    this.config = config;
    this.memoryCache = new Map();
    
    // Cleanup expired items periodically
    setInterval(() => this.cleanupMemoryCache(), 60000); // Every minute
  }

  // L1 Cache: Memory (fastest)
  private getFromMemory(key: string): any | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return item.value;
  }

  private setInMemory(key: string, value: any, ttl: number): void {
    if (this.config.maxSize && this.memoryCache.size >= this.config.maxSize) {
      // Evict oldest item (simple LRU)
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    
    this.memoryCache.set(key, {
      value,
      expires: Date.now() + (ttl * 1000)
    });
  }

  // L2 Cache: Redis (fast)
  private async getFromRedis(key: string): Promise<any | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.warn('Redis cache get failed', { key, error: error.message });
      return null;
    }
  }

  private async setInRedis(key: string, value: any, ttl: number): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.warn('Redis cache set failed', { key, error: error.message });
    }
  }

  // Public interface
  async get<T>(key: string): Promise<T | null> {
    // Try L1 cache first
    let value = this.getFromMemory(key);
    if (value !== null) {
      return value as T;
    }

    // Try L2 cache (Redis)
    value = await this.getFromRedis(key);
    if (value !== null) {
      // Populate L1 cache
      this.setInMemory(key, value, Math.min(this.config.ttl, 300)); // Max 5min in memory
      return value as T;
    }

    return null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const cacheTtl = ttl || this.config.ttl;
    
    // Set in both caches
    this.setInMemory(key, value, Math.min(cacheTtl, 300));
    await this.setInRedis(key, value, cacheTtl);
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.warn('Redis cache delete failed', { key, error: error.message });
    }
  }

  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, item] of this.memoryCache.entries()) {
      if (now > item.expires) {
        this.memoryCache.delete(key);
      }
    }
  }
}

// Cache decorators
export function Cache(ttl: number = 300) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
      const cacheManager: CacheManager = this.cacheManager;
      
      if (cacheManager) {
        const cached = await cacheManager.get(cacheKey);
        if (cached !== null) {
          return cached;
        }
      }
      
      const result = await originalMethod.apply(this, args);
      
      if (cacheManager && result !== null && result !== undefined) {
        await cacheManager.set(cacheKey, result, ttl);
      }
      
      return result;
    };
    
    return descriptor;
  };
}
```

## 🚀 API OPTIMIZATION

### Request/Response Optimization
```typescript
// middleware/compression.middleware.ts
import compression from 'compression';
import { Request, Response } from 'express';

export const compressionMiddleware = compression({
  // Only compress responses above 1KB
  threshold: 1024,
  
  // Compression level (1-9, 6 is good balance)
  level: 6,
  
  // Filter function to determine what to compress
  filter: (req: Request, res: Response) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Compress text-based responses
    const contentType = res.getHeader('content-type') as string;
    if (!contentType) return false;
    
    return /json|text|javascript|css|html/.test(contentType);
  }
});

// middleware/etag.middleware.ts
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const etagMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  
  res.json = function (body: any) {
    if (body && typeof body === 'object') {
      // Generate ETag from content
      const etag = crypto
        .createHash('md5')
        .update(JSON.stringify(body))
        .digest('hex');
      
      res.set('ETag', `"${etag}"`);
      
      // Check if client has same version
      const clientEtag = req.headers['if-none-match'];
      if (clientEtag === `"${etag}"`) {
        return res.status(304).end();
      }
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};
```

### Response Optimization Patterns
```typescript
// utils/response-optimizer.ts
interface OptimizedResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    cached: boolean;
    processingTime: number;
  };
}

export class ResponseOptimizer {
  static async optimizeResponse<T>(
    data: T,
    options: {
      removeNulls?: boolean;
      flattenArrays?: boolean;
      processingStartTime?: number;
      cached?: boolean;
    } = {}
  ): Promise<OptimizedResponse<T>> {
    let optimizedData = data;
    
    // Remove null/undefined values if requested
    if (options.removeNulls) {
      optimizedData = this.removeNulls(optimizedData);
    }
    
    // Calculate processing time
    const processingTime = options.processingStartTime 
      ? Date.now() - options.processingStartTime 
      : 0;

    return {
      data: optimizedData,
      meta: {
        timestamp: new Date().toISOString(),
        cached: options.cached || false,
        processingTime
      }
    };
  }

  private static removeNulls<T>(obj: T): T {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeNulls(item)).filter(item => item !== null && item !== undefined) as unknown as T;
    }
    
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = this.removeNulls(value);
        if (cleanedValue !== null && cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
      return cleaned as T;
    }
    
    return obj;
  }
}
```

## 📡 CONNECTION OPTIMIZATION

### Database Connection Pooling
```typescript
// config/database.ts
import { PrismaClient } from '@prisma/client';

export const createOptimizedPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  }).$extends({
    query: {
      // Add automatic query logging for slow queries
      $allOperations: async ({ operation, model, args, query }) => {
        const start = Date.now();
        const result = await query(args);
        const end = Date.now();
        const duration = end - start;
        
        if (duration > PERFORMANCE_TARGETS.DB_QUERY_TIME_MAX) {
          logger.warn('Slow database query detected', {
            model,
            operation,
            duration,
            args: JSON.stringify(args)
          });
        }
        
        return result;
      },
    },
  });
};

// Connection pool configuration
export const DATABASE_CONFIG = {
  // Connection pool settings
  pool: {
    min: PERFORMANCE_TARGETS.DB_CONNECTION_POOL_MIN,
    max: PERFORMANCE_TARGETS.DB_CONNECTION_POOL_MAX,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },
  
  // Query settings
  statement_timeout: '30s',
  idle_in_transaction_session_timeout: '30s',
};
```

## ⚡ FRONTEND OPTIMIZATION

### Bundle Optimization Strategies
```typescript
// webpack/performance.config.js
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  optimization: {
    // Code splitting
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 20,
        },
        common: {
          minChunks: 2,
          chunks: 'all',
          name: 'common',
          priority: 10,
        },
      },
    },
    
    // Tree shaking
    usedExports: true,
    sideEffects: false,
    
    // Minimize bundle size
    minimize: true,
  },
  
  plugins: [
    // Gzip compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    
    // Bundle analysis (only in analysis mode)
    ...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
  ],
  
  performance: {
    // Bundle size warnings
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: 'warning',
  },
};

// React component optimization
import React, { memo, useMemo, useCallback } from 'react';

// ✅ Memoized component to prevent unnecessary re-renders
export const OptimizedUserList = memo(({ users, onUserSelect }: UserListProps) => {
  // ✅ Memoize expensive calculations
  const sortedUsers = useMemo(() => {
    return users.sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);
  
  // ✅ Memoize event handlers
  const handleUserSelect = useCallback((userId: string) => {
    onUserSelect(userId);
  }, [onUserSelect]);
  
  return (
    <div>
      {sortedUsers.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onSelect={handleUserSelect}
        />
      ))}
    </div>
  );
});
```

## 🚫 PERFORMANCE ANTI-PATTERNS

### ❌ Práticas que Degradam Performance
```typescript
// NUNCA fazer isso - N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } }); // ❌
}

// NUNCA fazer isso - Buscar todos os registros
const allUsers = await prisma.user.findMany(); // ❌ Sem limit

// NUNCA fazer isso - Queries dentro de loops
for (let i = 0; i < userIds.length; i++) {
  await prisma.user.update({ where: { id: userIds[i] }, data: { active: true } }); // ❌
}

// NUNCA fazer isso - Não usar cache para dados frequentemente acessados
const getUser = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } }); // ❌ Sem cache
};
```

### ✅ Padrões de Alto Performance
```typescript
// ✅ Usar include/select para evitar N+1
const usersWithPosts = await prisma.user.findMany({
  include: { posts: true }
});

// ✅ Sempre usar paginação
const users = await prisma.user.findMany({
  take: 20,
  skip: offset,
  orderBy: { createdAt: 'desc' }
});

// ✅ Usar batch operations
await prisma.user.updateMany({
  where: { id: { in: userIds } },
  data: { active: true }
});

// ✅ Implementar cache adequado
@Cache(300)
async getUser(id: string): Promise<User> {
  return await prisma.user.findUnique({ where: { id } });
}
```

## 📊 MONITORING & BENCHMARKING

### Performance Testing Framework
```typescript
// tests/performance/benchmark.test.ts
import { performance } from 'perf_hooks';

describe('Performance Benchmarks', () => {
  describe('UserService', () => {
    it('should handle 1000 concurrent user lookups within SLA', async () => {
      const userIds = Array.from({ length: 1000 }, (_, i) => `user-${i}`);
      
      const start = performance.now();
      
      const promises = userIds.map(id => userService.getUserById(id));
      const results = await Promise.all(promises);
      
      const end = performance.now();
      const duration = end - start;
      
      expect(results).toHaveLength(1000);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      
      // Calculate average response time
      const avgResponseTime = duration / 1000;
      expect(avgResponseTime).toBeLessThan(PERFORMANCE_TARGETS.RESPONSE_TIME_P95);
    });

    it('should maintain performance under sustained load', async () => {
      const iterations = 100;
      const concurrency = 50;
      const durations: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        
        const promises = Array.from({ length: concurrency }, () => 
          userService.createUser({
            email: `test-${Date.now()}-${Math.random()}@example.com`,
            name: 'Test User'
          })
        );
        
        await Promise.all(promises);
        
        const end = performance.now();
        durations.push(end - start);
      }
      
      const p95 = durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)];
      expect(p95).toBeLessThan(PERFORMANCE_TARGETS.RESPONSE_TIME_P95);
    });
  });
});
```

## ✅ PERFORMANCE CHECKLIST

### Development Checklist
- [ ] Database queries otimizadas (evitar N+1)?
- [ ] Índices apropriados definidos?
- [ ] Connection pooling configurado?
- [ ] Cache implementado em múltiplas camadas?
- [ ] Response compression habilitada?
- [ ] Bundle size otimizado?
- [ ] Lazy loading implementado?
- [ ] Performance monitoring configurado?

### Production Checklist
- [ ] CDN configurado para assets estáticos?
- [ ] Database performance monitoring ativo?
- [ ] APM (Application Performance Monitoring) configurado?
- [ ] Cache hit ratios monitorados?
- [ ] Resource limits definidos?
- [ ] Horizontal scaling preparado?
- [ ] Performance budgets definidos?
- [ ] Alertas de performance configurados?

---
**Última atualização**: 2025-08-15
**Versão**: 1.0
