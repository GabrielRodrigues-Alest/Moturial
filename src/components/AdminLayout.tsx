import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Users, Bike, Calendar, BarChart3 } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="border-b bg-background">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="font-semibold">Moturial Admin</NavLink>
            <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <NavLink to="/admin" className={({isActive}) => isActive ? 'text-foreground' : ''}>Dashboard</NavLink>
              <Link to="/admin/stores" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Store className="h-4 w-4" />
                Lojas
              </Link>
              <Link to="/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Users className="h-4 w-4" />
                Usuários
              </Link>
              <Link to="/admin/motorcycles" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Bike className="h-4 w-4" />
                Motocicletas
              </Link>
              <Link to="/admin/rentals" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Calendar className="h-4 w-4" />
                Aluguéis
              </Link>
              <Link to="/admin/reports" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground truncate max-w-[180px]">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>Sair</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Moturial</div>
      </main>
    </div>
  );
};

export default AdminLayout;


