import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { Search, Loader2, MapPin } from 'lucide-react';

interface Props {
  onSelectAddress: (lat: number, lng: number) => void;
}

interface PlaceResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function AddressSearch({ onSelectAddress }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSearch() {
    if (!query) return;
    setLoading(true);
    setIsOpen(true);
    
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        }
      });
      setResults(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-[90%] max-w-md">
      <div className="flex gap-2 shadow-xl bg-white rounded-lg p-1">
        <Input 
          placeholder="Buscar rua, bairro..." 
          className="border-0 focus-visible:ring-0 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="icon" variant="ghost">
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && results.length > 0 && (
        <Card className="mt-2 shadow-xl border-zinc-200 overflow-hidden">
          <ul>
            {results.map((place) => (
              <li 
                key={place.place_id}
                className="p-3 hover:bg-zinc-100 cursor-pointer text-sm border-b last:border-0 flex items-start gap-2"
                onClick={() => {
                  onSelectAddress(parseFloat(place.lat), parseFloat(place.lon));
                  setIsOpen(false);
                  setQuery(place.display_name.split(',')[0]);
                }}
              >
                <MapPin className="h-4 w-4 mt-1 text-zinc-400 shrink-0" />
                <span className="line-clamp-2">{place.display_name}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}