import {
  Home,
  Play,
  Camera,
  User,
  Palette,
  Users,
  Compass,
  MessageCircle,
  Sparkles,
  Settings,
  Bell,
  Search,
  TrendingUp,
  BookOpen,
  Briefcase,
  GraduationCap,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active, badge, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "nav-item w-full group",
      active && "active"
    )}
  >
    <span className={cn(
      "transition-colors duration-300",
      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
    )}>
      {icon}
    </span>
    <span className={cn(
      "font-medium transition-colors duration-300",
      active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
    )}>
      {label}
    </span>
    {badge && badge > 0 && (
      <span className="ml-auto bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </button>
);

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user } = useAuthContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const mainNavItems = [
    { id: "home", icon: <Home size={20} />, label: "Home Feed" },
    { id: "reels", icon: <Play size={20} />, label: "Reels" },
    { id: "stories", icon: <Camera size={20} />, label: "Stories" },
    { id: "explore", icon: <Compass size={20} />, label: "Explore" },
  ];

  const socialNavItems = [
    { id: "groups", icon: <Users size={20} />, label: "Communities" },
    { id: "messages", icon: <MessageCircle size={20} />, label: "Messages", badge: 5 },
    { id: "notifications", icon: <Bell size={20} />, label: "Notifications", badge: 12 },
  ];

  const professionalNavItems = [
    { id: "profile", icon: <User size={20} />, label: "My Profile" },
    { id: "studio", icon: <Palette size={20} />, label: "Creator Studio" },
    { id: "ai", icon: <Sparkles size={20} />, label: "AI Dashboard" },
  ];

  const eduNavItems = [
    { id: "exams", icon: <GraduationCap size={20} />, label: "Exam Arena" },
    { id: "careers", icon: <Briefcase size={20} />, label: "Career Hub" },
    { id: "learn", icon: <BookOpen size={20} />, label: "Learn" },
  ];

  // Get user initials for avatar
  const getUserInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-strong border-r border-border/50 z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cosmic-cyan to-cosmic-magenta flex items-center justify-center shadow-glow-md">
            <Sparkles className="text-primary-foreground" size={20} />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-gradient-cosmic">
              Connect Realm
            </h1>
            <p className="text-xs text-muted-foreground">by TechgramLabs</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search the realm..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-glow-sm transition-all"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-cosmic px-3 space-y-6 py-4">
        {/* Main */}
        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Discover
          </p>
          {mainNavItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </div>

        {/* Social */}
        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Connect
          </p>
          {socialNavItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              badge={item.badge}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </div>

        {/* Professional */}
        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Create & Grow
          </p>
          {professionalNavItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </div>

        {/* Education */}
        <div>
          <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Learn & Excel
          </p>
          {eduNavItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-border/50 space-y-2">
        {/* User Card */}
        <div className="p-3 rounded-xl glass hover:bg-muted/50 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-violet to-cosmic-magenta flex items-center justify-center text-sm font-bold text-foreground">
              {getUserInitial()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                View Profile
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};
