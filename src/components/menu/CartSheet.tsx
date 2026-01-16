import { ShoppingCart, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartItem } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface CartSheetProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  onAddItem: (item: { name: string; price: string; isVeg: boolean }) => void;
  onRemoveItem: (name: string) => void;
  onClearCart: () => void;
  whatsappOrderUrl: string;
}

export function CartSheet({
  items,
  totalItems,
  totalPrice,
  onAddItem,
  onRemoveItem,
  onClearCart,
  whatsappOrderUrl,
}: CartSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="gold"
          size="lg"
          className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 gap-2 shadow-gold animate-float"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">Cart</span>
          {totalItems > 0 && (
            <span className="ml-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <ShoppingCart className="w-5 h-5" />
            Your Order
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Add items from the menu to start your order
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-3">
              {items.map((item) => {
                const itemTotal = parseInt(item.price.replace(/[₹,]/g, '')) * item.quantity;
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl"
                  >
                    <div
                      className={cn(
                        'w-3 h-3 rounded border-2 flex items-center justify-center flex-shrink-0',
                        item.isVeg ? 'border-accent' : 'border-destructive'
                      )}
                    >
                      <div
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          item.isVeg ? 'bg-accent' : 'bg-destructive'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.price} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveItem(item.name)}
                        className="w-7 h-7 rounded-full bg-background hover:bg-destructive/10 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onAddItem(item)}
                        className="w-7 h-7 rounded-full bg-background hover:bg-accent/10 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-gold text-sm whitespace-nowrap">
                      ₹{itemTotal}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClearCart}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear cart
                </button>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-display text-2xl font-bold text-gold">₹{totalPrice}</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-14 bg-[#25D366] hover:bg-[#22c55e] text-white rounded-xl font-semibold text-lg shadow-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" fill="currentColor" />
                  Order via WhatsApp
                </a>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
