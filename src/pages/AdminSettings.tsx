import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Settings, 
  Key, 
  Users, 
  Save, 
  Trash2, 
  Plus,
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  Coffee,
  Store,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
}

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Café info state
  const [cafeName, setCafeName] = useState('Coffee Nivasa');
  const [cafeAddress, setCafeAddress] = useState('Bangalore, India');
  const [cafePhone, setCafePhone] = useState('');

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
        fetchData();
      }
    }
    setLoading(false);
  };

  const fetchData = async () => {
    const [settingsRes, adminsRes] = await Promise.all([
      supabase.from('system_settings').select('*'),
      supabase.from('admin_users').select('*').order('created_at', { ascending: true }),
    ]);

    if (settingsRes.data) {
      setSettings(settingsRes.data);
      const editValues: Record<string, string> = {};
      settingsRes.data.forEach(s => {
        editValues[s.key] = s.value;
      });
      // Load café info from settings
      const cafeNameSetting = settingsRes.data.find(s => s.key === 'cafe_name');
      const cafeAddressSetting = settingsRes.data.find(s => s.key === 'cafe_address');
      const cafePhoneSetting = settingsRes.data.find(s => s.key === 'cafe_phone');
      if (cafeNameSetting) setCafeName(cafeNameSetting.value);
      if (cafeAddressSetting) setCafeAddress(cafeAddressSetting.value);
      if (cafePhoneSetting) setCafePhone(cafePhoneSetting.value);
      setEditingSettings(editValues);
    }
    if (adminsRes.data) setAdminUsers(adminsRes.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    const existing = settings.find(s => s.key === key);
    
    if (existing) {
      const { error } = await supabase
        .from('system_settings')
        .update({ value })
        .eq('id', existing.id);
      
      if (error) {
        toast.error('Failed to update setting');
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('system_settings')
        .insert({ key, value });
      
      if (error) {
        toast.error('Failed to save setting');
        setSaving(false);
        return;
      }
    }
    
    toast.success('Setting saved!');
    fetchData();
    setSaving(false);
  };

  const saveCafeInfo = async () => {
    setSaving(true);
    try {
      await saveSetting('cafe_name', cafeName);
      await saveSetting('cafe_address', cafeAddress);
      await saveSetting('cafe_phone', cafePhone);
      toast.success('Café info updated!');
    } catch {
      toast.error('Failed to save café info');
    }
    setSaving(false);
  };

  const addAdminUser = async () => {
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    
    const { error } = await supabase
      .from('admin_users')
      .insert({ email: newAdminEmail.toLowerCase().trim() });
    
    if (error) {
      if (error.code === '23505') {
        toast.error('This email is already an admin');
      } else {
        toast.error('Failed to add admin user');
      }
      return;
    }
    
    toast.success('Admin user added!');
    setNewAdminEmail('');
    fetchData();
  };

  const removeAdminUser = async (id: string, email: string) => {
    if (email === user?.email) {
      toast.error("You can't remove yourself");
      return;
    }
    
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to remove admin user');
      return;
    }
    
    toast.success('Admin user removed');
    fetchData();
  };

  const toggleShowPin = (key: string) => {
    setShowPins(prev => ({ ...prev, [key]: !prev[key] }));
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
              Your email ({user?.email}) is not registered as an admin.
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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary" />
                Management & Settings
              </h1>
              <p className="text-muted-foreground">
                Configure your café settings, PINs, and admin users
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="cafe" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cafe" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Café Info</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Admins</span>
              </TabsTrigger>
            </TabsList>

            {/* Café Info Tab */}
            <TabsContent value="cafe">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-primary" />
                    Café Information
                  </CardTitle>
                  <CardDescription>
                    Update your café name, address, and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cafeName">Café Name</Label>
                    <Input
                      id="cafeName"
                      value={cafeName}
                      onChange={(e) => setCafeName(e.target.value)}
                      placeholder="Coffee Nivasa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cafeAddress">Address</Label>
                    <Input
                      id="cafeAddress"
                      value={cafeAddress}
                      onChange={(e) => setCafeAddress(e.target.value)}
                      placeholder="123 Main Street, Bangalore"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cafePhone">Phone Number</Label>
                    <Input
                      id="cafePhone"
                      value={cafePhone}
                      onChange={(e) => setCafePhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <Button onClick={saveCafeInfo} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    PIN Codes & Security
                  </CardTitle>
                  <CardDescription>
                    Manage access PINs for customer ordering and kitchen display
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer PIN */}
                  <div className="space-y-2">
                    <Label htmlFor="customerPin">Customer Order PIN</Label>
                    <p className="text-sm text-muted-foreground">
                      Customers enter this PIN to access the ordering system
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="customerPin"
                          type={showPins['customer_pin'] ? 'text' : 'password'}
                          value={editingSettings['customer_pin'] || ''}
                          onChange={(e) => setEditingSettings(prev => ({ ...prev, customer_pin: e.target.value }))}
                          placeholder="Enter 4-digit PIN"
                          maxLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => toggleShowPin('customer_pin')}
                        >
                          {showPins['customer_pin'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button 
                        onClick={() => saveSetting('customer_pin', editingSettings['customer_pin'] || '')}
                        disabled={saving}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Kitchen PIN */}
                  <div className="space-y-2">
                    <Label htmlFor="kitchenPin">Kitchen Display PIN</Label>
                    <p className="text-sm text-muted-foreground">
                      Staff enter this PIN to access the kitchen display
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="kitchenPin"
                          type={showPins['kitchen_pin'] ? 'text' : 'password'}
                          value={editingSettings['kitchen_pin'] || ''}
                          onChange={(e) => setEditingSettings(prev => ({ ...prev, kitchen_pin: e.target.value }))}
                          placeholder="Enter 4-digit PIN"
                          maxLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => toggleShowPin('kitchen_pin')}
                        >
                          {showPins['kitchen_pin'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button 
                        onClick={() => saveSetting('kitchen_pin', editingSettings['kitchen_pin'] || '')}
                        disabled={saving}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Current PIN Display */}
                  <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-3">Current PINs</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customer PIN:</span>
                        <span className="ml-2 font-mono font-bold">
                          {showPins['customer_pin_display'] 
                            ? settings.find(s => s.key === 'customer_pin')?.value || 'Not set'
                            : '••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-6 w-6 p-0"
                          onClick={() => toggleShowPin('customer_pin_display')}
                        >
                          {showPins['customer_pin_display'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Kitchen PIN:</span>
                        <span className="ml-2 font-mono font-bold">
                          {showPins['kitchen_pin_display'] 
                            ? settings.find(s => s.key === 'kitchen_pin')?.value || 'Not set'
                            : '••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-6 w-6 p-0"
                          onClick={() => toggleShowPin('kitchen_pin_display')}
                        >
                          {showPins['kitchen_pin_display'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admins Tab */}
            <TabsContent value="admins">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Admin Users
                  </CardTitle>
                  <CardDescription>
                    Manage who has admin access to the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add New Admin */}
                  <div className="space-y-2">
                    <Label>Add New Admin</Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin@example.com"
                        onKeyDown={(e) => e.key === 'Enter' && addAdminUser()}
                      />
                      <Button onClick={addAdminUser}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Admin List */}
                  <div className="space-y-2">
                    <Label>Current Admins</Label>
                    <div className="border border-border rounded-lg divide-y divide-border">
                      {adminUsers.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{admin.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Added {new Date(admin.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {admin.email === user?.email && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeAdminUser(admin.id, admin.email)}
                            disabled={admin.email === user?.email}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {adminUsers.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                          No admin users found
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
