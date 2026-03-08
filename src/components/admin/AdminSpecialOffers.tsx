import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount_text: string;
  badge: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

export function AdminSpecialOffers() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount_text: '',
    badge: '',
    image_url: '',
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error fetching offers:', error);
    } else {
      setOffers(data || []);
    }
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingOffer(null);
    setForm({ title: '', description: '', discount_text: '', badge: '', image_url: '' });
    setDialogOpen(true);
  };

  const openEditDialog = (offer: SpecialOffer) => {
    setEditingOffer(offer);
    setForm({
      title: offer.title,
      description: offer.description,
      discount_text: offer.discount_text,
      badge: offer.badge,
      image_url: offer.image_url,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.discount_text.trim()) {
      toast.error('Title and discount text are required');
      return;
    }

    if (editingOffer) {
      const { error } = await supabase
        .from('special_offers')
        .update({
          title: form.title,
          description: form.description,
          discount_text: form.discount_text,
          badge: form.badge,
          image_url: form.image_url,
        })
        .eq('id', editingOffer.id);

      if (error) {
        toast.error('Failed to update offer');
        return;
      }
      toast.success('Offer updated!');
    } else {
      const maxOrder = offers.length > 0 ? Math.max(...offers.map(o => o.display_order)) : 0;
      const { error } = await supabase
        .from('special_offers')
        .insert({
          title: form.title,
          description: form.description,
          discount_text: form.discount_text,
          badge: form.badge,
          image_url: form.image_url,
          display_order: maxOrder + 1,
        });

      if (error) {
        toast.error('Failed to add offer');
        return;
      }
      toast.success('Offer added!');
    }

    setDialogOpen(false);
    fetchOffers();
  };

  const toggleActive = async (offer: SpecialOffer) => {
    const { error } = await supabase
      .from('special_offers')
      .update({ is_active: !offer.is_active })
      .eq('id', offer.id);

    if (error) {
      toast.error('Failed to update');
      return;
    }
    toast.success(offer.is_active ? 'Offer hidden' : 'Offer visible');
    fetchOffers();
  };

  const deleteOffer = async (id: string) => {
    const { error } = await supabase
      .from('special_offers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete');
      return;
    }
    toast.success('Offer deleted');
    fetchOffers();
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-secondary/50 rounded-2xl" />;
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Today's Special Offers</h2>
            <p className="text-sm text-muted-foreground">{offers.length} offer{offers.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Button onClick={openAddDialog} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Offer
        </Button>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No special offers yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border border-border transition-colors',
                !offer.is_active && 'opacity-50'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground truncate">{offer.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-bold">
                    {offer.discount_text}
                  </span>
                  {offer.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold font-medium">
                      {offer.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{offer.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(offer)}
                  className="h-8 w-8"
                >
                  {offer.is_active ? (
                    <ToggleRight className="w-5 h-5 text-accent" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(offer)}
                  className="h-8 w-8"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteOffer(offer.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Title *</label>
              <Input
                placeholder="e.g. Combo Meal Deal"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
              <Input
                placeholder="e.g. Any Sandwich + Cold Coffee"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Discount Text *</label>
              <Input
                placeholder="e.g. 20% OFF or ₹149 Only"
                value={form.discount_text}
                onChange={(e) => setForm({ ...form, discount_text: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Badge Label</label>
              <Input
                placeholder="e.g. Most Popular, Limited Time"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Image URL (optional)</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {editingOffer ? 'Update' : 'Add'} Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
