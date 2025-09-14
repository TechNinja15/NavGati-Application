import { useState } from 'react'
import { User, Settings, Bell, HelpCircle, Shield, Moon, Sun, Globe, CreditCard, Star, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/components/ThemeProvider'

export default function Profile() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    busArrivals: true,
    delays: true,
    offers: false,
    weeklyReports: true
  })

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    memberSince: 'March 2024',
    totalTrips: 156,
    carbonSaved: '45.2 kg',
    favoriteRoute: '42A - City Center Express'
  }

  const menuItems = [
    {
      icon: User,
      title: 'Personal Information',
      subtitle: 'Update your profile details',
      action: 'navigate'
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage cards and payment options',
      action: 'navigate'
    },
    {
      icon: Star,
      title: 'Favorite Routes',
      subtitle: 'Manage your saved routes',
      action: 'navigate'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Account security settings',
      action: 'navigate'
    },
    {
      icon: Globe,
      title: 'Language',
      subtitle: 'English',
      action: 'navigate'
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'FAQs and contact support',
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
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
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
              <p className="text-muted-foreground text-sm">Member since {userData.memberSince}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userData.totalTrips}</p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{userData.carbonSaved}</p>
              <p className="text-xs text-muted-foreground">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                Eco Rider
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Status</p>
            </div>
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
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
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
              <h3 className="font-semibold">Notifications</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Bus Arrivals</p>
                  <p className="text-xs text-muted-foreground">Get notified when your bus is arriving</p>
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
                  <p className="font-medium text-sm">Delays & Disruptions</p>
                  <p className="text-xs text-muted-foreground">Service updates and delays</p>
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
                  <p className="font-medium text-sm">Offers & Promotions</p>
                  <p className="text-xs text-muted-foreground">Special deals and discounts</p>
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
            </Card>
          ))}
        </div>

        {/* Favorite Route */}
        <Card className="p-4 shadow-card bg-gradient-card border-l-4 border-l-primary">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <p className="font-semibold text-sm">Most Used Route</p>
            </div>
            <p className="text-sm text-muted-foreground">{userData.favoriteRoute}</p>
            <p className="text-xs text-muted-foreground">Used 45 times this month</p>
          </div>
        </Card>

        {/* Logout Button */}
        <Card className="p-4 shadow-card bg-gradient-card border-destructive/20">
          <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  )
}