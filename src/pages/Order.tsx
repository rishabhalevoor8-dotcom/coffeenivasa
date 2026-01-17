import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, Coffee, ShoppingCart, Plus, Minus, Trash2, UtensilsCrossed, ShoppingBag, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  is_veg: boolean;
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

type OrderType = 'dine_in' | 'takeaway';

export default function Order() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const verifyPin = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'customer_pin')
      .single();

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
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from('menu_categories').select('*').order('display_order'),
      supabase.from('menu_items').select('*').eq('is_active', true).order('display_order'),
    ]);

    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
      if (categoriesRes.data.length > 0) {
        setSelectedCategory(categoriesRes.data[0].id);
      }
    }
    if (itemsRes.data) setItems(itemsRes.data);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to cart`);
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
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + tax;

  const getItemQuantity = (itemId: string) => cart.find(i => i.id === itemId)?.quantity || 0;

  const submitOrder = async (paymentType: 'cash' | 'online') => {
    if (orderType === 'dine_in' && !tableNumber) {
      toast.error('Please select a table number');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_type: orderType,
          table_number: orderType === 'dine_in' ? tableNumber : null,
          customer_name: customerName || null,
          customer_phone: customerPhone || null,
          subtotal,
          tax,
          total,
          payment_status: paymentType === 'cash' ? 'cash_pending' : 'pending',
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
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
      setOrderComplete(true);
      setCart([]);
      toast.success('Order placed successfully!');
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
    setOrderType(null);
    setTableNumber(null);
    setCustomerName('');
    setCustomerPhone('');
  };

  // Order Complete Screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your order #{orderNumber} has been sent to the kitchen
          </p>
          <div className="bg-card rounded-2xl p-6 border border-border mb-6">
            <p className="text-sm text-muted-foreground mb-2">Order Number</p>
            <p className="font-display text-5xl font-bold text-primary">#{orderNumber}</p>
          </div>
          <Button onClick={startNewOrder} size="lg" className="w-full">
            Place Another Order
          </Button>
        </div>
      </div>
    );
  }

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Coffee Nivasa
            </h1>
            <p className="text-muted-foreground">Enter PIN to start ordering</p>
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
              {loading ? 'Verifying...' : 'Start Ordering'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Order Type Selection
  if (!orderType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Choose Order Type
            </h1>
            <p className="text-muted-foreground">How would you like to order?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOrderType('dine_in')}
              className="bg-card rounded-2xl p-8 border-2 border-border hover:border-primary transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <UtensilsCrossed className="w-8 h-8 text-primary" />
              </div>
              <p className="font-display font-bold text-lg text-foreground">Dine In</p>
              <p className="text-sm text-muted-foreground">Eat at the café</p>
            </button>
            
            <button
              onClick={() => setOrderType('takeaway')}
              className="bg-card rounded-2xl p-8 border-2 border-border hover:border-primary transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <p className="font-display font-bold text-lg text-foreground">Takeaway</p>
              <p className="text-sm text-muted-foreground">Pack to go</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Table Selection (for dine-in)
  if (orderType === 'dine_in' && !tableNumber) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Select Your Table
            </h1>
            <p className="text-muted-foreground">Choose your table number</p>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => setTableNumber(num)}
                className="aspect-square bg-card rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center"
              >
                <span className="font-display text-2xl font-bold text-foreground">{num}</span>
              </button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setOrderType(null)} 
            className="w-full mt-6"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Menu Browsing Screen
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category_id === selectedCategory)
    : items;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Coffee Nivasa
              </h1>
              <p className="text-sm text-muted-foreground">
                {orderType === 'dine_in' ? `Table ${tableNumber}` : 'Takeaway'}
              </p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                  <SheetTitle>Your Order</SheetTitle>
                </SheetHeader>
                
                {cart.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Your cart is empty</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 -mx-6 px-6">
                      <div className="space-y-3 py-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  'w-3 h-3 rounded border flex-shrink-0',
                                  item.is_veg ? 'border-accent bg-accent/20' : 'border-destructive bg-destructive/20'
                                )} />
                                <span className="font-medium text-sm">{item.name}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">₹{item.price} × {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-6 text-center font-medium">{item.quantity}</span>
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="border-t border-border pt-4 space-y-4">
                      <Input
                        placeholder="Your Name (optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                      <Input
                        placeholder="Phone Number (optional)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax (5%)</span>
                          <span>₹{tax}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span className="text-primary">₹{total}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <Button 
                          onClick={() => submitOrder('cash')}
                          disabled={isSubmitting || cart.length === 0}
                          className="w-full"
                          size="lg"
                        >
                          {isSubmitting ? 'Placing Order...' : 'Pay with Cash'}
                        </Button>
                        {/* Online payment will be added later */}
                      </div>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 pb-3 min-w-max">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="flex-shrink-0"
              >
                {cat.icon} {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div 
                key={item.id} 
                className="bg-card rounded-xl p-4 border border-border flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                      'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                      item.is_veg ? 'border-accent' : 'border-destructive'
                    )}>
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        item.is_veg ? 'bg-accent' : 'bg-destructive'
                      )} />
                    </div>
                    <span className="font-medium text-foreground truncate">{item.name}</span>
                  </div>
                  <p className="font-bold text-primary">₹{item.price}</p>
                </div>
                
                {quantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-9 w-9"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-6 text-center font-bold">{quantity}</span>
                    <Button 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={() => addToCart(item)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(item)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Coffee className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No items in this category</p>
          </div>
        )}
      </div>

      {/* Fixed Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full h-14 text-lg" size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Cart • {totalItems} items • ₹{total}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle>Your Order</SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-3 py-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-3 h-3 rounded border flex-shrink-0',
                            item.is_veg ? 'border-accent bg-accent/20' : 'border-destructive bg-destructive/20'
                          )} />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">₹{item.price} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t border-border pt-4 space-y-4">
                <Input
                  placeholder="Your Name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Phone Number (optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={() => submitOrder('cash')}
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? 'Placing Order...' : 'Pay with Cash'}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}
