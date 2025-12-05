import { UserPlus, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchUsers } from "@/hooks/useUsers";
import { useSocial } from "@/hooks/useSocial";
import { useAuth } from "@/hooks/useAuth";

const avatarColors = [
  "from-cosmic-cyan to-cosmic-blue",
  "from-cosmic-magenta to-cosmic-pink",
  "from-cosmic-violet to-cosmic-magenta",
];

export const SuggestedConnections = () => {
  const { user } = useAuth();
  // For now, we'll show a simple search or could implement a recommendation algorithm
  const { users, isLoading } = useSearchUsers("a"); // Search for users with common letters
  const { follow } = useSocial();

  // Limit to 3 suggestions, exclude current user
  const suggestedUsers = users.filter(u => u.id !== user?.id).slice(0, 3);

  const handleFollow = async (userId: string) => {
    if (!user) return;
    try {
      await follow(userId);
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

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

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : suggestedUsers.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No suggestions available
        </div>
      ) : (
        <div className="space-y-3">
          {suggestedUsers.map((suggestedUser, index) => (
            <div
              key={suggestedUser.id}
              className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="story-ring">
              <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                    `bg-gradient-to-br ${avatarColors[index % avatarColors.length]}`
                  )}>
                    {suggestedUser.avatar_url || suggestedUser.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate">
                      {suggestedUser.display_name || suggestedUser.username}
                    </span>
                    {suggestedUser.verified && (
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta flex items-center justify-center shrink-0">
                        <Sparkles size={8} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">@{suggestedUser.username}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Sparkles size={10} className="text-cosmic-cyan" />
                    <span className="text-[10px] text-cosmic-cyan">Suggested for you</span>
                  </div>
                </div>
                <Button
                  variant="neon"
                  size="sm"
                  className="shrink-0"
                  onClick={() => handleFollow(suggestedUser.id)}
                >
                  <UserPlus size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
