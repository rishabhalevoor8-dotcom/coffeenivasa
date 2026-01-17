import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Lock, Coffee, ChefHat, Settings, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

type RoleType = 'admin' | 'kitchen';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as RoleType) || 'admin';
  
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RoleType>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // Check role and redirect accordingly
          setTimeout(() => {
            checkRoleAndRedirect(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkRoleAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkRoleAndRedirect = async (userId: string) => {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (roles && roles.length > 0) {
      const hasAdmin = roles.some(r => r.role === 'admin');
      if (hasAdmin) {
        navigate('/admin');
      } else {
        navigate('/kitchen');
      }
    } else {
      // No role assigned yet - might be admin_users legacy
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user?.email) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', session.session.user.email)
          .maybeSingle();
        
        if (adminUser) {
          navigate('/admin');
          return;
        }
      }
      // Default to kitchen if no role found
      navigate('/kitchen');
    }
  };

  const verifySignupCode = async (code: string, role: RoleType): Promise<boolean> => {
    const settingKey = role === 'admin' ? 'admin_signup_code' : 'kitchen_signup_code';
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', settingKey)
      .maybeSingle();

    if (error || !data) {
      toast.error('Could not verify signup code');
      return false;
    }

    return data.value === code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Logged in successfully!');
      } else {
        // Verify signup code first
        const isValidCode = await verifySignupCode(signupCode, selectedRole);
        if (!isValidCode) {
          toast.error('Invalid signup code for ' + (selectedRole === 'admin' ? 'Admin' : 'Kitchen'));
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });
        if (error) throw error;

        // Add role to user_roles table if signup successful
        if (data.user) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: selectedRole,
            });

          if (roleError) {
            console.error('Failed to assign role:', roleError);
          }

          // If admin, also add to admin_users for backward compatibility
          if (selectedRole === 'admin') {
            await supabase
              .from('admin_users')
              .insert({ email });
          }
        }

        toast.success('Account created! You can now log in.');
        setIsLogin(true);
        setSignupCode('');
      }
    } catch (error: any) {
      if (error.message?.includes('User already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    admin: {
      icon: Settings,
      title: 'Admin',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary',
    },
    kitchen: {
      icon: ChefHat,
      title: 'Kitchen Staff',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-500',
    },
  };

  const currentRole = roleConfig[selectedRole];
  const RoleIcon = currentRole.icon;

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-card p-8 border border-border">
            <div className="text-center mb-8">
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                currentRole.bgColor
              )}>
                <RoleIcon className={cn('w-8 h-8', currentRole.color)} />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {isLogin ? 'Staff Login' : `${currentRole.title} Sign Up`}
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {isLogin 
                  ? 'Sign in to access management portal' 
                  : `Create a ${currentRole.title.toLowerCase()} account`}
              </p>
            </div>

            {/* Role Selection for Signup */}
            {!isLogin && (
              <div className="flex gap-3 mb-6">
                {(['admin', 'kitchen'] as RoleType[]).map((role) => {
                  const config = roleConfig[role];
                  const Icon = config.icon;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                        selectedRole === role 
                          ? cn(config.borderColor, config.bgColor)
                          : 'border-border hover:border-muted-foreground/50'
                      )}
                    >
                      <Icon className={cn('w-6 h-6', selectedRole === role ? config.color : 'text-muted-foreground')} />
                      <span className={cn(
                        'text-sm font-medium',
                        selectedRole === role ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {config.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Signup Code for new accounts */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="signupCode">
                    {selectedRole === 'admin' ? 'Admin' : 'Kitchen'} Signup Code
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signupCode"
                      type="text"
                      placeholder="Enter signup code"
                      value={signupCode}
                      onChange={(e) => setSignupCode(e.target.value.toUpperCase())}
                      className="pl-10 uppercase"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contact the administrator for signup codes
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setSignupCode('');
                }}
                className="text-sm text-gold hover:underline"
              >
                {isLogin
                  ? "Need an account? Sign up here"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              This portal is for authorized staff members only.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
