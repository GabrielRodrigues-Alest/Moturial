import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();

  const storesQuery = useQuery({
    queryKey: ['admin', 'stores'],
    queryFn: async () => {
      const { data, error } = await queries.getStores();
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
    retry: 1,
  });

  if (storesQuery.isError) {
    const err = (storesQuery.error as any)?.message ?? 'Falha ao carregar dados';
    toast({ title: 'Erro', description: err, variant: 'destructive' });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Lojas ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{storesQuery.data?.length ?? 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;


