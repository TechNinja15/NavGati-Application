import { useState, useRef, useEffect } from 'react';
import { Bus, MapPin, Clock, Users, Camera, Map, Play, Square, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import RouteMap from '@/components/RouteMap';
export default function DriverDashboard() {
  const [selectedCity, setSelectedCity] = useState('');
  const [filledSeats, setFilledSeats] = useState(0);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const { toast } = useToast();
  const { user } = useAuth();
  // 1. DATA EXTRACTION & PREPARATION
  // Extract Bus details
  const busPlateNumber = user?.email?.replace('DRV-', '') || 'Unknown Bus';
  // Parse route data from DB
  const driverDetails = user?.driverDetails;
  const rawRouteStops = driverDetails?.busRouteData?.stops;
  // Safeguard: Ensure it is an array
  const routeStops = Array.isArray(rawRouteStops) ? rawRouteStops : [];
  // Construct stops dynamically
  const currentBusStops = routeStops.length > 0 ? routeStops.map((stop, index) => ({
    name: stop,
    eta: index === 0 ? 'Current Stop' : `${index * 15} min`, // Mock ETA
    status: index === 0 ? 'current' : 'upcoming'
  })) : [
    // Fallback
    { name: driverDetails?.startStop || 'Start', eta: 'Current Stop', status: 'current' },
    ...((Array.isArray(driverDetails?.middleStops) ? driverDetails.middleStops : []).map((stop, index) => ({
      name: stop, eta: `${(index + 1) * 15} min`, status: 'upcoming'
    }))),
    { name: driverDetails?.endStop || 'End', eta: '45 min', status: 'upcoming' }
  ].filter(s => s.name);
  const maxSeats = 40;
  const totalSeats = maxSeats.toString();
  const cities = ['Bangalore', 'Punjab', 'Raipur', 'Mumbai', 'Delhi'];
  const getRoutesForCity = (city) => {
    const cityRoutes = {
      'Bangalore': ['Route 1: Central - Airport', 'Route 2: Mall - University', 'Route 3: Tech Park - Terminal'],
      'Punjab': ['Route 1: Ludhiana - Amritsar', 'Route 2: Chandigarh - Patiala', 'Route 3: Jalandhar - Pathankot'],
      'Raipur': ['Route 1: Central - Steel Plant', 'Route 2: University - Airport', 'Route 3: Station - IT Park'],
      'Mumbai': ['Route 1: CST - Bandra', 'Route 2: Andheri - Colaba', 'Route 3: Thane - Churchgate'],
      'Delhi': ['Route 1: CP - Airport', 'Route 2: Red Fort - Noida', 'Route 3: India Gate - Gurgaon']
    };
    return cityRoutes[city] || [];
  };
  const routes = selectedCity ? getRoutesForCity(selectedCity) : [];
  // Derived Route Number
  const routeNumber = currentBusStops.length > 0
    ? `${currentBusStops[0].name} - ${currentBusStops[currentBusStops.length - 1].name}`
    : "No Route Assigned";
  // Helper: sync live data to Supabase
  const syncToSupabase = async (updates) => {
    if (!user?.email) return;
    try {
      const { error } = await supabase
        .from('registered_buses')
        .update(updates)
        .eq('user_id', user.email);
      if (error) console.error('Sync error:', error);
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  // 2. EFFECTS & HANDLERS
  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
    else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
    catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  const handleStartJourney = async () => {
    if (!user?.email)
      return;
    try {
      const { error } = await supabase
        .from('registered_buses')
        .update({ status: 'active', filled_seats: 0, current_stop_index: 0 })
        .eq('user_id', user.email);
      if (error)
        throw error;
      setJourneyStarted(true);
      toast({
        title: "Journey Started!",
        description: `Bus ${busPlateNumber} is now active on ${routeNumber}`,
      });
    }
    catch (error) {
      console.error('Error starting journey:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start journey status.",
        variant: "destructive",
      });
    }
  };
  const handleStopJourney = async () => {
    if (!user?.email)
      return;
    try {
      const { error } = await supabase
        .from('registered_buses')
        .update({ status: 'inactive', filled_seats: 0, current_stop_index: 0 })
        .eq('user_id', user.email);
      if (error)
        throw error;
      setJourneyStarted(false);
      setCurrentStopIndex(0);
      toast({
        title: "Journey Completed",
        description: "Thank you for your service!",
      });
    }
    catch (error) {
      console.error('Error stopping journey:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    }
  };
  const moveToNextStop = () => {
    if (currentStopIndex < currentBusStops.length - 1) {
      const nextIndex = currentStopIndex + 1;
      setCurrentStopIndex(nextIndex);
      syncToSupabase({ current_stop_index: nextIndex });
      toast({
        title: "Stop Updated",
        description: `Now at ${currentBusStops[nextIndex].name}`,
      });
    }
  };
  const openGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/bus+route+${routeNumber}`;
    window.open(mapsUrl, '_blank');
  };
  // 3. RENDER - READY STATE
  if (!journeyStarted) {
    return (<div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary/5 p-4 flex justify-between items-start shadow-sm">
        {/* Top Left: Profile */}
        <Link to="/profile">
          <div className="bg-background p-2 rounded-full shadow-sm border border-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
        </Link>

        {/* Top Right: Bus & Route Info */}
        <div className="text-right">
          <h2 className="text-xl font-bold text-primary tracking-tight">{busPlateNumber}</h2>
          <p className="text-sm text-muted-foreground font-medium">
            {routeNumber || "Assigned Route"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Route Summary Card */}
        <Card className="p-4 mb-6 border-primary/10 shadow-sm bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Start Point</p>
              <p className="font-medium text-lg">{currentBusStops[0]?.name || 'Not Assigned'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">End Point</p>
              <p className="font-medium text-lg">{currentBusStops[currentBusStops.length - 1]?.name || 'Not Assigned'}</p>
            </div>
          </div>
          <div className="w-full bg-background/50 h-1.5 rounded-full mt-2 overflow-hidden flex">
            <div className="bg-primary w-full h-full opacity-20"></div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            {currentBusStops.length} Stops • ~{currentBusStops.length * 15} mins • {maxSeats} Seats
          </p>
        </Card>

        {/* Route Timeline Preview */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg px-1">Route Timeline</h3>
          <div className="relative pl-4 border-l-2 border-dashed border-muted ml-2 space-y-6 pb-2">
            {currentBusStops.map((stop, index) => (<div key={index} className="relative flex items-center justify-between pl-4">
              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] w-4 h-4 rounded-full border-2 border-background ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />

              <div>
                <p className="font-medium text-sm">{stop.name}</p>
                <p className="text-xs text-muted-foreground">Stop {index + 1}</p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Traffic Indicator */}
                <div className={`h-2 w-12 rounded-full ${index % 3 === 0 ? 'bg-green-500' : index % 3 === 1 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-xs font-mono text-muted-foreground">{stop.eta}</span>
              </div>
            </div>))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 bg-background border-t">
        <Button onClick={handleStartJourney} className="w-full h-12 text-lg font-semibold shadow-lg" size="lg" disabled={currentBusStops.length === 0}>
          <Play className="w-5 h-5 mr-2" />
          Start Journey
        </Button>
      </div>
    </div>);
  }
  // 4. RENDER - ACTIVE JOURNEY STATE
  return (<div className="min-h-screen bg-background p-3 sm:p-4 space-y-4 sm:space-y-6 max-w-md mx-auto pb-20">
    {/* Header */}
    <Card className="p-3 sm:p-4 shadow-card bg-gradient-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Bus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Bus {busPlateNumber}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{routeNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/profile">
            <Button variant="outline" size="sm">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Profile</span>
            </Button>
          </Link>
          <Button onClick={handleStopJourney} variant="destructive" size="sm">
            <Square className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">End</span>
          </Button>
        </div>
      </div>
    </Card>

    {/* Quick Stats */}
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <Card className="p-3 sm:p-4 shadow-card">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Passengers</p>
            <p className="text-sm sm:text-lg font-semibold">{filledSeats}/{totalSeats}</p>
          </div>
        </div>
      </Card>
      <Card className="p-3 sm:p-4 shadow-card">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">Current Stop</p>
            <p className="text-sm sm:text-lg font-semibold truncate">{currentBusStops[currentStopIndex]?.name || 'Unknown'}</p>
          </div>
        </div>
      </Card>
    </div>

    {/* Map Section */}
    <div className="w-full">
      <h2 className="text-base sm:text-lg font-semibold mb-2 ml-1">Live Map</h2>
      <ErrorBoundary>
        <RouteMap stops={currentBusStops.map(s => s.name)} />
      </ErrorBoundary>
    </div>

    {/* Bus Stops Timeline */}
    <Card className="p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold">Route Progress</h2>
        <Button onClick={openGoogleMaps} variant="outline" size="sm">
          <Map className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Google Maps</span>
        </Button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {currentBusStops.map((stop, index) => (<div key={index} className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border ${index === currentStopIndex
          ? 'bg-primary/10 border-primary'
          : index < currentStopIndex
            ? 'bg-muted/50 border-muted'
            : 'border-border'}`}>
          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 ${index === currentStopIndex
            ? 'bg-primary'
            : index < currentStopIndex
              ? 'bg-muted-foreground'
              : 'bg-border'}`} />

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base truncate">{stop.name}</p>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                {index < currentStopIndex ? 'Departed' : stop.eta}
              </p>
            </div>
          </div>

          {index === currentStopIndex && currentStopIndex < currentBusStops.length - 1 && (<Button onClick={moveToNextStop} size="sm" className="flex-shrink-0">
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>)}
        </div>))}
      </div>
    </Card>

    {/* Camera Section */}
    <Card className="p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-semibold">Bus Camera</h3>
        <Button onClick={() => setShowCamera(!showCamera)} variant={showCamera ? "destructive" : "default"} size="sm">
          <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">{showCamera ? 'Stop' : 'Start'}</span>
        </Button>
      </div>

      {showCamera ? (<video ref={videoRef} autoPlay playsInline className="w-full h-40 sm:h-48 bg-muted rounded-lg object-cover" />) : (<div className="w-full h-40 sm:h-48 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs sm:text-sm text-muted-foreground">Camera off</p>
        </div>
      </div>)}
    </Card>

    {/* Passenger Count */}
    <Card className="p-4 shadow-card">
      <h3 className="text-sm sm:text-base font-semibold mb-3">Passenger Count</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base">Current:</span>
          <div className="flex items-center space-x-2">
            <Button onClick={() => { const v = Math.max(0, filledSeats - 1); setFilledSeats(v); syncToSupabase({ filled_seats: v }); }} variant="outline" size="sm" disabled={filledSeats === 0} className="h-8 w-8 p-0">
              -
            </Button>
            <Badge variant="secondary" className="px-2 py-1 text-sm">
              {filledSeats}
            </Badge>
            <Button onClick={() => { const v = Math.min(parseInt(totalSeats), filledSeats + 1); setFilledSeats(v); syncToSupabase({ filled_seats: v }); }} variant="outline" size="sm" disabled={filledSeats >= parseInt(totalSeats)} className="h-8 w-8 p-0">
              +
            </Button>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(filledSeats / parseInt(totalSeats)) * 100}%` }} />
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          {((filledSeats / parseInt(totalSeats)) * 100).toFixed(0)}% occupied
        </p>
      </div>
    </Card>
  </div>);
}
