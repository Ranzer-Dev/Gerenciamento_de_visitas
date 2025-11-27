import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, LayoutDashboard, User, Map as MapIcon, Satellite, Search, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AgentManager } from '@/components/AgentManager';

interface Props {
  showDashboard: boolean;
  setShowDashboard: (v: boolean) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  mapLayer: 'satellite' | 'street';
  setMapLayer: (v: 'satellite' | 'street') => void;
}

export function MenuMobile({ 
  showDashboard, setShowDashboard, 
  showSearch, setShowSearch,
  mapLayer, setMapLayer 
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      {showAgents && <AgentManager onClose={() => setShowAgents(false)} />}

      <div className="absolute bottom-6 left-4 z-[1000] flex flex-col items-start gap-2">
        
        {isOpen && (
          <div className="bg-white rounded-lg shadow-2xl border border-zinc-200 p-4 w-72 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-100">
              <div className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800">{user?.name}</p>
                <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-zinc-800 px-2 py-0.5 rounded-full">
                  {user?.role === 'ADMIN' ? 'Admin' : 'Agente'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-2">Exibição</p>
              
              <Button 
                variant={showDashboard ? "secondary" : "ghost"} 
                className="w-full justify-start text-sm h-9"
                onClick={() => setShowDashboard(!showDashboard)}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {showDashboard ? 'Ocultar Dashboard' : 'Ver Dashboard'}
              </Button>

              <Button 
                variant={showSearch ? "secondary" : "ghost"} 
                className="w-full justify-start text-sm h-9"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="mr-2 h-4 w-4" />
                {showSearch ? 'Ocultar Busca' : 'Habilitar Busca'}
              </Button>
            </div>

            {user?.role === 'ADMIN' && (
              <>
                <div className="my-3 border-b border-zinc-100" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-2">Administração</p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-9 text-purple-700 hover:bg-purple-50"
                    onClick={() => setShowAgents(true)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Gerenciar Equipe
                  </Button>
                </div>
              </>
            )}

            <div className="my-3 border-b border-zinc-100" />

            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 ml-2">Tipo de Mapa</p>
              
              <Button 
                variant={mapLayer === 'satellite' ? "default" : "ghost"} 
                className={`w-full justify-start text-sm h-9 ${mapLayer === 'satellite' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                onClick={() => setMapLayer('satellite')}
              >
                <Satellite className="mr-2 h-4 w-4" />
                Satélite (Real)
              </Button>

              <Button 
                variant={mapLayer === 'street' ? "default" : "ghost"} 
                className={`w-full justify-start text-sm h-9 ${mapLayer === 'street' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                onClick={() => setMapLayer('street')}
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Mapa de Rua
              </Button>
            </div>

            <div className="my-3 border-b border-zinc-100" />

            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair do Sistema
            </Button>
          </div>
        )}

        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-2xl bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95 border-2 border-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </>
  );
}