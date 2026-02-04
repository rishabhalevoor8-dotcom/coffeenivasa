import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Coffee, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  UtensilsCrossed, 
  ShoppingBag, 
  CheckCircle,
  Wallet,
  ArrowLeft,
  Sparkles,
  User,
  Phone,
  Mail,
  Clock,
  Calendar,
  Home,
  ChefHat,
  Bell,
  QrCode,
  Smartphone,
  ShieldCheck,
  Banknote,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import logo from '@/assets/logo.png';
import { useShopStatus } from '@/hooks/useShopStatus';
import { ShopClosedBanner } from '@/components/order/ShopClosedBanner';
import { useConfetti } from '@/hooks/useConfetti';
import { MenuSkeleton, CategoryTabsSkeleton } from '@/components/ui/menu-skeleton';

type FoodType = 'veg' | 'non_veg' | 'egg';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  is_veg: boolean;
  food_type: FoodType;
  subcategory: string | null;
  category_id: string;
  image_key: string;
}

interface MenuCategory {
  id: string;
  name: string;
  icon: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
}

type OrderType = 'dine_in' | 'takeaway';
type PaymentMethod = 'upi_later' | 'cash_later' | 'card_later';

export default function Order() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerDetailsCollected, setCustomerDetailsCollected] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'>('pending');
  const [orderDateTime, setOrderDateTime] = useState<Date | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi_later');
  const [showUpiConfirmation, setShowUpiConfirmation] = useState(false);
  const [queueCount, setQueueCount] = useState<number>(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);

  // Shop status check
  const shopStatus = useShopStatus();
  
  // Confetti celebration
  const { fireConfetti } = useConfetti();

  // Trigger confetti when order is complete
  useEffect(() => {
    if (orderComplete) {
      // Small delay to let the success screen render first
      const timer = setTimeout(() => {
        fireConfetti();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [orderComplete, fireConfetti]);

  // Real-time order status subscription
  useEffect(() => {
    if (!orderId || !orderComplete) return;

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = payload.new.status as typeof orderStatus;
          setOrderStatus(newStatus);
          
          // Show toast notification for status changes
          const statusMessages: Record<string, string> = {
            preparing: '👨‍🍳 Your order is now being prepared!',
            ready: '✅ Your order is ready for pickup!',
            served: '🎉 Enjoy your meal!',
            cancelled: '❌ Your order has been cancelled',
          };
          
          if (statusMessages[newStatus]) {
            toast.success(statusMessages[newStatus]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, orderComplete]);

  const verifyPin = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'customer_pin')
      .maybeSingle();

    if (error || !data) {
      toast.error('Could not verify PIN');
      setLoading(false);
      return;
    }

    if (data.value === pin) {
      setIsAuthenticated(true);
      fetchMenuData();
    } else {
      toast.error('Invalid PIN');
    }
    setLoading(false);
  };

  const fetchMenuData = async () => {
    setMenuLoading(true);
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase.from('menu_categories').select('*').order('display_order'),
        supabase.from('menu_items').select('*').eq('is_active', true).order('display_order'),
      ]);

      const fetchedItems = (itemsRes.data || []).map(item => ({
        ...item,
        food_type: (item.food_type as FoodType) || 'veg'
      }));
      setItems(fetchedItems);

      if (categoriesRes.data) {
        // Filter out categories that have no items
        const categoriesWithItems = categoriesRes.data.filter(cat => 
          fetchedItems.some(item => item.category_id === cat.id)
        );
        setCategories(categoriesWithItems);
        if (categoriesWithItems.length > 0) {
          setSelectedCategory(categoriesWithItems[0].id);
        }
      }
    } finally {
      setMenuLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  // Packing charge only for takeaway
  const packingCharge = orderType === 'takeaway' ? 15 : 0;
  const total = subtotal + tax + packingCharge;

  const getItemQuantity = (itemId: string) => cart.find(i => i.id === itemId)?.quantity || 0;

  const getPaymentStatus = (): 'pending' | 'paid' | 'cash_pending' | 'refunded' | 'cheque_pending' | 'card_pending' => {
    switch (selectedPayment) {
      case 'cash_later':
        return 'cash_pending';
      case 'card_later':
        return 'card_pending';
      case 'upi_later':
      default:
        return 'pending';
    }
  };

  const getPaymentLabel = () => {
    switch (selectedPayment) {
      case 'cash_later':
        return 'Pay Later (Cash)';
      case 'card_later':
        return 'Pay Later (Card)';
      case 'upi_later':
      default:
        return 'Pay Later (UPI)';
    }
  };

  const validateCustomerDetails = () => {
    if (!customerDetails.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!customerDetails.phone.trim() || customerDetails.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleCustomerDetailsSubmit = () => {
    if (validateCustomerDetails()) {
      setCustomerDetailsCollected(true);
    }
  };

  const handleProceedToPayment = () => {
    if (orderType === 'dine_in' && !tableNumber) {
      toast.error('Please select a table number');
      return;
    }

    // Directly submit order - Pay Later (UPI)
    submitOrder();
  };

  const fetchQueueInfo = async () => {
    try {
      // Count orders that are pending or preparing (excluding completed, served, cancelled)
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'preparing']);

      if (error) throw error;

      const ordersAhead = count || 0;
      setQueueCount(ordersAhead);
      
      // Estimate ~5 minutes per order in queue (adjust based on your café's speed)
      const estimatedMinutes = ordersAhead * 5;
      setEstimatedWaitTime(estimatedMinutes);
    } catch (error) {
      console.error('Error fetching queue info:', error);
      setQueueCount(0);
      setEstimatedWaitTime(0);
    }
  };

  const submitOrder = async () => {
    setIsSubmitting(true);

    try {
      // Fetch queue info before placing order
      await fetchQueueInfo();

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_type: orderType,
          table_number: orderType === 'dine_in' ? tableNumber : null,
          subtotal,
          tax,
          total,
          payment_status: getPaymentStatus(),
          status: 'pending',
          customer_name: customerDetails.name,
          customer_phone: customerDetails.phone,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
        is_veg: item.is_veg,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderNumber(orderData.order_number);
      setOrderId(orderData.id);
      setOrderStatus('pending');
      setOrderDateTime(new Date(orderData.created_at));
      setOrderComplete(true);
      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startNewOrder = () => {
    setOrderComplete(false);
    setOrderNumber(null);
    setOrderId(null);
    setOrderStatus('pending');
    setOrderDateTime(null);
    setOrderType(null);
    setTableNumber(null);
    setCustomerDetailsCollected(false);
    setCustomerDetails({ name: '', phone: '', email: '' });
    setShowUpiConfirmation(false);
    setQueueCount(0);
    setEstimatedWaitTime(0);
  };

  // UPI QR Code Payment Confirmation Screen
  if (showUpiConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-amber-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setShowUpiConfirmation(false);
                setShowCart(true);
              }}
              className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-amber-700" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">UPI Payment</h1>
              <p className="text-sm text-muted-foreground">Scan & Pay</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 flex flex-col items-center justify-center">
          {/* Amount Display */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
            <p className="font-display text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              ₹{total}
            </p>
          </div>

          {/* QR Code Placeholder */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-amber-100 border border-amber-100 mb-6 w-full max-w-xs">
            <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-amber-200">
              <QrCode className="w-24 h-24 text-amber-300 mb-4" />
              <p className="text-sm text-muted-foreground text-center px-4">
                QR Code will be added soon
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-foreground mb-1">Coffee Nivasa</p>
              <p className="text-xs text-muted-foreground">UPI ID will appear here</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-5 shadow-md shadow-amber-100 border border-amber-50 w-full max-w-xs mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-600" />
              How to Pay
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0 mt-0.5">1</span>
                <span>Open any UPI app (GPay, PhonePe, Paytm)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0 mt-0.5">2</span>
                <span>Scan the QR code above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0 mt-0.5">3</span>
                <span>Complete payment of ₹{total}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0 mt-0.5">4</span>
                <span>Show payment confirmation to staff</span>
              </li>
            </ol>
          </div>

          {/* Staff Verification Notice */}
          <div className="bg-amber-100 rounded-2xl p-4 w-full max-w-xs flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-700 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800 text-sm">Staff Verification Required</p>
              <p className="text-xs text-amber-700 mt-1">
                After payment, our staff will verify and confirm your order
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom - Confirm Button */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-amber-100 p-4 shadow-2xl">
          <Button 
            onClick={submitOrder}
            disabled={isSubmitting}
            className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              'Placing Order...'
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                I've Paid - Confirm Order
              </span>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Staff will verify payment before preparing your order
          </p>
        </div>
      </div>
    );
  }

  // Order Complete Screen
  if (orderComplete) {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    };
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm w-full">
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-green-200">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-amber-500 absolute top-0 right-1/4 animate-pulse" />
          </div>
          
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            Thank you, <span className="font-semibold text-foreground">{customerDetails.name}</span>!
          </p>
          
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-amber-100 border border-amber-100 mb-6">
            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Order Number</p>
            <p className="font-display text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              #{orderNumber}
            </p>
            
            {orderDateTime && (
              <div className="mt-6 pt-4 border-t border-amber-100">
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(orderDateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(orderDateTime)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Estimated Wait Time Card */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-5 mb-6 border border-amber-200">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-medium text-amber-800 uppercase tracking-wide">Estimated Wait Time</p>
            </div>
            <p className="font-display text-3xl font-bold text-amber-700">
              {estimatedWaitTime === 0 ? (
                'Ready Soon!'
              ) : estimatedWaitTime < 60 ? (
                `~${estimatedWaitTime} min`
              ) : (
                `~${Math.floor(estimatedWaitTime / 60)}h ${estimatedWaitTime % 60}min`
              )}
            </p>
            <p className="text-xs text-amber-600 mt-2">
              {queueCount === 0 ? (
                'No orders ahead of you'
              ) : queueCount === 1 ? (
                '1 order ahead of you'
              ) : (
                `${queueCount} orders ahead of you`
              )}
            </p>
          </div>

          {/* Real-time Order Status Tracker */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-border mb-6">
            <p className="text-sm font-medium text-foreground mb-4 uppercase tracking-wide">Order Status</p>
            
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-muted rounded-full">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    orderStatus === 'pending' && "w-0 bg-primary",
                    orderStatus === 'preparing' && "w-1/2 bg-primary",
                    orderStatus === 'ready' && "w-full bg-green-500",
                    orderStatus === 'served' && "w-full bg-green-500",
                    orderStatus === 'cancelled' && "w-full bg-destructive"
                  )}
                />
              </div>

              {/* Pending Step */}
              <div className="flex flex-col items-center z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  orderStatus === 'pending' 
                    ? "bg-primary text-primary-foreground animate-pulse" 
                    : orderStatus === 'cancelled'
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground"
                )}>
                  <Clock className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs mt-2 font-medium",
                  orderStatus === 'pending' ? "text-primary" : "text-muted-foreground"
                )}>Pending</span>
              </div>

              {/* Preparing Step */}
              <div className="flex flex-col items-center z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  orderStatus === 'preparing' 
                    ? "bg-primary text-primary-foreground animate-pulse" 
                    : orderStatus === 'ready' || orderStatus === 'served'
                    ? "bg-primary text-primary-foreground"
                    : orderStatus === 'cancelled'
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  <ChefHat className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs mt-2 font-medium",
                  orderStatus === 'preparing' ? "text-primary" : "text-muted-foreground"
                )}>Preparing</span>
              </div>

              {/* Ready Step */}
              <div className="flex flex-col items-center z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  orderStatus === 'ready' 
                    ? "bg-green-500 text-white animate-pulse" 
                    : orderStatus === 'served'
                    ? "bg-green-500 text-white"
                    : orderStatus === 'cancelled'
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  <Bell className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs mt-2 font-medium",
                  orderStatus === 'ready' ? "text-green-600" : "text-muted-foreground"
                )}>Ready</span>
              </div>
            </div>

            {/* Status Message */}
            <div className={cn(
              "mt-5 p-3 rounded-xl text-sm font-medium text-center",
              orderStatus === 'pending' && "bg-primary/10 text-primary",
              orderStatus === 'preparing' && "bg-primary/10 text-primary",
              orderStatus === 'ready' && "bg-green-100 text-green-700",
              orderStatus === 'served' && "bg-green-100 text-green-700",
              orderStatus === 'cancelled' && "bg-destructive/10 text-destructive"
            )}>
              {orderStatus === 'pending' && '⏳ Your order is in the queue'}
              {orderStatus === 'preparing' && '👨‍🍳 Your order is being prepared'}
              {orderStatus === 'ready' && '✅ Your order is ready for pickup!'}
              {orderStatus === 'served' && '🎉 Enjoy your meal!'}
              {orderStatus === 'cancelled' && '❌ Order cancelled'}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            This page updates automatically
          </p>
          
          <Button 
            onClick={startNewOrder} 
            size="lg" 
            className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
          >
            Place Another Order
          </Button>
        </div>
      </div>
    );
  }

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <img 
              src={logo} 
              alt="Coffee Nivasa" 
              className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-xl shadow-amber-200"
            />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Coffee Nivasa
            </h1>
            <p className="text-muted-foreground text-lg">Enter café code to order</p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-amber-100 border border-amber-100">
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter Code"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="text-center text-3xl tracking-[0.5em] h-16 rounded-2xl border-2 border-amber-200 focus:border-amber-400 bg-amber-50/50 mb-6"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && verifyPin()}
            />
            <Button 
              onClick={verifyPin} 
              className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg" 
              disabled={loading || pin.length < 4}
            >
              {loading ? 'Verifying...' : 'Start Ordering'}
            </Button>
            
            {/* Home Button */}
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Customer Details Collection Screen
  if (!customerDetailsCollected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-200">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Your Details
            </h1>
            <p className="text-muted-foreground">Please tell us a bit about you</p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-amber-100 border border-amber-100">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 h-12 rounded-xl border-2 border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    className="pl-10 h-12 rounded-xl border-2 border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 h-12 rounded-xl border-2 border-amber-200 focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleCustomerDetailsSubmit}
              className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg mt-6"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Shop Closed Screen
  if (!shopStatus.loading && !shopStatus.isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src={logo} 
              alt="Coffee Nivasa" 
              className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-lg"
            />
            <h1 className="font-display text-2xl font-bold text-foreground">
              Coffee Nivasa
            </h1>
          </div>
          <ShopClosedBanner 
            openTime={shopStatus.openTime} 
            closeTime={shopStatus.closeTime} 
          />
          <div className="mt-6">
            <Button 
              onClick={() => shopStatus.refetch()}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Check Again
            </Button>
          </div>
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Order Type Selection
  if (!orderType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              How are you dining?
            </h1>
            <p className="text-muted-foreground text-lg">Select your preference</p>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <button
              onClick={() => setOrderType('dine_in')}
              className="bg-white rounded-3xl p-8 border-2 border-amber-100 hover:border-amber-400 transition-all duration-300 group shadow-lg shadow-amber-100 hover:shadow-xl active:scale-95"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-5 group-hover:from-amber-200 group-hover:to-orange-200 transition-colors">
                <UtensilsCrossed className="w-10 h-10 text-amber-600" />
              </div>
              <p className="font-display font-bold text-xl text-foreground">Dine In</p>
              <p className="text-sm text-muted-foreground mt-1">Eat here</p>
            </button>
            
            <button
              onClick={() => setOrderType('takeaway')}
              className="bg-white rounded-3xl p-8 border-2 border-amber-100 hover:border-amber-400 transition-all duration-300 group shadow-lg shadow-amber-100 hover:shadow-xl active:scale-95"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-5 group-hover:from-amber-200 group-hover:to-orange-200 transition-colors">
                <ShoppingBag className="w-10 h-10 text-amber-600" />
              </div>
              <p className="font-display font-bold text-xl text-foreground">Takeaway</p>
              <p className="text-sm text-muted-foreground mt-1">Pack to go</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Table Selection (for dine-in)
  if (orderType === 'dine_in' && !tableNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <button 
            onClick={() => setOrderType(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Select Your Table
            </h1>
            <p className="text-muted-foreground text-lg">Tap your table number</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => setTableNumber(num)}
                className="aspect-square bg-white rounded-2xl border-2 border-amber-100 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center shadow-lg shadow-amber-100 active:scale-95"
              >
                <span className="font-display text-3xl font-bold text-amber-700">{num}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Cart View
  if (showCart) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-amber-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCart(false)}
              className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-amber-700" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Your Order</h1>
              <p className="text-sm text-muted-foreground">{totalItems} items</p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-md shadow-amber-100 border border-amber-50">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    item.food_type === 'veg' ? 'border-green-600' : 
                    item.food_type === 'egg' ? 'border-amber-700' : 'border-red-600'
                  )}>
                    <div className={cn(
                      'w-2.5 h-2.5 rounded-full',
                      item.food_type === 'veg' ? 'bg-green-600' : 
                      item.food_type === 'egg' ? 'bg-amber-700' : 'bg-red-600'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-amber-600 font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center active:scale-95"
                    >
                      <Minus className="w-4 h-4 text-amber-700" />
                    </button>
                    <span className="w-6 text-center font-bold text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center active:scale-95 ml-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Selection */}
          <div className="mt-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Payment Method</h2>
            <div className="space-y-3">
              {/* UPI Option */}
              <button
                onClick={() => setSelectedPayment('upi_later')}
                className={cn(
                  'w-full bg-white rounded-2xl p-4 border-2 transition-all',
                  selectedPayment === 'upi_later' 
                    ? 'border-amber-500 shadow-lg' 
                    : 'border-amber-100 hover:border-amber-300'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                    selectedPayment === 'upi_later' ? 'bg-amber-500' : 'bg-amber-100'
                  )}>
                    <Wallet className={cn(
                      'w-6 h-6',
                      selectedPayment === 'upi_later' ? 'text-white' : 'text-amber-600'
                    )} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-foreground">Pay Later (UPI)</p>
                    <p className="text-xs text-muted-foreground">Pay via UPI at counter/table</p>
                  </div>
                  {selectedPayment === 'upi_later' && (
                    <CheckCircle className="w-6 h-6 text-amber-500" />
                  )}
                </div>
              </button>

              {/* Cash Option */}
              <button
                onClick={() => setSelectedPayment('cash_later')}
                className={cn(
                  'w-full bg-white rounded-2xl p-4 border-2 transition-all',
                  selectedPayment === 'cash_later' 
                    ? 'border-amber-500 shadow-lg' 
                    : 'border-amber-100 hover:border-amber-300'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                    selectedPayment === 'cash_later' ? 'bg-amber-500' : 'bg-amber-100'
                  )}>
                    <Banknote className={cn(
                      'w-6 h-6',
                      selectedPayment === 'cash_later' ? 'text-white' : 'text-amber-600'
                    )} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-foreground">Pay Later (Cash)</p>
                    <p className="text-xs text-muted-foreground">Pay with cash at counter/table</p>
                  </div>
                  {selectedPayment === 'cash_later' && (
                    <CheckCircle className="w-6 h-6 text-amber-500" />
                  )}
                </div>
              </button>

              {/* Card Option */}
              <button
                onClick={() => setSelectedPayment('card_later')}
                className={cn(
                  'w-full bg-white rounded-2xl p-4 border-2 transition-all',
                  selectedPayment === 'card_later' 
                    ? 'border-amber-500 shadow-lg' 
                    : 'border-amber-100 hover:border-amber-300'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                    selectedPayment === 'card_later' ? 'bg-amber-500' : 'bg-amber-100'
                  )}>
                    <CreditCard className={cn(
                      'w-6 h-6',
                      selectedPayment === 'card_later' ? 'text-white' : 'text-amber-600'
                    )} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-foreground">Pay Later (Card)</p>
                    <p className="text-xs text-muted-foreground">Pay with Credit/Debit Card at counter/table</p>
                  </div>
                  {selectedPayment === 'card_later' && (
                    <CheckCircle className="w-6 h-6 text-amber-500" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 bg-white rounded-2xl p-5 shadow-md shadow-amber-100 border border-amber-50">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Bill Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Total</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              {packingCharge > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4" />
                    Packing Charge (Takeaway)
                  </span>
                  <span className="font-medium">₹{packingCharge}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span className="font-medium">₹{tax}</span>
              </div>
              <div className="border-t border-amber-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Order Type</span>
                  <span className="font-medium text-foreground">{orderType === 'dine_in' ? 'Dine-In' : 'Takeaway'}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Payment</span>
                  <span className="font-medium text-foreground">{getPaymentLabel()}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-amber-600">₹{total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-32" />
        </ScrollArea>

        {/* Fixed Bottom - Place Order */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 p-4 shadow-2xl">
          <Button 
            onClick={handleProceedToPayment}
            disabled={isSubmitting}
            className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Placing Order...' : `Place Order • ₹${total}`}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Payment will be collected at counter/table
          </p>
        </div>
      </div>
    );
  }

  // Menu Browsing Screen
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category_id === selectedCategory)
    : items;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pb-40">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-amber-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Coffee Nivasa
              </h1>
              <p className="text-sm text-muted-foreground">
                {orderType === 'dine_in' ? `Table ${tableNumber}` : '📦 Takeaway'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto scrollbar-hide pb-3">
          {menuLoading ? (
            <div className="px-4">
              <CategoryTabsSkeleton />
            </div>
          ) : (
            <div className="flex gap-2 px-4 min-w-max">
              {categories.map((cat, index) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                    selectedCategory === cat.id 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                      : 'bg-white text-muted-foreground border border-amber-200 hover:border-amber-400'
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.icon} {cat.name}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4">
        {menuLoading ? (
          <MenuSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map((item, index) => {
              const quantity = getItemQuantity(item.id);
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white rounded-2xl p-4 shadow-md shadow-amber-100 border border-amber-50 flex items-center gap-4 hover:shadow-lg hover:border-amber-200 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn(
                        'w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0',
                        item.food_type === 'veg' ? 'border-green-600' : 
                        item.food_type === 'egg' ? 'border-amber-700' : 'border-red-600'
                      )}>
                        <div className={cn(
                          'w-2.5 h-2.5 rounded-full',
                          item.food_type === 'veg' ? 'bg-green-600' : 
                          item.food_type === 'egg' ? 'bg-amber-700' : 'bg-red-600'
                        )} />
                      </div>
                      <span className="font-semibold text-foreground truncate">{item.name}</span>
                    </div>
                    <p className="font-bold text-amber-600 text-lg">₹{item.price}</p>
                  </div>
                  
                  {quantity > 0 ? (
                    <div className="flex items-center gap-3">
                      <motion.button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shadow-sm"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-5 h-5 text-amber-700" />
                      </motion.button>
                      <motion.span 
                        key={quantity}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className="w-6 text-center font-bold text-lg"
                      >
                        {quantity}
                      </motion.span>
                      <motion.button 
                        onClick={() => addToCart(item)}
                        className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shadow-md"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button 
                      onClick={() => addToCart(item)}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-1 shadow-md"
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {!menuLoading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-10 h-10 text-amber-400" />
            </div>
            <p className="text-muted-foreground text-lg">No items in this category</p>
          </div>
        )}
      </div>

      {/* Fixed Cart Bar */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-amber-50 via-amber-50 to-transparent pt-8 z-40"
          >
            <motion.button
              onClick={() => setShowCart(true)}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between px-6 shadow-xl shadow-amber-300/50"
              whileTap={{ scale: 0.98 }}
              whileHover={{ boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.5)' }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.div>
                <span className="font-bold text-lg">{totalItems} items</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.span 
                  key={total}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="font-bold text-xl"
                >
                  ₹{total}
                </motion.span>
                <span className="text-white/80">→</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
