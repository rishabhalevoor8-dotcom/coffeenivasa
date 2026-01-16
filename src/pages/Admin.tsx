import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LogOut, Save, Pencil, Search, Coffee, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  is_veg: boolean;
  subcategory: string | null;
  category_id: string;
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
      supabase.from('menu_items').select('*').order('display_order'),
    ]);

    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (itemsRes.data) setItems(itemsRes.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditPrice(item.price.toString());
  };

  const savePrice = async (itemId: string) => {
    const newPrice = parseInt(editPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const { error } = await supabase
      .from('menu_items')
      .update({ price: newPrice })
      .eq('id', itemId);

    if (error) {
      toast.error('Failed to update price');
      return;
    }

    setItems(items.map(item => 
      item.id === itemId ? { ...item, price: newPrice } : item
    ));
    setEditingId(null);
    toast.success('Price updated successfully!');
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
            <div className="grid grid-cols-12 gap-4 p-4 bg-secondary/50 font-semibold text-sm text-muted-foreground border-b border-border">
              <div className="col-span-5 md:col-span-6">Item Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3 md:col-span-2">Price</div>
              <div className="col-span-2">Action</div>
            </div>
            
            <div className="divide-y divide-border">
              {filteredItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/30 transition-colors">
                  <div className="col-span-5 md:col-span-6">
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
                      <span className="font-medium text-foreground truncate">
                        {item.name}
                      </span>
                    </div>
                    {item.subcategory && (
                      <span className="text-xs text-muted-foreground ml-6">
                        {item.subcategory}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className={cn(
                      'text-xs font-medium px-2 py-1 rounded-full',
                      item.is_veg 
                        ? 'bg-accent/10 text-accent' 
                        : 'bg-destructive/10 text-destructive'
                    )}>
                      {item.is_veg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-gold font-bold">₹</span>
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="h-8 w-20 text-center"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') savePrice(item.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-gold">₹{item.price}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {editingId === item.id ? (
                      <Button
                        size="sm"
                        onClick={() => savePrice(item.id)}
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
