import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Shield, ShieldAlert, X } from 'lucide-react';
import { api } from '@/lib/axios';

interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface Props {
  onClose: () => void;
}

export function AgentManager({ onClose }: Props) {
  const queryClient = useQueryClient();

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await api.get<Agent[]>('/agents');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/agents/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao deletar')
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, newRole }: { id: string, newRole: 'ADMIN' | 'USER' }) => {
      await api.put(`/agents/${id}`, { role: newRole });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] })
  });

  return (
    <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Gestão de Equipe</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto p-0">
          {isLoading ? (
            <p className="p-4 text-center">Carregando...</p>
          ) : (
            <div className="divide-y">
              {agents?.map((agent) => (
                <div key={agent.id} className="p-4 flex items-center justify-between bg-white hover:bg-zinc-50">
                  
                  <div>
                    <p className="font-bold text-sm">{agent.name}</p>
                    <p className="text-xs text-zinc-500">{agent.email}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${
                      agent.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {agent.role}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="icon" variant="ghost" 
                      title="Alterar Permissão"
                      onClick={() => updateRoleMutation.mutate({ 
                        id: agent.id, 
                        newRole: agent.role === 'ADMIN' ? 'USER' : 'ADMIN' 
                      })}
                    >
                      {agent.role === 'ADMIN' ? <ShieldAlert className="text-purple-600 h-4 w-4"/> : <Shield className="text-gray-400 h-4 w-4"/>}
                    </Button>

                    <Button 
                      size="icon" variant="ghost" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if(confirm(`Tem certeza que deseja remover ${agent.name}?`)) {
                          deleteMutation.mutate(agent.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}