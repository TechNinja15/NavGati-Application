import { useState } from 'react'
import { User, Settings, Bell, HelpCircle, Shield, Moon, Sun, Globe, CreditCard, Star, LogOut, ArrowLeft, Bus, MapPin, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/components/ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { LanguageSelector } from '@/components/LanguageSelector'

export default function Profile() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const [notifications, setNotifications] = useState({
    busArrivals: true,
    delays: true,
    offers: false,
    weeklyReports: true
  })

  // Mock user data with auth context fallback
  const userData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@email.com',
    phone: '+91 (555) 123-4567',
    memberSince: 'March 2024',
    totalTrips: user?.role === 'driver' ? 245 : 156,
    carbonSaved: user?.role === 'driver' ? '128.5 kg' : '45.2 kg',
    favoriteRoute: user?.role === 'driver' ? 'Route 1: Central - Airport' : '42A - City Center Express',
    driverId: user?.role === 'driver' ? 'DRV-2024-8756' : null,
    busNumber: user?.role === 'driver' ? 'KA-01-AB-1234' : null,
    totalPassengers: user?.role === 'driver' ? 12450 : null,
    rating: user?.role === 'driver' ? 4.8 : null
  }

  const menuItems = user?.role === 'driver' ? [
    {
      icon: User,
      title: getTranslation(language, 'personalInfo'),
      subtitle: getTranslation(language, 'updateProfile'),
      action: 'navigate'
    },
    {
      icon: Bus,
      title: getTranslation(language, 'busManagement'),
      subtitle: getTranslation(language, 'manageBusDetails'),
      action: 'navigate'
    },
    {
      icon: MapPin,
      title: getTranslation(language, 'routeHistory'),
      subtitle: getTranslation(language, 'viewCompletedRoutes'),
      action: 'navigate'
    },
    {
      icon: Clock,
      title: getTranslation(language, 'workSchedule'),
      subtitle: getTranslation(language, 'manageDrivingSchedule'),
      action: 'navigate'
    },
    {
      icon: Shield,
      title: getTranslation(language, 'driverCertification'),
      subtitle: getTranslation(language, 'licenseSafety'),
      action: 'navigate'
    },
    {
      icon: Globe,
      title: getTranslation(language, 'language'),
      subtitle: getTranslation(language, language === 'en' ? 'english' : language === 'hi' ? 'hindi' : language === 'pa' ? 'punjabi' : 'kannada'),
      action: 'language'
    },
    {
      icon: HelpCircle,
      title: getTranslation(language, 'helpSupport'),
      subtitle: getTranslation(language, 'driverAssistance'),
      action: 'navigate'
    }
  ] : [
    {
      icon: User,
      title: getTranslation(language, 'personalInfo'),
      subtitle: getTranslation(language, 'updateProfile'),
      action: 'navigate'
    },
    {
      icon: CreditCard,
      title: getTranslation(language, 'paymentMethods'),
      subtitle: getTranslation(language, 'managePayment'),
      action: 'navigate'
    },
    {
      icon: Star,
      title: getTranslation(language, 'favoriteRoutes'),
      subtitle: getTranslation(language, 'manageSavedRoutes'),
      action: 'navigate'
    },
    {
      icon: Shield,
      title: getTranslation(language, 'privacySecurity'),
      subtitle: getTranslation(language, 'accountSecurity'),
      action: 'navigate'
    },
    {
      icon: Globe,
      title: getTranslation(language, 'language'),
      subtitle: getTranslation(language, language === 'en' ? 'english' : language === 'hi' ? 'hindi' : language === 'pa' ? 'punjabi' : 'kannada'),
      action: 'language'
    },
    {
      icon: HelpCircle,
      title: getTranslation(language, 'helpSupport'),
      subtitle: getTranslation(language, 'faqContact'),
      action: 'navigate'
    }
  ]

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <div className="flex items-center space-x-3">
          {user?.role === 'driver' && (
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {user?.role === 'driver' ? getTranslation(language, 'driverProfile') : getTranslation(language, 'profile')}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'driver' 
                ? getTranslation(language, 'manageDriverAccount')
                : getTranslation(language, 'manageAccount')}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Profile Card */}
        <Card className="p-6 shadow-float bg-gradient-card">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <p className="text-muted-foreground text-sm">{userData.email}</p>
            {user?.role === 'driver' && userData.driverId && (
              <p className="text-primary text-sm font-medium">{getTranslation(language, 'driverId')}: {userData.driverId}</p>
            )}
            <p className="text-muted-foreground text-sm">{getTranslation(language, 'memberSince')} {userData.memberSince}</p>
          </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            {user?.role === 'driver' ? (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userData.totalTrips}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, 'totalRoutes')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{userData.totalPassengers}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, 'passengersServed')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">★ {userData.rating}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, 'driverRating')}</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userData.totalTrips}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, 'totalTrips')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{userData.carbonSaved}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, 'carbonSaved')}</p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    {getTranslation(language, 'ecoRider')}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{getTranslation(language, 'status')}</p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Theme Toggle */}
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <div>
                <p className="font-medium text-sm">{getTranslation(language, 'darkMode')}</p>
                <p className="text-xs text-muted-foreground">{getTranslation(language, 'toggleTheme')}</p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{getTranslation(language, 'notifications')}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{getTranslation(language, 'busArrivals')}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, 'busArrivalsDesc')}</p>
                </div>
                <Switch
                  checked={notifications.busArrivals}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, busArrivals: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{getTranslation(language, 'delaysDisruptions')}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, 'serviceUpdates')}</p>
                </div>
                <Switch
                  checked={notifications.delays}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, delays: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{getTranslation(language, 'offersPromotions')}</p>
                  <p className="text-xs text-muted-foreground">{getTranslation(language, 'specialDeals')}</p>
                </div>
                <Switch
                  checked={notifications.offers}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, offers: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Card key={index} className="p-4 shadow-card bg-gradient-card hover:shadow-float transition-shadow cursor-pointer">
              {item.action === 'language' ? (
                <LanguageSelector 
                  asMenuItem={true} 
                  currentLanguageDisplay={item.subtitle}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    →
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Favorite Route */}
        <Card className="p-4 shadow-card bg-gradient-card border-l-4 border-l-primary">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <p className="font-semibold text-sm">{getTranslation(language, 'mostUsedRoute')}</p>
            </div>
            <p className="text-sm text-muted-foreground">{userData.favoriteRoute}</p>
            <p className="text-xs text-muted-foreground">{getTranslation(language, 'usedThisMonth')}</p>
          </div>
        </Card>

        {/* Logout Button */}
        <Card className="p-4 shadow-card bg-gradient-card border-destructive/20">
          <Button 
            variant="ghost" 
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {getTranslation(language, 'signOut')}
          </Button>
        </Card>
      </div>
    </div>
  )
}