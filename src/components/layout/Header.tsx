import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{user.name}</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}