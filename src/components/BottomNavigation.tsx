import { MapPin, Route, Ticket, Wallet, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: MapPin },
  { name: 'Routes', href: '/routes', icon: Route },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Profile', href: '/profile', icon: User },
]

export function BottomNavigation() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <nav className="flex items-center justify-around py-2 px-1 max-w-md mx-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl text-xs font-medium transition-all duration-200",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}