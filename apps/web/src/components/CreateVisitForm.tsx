import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Importando do Shadcn
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  latitude: number;
  longitude: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateVisitForm({ latitude, longitude, onSuccess, onCancel }: Props) {
  const [notes, setNotes] = useState('');
  const [focoType, setFocoType] = useState('NENHUM');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      // Enviando para o Backend
      return axios.post('http://localhost:3333/visits', {
        latitude,
        longitude,
        focoType,
        notes,
        hasFoco: focoType !== 'NENHUM', 
        
        agentId: 'b1cc9812-e18b-4c84-8ab0-bc4de4456be3', 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      onSuccess();
    },
    onError: (error) => {
        alert("Erro ao salvar! Veja o console.");
        console.error(error);
    }
  });

  return (
    <Card className="w-[300px] border-0 shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">Nova Visita</CardTitle>
        <p className="text-xs text-gray-500">
          Local: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        
        {/* Select Nativo (Mais simples que o do Shadcn para começar) */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Situação</label>
          <select 
            className="w-full p-2 text-sm border rounded-md bg-background"
            value={focoType}
            onChange={(e) => setFocoType(e.target.value)}
          >
            <option value="NENHUM">✅ Sem Foco (Limpo)</option>
            <option value="PNEUS">🛞 Pneus</option>
            <option value="CAIXA_DAGUA">💧 Caixa D'água</option>
            <option value="LIXO">🗑️ Lixo Acumulado</option>
            <option value="VASOS">🪴 Vasos de Planta</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Notas</label>
          <Textarea 
            placeholder="Observações..." 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="w-full" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            className="w-full" 
            onClick={() => mutation.mutate()} 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? '...' : 'Salvar'}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}