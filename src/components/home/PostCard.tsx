import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PostCardProps {
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    badge?: string;
  };
  content: {
    text: string;
    media?: {
      type: "image" | "video";
      url: string;
    };
    tags?: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
  examCategory?: string;
}

const avatarColors = [
  "from-cosmic-cyan to-cosmic-blue",
  "from-cosmic-magenta to-cosmic-pink",
  "from-cosmic-violet to-cosmic-magenta",
  "from-cosmic-gold to-cosmic-pink",
  "from-cosmic-green to-cosmic-cyan",
];

export const PostCard = ({ author, content, engagement, timestamp, examCategory }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(engagement.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const colorIndex = author.name.charCodeAt(0) % avatarColors.length;

  return (
    <article className="glass rounded-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="story-ring">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
              `bg-gradient-to-br ${avatarColors[colorIndex]}`
            )}>
              {author.avatar}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{author.name}</span>
              {author.verified && (
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta flex items-center justify-center">
                  <Sparkles size={10} className="text-primary-foreground" />
                </div>
              )}
              {author.badge && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-accent/20 text-accent rounded-full">
                  {author.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>@{author.username}</span>
              <span>•</span>
              <span>{timestamp}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={18} />
        </Button>
      </div>

      {/* Exam Category Badge */}
      {examCategory && (
        <div className="px-4 pb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-gradient-to-r from-cosmic-cyan/20 to-cosmic-magenta/20 border border-cosmic-cyan/30 rounded-full text-cosmic-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-cosmic-cyan animate-pulse" />
            {examCategory}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground leading-relaxed">{content.text}</p>
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {content.tags.map(tag => (
              <span key={tag} className="text-primary text-sm hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {content.media && (
        <div className="relative aspect-video bg-muted">
          {content.media.type === "video" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cosmic-violet/20 to-cosmic-magenta/20">
              <button className="w-16 h-16 rounded-full glass flex items-center justify-center glow-cyan transition-transform hover:scale-110">
                <Play size={24} className="text-primary ml-1" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-card to-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Media Content</span>
            </div>
          )}
        </div>
      )}

      {/* Engagement */}
      <div className="p-4 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 px-3",
              liked && "text-destructive"
            )}
            onClick={handleLike}
          >
            <Heart
              size={18}
              className={cn(liked && "fill-current")}
            />
            <span className="text-sm">{likes.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 px-3">
            <MessageCircle size={18} />
            <span className="text-sm">{engagement.comments.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 px-3">
            <Share2 size={18} />
            <span className="text-sm">{engagement.shares.toLocaleString()}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(saved && "text-cosmic-gold")}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={18} className={cn(saved && "fill-current")} />
        </Button>
      </div>
    </article>
  );
};
