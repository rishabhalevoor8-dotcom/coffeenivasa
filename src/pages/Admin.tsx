import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LogOut, Save, Pencil, Search, Coffee, AlertCircle, Receipt, ChefHat, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';
import { SpiceIndicator, type SpiceType } from '@/components/menu/SpiceIndicator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  is_veg: boolean;
  is_active: boolean;
  subcategory: string | null;
  category_id: string;
  spice_type: SpiceType;
}

interface MenuCategory {
  id: string;
  name: string;
  icon: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editSpiceType, setEditSpiceType] = useState<SpiceType>('not_spicy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
      fetchMenuData();
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
    }
    setLoading(false);
  };

  const fetchMenuData = async () => {
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from('menu_categories').select('*').order('display_order'),
      supabase.rpc('get_all_menu_items_for_admin'),
    ]);

    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (itemsRes.data) {
      setItems(itemsRes.data.map((item: MenuItem & { is_active: boolean }) => ({
        ...item,
        spice_type: (item.spice_type as SpiceType) || 'not_spicy',
        is_active: item.is_active ?? true
      })));
    } else {
      // Fallback if RPC doesn't exist - use direct query (admin only sees all items)
      const { data: fallbackItems } = await supabase
        .from('menu_items')
        .select('*')
        .order('display_order');
      
      if (fallbackItems) {
        setItems(fallbackItems.map((item) => ({
          ...item,
          spice_type: (item.spice_type as SpiceType) || 'not_spicy',
          is_active: item.is_active ?? true
        })));
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditPrice(item.price.toString());
    setEditSpiceType(item.spice_type || 'not_spicy');
  };

  const saveItem = async (itemId: string) => {
    const newPrice = parseInt(editPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const { error } = await supabase
      .from('menu_items')
      .update({ price: newPrice, spice_type: editSpiceType })
      .eq('id', itemId);

    if (error) {
      toast.error('Failed to update item');
      return;
    }

    setItems(items.map(item => 
      item.id === itemId ? { ...item, price: newPrice, spice_type: editSpiceType } : item
    ));
    setEditingId(null);
    toast.success('Item updated successfully!');
  };

  const toggleItemAvailability = async (item: MenuItem) => {
    const newStatus = !item.is_active;
    
    const { error } = await supabase
      .from('menu_items')
      .update({ is_active: newStatus })
      .eq('id', item.id);

    if (error) {
      toast.error('Failed to update availability');
      return;
    }

    setItems(items.map(i => 
      i.id === item.id ? { ...i, is_active: newStatus } : i
    ));
    toast.success(newStatus ? 'Item is now available' : 'Item is now unavailable');
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
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
              Your email ({user?.email}) is not registered as an admin. 
              Please contact the site owner to get admin access.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Menu Admin
              </h1>
              <p className="text-muted-foreground">
                Logged in as {user?.email}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link to="/admin/orders">
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">Order Management</h3>
                <p className="text-sm text-muted-foreground">View orders, update status & generate invoices</p>
              </div>
            </Link>
            <Link to="/kitchen">
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">Kitchen Display</h3>
                <p className="text-sm text-muted-foreground">Live kitchen order tracking</p>
              </div>
            </Link>
            <Link to="/order">
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Coffee className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">Customer Order Page</h3>
                <p className="text-sm text-muted-foreground">QR-based ordering interface</p>
              </div>
            </Link>
            <Link to="/admin/settings">
              <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Settings className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">Management & Settings</h3>
                <p className="text-sm text-muted-foreground">Café info, PINs & admin users</p>
              </div>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-2xl p-4 mb-6 border border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={!selectedCategory ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.icon} {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-2 md:gap-4 p-4 bg-secondary/50 font-semibold text-sm text-muted-foreground border-b border-border">
              <div className="col-span-3 md:col-span-3">Item Name</div>
              <div className="col-span-2 hidden md:block">Type</div>
              <div className="col-span-2 md:col-span-2">Spice</div>
              <div className="col-span-2 md:col-span-2">Price</div>
              <div className="col-span-3 md:col-span-2">Status</div>
              <div className="col-span-2 md:col-span-1">Edit</div>
            </div>
            
            <div className="divide-y divide-border">
              {filteredItems.map((item) => (
                <div key={item.id} className={cn(
                  "grid grid-cols-12 gap-2 md:gap-4 p-4 items-center hover:bg-secondary/30 transition-colors",
                  !item.is_active && "opacity-60"
                )}>
                  <div className="col-span-3 md:col-span-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                          item.is_veg ? 'border-accent' : 'border-destructive'
                        )}
                      >
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            item.is_veg ? 'bg-accent' : 'bg-destructive'
                          )}
                        />
                      </div>
                      <span className="font-medium text-foreground truncate text-sm">
                        {item.name}
                      </span>
                    </div>
                    {item.subcategory && (
                      <span className="text-xs text-muted-foreground ml-6">
                        {item.subcategory}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <span className={cn(
                      'text-xs font-medium px-2 py-1 rounded-full',
                      item.is_veg 
                        ? 'bg-accent/10 text-accent' 
                        : 'bg-destructive/10 text-destructive'
                    )}>
                      {item.is_veg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    {editingId === item.id ? (
                      <Select
                        value={editSpiceType}
                        onValueChange={(value: SpiceType) => setEditSpiceType(value)}
                      >
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_spicy">Not Spicy</SelectItem>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="spicy">Spicy</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <SpiceIndicator spiceType={item.spice_type || 'not_spicy'} showLabel={false} />
                    )}
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-gold font-bold">₹</span>
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="h-8 w-16 text-center"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveItem(item.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-gold">₹{item.price}</span>
                    )}
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <button
                      onClick={() => toggleItemAvailability(item)}
                      className="flex items-center gap-1.5"
                    >
                      {item.is_active ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-accent" />
                          <span className="text-xs font-medium text-accent hidden sm:inline">Available</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Unavailable</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    {editingId === item.id ? (
                      <Button
                        size="sm"
                        onClick={() => saveItem(item.id)}
                        className="h-8"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(item)}
                        className="h-8"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No menu items found</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
