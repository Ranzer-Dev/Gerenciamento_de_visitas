import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  visits: any[]; // Num mundo ideal, importariamos o tipo Visit
}

export function DashboardStats({ visits = [] }: Props) {
  // Cálculos simples no Frontend (poderia ser no back, mas pra MVP tá ótimo)
  const totalVisitas = visits.length;
  const totalFocos = visits.filter(v => v.focoType !== 'NENHUM').length;
  const taxaFoco = totalVisitas > 0 ? ((totalFocos / totalVisitas) * 100).toFixed(0) : 0;

  return (
    <div className="absolute top-4 right-4 z-[1000] w-64">
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-zinc-200">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold uppercase text-zinc-500">
            Resumo da Operação
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid gap-4">
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Visitas Realizadas</span>
            <span className="text-2xl font-bold">{totalVisitas}</span>
          </div>

          <div className="flex justify-between items-center text-red-600">
            <span className="text-sm font-medium">Focos Encontrados</span>
            <span className="text-2xl font-bold">{totalFocos}</span>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Índice de Infestação:</span>
              <span className={Number(taxaFoco) > 5 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                {taxaFoco}%
              </span>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}