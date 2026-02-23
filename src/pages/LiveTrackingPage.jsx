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
        if (!busId) return;

        // Initial fetch
        const fetchBusData = async () => {
            const { data, error } = await supabase
                .from('registered_buses')
                .select('*')
                .eq('user_id', busId)
                .single();
            if (!error && data) {
                setBusData(data);
            }
            setLoading(false);
        };
        fetchBusData();

        // Supabase Realtime subscription for instant updates
        const channel = supabase
            .channel(`bus-live-${busId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'registered_buses',
                    filter: `user_id=eq.${busId}`,
                },
                (payload) => {
                    console.log('🔄 Real-time update received:', payload.new);
                    setBusData(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [busId]);

    if (loading)
        return <div className="p-8 text-center">Loading live details...</div>;
    if (!busData)
        return <div className="p-8 text-center text-red-500">Bus not found or offline.</div>;

    // Parse Route Data
    const routeStops = busData.bus_route_data?.stops || [];
    const currentStopIndex = busData.current_stop_index || 0;
    const filledSeats = busData.filled_seats || 0;
    const maxSeats = 40;
    const availableSeats = maxSeats - filledSeats;

    const currentBusStops = routeStops.map((stop, index) => ({
        name: stop,
        eta: index === currentStopIndex ? 'Current Stop' : index < currentStopIndex ? 'Departed' : `${(index - currentStopIndex) * 15} mins`,
        status: index === currentStopIndex ? 'current' : index < currentStopIndex ? 'departed' : 'upcoming'
    }));

    const routeName = `${busData.start_stop} - ${busData.end_stop}`;
    const nextStop = currentStopIndex < routeStops.length - 1 ? routeStops[currentStopIndex + 1] : 'End';
    const nextStopEta = currentStopIndex < routeStops.length - 1 ? '~15 mins away' : 'Final stop reached';

    return (<div className="min-h-screen bg-background flex flex-col pb-20">
        {/* Header */}
        <div className="bg-gradient-card px-4 py-4 border-b flex items-center shadow-sm sticky top-0 z-10">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
                <h1 className="text-lg font-bold text-primary flex items-center">
                    <Bus className="h-4 w-4 mr-2" />
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
                    <RouteMap stops={currentBusStops.map((s) => s.name)} />
                </ErrorBoundary>
            </Card>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 shadow-card bg-primary/5 border-primary/10">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Passengers</p>
                    <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-bold text-lg">{filledSeats} / {maxSeats}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{availableSeats} Seats Available</p>
                </Card>
                <Card className="p-3 shadow-card bg-primary/5 border-primary/10">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Next Stop</p>
                    <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-bold text-lg truncate">{nextStop}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{nextStopEta}</p>
                </Card>
            </div>

            {/* Timeline */}
            <Card className="p-4 shadow-card">
                <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-widest">Route Progress</h3>
                <div className="relative pl-2 space-y-6 border-l-2 border-dashed border-primary/20 ml-2">
                    {currentBusStops.map((stop, index) => (<div key={index} className="relative pl-6">
                        {/* Dot */}
                        <div className={`absolute -left-[9px] w-4 h-4 rounded-full border-2 border-background 
                            ${stop.status === 'current' ? 'bg-green-500 animate-ping' : stop.status === 'departed' ? 'bg-muted-foreground' : 'bg-primary'}`} />
                        {/* Dot Stable (if animating) */}
                        {stop.status === 'current' && <div className="absolute -left-[9px] w-4 h-4 rounded-full border-2 border-background bg-green-500" />}

                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`font-medium text-sm ${stop.status === 'current' ? 'text-green-600' : stop.status === 'departed' ? 'text-muted-foreground' : ''}`}>
                                    {stop.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {stop.status === 'current' ? 'Current Location' : stop.status === 'departed' ? 'Departed' : 'Upcoming'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-mono px-2 py-1 rounded bg-muted 
                                     ${stop.status === 'current' ? 'bg-green-100 text-green-700' : ''}`}>
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
