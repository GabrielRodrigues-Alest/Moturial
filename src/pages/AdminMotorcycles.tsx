import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { queries } from '@/lib/supabase';
import { 
  Bike, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Fuel,
  Gauge,
  Calendar,
  MapPin
} from 'lucide-react';

interface Motorcycle {
  id: string;
  name: string;
  type: string;
  engine: string;
  fuel: string;
  year: number;
  available: boolean;
  pricePerDay: number;
  location: string;
  mileage?: number;
  lastMaintenance?: string;
  condition: 'excellent' | 'good' | 'fair' | 'maintenance';
}

const AdminMotorcycles: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);

  const motorcyclesQuery = useQuery({
    queryKey: queries.motorcycles.queryKey,
    queryFn: queries.motorcycles.queryFn,
    staleTime: 60_000,
    retry: 1,
  });

  const motorcycles = motorcyclesQuery.data || [];
  const filteredMotorcycles = motorcycles.filter(moto => {
    const matchesSearch = moto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'available' && moto.available) ||
      (statusFilter === 'unavailable' && !moto.available);
    return matchesSearch && matchesStatus;
  });

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'excellent': return { variant: 'default' as const, label: 'Excelente' };
      case 'good': return { variant: 'secondary' as const, label: 'Bom' };
      case 'fair': return { variant: 'outline' as const, label: 'Regular' };
      case 'maintenance': return { variant: 'destructive' as const, label: 'Manutenção' };
      default: return { variant: 'outline' as const, label: condition };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frota de Motocicletas</h1>
          <p className="text-muted-foreground">Gerencie a frota de motocicletas disponíveis</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Motocicleta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bike className="h-5 w-5" />
            Motocicletas ({filteredMotorcycles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar motocicleta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="available">Disponíveis</SelectItem>
                  <SelectItem value="unavailable">Indisponíveis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Motocicleta</TableHead>
                  <TableHead>Especificações</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Preço/Dia</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMotorcycles.map((motorcycle) => {
                  const condition = getConditionBadge(motorcycle.condition);
                  return (
                    <TableRow key={motorcycle.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{motorcycle.name}</div>
                          <div className="text-sm text-muted-foreground">{motorcycle.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Gauge className="h-3 w-3" />
                            {motorcycle.engine}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Fuel className="h-3 w-3" />
                            {motorcycle.fuel} • {motorcycle.year}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={motorcycle.available ? 'default' : 'secondary'}>
                            {motorcycle.available ? 'Disponível' : 'Indisponível'}
                          </Badge>
                          <Badge variant={condition.variant}>
                            {condition.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(motorcycle.pricePerDay)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {motorcycle.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMotorcycles;
