import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FoodType = 'veg' | 'non_veg' | 'egg';
type SpiceType = 'not_spicy' | 'mild' | 'spicy';

interface MenuCategory {
  id: string;
  name: string;
  icon: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_veg: boolean;
  food_type: FoodType;
  is_active: boolean;
  subcategory: string | null;
  category_id: string;
  spice_type: SpiceType;
  image_key: string;
}

interface MenuItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: MenuCategory[];
  editItem?: MenuItem | null;
  onSuccess: () => void;
}

export function MenuItemForm({ open, onOpenChange, categories, editItem, onSuccess }: MenuItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: editItem?.name || '',
    description: editItem?.description || '',
    price: editItem?.price?.toString() || '',
    category_id: editItem?.category_id || '',
    food_type: editItem?.food_type || 'veg' as FoodType,
    spice_type: editItem?.spice_type || 'not_spicy' as SpiceType,
    image_key: editItem?.image_key || 'sandwich',
  });

  // Reset form when dialog opens/closes or editItem changes
  const resetForm = () => {
    setFormData({
      name: editItem?.name || '',
      description: editItem?.description || '',
      price: editItem?.price?.toString() || '',
      category_id: editItem?.category_id || '',
      food_type: editItem?.food_type || 'veg' as FoodType,
      spice_type: editItem?.spice_type || 'not_spicy' as SpiceType,
      image_key: editItem?.image_key || 'sandwich',
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_key;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload image');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Item name is required');
      return;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }

    setLoading(true);

    try {
      // Upload image if selected
      let imageUrl = formData.image_key;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price),
        category_id: formData.category_id,
        food_type: formData.food_type,
        spice_type: formData.spice_type,
        is_veg: formData.food_type === 'veg',
        image_key: imageUrl,
      };

      if (editItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editItem.id);

        if (error) throw error;
        toast.success('Item updated successfully!');
      } else {
        // Create new item
        const { error } = await supabase
          .from('menu_items')
          .insert(itemData);

        if (error) throw error;
        toast.success('Item added successfully!');
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Masala Dosa"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the item..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g., 120"
            />
          </div>

          {/* Food Type */}
          <div className="space-y-2">
            <Label>Food Type *</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'veg', label: 'Veg', color: 'border-accent bg-accent/10 text-accent', icon: '🟢' },
                { value: 'non_veg', label: 'Non-Veg', color: 'border-destructive bg-destructive/10 text-destructive', icon: '🔴' },
                { value: 'egg', label: 'Egg', color: 'border-amber-700 bg-amber-100 text-amber-700', icon: '🟤' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, food_type: type.value as FoodType })}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1',
                    formData.food_type === type.value
                      ? type.color
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          <div className="space-y-2">
            <Label>Spice Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'not_spicy', label: 'Mild', color: 'border-accent bg-accent/10', icon: '🌿' },
                { value: 'mild', label: 'Medium', color: 'border-yellow-500 bg-yellow-50', icon: '🌶️' },
                { value: 'spicy', label: 'Spicy', color: 'border-destructive bg-destructive/10', icon: '🔥' },
              ].map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, spice_type: level.value as SpiceType })}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1',
                    formData.spice_type === level.value
                      ? level.color
                      : 'border-border hover:border-muted-foreground'
                  )}
                >
                  <span className="text-lg">{level.icon}</span>
                  <span className="text-xs font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Item Image</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors',
                'hover:border-primary hover:bg-secondary/50',
                imagePreview ? 'border-primary' : 'border-border'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-sm">Click to upload image</span>
                      <span className="text-xs">JPG, PNG, WebP</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editItem ? 'Update Item' : 'Add Item'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
