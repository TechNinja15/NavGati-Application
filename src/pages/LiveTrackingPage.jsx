import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Bus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import RouteMap from '@/components/RouteMap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
export default function LiveTrackingPage() {
    const { busId } = useParams();
    const navigate = useNavigate();
    const [busData, setBusData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchBusData = async () => {
            if (!busId)
                return;
            const { data, error } = await supabase
                .from('registered_buses')
                .select('*')
                .eq('user_id', busId) // user_id is the bus plate/ID
                .single();
            if (!error && data) {
                setBusData(data);
            }
            setLoading(false);
        };
        fetchBusData();
        const interval = setInterval(fetchBusData, 10000); // Poll update
        return () => clearInterval(interval);
    }, [busId]);
    if (loading)
        return <div className="p-8 text-center">Loading live details...</div>;
    if (!busData)
        return <div className="p-8 text-center text-red-500">Bus not found or offline.</div>;
    // Parse Route Data
    const routeStops = busData.bus_route_data?.stops || [];
    const currentBusStops = routeStops.map((stop, index) => ({
        name: stop,
        eta: index === 0 ? 'Current Stop' : `${index * 15} mins`, // Mock ETA logic same as driver
        status: index === 0 ? 'current' : 'upcoming'
    }));
    const routeName = `${busData.start_stop} - ${busData.end_stop}`;
    return (<div className="min-h-screen bg-background flex flex-col pb-20">
            {/* Header */}
            <div className="bg-gradient-card px-4 py-4 border-b flex items-center shadow-sm sticky top-0 z-10">
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5"/>
                </Button>
                <div>
                    <h1 className="text-lg font-bold text-primary flex items-center">
                        <Bus className="h-4 w-4 mr-2"/>
                        {busData.bus_number || busData.user_id}
                    </h1>
                    <p className="text-xs text-muted-foreground">{routeName}</p>
                </div>
                <div className="ml-auto">
                    <Badge variant={busData.status === 'active' ? 'default' : 'secondary'} className="animate-pulse">
                        {busData.status === 'active' ? 'LIVE' : 'OFFLINE'}
                    </Badge>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Map Section */}
                <Card className="overflow-hidden shadow-card border-none">
                    <ErrorBoundary>
                        <RouteMap stops={currentBusStops.map((s) => s.name)}/>
                    </ErrorBoundary>
                </Card>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 shadow-card bg-primary/5 border-primary/10">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Passnegers</p>
                        <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 mr-2 text-primary"/>
                            <span className="font-bold text-lg">12 / 45</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Available Seats</p>
                    </Card>
                    <Card className="p-3 shadow-card bg-primary/5 border-primary/10">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Next Stop</p>
                        <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-2 text-primary"/>
                            <span className="font-bold text-lg truncate">{currentBusStops[1]?.name || "End"}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">~15 mins away</p>
                    </Card>
                </div>

                {/* Timeline */}
                <Card className="p-4 shadow-card">
                    <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-widest">Route Progress</h3>
                    <div className="relative pl-2 space-y-6 border-l-2 border-dashed border-primary/20 ml-2">
                        {currentBusStops.map((stop, index) => (<div key={index} className="relative pl-6">
                                {/* Dot */}
                                <div className={`absolute -left-[9px] w-4 h-4 rounded-full border-2 border-background 
                            ${index === 0 ? 'bg-green-500 animate-ping' : 'bg-primary'}`}/>
                                {/* Dot Stable (if animating) */}
                                {index === 0 && <div className="absolute -left-[9px] w-4 h-4 rounded-full border-2 border-background bg-green-500"/>}

                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`font-medium text-sm ${index === 0 ? 'text-green-600' : ''}`}>
                                            {stop.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {index === 0 ? 'Current Location' : index < 0 ? 'Departed' : 'Upcoming'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-mono px-2 py-1 rounded bg-muted 
                                     ${index === 0 ? 'bg-green-100 text-green-700' : ''}`}>
                                            {stop.eta}
                                        </span>
                                    </div>
                                </div>
                            </div>))}
                    </div>
                </Card>
            </div>
        </div>);
}
