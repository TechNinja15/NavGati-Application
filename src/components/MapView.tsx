import { ArrowLeft, Navigation, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface MapViewProps {
  routeId: string
  routeName: string
  onBack: () => void
}

export default function MapView({ routeId, routeName, onBack }: MapViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-4 border-b">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Route Map</h1>
            <p className="text-sm text-muted-foreground">{routeName}</p>
          </div>
        </div>
      </div>

      <div className="relative h-[calc(100vh-120px)]">
        {/* Map Placeholder */}
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center">
            <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Interactive map would be displayed here</p>
            <p className="text-sm text-muted-foreground mt-2">
              Showing route {routeId} with real-time bus location
            </p>
          </div>
        </div>

        {/* Current Location Card */}
        <Card className="absolute top-4 left-4 right-4 p-4 shadow-lg bg-background/95 backdrop-blur">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Current Location</h3>
              <p className="text-xs text-muted-foreground">Fafadih Bus Stop</p>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success">
              Live
            </Badge>
          </div>
        </Card>

        {/* Route Info Card */}
        <Card className="absolute bottom-4 left-4 right-4 p-4 shadow-lg bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {routeId}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{routeName}</h3>
                <p className="text-xs text-muted-foreground">Next: Gudhiyari (ETA: 11:30)</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              6 stops remaining
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Speed:</span>
              <span className="ml-1 font-medium">45 km/h</span>
            </div>
            <div>
              <span className="text-muted-foreground">Distance:</span>
              <span className="ml-1 font-medium">2.3 km</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}