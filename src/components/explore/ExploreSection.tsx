import { 
  Search, 
  TrendingUp, 
  Sparkles, 
  Play, 
  Users, 
  BookOpen,
  GraduationCap,
  Globe,
  Flame,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";

const trendingSearches = [
  "JEE 2025 cutoff predictions",
  "NEET Biology NCERT notes",
  "UPSC current affairs May 2025",
  "CAT quant shortcuts",
  "GRE vocabulary list",
];

const categories = [
  { id: "all", name: "All", icon: <Sparkles size={16} /> },
  { id: "jee", name: "JEE", icon: <GraduationCap size={16} /> },
  { id: "neet", name: "NEET", icon: <BookOpen size={16} /> },
  { id: "upsc", name: "UPSC", icon: <Users size={16} /> },
  { id: "abroad", name: "Study Abroad", icon: <Globe size={16} /> },
  { id: "trending", name: "Trending", icon: <Flame size={16} /> },
];

const exploreTiles = [
  {
    id: "1",
    title: "JEE Physics Masterclass",
    author: "Aman Sir",
    views: "1.2M",
    type: "video",
    color: "from-cosmic-cyan to-cosmic-blue",
    size: "large",
  },
  {
    id: "2",
    title: "NEET Biology Daily",
    author: "Dr. Priya",
    views: "890K",
    type: "series",
    color: "from-cosmic-magenta to-cosmic-pink",
    size: "medium",
  },
  {
    id: "3",
    title: "UPSC Strategy 2025",
    author: "IAS Mentor",
    views: "2.1M",
    type: "video",
    color: "from-cosmic-violet to-cosmic-magenta",
    size: "medium",
  },
  {
    id: "4",
    title: "Math Tricks",
    author: "Quick Math",
    views: "450K",
    type: "reel",
    color: "from-cosmic-gold to-cosmic-pink",
    size: "small",
  },
  {
    id: "5",
    title: "Chemistry Organic",
    author: "Chem Pro",
    views: "678K",
    type: "playlist",
    color: "from-cosmic-green to-cosmic-cyan",
    size: "small",
  },
  {
    id: "6",
    title: "GRE Verbal Tips",
    author: "Study Abroad",
    views: "234K",
    type: "video",
    color: "from-cosmic-blue to-cosmic-violet",
    size: "small",
  },
  {
    id: "7",
    title: "CAT 2025 Prep",
    author: "MBA Guide",
    views: "567K",
    type: "course",
    color: "from-cosmic-pink to-cosmic-gold",
    size: "small",
  },
  {
    id: "8",
    title: "GATE CS Notes",
    author: "Tech Edu",
    views: "345K",
    type: "notes",
    color: "from-cosmic-cyan to-cosmic-green",
    size: "medium",
  },
];

const topCreators = [
  { name: "Physics Wallah", followers: "45M", avatar: "P", color: "from-cosmic-cyan to-cosmic-blue" },
  { name: "Unacademy", followers: "32M", avatar: "U", color: "from-cosmic-magenta to-cosmic-pink" },
  { name: "Khan Academy", followers: "28M", avatar: "K", color: "from-cosmic-violet to-cosmic-magenta" },
  { name: "Vedantu", followers: "18M", avatar: "V", color: "from-cosmic-gold to-cosmic-pink" },
];

export const ExploreSection = () => {
  return (
    <div className="min-h-screen">
      <TopBar 
        title="Explore Universe" 
        subtitle="Discover content from across the realm"
      />

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search for topics, creators, or content..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl glass border border-border/50 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-glow-md transition-all"
            />
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Filter size={18} />
            </Button>
          </div>

          {/* Trending Searches */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp size={12} />
              Trending:
            </span>
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                className="text-xs text-primary hover:underline"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-cosmic pb-2">
          {categories.map((cat, index) => (
            <Button
              key={cat.id}
              variant={index === 0 ? "cosmic" : "glass"}
              size="sm"
              className="whitespace-nowrap gap-2"
            >
              {cat.icon}
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Top Creators */}
        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            Top Creators
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {topCreators.map((creator, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-4 text-center hover:shadow-glow-sm transition-all cursor-pointer group"
              >
                <div className={cn(
                  "w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold bg-gradient-to-br",
                  creator.color
                )}>
                  <span className="text-primary-foreground">{creator.avatar}</span>
                </div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {creator.name}
                </p>
                <p className="text-xs text-muted-foreground">{creator.followers} followers</p>
                <Button variant="neon" size="sm" className="mt-3 w-full">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Grid */}
        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Flame size={18} className="text-cosmic-gold" />
            Trending Now
          </h2>
          <div className="grid grid-cols-4 gap-4 auto-rows-[200px]">
            {exploreTiles.map((tile, index) => {
              const sizeClasses = {
                large: "col-span-2 row-span-2",
                medium: "col-span-2 row-span-1",
                small: "col-span-1 row-span-1",
              };

              return (
                <div
                  key={tile.id}
                  className={cn(
                    "glass rounded-2xl overflow-hidden relative group cursor-pointer",
                    sizeClasses[tile.size as keyof typeof sizeClasses]
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-60",
                    tile.color
                  )} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  
                  {/* Play Button */}
                  {(tile.type === "video" || tile.type === "reel") && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full glass flex items-center justify-center glow-cyan">
                        <Play size={24} className="text-foreground ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Content Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 text-[10px] font-semibold glass rounded-full text-foreground uppercase">
                      {tile.type}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {tile.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{tile.author}</span>
                      <span>{tile.views} views</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exam Sections */}
        <div className="grid grid-cols-2 gap-6">
          {/* Indian Exams */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-lg">🇮🇳</span>
              Indian Competitive Exams
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["JEE Main", "JEE Advanced", "NEET UG", "NEET PG", "UPSC CSE", "SSC CGL", "IBPS PO", "CAT", "GATE", "NDA"].map((exam) => (
                <button
                  key={exam}
                  className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 text-sm font-medium text-foreground hover:text-primary transition-all text-left"
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          {/* Global Exams */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Globe size={18} className="text-cosmic-cyan" />
              Global Exams
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["GRE", "GMAT", "TOEFL", "IELTS", "SAT", "ACT", "MCAT", "LSAT", "PTE", "Duolingo"].map((exam) => (
                <button
                  key={exam}
                  className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 text-sm font-medium text-foreground hover:text-primary transition-all text-left"
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
