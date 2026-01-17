import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, ChefHat, Clock, CheckCircle2, Coffee, CreditCard, Banknote, PlayCircle, AlertCircle } from 'lucide-react';
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
  payment_status: 'pending' | 'paid' | 'cash_pending' | 'card_pending' | 'cheque_pending' | 'refunded';
  created_at: string;
  items: OrderItem[];
}

// Kitchen displays 'pending' as 'NEW ORDER' for clarity
const statusConfig = {
  pending: { label: 'NEW ORDER', color: 'bg-blue-600', textColor: 'text-white', icon: AlertCircle },
  preparing: { label: 'PREPARING', color: 'bg-amber-500', textColor: 'text-white', icon: ChefHat },
  ready: { label: 'READY', color: 'bg-green-600', textColor: 'text-white', icon: CheckCircle2 },
  served: { label: 'SERVED', color: 'bg-purple-600', textColor: 'text-white', icon: CheckCircle2 },
  completed: { label: 'DONE', color: 'bg-gray-600', textColor: 'text-white', icon: CheckCircle2 },
  cancelled: { label: 'CANCELLED', color: 'bg-gray-800', textColor: 'text-white', icon: Clock },
};

const paymentConfig = {
  paid: { label: 'PAID (UPI)', color: 'bg-green-700', icon: CreditCard },
  cash_pending: { label: 'CASH', color: 'bg-amber-700', icon: Banknote },
  card_pending: { label: 'CARD', color: 'bg-blue-700', icon: CreditCard },
  cheque_pending: { label: 'CHEQUE', color: 'bg-purple-700', icon: CreditCard },
  pending: { label: 'UNPAID', color: 'bg-red-700', icon: Clock },
  refunded: { label: 'REFUNDED', color: 'bg-gray-700', icon: CreditCard },
};

