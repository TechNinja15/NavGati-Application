import { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
export default function BookTicket() {
    const navigate = useNavigate();
    const [boardingStop, setBoardingStop] = useState('');
    const [droppingStop, setDroppingStop] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');
    // Mock route data - in real app this would come from route params
    const routeStops = [
        'Raipur Railway Station',
        'Fafadih',
        'Gudhiyari',
        'Kota',
        'GE Road',
        'Devendra Nagar'
    ];
    const calculateFare = () => {
        if (!boardingStop || !droppingStop)
            return 0;
        const boardingIndex = routeStops.indexOf(boardingStop);
        const droppingIndex = routeStops.indexOf(droppingStop);
        const distance = Math.abs(droppingIndex - boardingIndex);
        return distance * 5 + 10; // Base fare ₹10 + ₹5 per stop
    };
    const fare = calculateFare();
    const handleBookTicket = () => {
        if (!boardingStop || !droppingStop || !selectedPayment)
            return;
        // Here you would process the payment and booking
        navigate('/tickets');
    };
    return (<div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5"/>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Book Ticket</h1>
            <p className="text-sm text-muted-foreground">Select your boarding and dropping stops</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Route Info */}
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              RP1
            </div>
            <div>
              <h2 className="font-semibold">Telibandha - Pandri</h2>
              <p className="text-sm text-muted-foreground">Regular Service • Every 12 min</p>
            </div>
          </div>
        </Card>

        {/* Stop Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Boarding Stop</label>
            <Select value={boardingStop} onValueChange={setBoardingStop}>
              <SelectTrigger>
                <SelectValue placeholder="Select boarding stop"/>
              </SelectTrigger>
              <SelectContent>
                {routeStops.map((stop) => (<SelectItem key={stop} value={stop} disabled={stop === droppingStop}>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground"/>
                      <span>{stop}</span>
                    </div>
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Dropping Stop</label>
            <Select value={droppingStop} onValueChange={setDroppingStop}>
              <SelectTrigger>
                <SelectValue placeholder="Select dropping stop"/>
              </SelectTrigger>
              <SelectContent>
                {routeStops.map((stop) => (<SelectItem key={stop} value={stop} disabled={stop === boardingStop}>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground"/>
                      <span>{stop}</span>
                    </div>
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fare Details */}
        {fare > 0 && (<Card className="p-4 shadow-card">
            <h3 className="font-semibold mb-3">Fare Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Fare</span>
                <span>₹10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Distance Charge</span>
                <span>₹{fare - 10}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="text-primary">₹{fare}</span>
              </div>
            </div>
          </Card>)}

        {/* Payment Options */}
        {fare > 0 && (<Card className="p-4 shadow-card">
            <h3 className="font-semibold mb-3">Payment Method</h3>
            <div className="space-y-2">
              <div className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedPayment === 'wallet' ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => setSelectedPayment('wallet')}>
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-primary"/>
                  <div>
                    <p className="font-medium text-sm">Digital Wallet</p>
                    <p className="text-xs text-muted-foreground">Balance: ₹250</p>
                  </div>
                  {selectedPayment === 'wallet' && (<Badge variant="secondary" className="ml-auto">Selected</Badge>)}
                </div>
              </div>
              
              <div className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedPayment === 'card' ? 'border-primary bg-primary/5' : 'border-border'}`} onClick={() => setSelectedPayment('card')}>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-primary"/>
                  <div>
                    <p className="font-medium text-sm">Credit/Debit Card</p>
                    <p className="text-xs text-muted-foreground">Secure payment</p>
                  </div>
                  {selectedPayment === 'card' && (<Badge variant="secondary" className="ml-auto">Selected</Badge>)}
                </div>
              </div>
            </div>
          </Card>)}

        {/* Book Button */}
        <Button className="w-full" size="lg" onClick={handleBookTicket} disabled={!boardingStop || !droppingStop || !selectedPayment}>
          Book Ticket - ₹{fare}
        </Button>
      </div>
    </div>);
}
