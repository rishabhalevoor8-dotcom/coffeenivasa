import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, ChefHat, Clock, CheckCircle2, UtensilsCrossed, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  pending: { label: 'New', color: 'bg-yellow-500', icon: Clock },
  preparing: { label: 'Preparing', color: 'bg-blue-500', icon: ChefHat },
  ready: { label: 'Ready', color: 'bg-green-500', icon: CheckCircle2 },
  served: { label: 'Served', color: 'bg-purple-500', icon: UtensilsCrossed },
  completed: { label: 'Done', color: 'bg-gray-500', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: Clock },
};

export default function Kitchen() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

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
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    // Fetch items for each order
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

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'served';
      default: return null;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeSince = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
  };

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Kitchen Dashboard
            </h1>
            <p className="text-muted-foreground">Enter PIN to access orders</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="relative mb-4">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-10 text-center text-2xl tracking-widest h-14"
                maxLength={6}
                onKeyDown={(e) => e.key === 'Enter' && verifyPin()}
              />
            </div>
            <Button 
              onClick={verifyPin} 
              className="w-full h-12" 
              disabled={loading || pin.length < 4}
            >
              {loading ? 'Verifying...' : 'Access Kitchen'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Kitchen Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-primary" />
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  Kitchen Display
                </h1>
                <p className="text-sm text-muted-foreground">
                  {orders.filter(o => o.status === 'pending').length} new orders
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="container mx-auto p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Coffee className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-xl text-muted-foreground">No active orders</p>
            <p className="text-sm text-muted-foreground">New orders will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              const nextStatus = getNextStatus(order.status);

              return (
                <div
                  key={order.id}
                  className={cn(
                    'bg-card rounded-2xl border-2 overflow-hidden transition-all',
                    order.status === 'pending' && 'border-yellow-500 animate-pulse',
                    order.status === 'preparing' && 'border-blue-500',
                    order.status === 'ready' && 'border-green-500',
                    order.status === 'served' && 'border-purple-500'
                  )}
                >
                  {/* Order Header */}
                  <div className={cn('px-4 py-3 flex items-center justify-between', config.color)}>
                    <div className="flex items-center gap-2 text-white">
                      <span className="font-display text-2xl font-bold">
                        #{order.order_number}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <StatusIcon className="w-5 h-5" />
                      <span className="font-medium">{config.label}</span>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {order.order_type === 'dine_in' ? (
                        <Badge variant="secondary" className="font-bold">
                          Table {order.table_number}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Takeaway</Badge>
                      )}
                      <Badge 
                        variant={order.payment_status === 'paid' ? 'default' : 'destructive'}
                        className="font-medium"
                      >
                        {order.payment_status === 'cash_pending' ? '💵 Cash' : '✓ Paid'}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">
                      {getTimeSince(order.created_at)}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="px-4 py-3 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <span className="font-bold text-lg text-primary min-w-[2rem]">
                          {item.quantity}×
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              'w-3 h-3 rounded border flex-shrink-0',
                              item.is_veg ? 'border-accent bg-accent/30' : 'border-destructive bg-destructive/30'
                            )} />
                            <span className="font-medium text-foreground">{item.item_name}</span>
                          </div>
                          {item.special_instructions && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Note: {item.special_instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  {nextStatus && (
                    <div className="px-4 py-3 border-t border-border">
                      <Button
                        onClick={() => updateOrderStatus(order.id, nextStatus)}
                        className="w-full"
                        size="lg"
                      >
                        Mark as {statusConfig[nextStatus].label}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
