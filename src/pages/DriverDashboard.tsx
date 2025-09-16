import { useState, useRef, useEffect } from 'react'
import { Bus, MapPin, Clock, Users, Camera, Map, Play, Square, ChevronRight, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function DriverDashboard() {
  const [busNumber, setBusNumber] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [routeNumber, setRouteNumber] = useState('')
  const [totalSeats, setTotalSeats] = useState('')
  const [filledSeats, setFilledSeats] = useState(0)
  const [journeyStarted, setJourneyStarted] = useState(false)
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  // Mock bus stops data
  const busStops = [
    { name: 'Central Station', eta: 'Current Stop', status: 'current' },
    { name: 'City Mall', eta: '5 min', status: 'upcoming' },
    { name: 'Tech Park', eta: '12 min', status: 'upcoming' },
    { name: 'University', eta: '18 min', status: 'upcoming' },
    { name: 'Airport Road', eta: '25 min', status: 'upcoming' },
    { name: 'Terminal', eta: '32 min', status: 'upcoming' },
  ]

  const cities = ['Bangalore', 'Punjab', 'Raipur', 'Mumbai', 'Delhi']
  
  const getRoutesForCity = (city: string) => {
    const cityRoutes = {
      'Bangalore': ['Route 1: Central - Airport', 'Route 2: Mall - University', 'Route 3: Tech Park - Terminal'],
      'Punjab': ['Route 1: Ludhiana - Amritsar', 'Route 2: Chandigarh - Patiala', 'Route 3: Jalandhar - Pathankot'],
      'Raipur': ['Route 1: Central - Steel Plant', 'Route 2: University - Airport', 'Route 3: Station - IT Park'],
      'Mumbai': ['Route 1: CST - Bandra', 'Route 2: Andheri - Colaba', 'Route 3: Thane - Churchgate'],
      'Delhi': ['Route 1: CP - Airport', 'Route 2: Red Fort - Noida', 'Route 3: India Gate - Gurgaon']
    }
    return cityRoutes[city] || []
  }

  const routes = selectedCity ? getRoutesForCity(selectedCity) : []

  useEffect(() => {
    if (showCamera) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [showCamera])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const handleStartJourney = () => {
    if (!busNumber || !selectedCity || !routeNumber || !totalSeats) {
      toast({
        title: "Missing Information",
        description: "Please fill in all bus details including city selection before starting journey.",
        variant: "destructive",
      })
      return
    }
    
    setJourneyStarted(true)
    toast({
      title: "Journey Started!",
      description: `Bus ${busNumber} is now active on ${routeNumber} in ${selectedCity}`,
    })
  }

  const handleStopJourney = () => {
    setJourneyStarted(false)
    setCurrentStopIndex(0)
    toast({
      title: "Journey Completed",
      description: "Thank you for your service!",
    })
  }

  const moveToNextStop = () => {
    if (currentStopIndex < busStops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1)
      toast({
        title: "Stop Updated",
        description: `Now at ${busStops[currentStopIndex + 1].name}`,
      })
    }
  }

  const openGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/bus+route+${routeNumber}`
    window.open(mapsUrl, '_blank')
  }

  if (!journeyStarted) {
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4">
      <div className="max-w-md mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="p-4 sm:p-6 shadow-card bg-gradient-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Driver Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Set up your bus details</p>
            </div>
          </div>
          <Link to="/profile">
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm">Profile</span>
            </Button>
          </Link>
        </div>
      </Card>

          {/* Bus Setup Form */}
          <Card className="p-4 sm:p-6 shadow-card">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Bus Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number</Label>
                <Input
                  id="busNumber"
                  placeholder="e.g., KA-01-AB-1234"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={selectedCity} onValueChange={(value) => {
                  setSelectedCity(value)
                  setRouteNumber('') // Reset route when city changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city, index) => (
                      <SelectItem key={index} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Select 
                  value={routeNumber} 
                  onValueChange={setRouteNumber}
                  disabled={!selectedCity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCity ? "Select your route" : "First select a city"} />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route, index) => (
                      <SelectItem key={index} value={route}>{route}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedCity && (
                  <p className="text-xs text-muted-foreground">Please select a city first to see available routes</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Total Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  placeholder="e.g., 45"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                />
              </div>

              <Button onClick={handleStartJourney} className="w-full mt-2" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Start Journey
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 space-y-4 sm:space-y-6 max-w-md mx-auto">
      {/* Header */}
      <Card className="p-3 sm:p-4 shadow-card bg-gradient-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Bus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Bus {busNumber}</h1>
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
              <p className="text-sm sm:text-lg font-semibold truncate">{busStops[currentStopIndex].name}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bus Stops Timeline */}
      <Card className="p-4 sm:p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold">Route Progress</h2>
          <Button onClick={openGoogleMaps} variant="outline" size="sm">
            <Map className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Map</span>
          </Button>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          {busStops.map((stop, index) => (
            <div key={index} className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border ${
              index === currentStopIndex 
                ? 'bg-primary/10 border-primary' 
                : index < currentStopIndex 
                  ? 'bg-muted/50 border-muted' 
                  : 'border-border'
            }`}>
              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 ${
                index === currentStopIndex 
                  ? 'bg-primary' 
                  : index < currentStopIndex 
                    ? 'bg-muted-foreground' 
                    : 'bg-border'
              }`} />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate">{stop.name}</p>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {index < currentStopIndex ? 'Departed' : stop.eta}
                  </p>
                </div>
              </div>
              
              {index === currentStopIndex && currentStopIndex < busStops.length - 1 && (
                <Button onClick={moveToNextStop} size="sm" className="flex-shrink-0">
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Camera Section */}
      <Card className="p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-semibold">Bus Camera</h3>
          <Button 
            onClick={() => setShowCamera(!showCamera)} 
            variant={showCamera ? "destructive" : "default"}
            size="sm"
          >
            <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">{showCamera ? 'Stop' : 'Start'}</span>
          </Button>
        </div>
        
        {showCamera ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-40 sm:h-48 bg-muted rounded-lg object-cover"
          />
        ) : (
          <div className="w-full h-40 sm:h-48 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">Camera off</p>
            </div>
          </div>
        )}
      </Card>

      {/* Passenger Count */}
      <Card className="p-4 shadow-card">
        <h3 className="text-sm sm:text-base font-semibold mb-3">Passenger Count</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base">Current:</span>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setFilledSeats(Math.max(0, filledSeats - 1))} 
                variant="outline" 
                size="sm"
                disabled={filledSeats === 0}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <Badge variant="secondary" className="px-2 py-1 text-sm">
                {filledSeats}
              </Badge>
              <Button 
                onClick={() => setFilledSeats(Math.min(parseInt(totalSeats), filledSeats + 1))} 
                variant="outline" 
                size="sm"
                disabled={filledSeats >= parseInt(totalSeats)}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(filledSeats / parseInt(totalSeats)) * 100}%` }}
            />
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            {((filledSeats / parseInt(totalSeats)) * 100).toFixed(0)}% occupied
          </p>
        </div>
      </Card>
    </div>
  )
}