import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: { id: string; name: string } | null;
  onSuccess: () => void;
}

export function DeleteItemDialog({ open, onOpenChange, item, onSuccess }: DeleteItemDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast.success(`"${item.name}" deleted successfully`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>"{item?.name}"</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
