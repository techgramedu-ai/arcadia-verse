import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Play, Pause, Volume2, VolumeX, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Reel {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  description: string;
  tags: string[];
  audio: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  examCategory: string;
}

const reels: Reel[] = [
  {
    id: "1",
    author: { name: "Aman Physics", username: "amanphysics", avatar: "A", verified: true },
    description: "JEE Physics trick: Understanding Projectile Motion in 60 seconds! 🚀",
    tags: ["JEEPhysics", "QuickTips", "ProjectileMotion"],
    audio: "Original Audio - Aman Physics",
    engagement: { likes: 45200, comments: 1234, shares: 5678 },
    examCategory: "JEE Advanced",
  },
  {
    id: "2",
    author: { name: "NEET Bio Queen", username: "neetbioqueen", avatar: "N", verified: true },
    description: "Memorize all 206 bones with this simple trick! 🦴 #NEET2025",
    tags: ["NEETBiology", "Anatomy", "StudyHack"],
    audio: "Trending Sound - Study Beats",
    engagement: { likes: 78900, comments: 2341, shares: 8901 },
    examCategory: "NEET UG",
  },
  {
    id: "3",
    author: { name: "UPSC Mentor", username: "upscmentor", avatar: "U", verified: true },
    description: "Current Affairs made easy: This week's top 10 in 60 seconds!",
    tags: ["UPSCCurrent", "CurrentAffairs", "CivilServices"],
    audio: "Original Audio - UPSC Mentor",
    engagement: { likes: 32100, comments: 892, shares: 3456 },
    examCategory: "UPSC CSE",
  },
];

const avatarColors = [
  "from-cosmic-cyan to-cosmic-blue",
  "from-cosmic-magenta to-cosmic-pink",
  "from-cosmic-violet to-cosmic-magenta",
];

export const ReelsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const currentReel = reels[currentIndex];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleLike = (id: string) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md h-[85vh] rounded-3xl overflow-hidden glass-strong border border-border/50">
        {/* Video Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-violet/30 via-cosmic-magenta/20 to-cosmic-cyan/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4 glow-magenta">
                {isPlaying ? (
                  <Pause size={32} className="text-foreground" />
                ) : (
                  <Play size={32} className="text-foreground ml-1" />
                )}
              </div>
              <p className="text-muted-foreground text-sm">Tap to {isPlaying ? "pause" : "play"}</p>
            </div>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta rounded-full text-primary-foreground">
                {currentReel.examCategory}
              </span>
              <span className="px-3 py-1 text-xs font-semibold glass rounded-full text-foreground">
                <Sparkles size={10} className="inline mr-1" />
                AI Curated
              </span>
            </div>
            <Button variant="ghost" size="icon" className="text-foreground">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          <Button
            variant="glass"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="rounded-full"
          >
            <ChevronUp size={20} />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === reels.length - 1}
            className="rounded-full"
          >
            <ChevronDown size={20} />
          </Button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-end gap-4">
            {/* Info */}
            <div className="flex-1 space-y-3">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="story-ring">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                    `bg-gradient-to-br ${avatarColors[currentIndex % avatarColors.length]}`
                  )}>
                    {currentReel.author.avatar}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">{currentReel.author.name}</span>
                    {currentReel.author.verified && (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta flex items-center justify-center">
                        <Sparkles size={10} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">@{currentReel.author.username}</p>
                </div>
                <Button variant="neon" size="sm" className="ml-2">
                  Follow
                </Button>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground">{currentReel.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {currentReel.tags.map(tag => (
                  <span key={tag} className="text-xs text-primary">#{tag}</span>
                ))}
              </div>

              {/* Audio */}
              <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 w-fit">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta animate-spin-slow" />
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {currentReel.audio}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex-col h-auto py-2",
                  liked[currentReel.id] && "text-destructive"
                )}
                onClick={() => toggleLike(currentReel.id)}
              >
                <Heart size={24} className={cn(liked[currentReel.id] && "fill-current")} />
                <span className="text-xs mt-1">
                  {((currentReel.engagement.likes + (liked[currentReel.id] ? 1 : 0)) / 1000).toFixed(1)}K
                </span>
              </Button>

              <Button variant="ghost" size="icon" className="flex-col h-auto py-2">
                <MessageCircle size={24} />
                <span className="text-xs mt-1">
                  {(currentReel.engagement.comments / 1000).toFixed(1)}K
                </span>
              </Button>

              <Button variant="ghost" size="icon" className="flex-col h-auto py-2">
                <Share2 size={24} />
                <span className="text-xs mt-1">
                  {(currentReel.engagement.shares / 1000).toFixed(1)}K
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(saved[currentReel.id] && "text-cosmic-gold")}
                onClick={() => toggleSave(currentReel.id)}
              >
                <Bookmark size={24} className={cn(saved[currentReel.id] && "fill-current")} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {reels.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                index === currentIndex
                  ? "w-4 bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta"
                  : "bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
