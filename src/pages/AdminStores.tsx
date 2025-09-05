import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AdminStores: React.FC = () => {
  const { toast } = useToast();

  const storesQuery = useQuery({
    queryKey: ['admin', 'stores', 'list'],
    queryFn: async () => {
      const { data, error } = await queries.getStores();
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
    retry: 1,
  });

  if (storesQuery.isError) {
    const err = (storesQuery.error as any)?.message ?? 'Falha ao carregar lojas';
    toast({ title: 'Erro', description: err, variant: 'destructive' });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Lojas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(storesQuery.data ?? []).map((store: any) => (
          <Card key={store.id}>
            <CardHeader>
              <CardTitle className="text-base">{store.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{store.address}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminStores;


