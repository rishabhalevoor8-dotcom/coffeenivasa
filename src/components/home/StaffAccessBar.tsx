import { Link } from 'react-router-dom';
import { ChefHat, Settings, History } from 'lucide-react';

export function StaffAccessBar() {
  return (
    <div className="bg-secondary/50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <Link 
              to="/order-history" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Order History</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground hidden sm:inline">Management & Staff:</span>
            <Link 
              to="/auth?role=admin" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <Link 
              to="/kitchen" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