export default function Kitchen() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

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
    // Only fetch PENDING and PREPARING orders for kitchen display
    // pending = new orders that need to start preparing
    // preparing = orders currently being made
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'preparing'])
      .order('created_at', { ascending: true }); // Oldest first (FIFO)

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

  // Kitchen staff can only update status: PENDING → PREPARING → READY
  const updateOrderStatus = async (orderId: string, newStatus: 'preparing' | 'ready') => {
    setUpdatingOrder(orderId);
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order:', error);
    } else {
      toast.success(`Order marked as ${newStatus.toUpperCase()}`);
      // Play sound for status change
      try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {
        // Ignore audio errors
      }
    }
    
    setUpdatingOrder(null);
  };

  const getTimeSince = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'NOW';
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getTimeColor = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 5) return 'text-green-400';
    if (minutes < 10) return 'text-amber-400';
    return 'text-red-400';
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
              Kitchen Display
            </h1>
            <p className="text-xl text-gray-400">Coffee Nivasa • Level 2</p>
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
  const newOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header - TV Optimized */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b-4 border-amber-600">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ChefHat className="w-14 h-14 text-amber-500" />
              <div>
                <h1 className="text-4xl font-bold tracking-wide">
                  KITCHEN DISPLAY
                </h1>
                <p className="text-xl text-gray-400">
                  Coffee Nivasa • Worker Dashboard
                </p>
              </div>
            </div>
            
            {/* Order Stats - Large */}
            <div className="flex items-center gap-12">
              <div className="text-center">
                <p className="text-6xl font-bold text-blue-500">
                  {newOrders.length}
                </p>
                <p className="text-xl text-gray-400 font-semibold">NEW</p>
              </div>
              <div className="text-center">
                <p className="text-6xl font-bold text-amber-500">
                  {preparingOrders.length}
                </p>
                <p className="text-xl text-gray-400 font-semibold">PREPARING</p>
              </div>
              <div className="text-center">
                <p className="text-6xl font-bold text-white">
                  {orders.length}
                </p>
                <p className="text-xl text-gray-400 font-semibold">TOTAL</p>
              </div>
            </div>
            
            {/* Clock - Large */}
            <div className="text-right">
              <p className="text-5xl font-mono font-bold text-white">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xl text-gray-400">
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
            <Coffee className="w-40 h-40 text-gray-700 mb-8" />
            <p className="text-5xl text-gray-600 font-bold">NO ACTIVE ORDERS</p>
            <p className="text-2xl text-gray-700 mt-4">New orders will appear here automatically</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              const payment = paymentConfig[order.payment_status];
              const StatusIcon = config.icon;
              const PaymentIcon = payment.icon;

              return (
                <div
                  key={order.id}
                  className={cn(
                    'bg-gray-900 rounded-2xl overflow-hidden border-4 transition-all shadow-2xl',
                    order.status === 'pending' && 'border-blue-500 ring-4 ring-blue-500/30',
                    order.status === 'preparing' && 'border-amber-500'
                  )}
                >
                  {/* Order Header */}
                  <div className={cn('px-6 py-5 flex items-center justify-between', config.color)}>
                    <span className="text-5xl font-black">
                      #{order.order_number}
                    </span>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-8 h-8" />
                      <span className="text-2xl font-bold">{config.label}</span>
                    </div>
                  </div>

                  {/* Table / Order Type - Extra Large */}
                  <div className="px-6 py-5 bg-gray-800 flex items-center justify-between">
                    <div className="text-4xl font-black">
                      {order.order_type === 'dine_in' ? (
                        <span className="text-white">TABLE {order.table_number}</span>
                      ) : (
                        <span className="text-orange-400">🥡 TAKEAWAY</span>
                      )}
                    </div>
                    <div className={cn('text-3xl font-bold', getTimeColor(order.created_at))}>
                      <Clock className="w-6 h-6 inline mr-2" />
                      {getTimeSince(order.created_at)}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className={cn('px-6 py-3 flex items-center justify-center gap-3', payment.color)}>
                    <PaymentIcon className="w-6 h-6" />
                    <span className="text-xl font-bold">{payment.label}</span>
                  </div>

                  {/* Order Items - Large readable text */}
                  <div className="px-6 py-5 space-y-4 max-h-72 overflow-y-auto bg-gray-950">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <span className="text-4xl font-black text-amber-400 min-w-[4rem] text-right">
                          {item.quantity}×
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-6 h-6 rounded border-2 flex-shrink-0',
                              item.is_veg ? 'border-green-500 bg-green-500/40' : 'border-red-500 bg-red-500/40'
                            )} />
                            <span className="text-2xl font-bold text-white leading-tight">
                              {item.item_name}
                            </span>
                          </div>
                          {item.special_instructions && (
                            <p className="text-lg text-amber-400 mt-2 ml-9 font-medium">
                              ⚠️ {item.special_instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons - Kitchen staff can update status */}
                  <div className="p-4 bg-gray-900 border-t border-gray-700">
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        disabled={updatingOrder === order.id}
                        className="w-full h-16 text-2xl font-bold bg-amber-600 hover:bg-amber-700 transition-colors"
                      >
                        <PlayCircle className="w-8 h-8 mr-3" />
                        {updatingOrder === order.id ? 'UPDATING...' : 'START PREPARING'}
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        disabled={updatingOrder === order.id}
                        className="w-full h-16 text-2xl font-bold bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle2 className="w-8 h-8 mr-3" />
                        {updatingOrder === order.id ? 'UPDATING...' : 'MARK READY'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer - Status Flow Legend */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t-2 border-gray-700 px-8 py-4">
        <div className="flex items-center justify-center gap-8 text-xl">
          <span className="text-gray-400 font-semibold">STATUS FLOW:</span>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-blue-600 rounded-lg font-bold">NEW ORDER</span>
            <span className="text-gray-500 text-3xl">→</span>
            <span className="px-4 py-2 bg-amber-500 rounded-lg font-bold">PREPARING</span>
            <span className="text-gray-500 text-3xl">→</span>
            <span className="px-4 py-2 bg-green-600 rounded-lg font-bold">READY</span>
          </div>
          <span className="text-gray-500 ml-8">|</span>
          <span className="text-gray-400">Kitchen Staff • Read-Only Access</span>
        </div>
      </div>
    </div>
  );
}
