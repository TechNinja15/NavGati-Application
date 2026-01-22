import { useState } from 'react'
import { Search, MapPin, Navigation, Clock, Bell, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCity } from '@/contexts/CityContext'
import ChatBot from '@/components/ChatBot'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const { selectedCity, setSelectedCity, cities } = useCity()
  const { t } = useLanguage()

  // Mock data for nearby buses and stops based on selected city
  const getCityData = (city: string) => {
    const cityData: { [key: string]: { buses: any[], stops: any[] } } = {
      'Bangalore': {
        buses: [
          { id: 'V1', route: 'Whitefield - Electronic City', eta: '3 min', stops: 2 },
          { id: 'AS4', route: 'Koramangala - Majestic', eta: '7 min', stops: 4 },
          { id: 'G4', route: 'Yeshwanthpur - Silk Board', eta: '12 min', stops: 6 },
        ],
        stops: [
          { name: 'Brigade Road', distance: '50m', buses: ['V1', 'AS4'] },
          { name: 'MG Road Metro', distance: '200m', buses: ['G4', 'MF1'] },
          { name: 'Forum Mall', distance: '350m', buses: ['V1'] },
        ]
      },
      'Mumbai': {
        buses: [
          { id: '25', route: 'Bandra - Colaba', eta: '5 min', stops: 3 },
          { id: 'A1', route: 'Andheri - CST', eta: '8 min', stops: 5 },
          { id: 'C210', route: 'Powai - Churchgate', eta: '15 min', stops: 8 },
        ],
        stops: [
          { name: 'Linking Road', distance: '80m', buses: ['25', 'A1'] },
          { name: 'Bandra Station', distance: '150m', buses: ['C210', '25'] },
          { name: 'Infinity Mall', distance: '300m', buses: ['A1'] },
        ]
      },
      'Delhi': {
        buses: [
          { id: '764', route: 'CP - Gurgaon', eta: '4 min', stops: 2 },
          { id: '543', route: 'ISBT - Airport', eta: '9 min', stops: 6 },
          { id: '615', route: 'Karol Bagh - Noida', eta: '11 min', stops: 4 },
        ],
        stops: [
          { name: 'Connaught Place', distance: '60m', buses: ['764', '543'] },
          { name: 'Rajiv Chowk Metro', distance: '180m', buses: ['615', '764'] },
          { name: 'Palika Bazaar', distance: '320m', buses: ['543'] },
        ]
      },
      'Punjab': {
        buses: [
          { id: 'PB12', route: 'Chandigarh - Ludhiana', eta: '6 min', stops: 3 },
          { id: 'PB8', route: 'Amritsar - Jalandhar', eta: '10 min', stops: 5 },
          { id: 'PB15', route: 'Patiala - Bathinda', eta: '14 min', stops: 7 },
        ],
        stops: [
          { name: 'Sector 17', distance: '90m', buses: ['PB12', 'PB8'] },
          { name: 'Bus Stand', distance: '220m', buses: ['PB15', 'PB12'] },
          { name: 'Civil Hospital', distance: '400m', buses: ['PB8'] },
        ]
      },
      'Raipur': {
        buses: [
          { id: 'RP1', route: 'Telibandha - Pandri', eta: '5 min', stops: 2 },
          { id: 'RP7', route: 'Shankar Nagar - Mowa', eta: '8 min', stops: 4 },
          { id: 'RP3', route: 'Devendra Nagar - Durg', eta: '13 min', stops: 6 },
        ],
        stops: [
          { name: 'Pandri Station', distance: '70m', buses: ['RP1', 'RP7'] },
          { name: 'City Center Mall', distance: '160m', buses: ['RP3', 'RP1'] },
          { name: 'Marine Drive', distance: '280m', buses: ['RP7'] },
        ]
      }
    }
    return cityData[city] || cityData['Bangalore']
  }

  const { buses: nearbyBuses, stops: nearbyStops } = getCityData(selectedCity)

  return (
    <div className="min-h-screen bg-background">
      {/* Header with App Name and City Selector */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{t("app.name")}</h1>
            <p className="text-sm text-muted-foreground">{t("app.tagline")}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                {t(`city.${selectedCity}`)}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={selectedCity === city ? 'bg-primary/10' : ''}
                >
                  {t(`city.${city}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search Bar with ChatBot */}
        <Card className="p-4 shadow-card">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-0 shadow-none focus-visible:ring-1"
              />
            </div>
            <ChatBot />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 shadow-card hover:shadow-float transition-shadow cursor-pointer bg-gradient-card">
            <div className="flex items-center space-x-3">
              <Navigation className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium text-sm">{t("quick.live_tracking")}</p>
                <p className="text-xs text-muted-foreground">{t("quick.track_buses")}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 shadow-card hover:shadow-float transition-shadow cursor-pointer bg-gradient-card">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium text-sm">{t("quick.notifications")}</p>
                <p className="text-xs text-muted-foreground">{t("quick.bus_alerts")}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Nearby Buses */}
        <div>
          <h2 className="text-lg font-semibold mb-3">{t("nearby.buses")}</h2>
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
                      <p className="text-xs text-muted-foreground">{bus.stops} {t("stops_away")}</p>
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
          <h2 className="text-lg font-semibold mb-3">{t("nearby.stops")}</h2>
          <div className="space-y-3">
            {nearbyStops.map((stop, index) => (
              <Card key={index} className="p-4 shadow-card bg-gradient-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-bus-stop" />
                    <div>
                      <p className="font-medium text-sm">{stop.name}</p>
                      <p className="text-xs text-muted-foreground">{stop.distance} {t("away")}</p>
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
              <p className="font-medium text-sm">{t("emergency.title")}</p>
              <p className="text-xs text-muted-foreground">{t("emergency.subtitle")}</p>
            </div>
            <Button size="sm" variant="outline">
              {t("emergency.call")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}