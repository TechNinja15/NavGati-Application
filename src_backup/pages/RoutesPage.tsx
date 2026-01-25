import { useState } from 'react'
import { Search, MapPin, Clock, Navigation, Star, Ticket } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCity } from '@/contexts/CityContext'
import { useNavigate } from 'react-router-dom'
import RouteProgress from '@/components/RouteProgress'
import MapView from '@/components/MapView'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showRouteProgress, setShowRouteProgress] = useState(false)
  const [showMapView, setShowMapView] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const { selectedCity } = useCity()
  const navigate = useNavigate()
  const { t } = useLanguage()

  // Real route data based on selected city
  const getCityRoutes = (city: string) => {
    const cityRoutes: { [key: string]: any[] } = {
      'Bangalore': [
        { id: '305D', name: 'Whitefield - Electronic City', type: 'Express', duration: '45 min', stops: 12, frequency: '10 min', fare: '₹35', isFavorite: true, status: 'On Time', traffic: 'Light' },
        { id: 'KIA-15', name: 'Koramangala - Kempegowda Airport', type: 'Express', duration: '65 min', stops: 8, frequency: '20 min', fare: '₹50', isFavorite: false, status: 'Delayed 5 min', traffic: 'Heavy' },
        { id: '500D', name: 'Yeshwanthpur - Silk Board', type: 'Regular', duration: '40 min', stops: 18, frequency: '12 min', fare: '₹25', isFavorite: true, status: 'On Time', traffic: 'Moderate' },
        { id: 'MF-1', name: 'Brigade Road - Marathahalli', type: 'Regular', duration: '35 min', stops: 14, frequency: '15 min', fare: '₹20', isFavorite: false, status: 'Running Early', traffic: 'Light' }
      ],
      'Mumbai': [
        { id: '51', name: 'Colaba - Santacruz Depot', type: 'Regular', duration: '55 min', stops: 25, frequency: '8 min', fare: '₹30', isFavorite: true, status: 'On Time', traffic: 'Heavy' },
        { id: '496LTD', name: 'Andheri - Marathon Chowk', type: 'Limited', duration: '40 min', stops: 12, frequency: '12 min', fare: '₹35', isFavorite: false, status: 'Delayed 3 min', traffic: 'Moderate' },
        { id: '39', name: 'Kurne Chowk - SEEPZ', type: 'Regular', duration: '45 min', stops: 18, frequency: '15 min', fare: '₹28', isFavorite: true, status: 'On Time', traffic: 'Light' },
        { id: 'AS-4', name: 'Bandra - Churchgate', type: 'Express', duration: '35 min', stops: 10, frequency: '10 min', fare: '₹32', isFavorite: false, status: 'Running Early', traffic: 'Moderate' }
      ],
      'Delhi': [
        { id: '405', name: 'Mori Gate - Badarpur Border', type: 'Regular', duration: '75 min', stops: 22, frequency: '12 min', fare: '₹25', isFavorite: true, status: 'On Time', traffic: 'Heavy' },
        { id: 'NCR', name: 'ISBT Kashmere Gate - Gurgaon', type: 'Express', duration: '60 min', stops: 8, frequency: '20 min', fare: '₹50', isFavorite: false, status: 'Delayed 8 min', traffic: 'Heavy' },
        { id: '411', name: 'ISBT - Ambedkar Nagar', type: 'Regular', duration: '50 min', stops: 18, frequency: '15 min', fare: '₹20', isFavorite: true, status: 'On Time', traffic: 'Moderate' },
        { id: '160', name: 'Karol Bagh - Gurgaon Stand', type: 'Express', duration: '45 min', stops: 12, frequency: '18 min', fare: '₹40', isFavorite: false, status: 'Running Early', traffic: 'Light' }
      ],
      'Punjab': [
        { id: 'PB12', name: 'Chandigarh - Ludhiana', type: 'Express', duration: '90 min', stops: 15, frequency: '30 min', fare: '₹80', isFavorite: true, status: 'On Time', traffic: 'Moderate' },
        { id: 'PB8', name: 'Amritsar - Jalandhar', type: 'Regular', duration: '75 min', stops: 22, frequency: '25 min', fare: '₹65', isFavorite: false, status: 'Delayed 10 min', traffic: 'Heavy' },
        { id: 'PB15', name: 'Patiala - Bathinda', type: 'Regular', duration: '85 min', stops: 20, frequency: '35 min', fare: '₹70', isFavorite: true, status: 'On Time', traffic: 'Light' },
        { id: 'PB3', name: 'Mohali - Rupnagar', type: 'Express', duration: '60 min', stops: 12, frequency: '40 min', fare: '₹55', isFavorite: false, status: 'Running Early', traffic: 'Moderate' }
      ],
      'Raipur': [
        { id: 'RP1', name: 'Telibandha - Pandri', type: 'Regular', duration: '25 min', stops: 12, frequency: '12 min', fare: '₹15', isFavorite: true, status: 'On Time', traffic: 'Light' },
        { id: 'RP7', name: 'Shankar Nagar - Mowa', type: 'Regular', duration: '30 min', stops: 15, frequency: '15 min', fare: '₹18', isFavorite: false, status: 'Delayed 5 min', traffic: 'Moderate' },
        { id: 'RP3', name: 'Devendra Nagar - Durg', type: 'Express', duration: '45 min', stops: 8, frequency: '20 min', fare: '₹25', isFavorite: true, status: 'On Time', traffic: 'Heavy' },
        { id: 'RP5', name: 'Station Road - Tatibandh', type: 'Regular', duration: '35 min', stops: 18, frequency: '18 min', fare: '₹20', isFavorite: false, status: 'Running Early', traffic: 'Light' }
      ]
    }
    return cityRoutes[city] || cityRoutes['Bangalore']
  }

  const routes = getCityRoutes(selectedCity)

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

  const handleTrackLive = (route: any) => {
    setSelectedRoute(route)
    setShowRouteProgress(true)
  }

  const handleBookTicket = () => {
    navigate('/book-ticket')
  }

  const handleViewMap = () => {
    setShowMapView(true)
    setShowRouteProgress(false)
  }

  const handleBackFromProgress = () => {
    setShowRouteProgress(false)
    setSelectedRoute(null)
  }

  const handleBackFromMap = () => {
    setShowMapView(false)
    setShowRouteProgress(true)
  }

  if (showMapView && selectedRoute) {
    return (
      <MapView
        routeId={selectedRoute.id}
        routeName={selectedRoute.name}
        onBack={handleBackFromMap}
      />
    )
  }

  if (showRouteProgress && selectedRoute) {
    return (
      <RouteProgress
        routeId={selectedRoute.id}
        routeName={selectedRoute.name}
        onBack={handleBackFromProgress}
        onViewMap={handleViewMap}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <h1 className="text-2xl font-bold mb-2">{t("routes.title")}</h1>
        <p className="text-muted-foreground">{t("routes.subtitle")}</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <Card className="p-4 shadow-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t("routes.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-0 shadow-none focus-visible:ring-1"
            />
          </div>
        </Card>

        {/* Route Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">{t("routes.tab.all")}</TabsTrigger>
            <TabsTrigger value="favorites">{t("routes.tab.favorites")}</TabsTrigger>
            <TabsTrigger value="express">{t("routes.tab.express")}</TabsTrigger>
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
                      <span className="text-muted-foreground">{route.stops} {t("stops_away")}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Every {route.frequency}
                    </div>
                    <div className="font-semibold text-primary">
                      {route.fare}
                    </div>
                  </div>

                  {/* Traffic Information */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${route.traffic === 'Light' ? 'bg-success' :
                          route.traffic === 'Moderate' ? 'bg-warning' : 'bg-destructive'
                        }`} />
                      <span className="text-xs text-muted-foreground">{t("routes.traffic")}: {route.traffic}</span>
                    </div>
                    <span className="text-xs font-medium">{t("routes.live_updates")}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={() => handleTrackLive(route)}>
                      <Navigation className="h-4 w-4 mr-2" />
                      {t("routes.track_live")}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={handleBookTicket}>
                      <Ticket className="h-4 w-4 mr-2" />
                      {t("routes.book_ticket")}
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
            <h3 className="font-semibold mb-2">{t("routes.no_routes")}</h3>
            <p className="text-muted-foreground text-sm">
              {t("routes.try_adjusting")}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}