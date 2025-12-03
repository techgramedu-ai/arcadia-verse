import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  name: string;
  avatar: string;
  hasUnread: boolean;
  isOwn?: boolean;
}

const stories: Story[] = [
  { id: "own", name: "Your Story", avatar: "R", hasUnread: false, isOwn: true },
  { id: "1", name: "JEE Topper", avatar: "A", hasUnread: true },
  { id: "2", name: "NEET Prep", avatar: "P", hasUnread: true },
  { id: "3", name: "UPSC Guide", avatar: "U", hasUnread: true },
  { id: "4", name: "CAT Mentor", avatar: "C", hasUnread: false },
  { id: "5", name: "GATE Expert", avatar: "G", hasUnread: true },
  { id: "6", name: "IIT Life", avatar: "I", hasUnread: false },
  { id: "7", name: "AIIMS Day", avatar: "M", hasUnread: true },
  { id: "8", name: "GRE Tips", avatar: "T", hasUnread: false },
  { id: "9", name: "IELTS Pro", avatar: "E", hasUnread: true },
];

const avatarColors = [
  "from-cosmic-cyan to-cosmic-blue",
  "from-cosmic-magenta to-cosmic-pink",
  "from-cosmic-violet to-cosmic-magenta",
  "from-cosmic-gold to-cosmic-pink",
  "from-cosmic-green to-cosmic-cyan",
  "from-cosmic-blue to-cosmic-violet",
  "from-cosmic-pink to-cosmic-gold",
  "from-cosmic-cyan to-cosmic-green",
  "from-cosmic-violet to-cosmic-blue",
];

export const StoryBar = () => {
  return (
    <div className="w-full overflow-x-auto scrollbar-cosmic py-4 px-2">
      <div className="flex gap-4">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className={cn(
                "p-0.5 rounded-full transition-all duration-300 group-hover:scale-105",
                story.hasUnread
                  ? "bg-gradient-to-br from-cosmic-cyan via-cosmic-magenta to-cosmic-violet"
                  : story.isOwn
                  ? "bg-border"
                  : "bg-muted"
              )}
            >
              <div className="p-0.5 bg-background rounded-full">
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold relative overflow-hidden",
                    `bg-gradient-to-br ${avatarColors[index % avatarColors.length]}`
                  )}
                >
                  {story.isOwn ? (
                    <div className="absolute inset-0 bg-card/80 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta flex items-center justify-center">
                        <Plus size={14} className="text-primary-foreground" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-foreground">{story.avatar}</span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[70px] group-hover:text-foreground transition-colors">
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
