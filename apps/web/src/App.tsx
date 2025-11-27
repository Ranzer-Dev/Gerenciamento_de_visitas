import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardStats } from '@/components/DashboardStats';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Importe os componentes que acabamos de criar
import { MapClickHandler } from '@/components/MapClickHandler';
import { CreateVisitForm } from '@/components/CreateVisitForm';

const queryClient = new QueryClient();

type Visit = {
    id: string;
    latitude: number;
    longitude: number;
    focoType: string;
    notes: string;
    agent: { name: string };
};

function MapaDengue() {
  // 1. Busca dados do Backend
  
  const { data: visits } = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const res = await axios.get<Visit[]>('http://localhost:3333/visits');
      // Dica: Abra o console do navegador para pegar um agentId válido daqui!
      console.log("DADOS DO BANCO:", res.data); 
      return res.data;
    }
  });

  // 2. Estado para controlar onde clicamos (para abrir o form)
  const [newVisitLocation, setNewVisitLocation] = useState<{lat: number, lng: number} | null>(null);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>

      {visits && <DashboardStats visits={visits} />}

      <MapContainer center={[-23.550520, -46.633308]} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Detecta o clique no mapa */}
        <MapClickHandler onMapClick={(lat, lng) => setNewVisitLocation({ lat, lng })} />

        {/* Pinos Existentes (Vindos do Banco) */}
        {visits?.map((visit) => (
          <Marker key={visit.id} position={[visit.latitude, visit.longitude]}>
            <Popup>
              <div className="p-2">
                <strong className="block text-lg">{visit.focoType}</strong>
                <span className="text-gray-600">{visit.notes}</span>
                <hr className="my-2"/>
                <small className="text-gray-400">Agente: {visit.agent.name}</small>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Pino Temporário (Formulário de Criação) */}
        {newVisitLocation && (
          <Marker position={[newVisitLocation.lat, newVisitLocation.lng]}>
            <Popup 
                minWidth={300} 
                closeButton={false}
                eventHandlers={{
                    add: (e) => { e.target.openPopup() } 
                }}
            >
              <CreateVisitForm 
                latitude={newVisitLocation.lat}
                longitude={newVisitLocation.lng}
                onSuccess={() => setNewVisitLocation(null)} 
                onCancel={() => setNewVisitLocation(null)}
              />
            </Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MapaDengue />
    </QueryClientProvider>
  );
}