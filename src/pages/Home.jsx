import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation, Bell, ChevronDown, Bus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCity } from '@/contexts/CityContext';
import ChatBot from '@/components/ChatBot';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeBuses, setActiveBuses] = useState([]);
    const { selectedCity, setSelectedCity, cities } = useCity();
    const { t } = useLanguage();
    const navigate = useNavigate();
    // Fetch active buses in real-time
    useEffect(() => {
        const fetchActiveBuses = async () => {
            if (!selectedCity)
                return;
            console.log('🔍 Fetching buses for city:', selectedCity);
            const { data, error } = await supabase
                .from('registered_buses')
                .select('*')
                // .eq('city', selectedCity) // Temporarily disabled for debugging
                .eq('status', 'active'); // Only show active buses
            if (error) {
                console.error('❌ Error fetching buses:', error);
            }
            else {
                console.log('✅ Fetched buses:', data);
                setActiveBuses(data || []);
            }
        };
        fetchActiveBuses();
        // Optional: Set up an interval or real-time subscription here
        const interval = setInterval(fetchActiveBuses, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [selectedCity]);
    return (<div className="min-h-screen bg-background">
      {/* Header with App Name and City Selector */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{t("app.name")}</h1>
            <p className="text-sm text-muted-foreground">{t("app.tagline")}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-sm">
                <MapPin className="h-4 w-4 mr-2"/>
                {t(`city.${selectedCity}`)}
                <ChevronDown className="h-4 w-4 ml-2"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {cities.map((city) => (<DropdownMenuItem key={city} onClick={() => setSelectedCity(city)} className={selectedCity === city ? 'bg-primary/10' : ''}>
                  {t(`city.${city}`)}
                </DropdownMenuItem>))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search Bar with ChatBot */}
        <Card className="p-4 shadow-card">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
              <Input type="text" placeholder={t("search.placeholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background border-0 shadow-none focus-visible:ring-1"/>
            </div>
            <ChatBot />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 shadow-card hover:shadow-float transition-shadow cursor-pointer bg-gradient-card">
            <div className="flex items-center space-x-3">
              <Navigation className="h-6 w-6 text-primary"/>
              <div>
                <p className="font-medium text-sm">{t("quick.live_tracking")}</p>
                <p className="text-xs text-muted-foreground">{t("quick.track_buses")}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 shadow-card hover:shadow-float transition-shadow cursor-pointer bg-gradient-card">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-primary"/>
              <div>
                <p className="font-medium text-sm">{t("quick.notifications")}</p>
                <p className="text-xs text-muted-foreground">{t("quick.bus_alerts")}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Buses Section */}
        {activeBuses.length > 0 ? (<div>
            <h2 className="text-lg font-semibold mb-3">Active Buses in {selectedCity}</h2>
            <div className="space-y-3">
              {activeBuses.map((bus) => (<Card key={bus.id} onClick={() => navigate(`/tracking/${bus.user_id}`)} className="p-4 shadow-card bg-gradient-card border-l-4 border-l-green-500 cursor-pointer hover:shadow-lg transition-transform active:scale-[0.98]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Bus className="h-5 w-5"/>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{bus.bus_number || bus.user_id}</p>
                        <p className="text-xs text-muted-foreground">
                          {bus.start_stop} → {bus.end_stop}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Live
                    </Badge>
                  </div>
                </Card>))}
            </div>
          </div>) : (<Card className="p-6 text-center border-dashed">
            <p className="text-muted-foreground">No active buses found in {selectedCity}</p>
          </Card>)}

        {/* Emergency Contact */}
        <Card className="p-4 shadow-card bg-destructive/5 border-destructive/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
              <Bell className="h-4 w-4"/>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{t("emergency.title")}</p>
              <p className="text-xs text-muted-foreground">{t("emergency.subtitle")}</p>
            </div>
            <Button size="sm" variant="outline">
              {t("emergency.call")}
            </Button>
          </div>
        </Card>
      </div>
    </div>);
}
