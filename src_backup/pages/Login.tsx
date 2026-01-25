import { useState } from 'react'
import { Eye, EyeOff, Bus, User, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [driverId, setDriverId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup, setUserRole } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(driverId, password)

      if (success) {
        toast({
          title: "Welcome back!",
          description: "Logged in as Driver.",
        })
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please checking your Driver ID and Password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePassengerAccess = () => {
    // Create a guest session
    const guestId = Math.random().toString(36).substring(7);
    signup(`Guest ${guestId}`, `guest_${guestId}@navgati.com`, 'guest123', 'passenger');
    toast({
      title: "Welcome!",
      description: "Continuing as Passenger.",
    })
  }

  const handleStudentAccess = () => {
    // Trigger student flow
    setUserRole('student');
    toast({
      title: "Student Portal",
      description: "Please complete onboarding.",
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-card bg-gradient-card">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Bus className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-primary">NavGati</h1>
          </div>
          <h2 className="text-xl font-semibold mb-2">Driver Login</h2>
          <p className="text-muted-foreground text-sm">Sign in with your Driver ID</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="driverId">Driver ID</Label>
            <Input
              id="driverId"
              type="text"
              placeholder="Enter your Driver ID"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In as Driver'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue as
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-primary/20 hover:bg-primary/5 h-12"
            onClick={handlePassengerAccess}
          >
            <User className="h-4 w-4 mr-2" />
            Continue as Passenger
          </Button>
          <Button
            variant="outline"
            className="w-full border-primary/20 hover:bg-primary/5 h-12"
            onClick={handleStudentAccess}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Student Portal
          </Button>
        </div>
      </Card>
    </div>
  )
}