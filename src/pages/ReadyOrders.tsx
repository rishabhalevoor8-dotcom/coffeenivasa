import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, MapPin, Clock, User, Volume2, VolumeX, Utensils, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  is_veg: boolean;
}

interface Order {
  id: string;
  order_number: number;
  table_number: number | null;
  order_type: 'dine_in' | 'takeaway';
  customer_name: string | null;
  created_at: string;
  items: OrderItem[];
}

const playReadySound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Pleasant bell sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Audio not supported');
  }
};

export default function ReadyOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchReadyOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, table_number, order_type, customer_name, created_at')
        .eq('status', 'ready')
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('id, order_id, item_name, quantity, is_veg')
          .in('order_id', ordersData.map(o => o.id));

        if (itemsError) throw itemsError;

        const ordersWithItems = ordersData.map(order => ({
          ...order,
          items: (itemsData || []).filter(item => item.order_id === order.id)
        }));

        // Check for new orders
        const previousOrderIds = orders.map(o => o.id);
        const newOrders = ordersWithItems.filter(o => !previousOrderIds.includes(o.id));
        
        if (newOrders.length > 0 && soundEnabled && previousOrderIds.length > 0) {
          playReadySound();
          toast({
            title: "🔔 Order Ready!",
            description: `Order #${newOrders[0].order_number} is ready for pickup`,
          });
        }

        setOrders(ordersWithItems);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadyOrders();
    const interval = setInterval(fetchReadyOrders, 5000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  useEffect(() => {
    const channel = supabase
      .channel('ready-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchReadyOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [soundEnabled]);

  const markAsServed = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'served', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order Served",
        description: "Order has been marked as served",
      });

      fetchReadyOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getTimeSince = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Ready for Pickup
                </h1>
                <p className="text-sm text-muted-foreground">
                  Orders waiting to be served
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                {orders.length} Ready
              </Badge>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={soundEnabled ? 'bg-green-100 border-green-300' : ''}
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-green-600" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
              
              <div className="text-right hidden sm:block">
                <div className="text-lg font-semibold">
                  {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">All Caught Up!</h2>
            <p className="text-muted-foreground max-w-md">
              No orders are ready for pickup right now. New ready orders will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => (
              <Card 
                key={order.id} 
                className="border-2 border-green-300 dark:border-green-700 bg-white dark:bg-card shadow-lg hover:shadow-xl transition-shadow animate-in fade-in-0 slide-in-from-bottom-4"
              >
                <CardHeader className="pb-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">
                      #{order.order_number}
                    </CardTitle>
                    <Badge className="bg-white/20 text-white border-white/30 text-sm">
                      {order.order_type === 'dine_in' ? (
                        <span className="flex items-center gap-1">
                          <Utensils className="h-3 w-3" />
                          Dine In
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          Takeaway
                        </span>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4 space-y-4">
                  {/* Location/Customer Info */}
                  <div className="flex items-center justify-between text-sm">
                    {order.order_type === 'dine_in' && order.table_number ? (
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <MapPin className="h-4 w-4 text-green-600" />
                        Table {order.table_number}
                      </div>
                    ) : order.customer_name ? (
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <User className="h-4 w-4 text-green-600" />
                        {order.customer_name}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">—</div>
                    )}
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getTimeSince(order.created_at)}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {order.items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium">{item.quantity}×</span>
                        <span className="text-foreground truncate">{item.item_name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => markAsServed(order.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    size="lg"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Served
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm border-t border-border py-3">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Screen auto-refreshes • Pick up orders and deliver to customers
        </div>
      </footer>
    </div>
  );
}
