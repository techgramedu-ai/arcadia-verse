import { UserPlus, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  title: string;
  mutualConnections: number;
  aiReason: string;
}

const suggestedUsers: SuggestedUser[] = [
  {
    id: "1",
    name: "Priya Sharma",
    username: "priyajee2025",
    avatar: "P",
    title: "JEE AIR 247 | IIT Delhi",
    mutualConnections: 12,
    aiReason: "Studies similar topics as you",
  },
  {
    id: "2",
    name: "Rahul Verma",
    username: "rahulneet",
    avatar: "R",
    title: "NEET Topper | AIIMS Delhi",
    mutualConnections: 8,
    aiReason: "From your city",
  },
  {
    id: "3",
    name: "Ananya Singh",
    username: "ananyaupsc",
    avatar: "A",
    title: "UPSC CSE 2024 | IAS",
    mutualConnections: 15,
    aiReason: "Popular in your network",
  },
];

const avatarColors = [
  "from-cosmic-cyan to-cosmic-blue",
  "from-cosmic-magenta to-cosmic-pink",
  "from-cosmic-violet to-cosmic-magenta",
];

export const SuggestedConnections = () => {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cosmic-cyan to-cosmic-magenta flex items-center justify-center">
            <Sparkles size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">AI Suggests</h3>
            <p className="text-[10px] text-muted-foreground">People you may know</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary gap-1">
          See All
          <ArrowRight size={14} />
        </Button>
      </div>

      <div className="space-y-3">
        {suggestedUsers.map((user, index) => (
          <div
            key={user.id}
            className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="story-ring">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                  `bg-gradient-to-br ${avatarColors[index]}`
                )}>
                  {user.avatar}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground truncate">{user.name}</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta flex items-center justify-center shrink-0">
                    <Sparkles size={8} className="text-primary-foreground" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">{user.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Sparkles size={10} className="text-cosmic-cyan" />
                  <span className="text-[10px] text-cosmic-cyan">{user.aiReason}</span>
                </div>
              </div>
              <Button variant="neon" size="sm" className="shrink-0">
                <UserPlus size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
