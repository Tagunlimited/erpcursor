import { ErpSidebar } from "@/components/ErpSidebar";
import { Button } from "@/components/ui/button";
import { Search, User, LogOut, Sun, Moon, Bell, Settings } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { FloatingNotification } from "@/components/notifications/FloatingNotification";
import { AvatarUploader } from "@/components/ui/avatar-uploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ErpLayoutProps {
  children: React.ReactNode;
}

export function ErpLayout({ children }: ErpLayoutProps) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [floatingNotification, setFloatingNotification] = useState<any>(null);
  const [availableRoles] = useState(['admin', 'sales', 'production', 'quality', 'dispatch', 'manager']);
  
  // Handle pre-configured admin user display
  const displayName = profile?.full_name || 
    (user?.email === 'ecom@tagunlimitedclothing.com' ? 'System Administrator' : user?.email);
  const displayRole = profile?.role || 
    (user?.email === 'ecom@tagunlimitedclothing.com' ? 'admin' : 'user');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAvatarUpload = async (url: string) => {
    if (!user) return;
    try {
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          avatar_url: url
        } as any);
      
      await refreshProfile();
      toast.success('Avatar uploaded successfully');
    } catch (error: any) {
      toast.error('Failed to upload avatar');
    }
  };

  const handleAvatarDelete = async () => {
    if (!user) return;
    try {
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          avatar_url: null
        } as any);
      
      await refreshProfile();
      toast.success('Avatar deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete avatar');
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!user || !profile) return;
    toast.success(`Role updated to ${newRole}`);
  };
  return (
    <div className="flex h-screen bg-background">
      <ErpSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-primary border-b border-border shadow-sm relative">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Company Logo */}
              <div className="flex items-center space-x-3">
                <img 
                  src="https://i.postimg.cc/D0hJxKtP/tag-black.png" 
                  alt="Company Logo" 
                  className="h-8 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://i.postimg.cc/D0hJxKtP/tag-black.png';
                  }}
                />
                <div className="text-primary-foreground">
                  <h2 className="font-bold text-lg">Scissors ERP</h2>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/70 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders, customers, products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 bg-primary-foreground/20 border border-primary-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:border-transparent placeholder-primary-foreground/70 text-primary-foreground"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full p-1">
                    {user && (
                      <AvatarUploader
                        currentUrl={(profile as any)?.avatar_url || ""}
                        onUpload={handleAvatarUpload}
                        onDelete={handleAvatarDelete}
                        userId={user.id}
                        userName={displayName}
                      />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-muted-foreground">Role:</span>
                        <Select value={displayRole} onValueChange={handleRoleChange}>
                          <SelectTrigger className="h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRoles.map((role) => (
                              <SelectItem key={role} value={role} className="text-xs">
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Floating Notification */}
      <FloatingNotification
        notification={floatingNotification}
        onDismiss={() => setFloatingNotification(null)}
        position="bottom-right"
        sound={true}
      />
    </div>
  );
}