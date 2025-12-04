import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLikePost } from "@/hooks/usePosts";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string | null;
    verified?: boolean;
    badge?: string | null;
  };
  content: {
    text: string;
    media?: {
      type: "image" | "video";
      url: string;
    } | null;
    tags?: string[] | null;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
  examCategory?: string | null;
  userHasLiked?: boolean;
}

const avatarColors = [
  "from-cosmic-cyan to-cosmic-blue",
  "from-cosmic-magenta to-cosmic-pink",
  "from-cosmic-violet to-cosmic-magenta",
  "from-cosmic-gold to-cosmic-pink",
  "from-cosmic-green to-cosmic-cyan",
];

export const PostCard = ({ id, author, content, engagement, timestamp, examCategory, userHasLiked = false }: PostCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const likeMutation = useLikePost();
  const { data: comments } = useComments(showComments ? id : '');
  const createCommentMutation = useCreateComment();

  const handleLike = () => {
    if (!user) {
      toast.error('Please log in to like posts');
      navigate('/auth');
      return;
    }
    likeMutation.mutate({ postId: id, isLiked: userHasLiked });
  };

  const handleComment = () => {
    if (!user) {
      toast.error('Please log in to comment');
      navigate('/auth');
      return;
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createCommentMutation.mutate(
      { postId: id, content: newComment },
      { onSuccess: () => setNewComment('') }
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/post/' + id);
    toast.success('Link copied to clipboard!');
  };

  const colorIndex = author.name.charCodeAt(0) % avatarColors.length;
  const avatarInitial = author.avatar || author.name.charAt(0).toUpperCase();
  
  const formattedTime = timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : '';

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
              {avatarInitial}
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
              <span>{formattedTime}</span>
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
            <img 
              src={content.media.url} 
              alt="Post media" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
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
              userHasLiked && "text-destructive"
            )}
            onClick={handleLike}
            disabled={likeMutation.isPending}
          >
            <Heart
              size={18}
              className={cn(userHasLiked && "fill-current")}
            />
            <span className="text-sm">{engagement.likes.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 px-3" onClick={handleComment}>
            <MessageCircle size={18} className={cn(showComments && "text-primary")} />
            <span className="text-sm">{engagement.comments.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 px-3" onClick={handleShare}>
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

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-border/50 space-y-3">
          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex gap-2 pt-3">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!newComment.trim() || createCommentMutation.isPending}
              className="bg-primary/20 hover:bg-primary/30"
            >
              <Send size={16} />
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex gap-2 p-2 rounded-lg bg-muted/30">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                  `bg-gradient-to-br ${avatarColors[(comment.profiles?.username?.charCodeAt(0) || 0) % avatarColors.length]}`
                )}>
                  {comment.profiles?.display_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-foreground">
                    {comment.profiles?.display_name || 'User'}
                  </span>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
            {comments?.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-2">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
