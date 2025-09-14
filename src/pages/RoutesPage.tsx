import { useState } from 'react'
import { Search, MapPin, Clock, Navigation, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Mock route data
  const routes = [
    {
      id: '42A',
      name: 'City Center - Airport Express',
      type: 'Express',
      duration: '45 min',
      stops: 12,
      frequency: '10 min',
      fare: '$3.50',
      isFavorite: true,
      status: 'On Time'
    },
    {
      id: '15B',
      name: 'Mall - University Circular',
      type: 'Regular',
      duration: '35 min',
      stops: 18,
      frequency: '15 min',
      fare: '$2.25',
      isFavorite: false,
      status: 'Delayed 5 min'
    },
    {
      id: '28C',
      name: 'Station - Hospital',
      type: 'Regular',
      duration: '25 min',
      stops: 14,
      frequency: '12 min',
      fare: '$2.00',
      isFavorite: true,
      status: 'On Time'
    },
    {
      id: '9D',
      name: 'Downtown - Suburbs',
      type: 'Express',
      duration: '55 min',
      stops: 8,
      frequency: '20 min',
      fare: '$4.00',
      isFavorite: false,
      status: 'Running Early'
    }
  ]

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'favorites') return matchesSearch && route.isFavorite
    if (activeTab === 'express') return matchesSearch && route.type === 'Express'
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    if (status.includes('Delayed')) return 'text-destructive'
    if (status.includes('Early')) return 'text-warning'
    return 'text-success'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <h1 className="text-2xl font-bold mb-2">Routes & Timetables</h1>
        <p className="text-muted-foreground">Find and track your bus routes</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <Card className="p-4 shadow-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by route number or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-0 shadow-none focus-visible:ring-1"
            />
          </div>
        </Card>

        {/* Route Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Routes</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="express">Express</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {filteredRoutes.map((route) => (
              <Card key={route.id} className="p-4 shadow-card bg-gradient-card">
                <div className="space-y-3">
                  {/* Route Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {route.id}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{route.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={route.type === 'Express' ? 'default' : 'secondary'} className="text-xs">
                            {route.type}
                          </Badge>
                          <span className={`text-xs font-medium ${getStatusColor(route.status)}`}>
                            {route.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Star className={`h-4 w-4 ${route.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>

                  {/* Route Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{route.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{route.stops} stops</span>
                    </div>
                    <div className="text-muted-foreground">
                      Every {route.frequency}
                    </div>
                    <div className="font-semibold text-primary">
                      {route.fare}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Track Live
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Stops
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {filteredRoutes.length === 0 && (
          <Card className="p-8 text-center shadow-card">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No routes found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}