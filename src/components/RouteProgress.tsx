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
  const getRouteStops = (routeId: string, routeName: string): RouteStop[] => {
    const routeStopsData: { [key: string]: RouteStop[] } = {
      // Bangalore Routes
      '305D': [
        { name: 'Whitefield ITPL', status: 'departed', arrivalTime: '10:30', traffic: 'Light' },
        { name: 'Marathahalli Bridge', status: 'departed', arrivalTime: '10:45', traffic: 'Moderate' },
        { name: 'Silk Board', status: 'current', arrivalTime: '11:00', traffic: 'Heavy' },
        { name: 'BTM Layout', status: 'upcoming', eta: '11:15', arrivalTime: '11:15', traffic: 'Moderate' },
        { name: 'Jayanagar', status: 'upcoming', eta: '11:30', arrivalTime: '11:32', traffic: 'Light' },
        { name: 'Electronic City', status: 'upcoming', eta: '11:45', arrivalTime: '11:48', traffic: 'Heavy' }
      ],
      'KIA-15': [
        { name: 'Koramangala', status: 'departed', arrivalTime: '09:30', traffic: 'Moderate' },
        { name: 'Forum Mall', status: 'departed', arrivalTime: '09:45', traffic: 'Heavy' },
        { name: 'Dairy Circle', status: 'current', arrivalTime: '10:00', traffic: 'Heavy' },
        { name: 'Hebbal', status: 'upcoming', eta: '10:25', arrivalTime: '10:28', traffic: 'Moderate' },
        { name: 'Yelahanka', status: 'upcoming', eta: '10:45', arrivalTime: '10:50', traffic: 'Light' },
        { name: 'Kempegowda Airport', status: 'upcoming', eta: '11:05', arrivalTime: '11:10', traffic: 'Light' }
      ],
      '500D': [
        { name: 'Yeshwanthpur', status: 'departed', arrivalTime: '10:15', traffic: 'Light' },
        { name: 'Malleswaram', status: 'departed', arrivalTime: '10:30', traffic: 'Moderate' },
        { name: 'Majestic', status: 'current', arrivalTime: '10:45', traffic: 'Heavy' },
        { name: 'Lalbagh', status: 'upcoming', eta: '11:00', arrivalTime: '11:02', traffic: 'Moderate' },
        { name: 'Jayanagar', status: 'upcoming', eta: '11:15', arrivalTime: '11:18', traffic: 'Heavy' },
        { name: 'Silk Board', status: 'upcoming', eta: '11:30', arrivalTime: '11:35', traffic: 'Heavy' }
      ],
      
      // Mumbai Routes
      '51': [
        { name: 'Colaba Depot', status: 'departed', arrivalTime: '09:00', traffic: 'Heavy' },
        { name: 'Gateway of India', status: 'departed', arrivalTime: '09:15', traffic: 'Heavy' },
        { name: 'CST Station', status: 'current', arrivalTime: '09:30', traffic: 'Heavy' },
        { name: 'Dadar', status: 'upcoming', eta: '09:50', arrivalTime: '09:55', traffic: 'Heavy' },
        { name: 'Bandra', status: 'upcoming', eta: '10:15', arrivalTime: '10:20', traffic: 'Moderate' },
        { name: 'Santacruz Depot', status: 'upcoming', eta: '10:35', arrivalTime: '10:40', traffic: 'Light' }
      ],
      '496LTD': [
        { name: 'Andheri Station', status: 'departed', arrivalTime: '10:00', traffic: 'Moderate' },
        { name: 'Juhu Beach', status: 'departed', arrivalTime: '10:15', traffic: 'Light' },
        { name: 'Versova', status: 'current', arrivalTime: '10:30', traffic: 'Moderate' },
        { name: 'Lokhandwala', status: 'upcoming', eta: '10:45', arrivalTime: '10:48', traffic: 'Heavy' },
        { name: 'Oshiwara', status: 'upcoming', eta: '11:00', arrivalTime: '11:05', traffic: 'Moderate' },
        { name: 'Marathon Chowk', status: 'upcoming', eta: '11:15', arrivalTime: '11:20', traffic: 'Light' }
      ],
      
      // Delhi Routes
      '405': [
        { name: 'Mori Gate', status: 'departed', arrivalTime: '08:30', traffic: 'Heavy' },
        { name: 'Red Fort', status: 'departed', arrivalTime: '08:45', traffic: 'Heavy' },
        { name: 'ITO', status: 'current', arrivalTime: '09:00', traffic: 'Heavy' },
        { name: 'Lajpat Nagar', status: 'upcoming', eta: '09:20', arrivalTime: '09:25', traffic: 'Heavy' },
        { name: 'Kalkaji', status: 'upcoming', eta: '09:40', arrivalTime: '09:45', traffic: 'Moderate' },
        { name: 'Badarpur Border', status: 'upcoming', eta: '10:00', arrivalTime: '10:05', traffic: 'Light' }
      ],
      'NCR': [
        { name: 'ISBT Kashmere Gate', status: 'departed', arrivalTime: '09:00', traffic: 'Heavy' },
        { name: 'Rajouri Garden', status: 'departed', arrivalTime: '09:25', traffic: 'Heavy' },
        { name: 'Dhaula Kuan', status: 'current', arrivalTime: '09:45', traffic: 'Heavy' },
        { name: 'Mahipalpur', status: 'upcoming', eta: '10:05', arrivalTime: '10:10', traffic: 'Moderate' },
        { name: 'Cyber City', status: 'upcoming', eta: '10:25', arrivalTime: '10:30', traffic: 'Heavy' },
        { name: 'Gurgaon Sector 14', status: 'upcoming', eta: '10:45', arrivalTime: '10:50', traffic: 'Light' }
      ],
      
      // Punjab Routes
      'PB12': [
        { name: 'Chandigarh Sector 43', status: 'departed', arrivalTime: '08:00', traffic: 'Moderate' },
        { name: 'Zirakpur', status: 'departed', arrivalTime: '08:20', traffic: 'Light' },
        { name: 'Rajpura', status: 'current', arrivalTime: '08:45', traffic: 'Moderate' },
        { name: 'Samana', status: 'upcoming', eta: '09:10', arrivalTime: '09:15', traffic: 'Light' },
        { name: 'Patran', status: 'upcoming', eta: '09:35', arrivalTime: '09:40', traffic: 'Moderate' },
        { name: 'Ludhiana Bus Stand', status: 'upcoming', eta: '10:00', arrivalTime: '10:05', traffic: 'Heavy' }
      ],
      'PB8': [
        { name: 'Amritsar Golden Temple', status: 'departed', arrivalTime: '07:30', traffic: 'Heavy' },
        { name: 'Tarn Taran', status: 'departed', arrivalTime: '08:00', traffic: 'Moderate' },
        { name: 'Goindwal Sahib', status: 'current', arrivalTime: '08:30', traffic: 'Light' },
        { name: 'Kapurthala', status: 'upcoming', eta: '09:00', arrivalTime: '09:05', traffic: 'Moderate' },
        { name: 'Phagwara', status: 'upcoming', eta: '09:25', arrivalTime: '09:30', traffic: 'Heavy' },
        { name: 'Jalandhar City', status: 'upcoming', eta: '09:50', arrivalTime: '09:55', traffic: 'Moderate' }
      ],
      
      // Raipur Routes (Default)
      'RP1': [
        { name: 'Telibandha', status: 'departed', arrivalTime: '10:00', traffic: 'Light' },
        { name: 'Shankar Nagar', status: 'departed', arrivalTime: '10:10', traffic: 'Moderate' },
        { name: 'Pandri Station', status: 'current', arrivalTime: '10:20', traffic: 'Moderate' },
        { name: 'City Center Mall', status: 'upcoming', eta: '10:30', arrivalTime: '10:32', traffic: 'Heavy' },
        { name: 'Marine Drive', status: 'upcoming', eta: '10:40', arrivalTime: '10:42', traffic: 'Light' },
        { name: 'Pandri Terminal', status: 'upcoming', eta: '10:50', arrivalTime: '10:52', traffic: 'Light' }
      ],
      'RP7': [
        { name: 'Shankar Nagar', status: 'departed', arrivalTime: '09:45', traffic: 'Light' },
        { name: 'VIP Road', status: 'departed', arrivalTime: '09:55', traffic: 'Moderate' },
        { name: 'Tatibandh', status: 'current', arrivalTime: '10:05', traffic: 'Heavy' },
        { name: 'Devendra Nagar', status: 'upcoming', eta: '10:15', arrivalTime: '10:18', traffic: 'Moderate' },
        { name: 'Kota', status: 'upcoming', eta: '10:25', arrivalTime: '10:28', traffic: 'Heavy' },
        { name: 'Mowa Terminal', status: 'upcoming', eta: '10:35', arrivalTime: '10:38', traffic: 'Light' }
      ],
      'RP3': [
        { name: 'Devendra Nagar', status: 'departed', arrivalTime: '08:30', traffic: 'Light' },
        { name: 'Station Road', status: 'departed', arrivalTime: '08:45', traffic: 'Moderate' },
        { name: 'Fafadih', status: 'current', arrivalTime: '09:00', traffic: 'Heavy' },
        { name: 'Risali', status: 'upcoming', eta: '09:20', arrivalTime: '09:25', traffic: 'Moderate' },
        { name: 'Bhilai Steel Plant', status: 'upcoming', eta: '09:40', arrivalTime: '09:45', traffic: 'Heavy' },
        { name: 'Durg Station', status: 'upcoming', eta: '10:00', arrivalTime: '10:05', traffic: 'Light' }
      ]
    }
    
    return routeStopsData[routeId] || [
      { name: 'Origin Stop', status: 'departed', arrivalTime: '10:00', traffic: 'Light' },
      { name: 'Intermediate Stop 1', status: 'departed', arrivalTime: '10:15', traffic: 'Moderate' },
      { name: 'Current Location', status: 'current', arrivalTime: '10:30', traffic: 'Moderate' },
      { name: 'Next Stop', status: 'upcoming', eta: '10:45', arrivalTime: '10:47', traffic: 'Heavy' },
      { name: 'Final Stop', status: 'upcoming', eta: '11:00', arrivalTime: '11:05', traffic: 'Light' }
    ]
  }
  
  const [stops] = useState<RouteStop[]>(getRouteStops(routeId, routeName))

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