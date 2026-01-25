import { useState } from 'react';
import { User, Bell, HelpCircle, Shield, Moon, Sun, Globe, CreditCard, Star, LogOut, ArrowLeft, Bus, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
export default function Profile() {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const { language, t, resetSelection } = useLanguage();
    const [notifications, setNotifications] = useState({
        busArrivals: true,
        delays: true,
        offers: false,
        weeklyReports: true
    });
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
    };
    const menuItems = user?.role === 'driver' ? [
        {
            icon: User,
            title: t('personalInfo'),
            subtitle: t('updateProfile'),
            action: 'navigate'
        },
        {
            icon: Bus,
            title: t('busManagement'),
            subtitle: t('manageBusDetails'),
            action: 'navigate'
        },
        {
            icon: MapPin,
            title: t('routeHistory'),
            subtitle: t('viewCompletedRoutes'),
            action: 'navigate'
        },
        {
            icon: Clock,
            title: t('workSchedule'),
            subtitle: t('manageDrivingSchedule'),
            action: 'navigate'
        },
        {
            icon: Shield,
            title: t('driverCertification'),
            subtitle: t('licenseSafety'),
            action: 'navigate'
        },
        {
            icon: Globe,
            title: t('language'),
            subtitle: t(language === 'en' ? 'english' : language === 'hi' ? 'hindi' : 'chhattisgarhi'),
            action: 'language'
        },
        {
            icon: HelpCircle,
            title: t('helpSupport'),
            subtitle: t('driverAssistance'),
            action: 'navigate'
        }
    ] : [
        {
            icon: User,
            title: t('personalInfo'),
            subtitle: t('updateProfile'),
            action: 'navigate'
        },
        {
            icon: CreditCard,
            title: t('paymentMethods'),
            subtitle: t('managePayment'),
            action: 'navigate'
        },
        {
            icon: Star,
            title: t('favoriteRoutes'),
            subtitle: t('manageSavedRoutes'),
            action: 'navigate'
        },
        {
            icon: Shield,
            title: t('privacySecurity'),
            subtitle: t('accountSecurity'),
            action: 'navigate'
        },
        {
            icon: Globe,
            title: t('language'),
            subtitle: t(language === 'en' ? 'english' : language === 'hi' ? 'hindi' : 'chhattisgarhi'),
            action: 'language'
        },
        {
            icon: HelpCircle,
            title: t('helpSupport'),
            subtitle: t('faqContact'),
            action: 'navigate'
        }
    ];
    const handleThemeToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    return (<div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <div className="flex items-center space-x-3">
          {user?.role === 'driver' && (<Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-4 w-4"/>
              </Button>
            </Link>)}
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {user?.role === 'driver' ? t('driverProfile') : t('profile')}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'driver'
            ? t('manageDriverAccount')
            : t('manageAccount')}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Profile Card */}
        <Card className="p-6 shadow-float bg-gradient-card">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg"/>
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-muted-foreground text-sm">{userData.email}</p>
              {user?.role === 'driver' && userData.driverId && (<p className="text-primary text-sm font-medium">{t('driverId')}: {userData.driverId}</p>)}
              <p className="text-muted-foreground text-sm">{t('memberSince')} {userData.memberSince}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            {user?.role === 'driver' ? (<>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userData.totalTrips}</p>
                  <p className="text-xs text-muted-foreground">{t('totalRoutes')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{userData.totalPassengers}</p>
                  <p className="text-xs text-muted-foreground">{t('passengersServed')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">★ {userData.rating}</p>
                  <p className="text-xs text-muted-foreground">{t('driverRating')}</p>
                </div>
              </>) : (<>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userData.totalTrips}</p>
                  <p className="text-xs text-muted-foreground">{t('totalTrips')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{userData.carbonSaved}</p>
                  <p className="text-xs text-muted-foreground">{t('carbonSaved')}</p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    {t('ecoRider')}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{t('status')}</p>
                </div>
              </>)}
          </div>
        </Card>

        {/* Theme Toggle */}
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (<Moon className="h-5 w-5 text-primary"/>) : (<Sun className="h-5 w-5 text-primary"/>)}
              <div>
                <p className="font-medium text-sm">{t('darkMode')}</p>
                <p className="text-xs text-muted-foreground">{t('toggleTheme')}</p>
              </div>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={handleThemeToggle}/>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Bell className="h-5 w-5 text-primary"/>
              <h3 className="font-semibold">{t('notifications')}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('busArrivals')}</p>
                  <p className="text-xs text-muted-foreground">{t('busArrivalsDesc')}</p>
                </div>
                <Switch checked={notifications.busArrivals} onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, busArrivals: checked }))}/>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('delaysDisruptions')}</p>
                  <p className="text-xs text-muted-foreground">{t('serviceUpdates')}</p>
                </div>
                <Switch checked={notifications.delays} onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, delays: checked }))}/>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t('offersPromotions')}</p>
                  <p className="text-xs text-muted-foreground">{t('specialDeals')}</p>
                </div>
                <Switch checked={notifications.offers} onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, offers: checked }))}/>
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (<Card key={index} className="p-4 shadow-card bg-gradient-card hover:shadow-float transition-shadow cursor-pointer">
              {item.action === 'language' ? (<LanguageSelector asMenuItem={true} currentLanguageDisplay={item.subtitle}/>) : (<div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 text-primary"/>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    →
                  </Button>
                </div>)}
            </Card>))}
        </div>

        {/* Favorite Route */}
        <Card className="p-4 shadow-card bg-gradient-card border-l-4 border-l-primary">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-primary fill-primary"/>
              <p className="font-semibold text-sm">{t('mostUsedRoute')}</p>
            </div>
            <p className="text-sm text-muted-foreground">{userData.favoriteRoute}</p>
            <p className="text-xs text-muted-foreground">{t('usedThisMonth')}</p>
          </div>
        </Card>

        {/* Logout Button */}
        <Card className="p-4 shadow-card bg-gradient-card border-destructive/20">
          <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2"/>
            {t('signOut')}
          </Button>
        </Card>
      </div>
    </div>);
}
