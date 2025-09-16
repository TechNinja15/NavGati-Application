import { useState } from 'react'
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface RouteStop {
  name: string
  status: 'departed' | 'current' | 'upcoming'
  eta?: string
  traffic?: 'Light' | 'Moderate' | 'Heavy'
  arrivalTime?: string
}

interface RouteProgressProps {
  routeId: string
  routeName: string
  onBack: () => void
  onViewMap: () => void
}

export default function RouteProgress({ routeId, routeName, onBack, onViewMap }: RouteProgressProps) {
  const [stops] = useState<RouteStop[]>([
    { name: 'Raipur Railway Station', status: 'departed', arrivalTime: '10:45', traffic: 'Light' },
    { name: 'Fafadih', status: 'current', arrivalTime: '11:15', traffic: 'Moderate' },
    { name: 'Gudhiyari', status: 'upcoming', eta: '11:30', arrivalTime: '11:30', traffic: 'Heavy' },
    { name: 'Kota', status: 'upcoming', eta: '11:45', arrivalTime: '11:47', traffic: 'Moderate' },
    { name: 'GE Road', status: 'upcoming', eta: '12:00', arrivalTime: '12:03', traffic: 'Heavy' },
    { name: 'Devendra Nagar', status: 'upcoming', eta: '12:15', arrivalTime: '12:20', traffic: 'Light' }
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <div className="flex items-center space-x-3 mb-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Route Progress</h1>
            <p className="text-sm text-muted-foreground">Track the bus journey along its route</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Route Info */}
        <Card className="p-4 mb-6 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              {routeId}
            </div>
            <div>
              <h2 className="font-semibold">{routeName}</h2>
              <p className="text-sm text-muted-foreground">Live tracking active</p>
            </div>
          </div>
        </Card>

        {/* Route Stops */}
        <div className="space-y-4 mb-8">
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center space-x-4">
              {/* Stop Icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    stop.status === 'departed'
                      ? 'bg-success text-success-foreground'
                      : stop.status === 'current'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted border-2 border-muted-foreground'
                  }`}
                >
                  {stop.status === 'departed' && <div className="w-3 h-3 bg-success-foreground rounded-full" />}
                  {stop.status === 'current' && <MapPin className="h-3 w-3" />}
                  {stop.status === 'upcoming' && <div className="w-2 h-2 bg-muted-foreground rounded-full" />}
                </div>
                {index < stops.length - 1 && (
                  <div
                    className={`w-0.5 h-8 ${
                      stop.status === 'departed' ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </div>

              {/* Stop Details */}
              <div className="flex-1 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold ${
                        stop.status === 'current' ? 'text-primary' : ''
                      }`}
                    >
                      {stop.name}
                    </h3>
                    {stop.arrivalTime && (
                      <span className="text-sm font-medium text-muted-foreground">
                        {stop.arrivalTime}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">
                      {stop.status === 'departed' && 'Departed'}
                      {stop.status === 'current' && 'Current Location'}
                      {stop.status === 'upcoming' && stop.eta && `ETA: ${stop.eta}`}
                    </p>
                    {stop.traffic && (
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          stop.traffic === 'Light' ? 'bg-success' : 
                          stop.traffic === 'Moderate' ? 'bg-warning' : 'bg-destructive'
                        }`} />
                        <span className="text-xs text-muted-foreground">{stop.traffic}</span>
                      </div>
                    )}
                  </div>
                </div>
                {stop.status === 'current' && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary ml-2">
                    Bus Here
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Get Detailed Location */}
        <Card className="p-6 shadow-card bg-gradient-card text-center">
          <h2 className="text-lg font-semibold mb-2">Get Detailed Location</h2>
          <p className="text-muted-foreground mb-4">
            View the exact location on Google Maps
          </p>
          <Button onClick={onViewMap} className="w-full sm:w-auto">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Map
          </Button>
        </Card>
      </div>
    </div>
  )
}