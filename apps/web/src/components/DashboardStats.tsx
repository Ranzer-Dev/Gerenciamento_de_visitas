import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  visits: { focoType: string }[];
}

export function DashboardStats({ visits = [] }: Props) {
  const totalVisitas = visits.length;
  const totalFocos = visits.filter(v => v.focoType !== 'NENHUM').length;
  const taxaFoco = totalVisitas > 0 ? ((totalFocos / totalVisitas) * 100).toFixed(0) : 0;

  return (
    <div className="absolute top-4 right-4 z-[999] w-64 pointer-events-none">
      <Card className="bg-white/90 backdrop-blur-md shadow-lg border-zinc-200 pointer-events-auto">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-xs font-bold uppercase text-zinc-500">
            Resumo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 grid gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Visitas</span>
            <span className="text-lg font-bold">{totalVisitas}</span>
          </div>
          <div className="flex justify-between items-center text-red-600">
            <span className="text-sm font-medium">Focos</span>
            <span className="text-lg font-bold">{totalFocos}</span>
          </div>
          <div className="pt-1 border-t text-xs text-zinc-500 flex justify-between">
            <span>Infestação:</span>
            <span className={Number(taxaFoco) > 5 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
              {taxaFoco}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}