import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { useQuery, QueryClient, QueryClientProvider, useQueryClient, useMutation } from '@tanstack/react-query';
import 'leaflet/dist/leaflet.css';

// --- CORREÇÃO DO LEAFLET (ICONES 404) ---
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Força o Leaflet a usar as imagens importadas corretamente pelo Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// ----------------------------------------

import { api } from '@/lib/axios';

import { DashboardStats } from '@/components/DashboardStats';
import { MapClickHandler } from '@/components/MapClickHandler';
import { CreateVisitForm } from '@/components/CreateVisitForm';
import { AddressSearch } from '@/components/AddressSearch';
import { LoginPage } from '@/pages/LoginPage';
import { Button } from '@/components/ui/button';
import { MenuMobile } from '@/components/MenuMobile';

import { AuthProvider, useAuth } from '@/context/AuthContext';

const queryClient = new QueryClient();

function MapController({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 18, { duration: 2 }); 
    }
  }, [coords, map]);
  return null;
}

type Visit = {
  id: string;
  latitude: number;
  longitude: number;
  focoType: string;
  notes: string;
  agent: { name: string };
};

function MapaDengue() {
  const { user } = useAuth();
  const queryClientHook = useQueryClient();

  const { data: visits } = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const res = await api.get<Visit[]>('/visits');
      return res.data;
    },
    refetchInterval: 30000 
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, force }: { id: string, force: boolean }) => {
      await api.delete(`/visits/${id}?force=${force}`);
    },
    onSuccess: () => queryClientHook.invalidateQueries({ queryKey: ['visits'] }),
    onError: () => alert('Erro ao excluir. Verifique suas permissões.')
  });

  const [newVisitLocation, setNewVisitLocation] = useState<{lat: number, lng: number} | null>(null);
  const [flyToLocation, setFlyToLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');

  const markerRef = useRef<any>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setNewVisitLocation({ lat, lng });
        }
      },
    }),
    [],
  );

  return (
    <div style={{ height: '100dvh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      
      {showSearch && (
        <AddressSearch onSelectAddress={(lat, lng) => setFlyToLocation({ lat, lng })} />
      )}

      <MenuMobile 
        showDashboard={showDashboard} 
        setShowDashboard={setShowDashboard}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        mapLayer={mapLayer}
        setMapLayer={setMapLayer}
      />

      {showDashboard && visits && <DashboardStats visits={visits} />}

      <MapContainer 
        center={[-23.550520, -46.633308]} 
        zoom={18} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <MapController coords={flyToLocation} />
        <ZoomControl position="bottomright" />

        {mapLayer === 'satellite' ? (
           <TileLayer
             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
             attribution='Tiles &copy; Esri'
             maxZoom={19}
           />
        ) : (
           <TileLayer
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             attribution='&copy; OpenStreetMap contributors'
           />
        )}

        <MapClickHandler onMapClick={(lat, lng) => setNewVisitLocation({ lat, lng })} />

        {visits?.map((visit) => (
          <Marker key={visit.id} position={[visit.latitude, visit.longitude]}>
            <Popup>
              <div className="p-2 min-w-[150px]">
                <strong className="block text-lg">{visit.focoType}</strong>
                <span className="text-gray-600 block mb-2">{visit.notes}</span>
                <small className="text-gray-400 block mb-3">Agente: {visit.agent.name}</small>
                
                {user?.role === 'ADMIN' && (
                  <div className="flex gap-2 pt-2 border-t mt-1">
                    <Button 
                      variant="destructive" size="sm" className="h-7 text-xs w-full"
                      onClick={() => {
                         if(confirm('Tem certeza?')) deleteMutation.mutate({ id: visit.id, force: false });
                      }}
                    >
                      Desativar
                    </Button>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {newVisitLocation && (
          <Marker 
            draggable={true}
            eventHandlers={eventHandlers}
            position={[newVisitLocation.lat, newVisitLocation.lng]}
            ref={markerRef}
            opacity={0.8}
            zIndexOffset={1000}
          >
            <Popup 
                minWidth={300} 
                closeButton={false} 
                autoPan={true}
                eventHandlers={{ add: (e) => { e.target.openPopup() } }}
            >
              <div className="text-center mb-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
                Nova Marcação (Arraste para ajustar)
              </div>
              
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

function MainContent() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <LoginPage />;
  return <MapaDengue />;
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <MainContent />
      </QueryClientProvider>
    </AuthProvider>
  );
}