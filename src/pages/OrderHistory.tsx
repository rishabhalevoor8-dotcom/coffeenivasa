import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Phone, Search, Coffee, Calendar, Clock, Receipt, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  item_price: number;
  is_veg: boolean;
}

interface Order {
  id: string;
  order_number: number;
  table_number: number | null;
  order_type: 'dine_in' | 'takeaway';
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-500' },
  preparing: { label: 'Preparing', color: 'bg-blue-500' },
  ready: { label: 'Ready', color: 'bg-green-500' },
  served: { label: 'Served', color: 'bg-purple-500' },
  completed: { label: 'Completed', color: 'bg-gray-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
};

export default function OrderHistory() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchOrders = async () => {
    if (phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setSearched(true);

    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
      return;
    }

    if (!ordersData || ordersData.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);
        return { ...order, items: items || [] };
      })
    );

    setOrders(ordersWithItems);
    setLoading(false);
  };

  return (
    <Layout>
      <section className="py-8 md:py-12 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Order History
            </h1>
            <p className="text-muted-foreground">
              Enter your phone number to view your past orders
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="pl-10 h-12 text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && searchOrders()}
                  maxLength={10}
                />
              </div>
              <Button 
                onClick={searchOrders} 
                disabled={loading || phone.length < 10}
                size="lg"
                className="h-12"
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-muted-foreground">
                    We couldn't find any orders with this phone number.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Found {orders.length} order{orders.length > 1 ? 's' : ''}
                  </p>
                  
                  {orders.map((order) => {
                    const status = statusLabels[order.status] || { label: order.status, color: 'bg-gray-500' };
                    
                    return (
                      <div 
                        key={order.id} 
                        className="bg-card rounded-2xl border border-border overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Receipt className="w-5 h-5 text-gold" />
                              <span className="font-display font-bold text-lg text-foreground">
                                #{order.order_number}
                              </span>
                            </div>
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-semibold text-white',
                              status.color
                            )}>
                              {status.label}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(order.created_at), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {format(new Date(order.created_at), 'h:mm a')}
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="px-5 py-4 space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  'w-3 h-3 rounded border',
                                  item.is_veg ? 'border-accent bg-accent/30' : 'border-destructive bg-destructive/30'
                                )} />
                                <span className="text-foreground">
                                  {item.quantity}× {item.item_name}
                                </span>
                              </div>
                              <span className="text-muted-foreground">
                                ₹{item.item_price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="px-5 py-3 bg-secondary/50 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {order.order_type === 'dine_in' 
                              ? `Dine In - Table ${order.table_number}` 
                              : 'Takeaway'}
                          </span>
                          <span className="font-display font-bold text-lg text-gold">
                            Total: ₹{order.total}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
