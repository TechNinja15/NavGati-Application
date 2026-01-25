import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ChatBot from '@/components/ChatBot';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, MapPin, GraduationCap, Calendar, Navigation, Bell, Phone } from 'lucide-react';
export default function StudentDashboard() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    // Mock student bus data
    const getStudentBusData = () => {
        const institution = user?.studentData?.institution || 'Delhi Public School';
        if (institution.includes('IISc') || institution.includes('IIT')) {
            return {
                buses: [
                    {
                        id: 'UNI-101',
                        route: 'Campus Shuttle - Main Gate to Hostels',
                        nextStop: 'Library Block',
                        eta: '3 min',
                        seats: { available: 8, total: 25 }
                    },
                    {
                        id: 'UNI-205',
                        route: 'Hostel to Academic Block',
                        nextStop: 'Engineering Department',
                        eta: '7 min',
                        seats: { available: 15, total: 30 }
                    }
                ],
                stops: [
                    { name: 'Main Gate', distance: '50m', busIds: ['UNI-101', 'UNI-205'] },
                    { name: 'Library Block', distance: '200m', busIds: ['UNI-101'] },
                    { name: 'Cafeteria', distance: '300m', busIds: ['UNI-205'] }
                ]
            };
        }
        else if (institution.includes('Christ') || institution.includes('Xavier')) {
            return {
                buses: [
                    {
                        id: 'COL-301',
                        route: 'Hostel to Main Campus',
                        nextStop: 'Arts Block',
                        eta: '5 min',
                        seats: { available: 12, total: 40 }
                    },
                    {
                        id: 'COL-402',
                        route: 'Metro Station to College',
                        nextStop: 'College Gate',
                        eta: '12 min',
                        seats: { available: 6, total: 35 }
                    }
                ],
                stops: [
                    { name: 'Metro Station', distance: '800m', busIds: ['COL-402'] },
                    { name: 'College Gate', distance: '100m', busIds: ['COL-301', 'COL-402'] },
                    { name: 'Arts Block', distance: '150m', busIds: ['COL-301'] }
                ]
            };
        }
        else {
            // School buses
            return {
                buses: [
                    {
                        id: 'SCH-15',
                        route: 'Residential Area to School',
                        nextStop: 'School Main Gate',
                        eta: '8 min',
                        seats: { available: 4, total: 45 }
                    },
                    {
                        id: 'SCH-22',
                        route: 'City Center to School',
                        nextStop: 'Sports Complex',
                        eta: '15 min',
                        seats: { available: 18, total: 50 }
                    }
                ],
                stops: [
                    { name: 'Residential Complex A', distance: '500m', busIds: ['SCH-15'] },
                    { name: 'City Center', distance: '2.1km', busIds: ['SCH-22'] },
                    { name: 'School Main Gate', distance: '200m', busIds: ['SCH-15', 'SCH-22'] }
                ]
            };
        }
    };
    const busData = getStudentBusData();
    return (<div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">NavGati Student</h1>
            <p className="text-white/80">Welcome back, {user?.name}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5"/>
              <span className="text-sm">{user?.studentData?.institution}</span>
            </div>
            <p className="text-xs text-white/60">Bus ID: {user?.studentData?.studentBusId}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search and ChatBot */}
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <Input placeholder="Search for routes, stops..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-0 bg-background/50"/>
            </div>
            <ChatBot />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center shadow-card hover:shadow-float transition-shadow cursor-pointer">
            <Navigation className="h-8 w-8 text-primary mx-auto mb-2"/>
            <h3 className="font-semibold">Live Tracking</h3>
            <p className="text-xs text-muted-foreground">Track campus buses</p>
          </Card>
          <Card className="p-4 text-center shadow-card hover:shadow-float transition-shadow cursor-pointer">
            <Bell className="h-8 w-8 text-primary mx-auto mb-2"/>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">Bus alerts & updates</p>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-primary"/>
            <h3 className="font-semibold">Today's Schedule</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Morning Route</p>
                  <p className="text-sm text-muted-foreground">8:00 AM - Classes</p>
                </div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Lunch Break</p>
                  <p className="text-sm text-muted-foreground">1:00 PM - Cafeteria</p>
                </div>
              </div>
              <Badge variant="outline">Upcoming</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Evening Route</p>
                  <p className="text-sm text-muted-foreground">5:30 PM - Home</p>
                </div>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </div>
        </Card>

        {/* Campus Buses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Campus Buses</h3>
          {busData.buses.map((bus) => (<Card key={bus.id} className="p-4 shadow-card hover:shadow-float transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {bus.id}
                  </div>
                  <div>
                    <h4 className="font-semibold">{bus.route}</h4>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3"/>
                      <span>{bus.nextStop}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-primary">{bus.seats.available}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-sm text-muted-foreground">{bus.seats.total}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Available Seats</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground"/>
                  <span className="text-sm font-medium">{bus.eta} away</span>
                </div>
                <Button size="sm" variant="outline">Track Live</Button>
              </div>
            </Card>))}
        </div>

        {/* Nearby Stops */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nearby Stops</h3>
          {busData.stops.map((stop, index) => (<Card key={index} className="p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{stop.name}</h4>
                  <p className="text-sm text-muted-foreground">{stop.distance} away</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {stop.busIds.map(busId => (<Badge key={busId} variant="secondary" className="text-xs">
                      {busId}
                    </Badge>))}
                </div>
              </div>
            </Card>))}
        </div>

        {/* Emergency Contact */}
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-primary"/>
            <div className="flex-1">
              <h3 className="font-semibold">Campus Transport Office</h3>
              <p className="text-sm text-muted-foreground">Emergency assistance & inquiries</p>
            </div>
            <Button size="sm">Call</Button>
          </div>
        </Card>
      </div>
    </div>);
}
