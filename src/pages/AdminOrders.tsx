import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  LogOut, Search, Clock, CheckCircle2, ChefHat, UtensilsCrossed, 
  XCircle, Receipt, RefreshCw, Eye, DollarSign, AlertCircle, ArrowLeft, Printer, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { User } from '@supabase/supabase-js';
import { printInvoice, downloadInvoice } from '@/utils/invoiceGenerator';

interface OrderItem {
  id: string;
  item_name: string;
  item_price: number;
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
  payment_status: 'pending' | 'paid' | 'cash_pending' | 'refunded';
  subtotal: number;
  tax: number;
  total: number;
  customer_name: string | null;
  customer_phone: string | null;
  created_at: string;
  completed_at: string | null;
  items: OrderItem[];
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-700', icon: Clock },
  preparing: { label: 'Preparing', color: 'bg-blue-500', textColor: 'text-blue-700', icon: ChefHat },
  ready: { label: 'Ready', color: 'bg-green-500', textColor: 'text-green-700', icon: CheckCircle2 },
  served: { label: 'Served', color: 'bg-purple-500', textColor: 'text-purple-700', icon: UtensilsCrossed },
  completed: { label: 'Completed', color: 'bg-gray-500', textColor: 'text-gray-700', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-700', icon: XCircle },
};

const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'bg-orange-100 text-orange-700' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  cash_pending: { label: 'Cash Pending', color: 'bg-yellow-100 text-yellow-700' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-700' },
};

export default function AdminOrders() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user?.email) return;
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } else {
      setIsAdmin(!!data);
      if (data) {
        fetchOrders();
        setupRealtimeSubscription();
      }
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

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
      .channel('admin-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const updateData: any = { status: newStatus };
    if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update order');
      return;
    }

    toast.success(`Order updated to ${statusConfig[newStatus].label}`);
    fetchOrders();
  };

  const updatePaymentStatus = async (orderId: string, newStatus: Order['payment_status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update payment');
      return;
    }

    toast.success(`Payment marked as ${paymentStatusConfig[newStatus].label}`);
    fetchOrders();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toString().includes(searchQuery) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    cashPending: orders.filter(o => o.payment_status === 'cash_pending').length,
    todayTotal: orders
      .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total, 0),
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-6">
              You don't have admin access.
            </p>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Order Management
                </h1>
                <p className="text-muted-foreground">
                  Real-time order tracking
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchOrders}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">New Orders</p>
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400">Preparing</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.preparing}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-700 dark:text-orange-400">Cash Pending</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{stats.cashPending}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400">Today's Revenue</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">₹{stats.todayTotal}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl p-4 mb-6 border border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by order #, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="served">Served</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="cash_pending">Cash Pending</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left p-4 font-semibold text-muted-foreground">Order #</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Type</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Items</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Total</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Payment</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Time</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const config = statusConfig[order.status];
                    const paymentConfig = paymentStatusConfig[order.payment_status];
                    return (
                      <tr key={order.id} className="border-b border-border hover:bg-secondary/30">
                        <td className="p-4">
                          <span className="font-bold text-primary">#{order.order_number}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">
                            {order.order_type === 'dine_in' ? `Table ${order.table_number}` : 'Takeaway'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold">₹{order.total}</span>
                        </td>
                        <td className="p-4">
                          <Badge className={cn('font-medium', config.color)}>
                            {config.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={cn('font-medium', paymentConfig.color)}>
                            {paymentConfig.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(order.created_at)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Order #{order.order_number}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Type:</span>
                                      <p className="font-medium">
                                        {order.order_type === 'dine_in' ? `Dine In - Table ${order.table_number}` : 'Takeaway'}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Time:</span>
                                      <p className="font-medium">{formatDateTime(order.created_at)}</p>
                                    </div>
                                    {order.customer_name && (
                                      <div>
                                        <span className="text-muted-foreground">Customer:</span>
                                        <p className="font-medium">{order.customer_name}</p>
                                      </div>
                                    )}
                                    {order.customer_phone && (
                                      <div>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <p className="font-medium">{order.customer_phone}</p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Items</h4>
                                    <div className="space-y-2">
                                      {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                          <span>
                                            {item.quantity}× {item.item_name}
                                          </span>
                                          <span>₹{item.item_price * item.quantity}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="border-t mt-4 pt-4 space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₹{order.subtotal}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>₹{order.tax}</span>
                                      </div>
                                      <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{order.total}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4 grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm text-muted-foreground">Update Status</label>
                                      <Select 
                                        value={order.status} 
                                        onValueChange={(v) => updateOrderStatus(order.id, v as Order['status'])}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="preparing">Preparing</SelectItem>
                                          <SelectItem value="ready">Ready</SelectItem>
                                          <SelectItem value="served">Served</SelectItem>
                                          <SelectItem value="completed">Completed</SelectItem>
                                          <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm text-muted-foreground">Payment Status</label>
                                      <Select 
                                        value={order.payment_status} 
                                        onValueChange={(v) => updatePaymentStatus(order.id, v as Order['payment_status'])}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="paid">Paid</SelectItem>
                                          <SelectItem value="cash_pending">Cash Pending</SelectItem>
                                          <SelectItem value="refunded">Refunded</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4 flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => printInvoice(order)}
                                      className="flex-1"
                                    >
                                      <Printer className="w-4 h-4 mr-2" />
                                      Print
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => downloadInvoice(order)}
                                      className="flex-1"
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => printInvoice(order)}
                              title="Print Invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            
                            {order.payment_status === 'cash_pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updatePaymentStatus(order.id, 'paid')}
                              >
                                <DollarSign className="w-4 h-4 mr-1" />
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No orders found</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
