import { Bell, Search, Plus, Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export const TopBar = ({ title, subtitle }: TopBarProps) => {
  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Button variant="glass" size="icon" className="hidden md:flex">
            <Search size={18} />
          </Button>

          {/* AI Assistant */}
          <Button variant="cosmic" size="sm" className="gap-2">
            <Sparkles size={16} />
            <span className="hidden md:inline">AI Assist</span>
          </Button>

          {/* Create */}
          <Button variant="neon" size="icon">
            <Plus size={18} />
          </Button>

          {/* Notifications */}
          <Button variant="glass" size="icon" className="relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta rounded-full text-[10px] font-bold flex items-center justify-center text-primary-foreground">
              3
            </span>
          </Button>

          {/* Profile */}
          <div className="story-ring cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cosmic-violet to-cosmic-pink flex items-center justify-center text-sm font-bold text-foreground">
              R
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
