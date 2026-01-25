import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function StudentOnboarding() {
  const { completeStudentOnboarding, goBackToLogin } = useAuth()
  const [formData, setFormData] = useState({
    state: '',
    city: '',
    institution: '',
    studentBusId: ''
  })

  const states = [
    'Karnataka', 'Maharashtra', 'Delhi', 'Punjab', 'Chhattisgarh',
    'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'
  ]

  const cities = {
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Delhi': ['New Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
    'Chhattisgarh': ['Raipur', 'Bilaspur', 'Korba', 'Durg']
  }

  const institutions = {
    'Bangalore': [
      'Indian Institute of Science (IISc)',
      'Bangalore University',
      'Christ University',
      'St. Joseph\'s College',
      'Mount Carmel College',
      'Bishop Cotton Boys School',
      'Delhi Public School',
      'Kendriya Vidyalaya'
    ],
    'Mumbai': [
      'University of Mumbai',
      'Indian Institute of Technology Bombay',
      'Xavier Institute of Management',
      'St. Xavier\'s College',
      'Mithibai College',
      'Cathedral & John Connon School',
      'Bombay Scottish School'
    ],
    'Delhi': [
      'Delhi University',
      'Jawaharlal Nehru University',
      'Indian Institute of Technology Delhi',
      'Jamia Millia Islamia',
      'Delhi Public School',
      'Modern School',
      'Sanskriti School'
    ]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.state && formData.city && formData.institution && formData.studentBusId) {
      completeStudentOnboarding(formData)
    }
  }

  const handleBack = () => {
    goBackToLogin()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 shadow-card bg-gradient-card">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Student Registration</h2>
              <p className="text-sm text-muted-foreground">Complete your profile</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value, city: '', institution: '' }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => setFormData(prev => ({ ...prev, city: value, institution: '' }))}
              disabled={!formData.state}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {formData.state && cities[formData.state]?.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">University/College/School *</Label>
            <Select
              value={formData.institution}
              onValueChange={(value) => setFormData(prev => ({ ...prev, institution: value }))}
              disabled={!formData.city}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your institution" />
              </SelectTrigger>
              <SelectContent>
                {formData.city && institutions[formData.city]?.map(institution => (
                  <SelectItem key={institution} value={institution}>{institution}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentBusId">Student Bus ID *</Label>
            <Input
              id="studentBusId"
              type="text"
              placeholder="Enter your student bus ID (e.g., SB001, COL123)"
              value={formData.studentBusId}
              onChange={(e) => setFormData(prev => ({ ...prev, studentBusId: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              This ID is provided by your institution for bus services
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!formData.state || !formData.city || !formData.institution || !formData.studentBusId}
          >
            Complete Registration
          </Button>
        </form>
      </Card>
    </div>
  )
}