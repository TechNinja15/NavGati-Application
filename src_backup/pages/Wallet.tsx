import { useState } from 'react'
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, History, Gift } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Wallet() {
  const [showRecharge, setShowRecharge] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const { t } = useLanguage()

  // Mock wallet data
  const walletData = {
    balance: 387.50,
    pendingRefund: 28.00,
    totalSaved: 996.00
  }

  const recentTransactions = [
    {
      id: 'TXN001',
      type: 'debit',
      description: 'Day Pass - All Routes',
      amount: 95.00,
      date: '2024-12-14 09:30',
      status: 'completed'
    },
    {
      id: 'TXN002',
      type: 'credit',
      description: 'Wallet Recharge',
      amount: 500.00,
      date: '2024-12-13 18:45',
      status: 'completed'
    },
    {
      id: 'TXN003',
      type: 'debit',
      description: 'Single Journey - Route V1',
      amount: 28.00,
      date: '2024-12-13 14:20',
      status: 'completed'
    },
    {
      id: 'TXN004',
      type: 'credit',
      description: 'Refund - Cancelled Journey',
      amount: 18.00,
      date: '2024-12-12 16:10',
      status: 'pending'
    }
  ]

  const quickAmounts = [100, 200, 500, 1000]

  const offers = [
    {
      title: '10% Cashback',
      description: 'On first recharge of ₹500+',
      code: 'FIRST10',
      color: 'success'
    },
    {
      title: 'Weekend Special',
      description: 'Buy 2 day passes, get 1 free',
      code: 'WEEKEND3',
      color: 'primary'
    }
  ]

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? ArrowDownLeft : ArrowUpRight
  }

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-success' : 'text-foreground'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-card px-4 py-6 border-b">
        <h1 className="text-2xl font-bold mb-2">{t("wallet.title")}</h1>
        <p className="text-muted-foreground">{t("wallet.subtitle")}</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="p-6 shadow-float bg-gradient-primary text-primary-foreground">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <WalletIcon className="h-6 w-6" />
                <span className="font-medium">{t("wallet.balance")}</span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowRecharge(!showRecharge)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("wallet.recharge")}
              </Button>
            </div>
            <div>
              <h2 className="text-3xl font-bold">₹{walletData.balance.toFixed(2)}</h2>
              <p className="text-sm opacity-90">{t("wallet.available_balance")}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm opacity-75">{t("wallet.pending_refund")}</p>
                <p className="font-semibold">₹{walletData.pendingRefund.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">{t("wallet.total_saved")}</p>
                <p className="font-semibold">₹{walletData.totalSaved.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recharge Section */}
        {showRecharge && (
          <Card className="p-4 shadow-card bg-gradient-card">
            <h3 className="font-semibold mb-4">{t("wallet.recharge_wallet")}</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">{t("wallet.enter_amount")}</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("wallet.quick_amounts")}</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setRechargeAmount(amount.toString())}
                      className="text-xs"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t("wallet.pay_now")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRecharge(false)}
                  className="flex-1"
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Special Offers */}
        <div>
          <h2 className="text-lg font-semibold mb-3">{t("wallet.special_offers")}</h2>
          <div className="space-y-3">
            {offers.map((offer, index) => (
              <Card key={index} className="p-4 shadow-card bg-gradient-card border-l-4 border-l-primary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Gift className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm">{offer.title}</h3>
                      <p className="text-xs text-muted-foreground">{offer.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {offer.code}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{t("wallet.recent_transactions")}</h2>
            <Button variant="ghost" size="sm">
              <History className="h-4 w-4 mr-2" />
              {t("wallet.view_all")}
            </Button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const Icon = getTransactionIcon(transaction.type)
              const colorClass = getTransactionColor(transaction.type)

              return (
                <Card key={transaction.id} className="p-4 shadow-card bg-gradient-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${colorClass}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${colorClass}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant={transaction.status === 'completed' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 shadow-card hover:shadow-float transition-shadow cursor-pointer bg-gradient-card">
            <div className="text-center space-y-2">
              <CreditCard className="h-6 w-6 text-primary mx-auto" />
              <p className="font-medium text-sm">{t("wallet.add_payment_method")}</p>
            </div>
          </Card>
          <Card className="p-4 shadow-card hover:shadow-float transition-shadow cursor-pointer bg-gradient-card">
            <div className="text-center space-y-2">
              <History className="h-6 w-6 text-primary mx-auto" />
              <p className="font-medium text-sm">{t("wallet.transaction_history")}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}