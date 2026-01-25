import { useState } from 'react';
import { Ticket, Plus, Clock, Download, Share, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import qrTicketImage from '@/assets/qr-ticket.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
export default function Tickets() {
    const [activeTab, setActiveTab] = useState('active');
    const { t } = useLanguage();
    // Mock ticket data
    const activeTickets = [
        {
            id: 'TKT001',
            type: t('tickets.type.single'),
            route: 'V1 - Whitefield to Electronic City',
            validUntil: '2024-12-14 18:30',
            price: '₹28.00',
            status: 'Active',
            qrCode: 'QR12345ABC'
        },
        {
            id: 'TKT002',
            type: t('tickets.type.day'),
            route: 'All Routes',
            validUntil: '2024-12-14 23:59',
            price: '₹95.00',
            status: 'Active',
            qrCode: 'QR67890DEF'
        }
    ];
    const pastTickets = [
        {
            id: 'TKT003',
            type: t('tickets.type.single'),
            route: 'AS4 - Koramangala to Majestic',
            usedAt: '2024-12-13 14:25',
            price: '₹18.00',
            status: 'Used'
        },
        {
            id: 'TKT004',
            type: t('tickets.type.weekly'),
            route: 'All Routes',
            expiredAt: '2024-12-10 23:59',
            price: '₹350.00',
            status: 'Expired'
        }
    ];
    const ticketTypes = [
        {
            name: t('tickets.type.single'),
            description: t('tickets.type.single_desc'),
            price: 'From ₹15.00',
            icon: Ticket,
            color: 'primary'
        },
        {
            name: t('tickets.type.day'),
            description: t('tickets.type.day_desc'),
            price: '₹95.00',
            icon: Clock,
            color: 'bus-route'
        },
        {
            name: t('tickets.type.weekly'),
            description: t('tickets.type.weekly_desc'),
            price: '₹350.00',
            icon: Calendar,
            color: 'bus-stop'
        }
    ];
    return (<div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <h1 className="text-2xl font-bold mb-2">{t("tickets.title")}</h1>
        <p className="text-muted-foreground">{t("tickets.subtitle")}</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Purchase */}
        <Card className="p-4 shadow-card bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">{t("tickets.quick_purchase")}</h3>
              <p className="text-sm opacity-90">{t("tickets.buy_instantly")}</p>
            </div>
            <Button size="sm" variant="secondary">
              <Plus className="h-4 w-4 mr-2"/>
              {t("tickets.buy_now")}
            </Button>
          </div>
        </Card>

        {/* Ticket Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">{t("tickets.tab.active")}</TabsTrigger>
            <TabsTrigger value="history">{t("tickets.tab.history")}</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {activeTickets.map((ticket) => (<Card key={ticket.id} className="p-4 shadow-card bg-gradient-card">
                <div className="space-y-4">
                  {/* Ticket Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{ticket.type}</h3>
                      <p className="text-xs text-muted-foreground">{ticket.route}</p>
                    </div>
                    <Badge variant="default" className="bg-success text-white">
                      {ticket.status}
                    </Badge>
                  </div>

                  {/* QR Code Section */}
                  <div className="bg-background rounded-xl p-4 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                        <img src={qrTicketImage} alt="QR Code Ticket" className="w-full h-full object-cover"/>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{ticket.qrCode}</p>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("tickets.valid_until")}</p>
                      <p className="font-medium">{ticket.validUntil}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("tickets.price")}</p>
                      <p className="font-semibold text-primary">{ticket.price}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2"/>
                      {t("tickets.download")}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Share className="h-4 w-4 mr-2"/>
                      {t("tickets.share")}
                    </Button>
                  </div>
                </div>
              </Card>))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            {pastTickets.map((ticket) => (<Card key={ticket.id} className="p-4 shadow-card bg-gradient-card opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{ticket.type}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{ticket.route}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.status === 'Used' ? `${t("tickets.used_at")} ${ticket.usedAt}` : `${t("tickets.expired_at")} ${ticket.expiredAt}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={ticket.status === 'Used' ? 'secondary' : 'destructive'}>
                      {ticket.status}
                    </Badge>
                    <p className="text-sm font-semibold text-muted-foreground mt-1">{ticket.price}</p>
                  </div>
                </div>
              </Card>))}
          </TabsContent>
        </Tabs>

        {/* Purchase Options */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{t("tickets.purchase_new")}</h2>
          <div className="space-y-3">
            {ticketTypes.map((type, index) => (<Card key={index} className="p-4 shadow-card bg-gradient-card hover:shadow-float transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <type.icon className="h-5 w-5 text-primary"/>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{type.name}</h3>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{type.price}</p>
                    <Button size="sm" className="mt-1">
                      {t("tickets.buy")}
                    </Button>
                  </div>
                </div>
              </Card>))}
          </div>
        </div>
      </div>
    </div>);
}
