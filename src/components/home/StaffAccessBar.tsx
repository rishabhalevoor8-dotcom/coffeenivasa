import { useNavigate } from 'react-router-dom';
import { ChefHat, Settings, History, Bell } from 'lucide-react';

export function StaffAccessBar() {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/auth?role=admin');
  };

  const handleKitchenClick = () => {
    navigate('/kitchen');
  };

  const handleOrderHistoryClick = () => {
    navigate('/order-history');
  };

  const handleReadyOrdersClick = () => {
    navigate('/ready-orders');
  };

  return (
    <div className="bg-card border-b border-border mt-16 md:mt-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2.5 text-sm">
          <button 
            onClick={handleOrderHistoryClick}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary"
          >
            <History className="w-4 h-4" />
            <span>Order History</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-muted-foreground hidden sm:inline text-xs">Management & Staff:</span>
            <button 
              onClick={handleAdminClick}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
            <button 
              onClick={handleKitchenClick}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-amber-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-50"
            >
              <ChefHat className="w-4 h-4" />
              <span>Kitchen</span>
            </button>
            <button 
              onClick={handleReadyOrdersClick}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-green-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50"
            >
              <Bell className="w-4 h-4" />
              <span>Ready</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
