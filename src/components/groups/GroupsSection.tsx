import { 
  Users, 
  Plus, 
  Search, 
  TrendingUp, 
  Lock, 
  Globe, 
  MessageCircle,
  Calendar,
  Star,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/TopBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  description: string;
  members: string;
  posts: string;
  image: string;
  category: string;
  isPrivate: boolean;
  isJoined?: boolean;
  isFeatured?: boolean;
}

const myGroups: Group[] = [
  {
    id: "1",
    name: "JEE 2025 Warriors",
    description: "Official community for JEE 2025 aspirants. Share doubts, strategies, and motivation!",
    members: "125K",
    posts: "5.2K/day",
    image: "J",
    category: "JEE Advanced",
    isPrivate: false,
    isJoined: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "NEET Biology Masters",
    description: "Deep dive into NCERT Biology with daily discussions and doubt clearing sessions",
    members: "89K",
    posts: "3.1K/day",
    image: "N",
    category: "NEET UG",
    isPrivate: false,
    isJoined: true,
  },
  {
    id: "3",
    name: "Kota Students Network",
    description: "Connect with fellow students in Kota. Local meetups, PG recommendations, and more!",
    members: "45K",
    posts: "1.8K/day",
    image: "K",
    category: "Local",
    isPrivate: true,
    isJoined: true,
  },
];

const suggestedGroups: Group[] = [
  {
    id: "4",
    name: "UPSC CSE 2025",
    description: "Serious aspirants only. Daily current affairs, answer writing practice, and mentorship",
    members: "234K",
    posts: "8.5K/day",
    image: "U",
    category: "UPSC",
    isPrivate: false,
    isFeatured: true,
  },
  {
    id: "5",
    name: "GRE 330+ Club",
    description: "For students targeting 330+ in GRE. Strategies, resources, and peer support",
    members: "67K",
    posts: "2.1K/day",
    image: "G",
    category: "Study Abroad",
    isPrivate: false,
  },
  {
    id: "6",
    name: "Physics Olympiad India",
    description: "INPhO, IPhO preparation. Advanced problem solving and conceptual discussions",
    members: "28K",
    posts: "890/day",
    image: "P",
    category: "Olympiad",
    isPrivate: true,
  },
];

const groupColors = [
  "from-cosmic-cyan to-cosmic-blue",
  "from-cosmic-magenta to-cosmic-pink",
  "from-cosmic-violet to-cosmic-magenta",
  "from-cosmic-gold to-cosmic-pink",
  "from-cosmic-green to-cosmic-cyan",
  "from-cosmic-blue to-cosmic-violet",
];

const GroupCard = ({ group, index }: { group: Group; index: number }) => (
  <div className="glass rounded-2xl p-4 hover:shadow-glow-sm transition-all cursor-pointer group">
    <div className="flex gap-4">
      <div className={cn(
        "w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0 bg-gradient-to-br",
        groupColors[index % groupColors.length]
      )}>
        <span className="text-primary-foreground">{group.image}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {group.name}
              </h3>
              {group.isPrivate ? (
                <Lock size={12} className="text-muted-foreground" />
              ) : (
                <Globe size={12} className="text-muted-foreground" />
              )}
              {group.isFeatured && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-cosmic-gold/20 text-cosmic-gold rounded-full">
                  <Star size={8} className="fill-cosmic-gold" />
                  Featured
                </span>
              )}
            </div>
            <span className="text-xs text-primary">{group.category}</span>
          </div>
          {group.isJoined ? (
            <Button variant="glass" size="sm">
              Open
            </Button>
          ) : (
            <Button variant="neon" size="sm">
              Join
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {group.description}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {group.members} members
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {group.posts}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const GroupsSection = () => {
  const categories = [
    "All", "JEE", "NEET", "UPSC", "CAT", "GATE", "Study Abroad", "Local"
  ];

  return (
    <div className="min-h-screen">
      <TopBar 
        title="Communities" 
        subtitle="Connect with your tribe"
      />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Search & Create */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search communities..."
              className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-glow-sm transition-all"
            />
          </div>
          <Button variant="cosmic" className="gap-2">
            <Plus size={18} />
            Create Community
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-cosmic pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === "All" ? "neon" : "glass"}
              size="sm"
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* AI Suggestions Banner */}
        <div className="glass rounded-2xl p-4 border border-primary/30 glow-cyan">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cosmic-cyan to-cosmic-magenta flex items-center justify-center">
                <Sparkles size={20} className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">AI Found 5 Communities For You</p>
                <p className="text-xs text-muted-foreground">Based on your interests and learning goals</p>
              </div>
            </div>
            <Button variant="neon" size="sm" className="gap-1">
              Explore
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="my" className="w-full">
          <TabsList className="w-full glass p-1 rounded-xl">
            <TabsTrigger value="my" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Users size={14} />
              My Communities
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <TrendingUp size={14} />
              Discover
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Calendar size={14} />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-4 space-y-4">
            {myGroups.map((group, index) => (
              <GroupCard key={group.id} group={group} index={index} />
            ))}
          </TabsContent>

          <TabsContent value="discover" className="mt-4 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Trending Communities
            </h3>
            {suggestedGroups.map((group, index) => (
              <GroupCard key={group.id} group={group} index={index + 3} />
            ))}
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <div className="glass rounded-2xl p-8 text-center">
              <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Community Events</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Discover live sessions, webinars, and meetups from your communities
              </p>
              <Button variant="cosmic">Browse Events</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
