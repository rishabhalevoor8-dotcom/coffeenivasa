import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, ChefHat, Clock, CheckCircle2, UtensilsCrossed, Coffee, CreditCard, Banknote, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  is_veg: boolean;
  special_instructions: string | null;
}

interface Order {
  id: string;
  order_number: number;
  table_number: number | null;
  order_type: 'dine_in' | 'takeaway';
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'cash_pending' | 'cheque_pending' | 'refunded';
  created_at: string;
  items: OrderItem[];
}

const statusConfig = {
  pending: { label: 'NEW', color: 'bg-red-600', textColor: 'text-white', icon: Clock },
  preparing: { label: 'PREPARING', color: 'bg-amber-500', textColor: 'text-white', icon: ChefHat },
  ready: { label: 'READY', color: 'bg-green-600', textColor: 'text-white', icon: CheckCircle2 },
  served: { label: 'SERVED', color: 'bg-blue-600', textColor: 'text-white', icon: UtensilsCrossed },
  completed: { label: 'DONE', color: 'bg-gray-600', textColor: 'text-white', icon: CheckCircle2 },
  cancelled: { label: 'CANCELLED', color: 'bg-gray-800', textColor: 'text-white', icon: Clock },
};

const paymentConfig = {
  paid: { label: 'PAID (UPI)', color: 'bg-green-600', icon: CreditCard },
  cash_pending: { label: 'CASH PENDING', color: 'bg-amber-600', icon: Banknote },
  cheque_pending: { label: 'CHEQUE PENDING', color: 'bg-purple-600', icon: FileText },
  pending: { label: 'PENDING', color: 'bg-gray-600', icon: Clock },
  refunded: { label: 'REFUNDED', color: 'bg-red-600', icon: CreditCard },
};

export default function Kitchen() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const verifyPin = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'kitchen_pin')
      .single();

    if (error || !data) {
      toast.error('Could not verify PIN');
      setLoading(false);
      return;
    }

    if (data.value === pin) {
      setIsAuthenticated(true);
      fetchOrders();
      setupRealtimeSubscription();
    } else {
      toast.error('Invalid PIN');
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'preparing', 'ready', 'served'])
      .order('created_at', { ascending: false }); // New orders at top

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    const ordersWithItems = await Promise.all(
      (ordersData || []).map(async (order) => {
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);
        return { ...order, items: items || [] };
      })
    );

    setOrders(ordersWithItems);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update order status');
      return;
    }

    toast.success(`Order marked as ${statusConfig[newStatus].label}`);
    fetchOrders();
  };

  const getTimeSince = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'NOW';
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-amber-600 flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Kitchen Dashboard
            </h1>
            <p className="text-xl text-gray-400">Coffee Nivasa</p>
          </div>
          
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <div className="relative mb-6">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter Kitchen PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-14 text-center text-3xl tracking-widest h-16 bg-gray-800 border-gray-600 text-white"
                maxLength={6}
                onKeyDown={(e) => e.key === 'Enter' && verifyPin()}
              />
            </div>
            <Button 
              onClick={verifyPin} 
              className="w-full h-14 text-xl bg-amber-600 hover:bg-amber-700" 
              disabled={loading || pin.length < 4}
            >
              {loading ? 'Verifying...' : 'Access Kitchen'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Kitchen TV Dashboard
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header - Very large for TV */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b-4 border-amber-600">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ChefHat className="w-12 h-12 text-amber-500" />
              <div>
                <h1 className="text-3xl font-bold">
                  KITCHEN DISPLAY
                </h1>
                <p className="text-xl text-gray-400">
                  Coffee Nivasa
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-red-500">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
                <p className="text-lg text-gray-400">NEW</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-amber-500">
                  {orders.filter(o => o.status === 'preparing').length}
                </p>
                <p className="text-lg text-gray-400">PREPARING</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-green-500">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
                <p className="text-lg text-gray-400">READY</p>
              </div>
            </div>
            
            {/* Clock */}
            <div className="text-right">
              <p className="text-4xl font-mono font-bold text-white">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-lg text-gray-400">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="p-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Coffee className="w-32 h-32 text-gray-700 mb-6" />
            <p className="text-4xl text-gray-600 font-bold">NO ACTIVE ORDERS</p>
            <p className="text-2xl text-gray-700 mt-2">New orders will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              const payment = paymentConfig[order.payment_status];
              const StatusIcon = config.icon;
              const PaymentIcon = payment.icon;

              return (
                <div
                  key={order.id}
                  className={cn(
                    'bg-gray-900 rounded-3xl overflow-hidden border-4 transition-all',
                    order.status === 'pending' && 'border-red-500 animate-pulse',
                    order.status === 'preparing' && 'border-amber-500',
                    order.status === 'ready' && 'border-green-500',
                    order.status === 'served' && 'border-blue-500'
                  )}
                >
                  {/* Order Header */}
                  <div className={cn('px-6 py-4 flex items-center justify-between', config.color)}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-bold">
                        #{order.order_number}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-8 h-8" />
                      <span className="text-2xl font-bold">{config.label}</span>
                    </div>
                  </div>

                  {/* Table Info */}
                  <div className="px-6 py-4 bg-gray-800 flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {order.order_type === 'dine_in' ? (
                        <span className="text-white">TABLE {order.table_number}</span>
                      ) : (
                        <span className="text-gray-400">TAKEAWAY</span>
                      )}
                    </div>
                    <div className="text-2xl text-gray-400">
                      {getTimeSince(order.created_at)}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className={cn('px-6 py-3 flex items-center justify-center gap-3', payment.color)}>
                    <PaymentIcon className="w-6 h-6" />
                    <span className="text-xl font-bold">{payment.label}</span>
                  </div>

                  {/* Order Items - Large text */}
                  <div className="px-6 py-4 space-y-3 max-h-64 overflow-y-auto">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <span className="text-3xl font-bold text-amber-500 min-w-[3rem]">
                          {item.quantity}×
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-5 h-5 rounded border-2 flex-shrink-0',
                              item.is_veg ? 'border-green-500 bg-green-500/30' : 'border-red-500 bg-red-500/30'
                            )} />
                            <span className="text-2xl font-semibold text-white">{item.item_name}</span>
                          </div>
                          {item.special_instructions && (
                            <p className="text-lg text-amber-400 mt-1 ml-8">
                              ⚠ {item.special_instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons - Large touch targets */}
                  <div className="px-4 py-4 bg-gray-800 border-t border-gray-700 grid grid-cols-3 gap-3">
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      disabled={order.status === 'preparing'}
                      className={cn(
                        'h-16 text-lg font-bold rounded-xl',
                        order.status === 'preparing' 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-gray-700 hover:bg-amber-600 text-white'
                      )}
                    >
                      PREPARING
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      disabled={order.status === 'ready'}
                      className={cn(
                        'h-16 text-lg font-bold rounded-xl',
                        order.status === 'ready' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 hover:bg-green-600 text-white'
                      )}
                    >
                      READY
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'served')}
                      disabled={order.status === 'served'}
                      className={cn(
                        'h-16 text-lg font-bold rounded-xl',
                        order.status === 'served' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 hover:bg-blue-600 text-white'
                      )}
                    >
                      SERVED
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
