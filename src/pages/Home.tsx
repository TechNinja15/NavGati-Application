import { useState } from 'react'
import { Search, MapPin, Navigation, Clock, Bell } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import busHeroImage from '@/assets/bus-hero.jpg'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for nearby buses and stops
  const nearbyBuses = [
    { id: '42A', route: 'City Center - Airport', eta: '3 min', stops: 2, color: 'bus-route' },
    { id: '15B', route: 'Mall - University', eta: '7 min', stops: 4, color: 'bus-live' },
    { id: '28C', route: 'Station - Hospital', eta: '12 min', stops: 6, color: 'bus-stop' },
  ]

  const nearbyStops = [
    { name: 'Main Street', distance: '50m', buses: ['42A', '15B'] },
    { name: 'Central Plaza', distance: '200m', buses: ['28C', '9D'] },
    { name: 'Shopping Center', distance: '350m', buses: ['42A'] },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Hero Image */}
      <div className="relative h-48 bg-gradient-card overflow-hidden">
        <img 
          src={busHeroImage} 
          alt="Modern city buses" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Good Morning!</h1>
          <p className="text-muted-foreground">Find your bus, track in real-time</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <Card className="p-4 shadow-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search routes, stops, or bus numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-0 shadow-none focus-visible:ring-1"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 shadow-card hover:shadow-float transition-shadow cursor-pointer bg-gradient-card">
            <div className="flex items-center space-x-3">
              <Navigation className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium text-sm">Live Tracking</p>
                <p className="text-xs text-muted-foreground">Track buses</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 shadow-card hover:shadow-float transition-shadow cursor-pointer bg-gradient-card">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium text-sm">Notifications</p>
                <p className="text-xs text-muted-foreground">Bus alerts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Nearby Buses */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Nearby Buses</h2>
          <div className="space-y-3">
            {nearbyBuses.map((bus) => (
              <Card key={bus.id} className="p-4 shadow-card bg-gradient-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {bus.id}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{bus.route}</p>
                      <p className="text-xs text-muted-foreground">{bus.stops} stops away</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {bus.eta}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Nearby Stops */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Nearby Stops</h2>
          <div className="space-y-3">
            {nearbyStops.map((stop, index) => (
              <Card key={index} className="p-4 shadow-card bg-gradient-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-bus-stop" />
                    <div>
                      <p className="font-medium text-sm">{stop.name}</p>
                      <p className="text-xs text-muted-foreground">{stop.distance} away</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {stop.buses.map((busId) => (
                      <Badge key={busId} variant="outline" className="text-xs">
                        {busId}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <Card className="p-4 shadow-card bg-destructive/5 border-destructive/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Emergency Contact</p>
              <p className="text-xs text-muted-foreground">24/7 helpline: 1800-123-BUS</p>
            </div>
            <Button size="sm" variant="outline">
              Call
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}