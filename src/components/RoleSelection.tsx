import { Users, Car } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function RoleSelection() {
  const { setUserRole } = useAuth()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 shadow-card bg-gradient-card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Choose Your Role</h2>
          <p className="text-muted-foreground">How would you like to use NavGati?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 shadow-card hover:shadow-float transition-shadow cursor-pointer border-2 hover:border-primary/50"
                onClick={() => setUserRole('passenger')}>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Passenger</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Track buses, find routes, and plan your journey
                </p>
              </div>
              <Button className="w-full" onClick={() => setUserRole('passenger')}>
                Select Passenger
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-float transition-shadow cursor-pointer border-2 hover:border-primary/50"
                onClick={() => setUserRole('driver')}>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Driver</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Manage your bus, track journey, and update passengers
                </p>
              </div>
              <Button className="w-full" onClick={() => setUserRole('driver')}>
                Select Driver
              </Button>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  )
}