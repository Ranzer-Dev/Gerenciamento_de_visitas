import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TEXTS } from '@/lib/constants';
import { api } from '@/lib/axios';

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
      return api.post('/visits', {
        latitude,
        longitude,
        focoType,
        notes,
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
        <CardTitle className="text-lg">{TEXTS.MAP.NEW_VISIT_TITLE}</CardTitle>
        <p className="text-xs text-gray-500">
          Local: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        
        <div className="space-y-1">
          <label className="text-sm font-medium">Situação</label>
          <select 
            className="w-full p-2 text-sm border rounded-md bg-background"
            value={focoType}
            onChange={(e) => setFocoType(e.target.value)}
          >
            <option value="NENHUM">{TEXTS.FOCOS.NENHUM}</option>
            <option value="PNEUS">{TEXTS.FOCOS.PNEUS}</option>
            <option value="CAIXA_DAGUA">{TEXTS.FOCOS.CAIXA_DAGUA}</option>
            <option value="LIXO">{TEXTS.FOCOS.LIXO}</option>
            <option value="VASOS">{TEXTS.FOCOS.VASOS}</option>
            <option value="OUTROS">{TEXTS.FOCOS.OUTROS}</option>
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
          <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); onCancel(); }}>
            {TEXTS.MAP.CANCEL_BTN}
          </Button>
          <Button 
            className="w-full" 
            onClick={(e) => { e.stopPropagation(); mutation.mutate(); }} 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? '...' : TEXTS.MAP.SAVE_BTN}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}