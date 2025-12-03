import { StoryBar } from "./StoryBar";
import { PostCard } from "./PostCard";
import { TrendingTopics } from "./TrendingTopics";
import { SuggestedConnections } from "./SuggestedConnections";
import { ExamCategories } from "./ExamCategories";
import { TopBar } from "@/components/layout/TopBar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, TrendingUp } from "lucide-react";

const feedPosts = [
  {
    author: {
      name: "Priya Sharma",
      username: "priyajee2025",
      avatar: "P",
      verified: true,
      badge: "JEE AIR 247",
    },
    content: {
      text: "Just finished solving 100 problems from HC Verma! 📚 The key to JEE Physics is understanding concepts deeply, not just mugging formulas. Here's my approach for Mechanics...",
      media: { type: "image" as const, url: "/placeholder.jpg" },
      tags: ["JEEPreparation", "Physics", "HCVerma", "IITDreams"],
    },
    engagement: { likes: 2453, comments: 342, shares: 128 },
    timestamp: "2h ago",
    examCategory: "JEE Advanced 2025",
  },
  {
    author: {
      name: "Dr. Amit Kumar",
      username: "amitneetmentor",
      avatar: "A",
      verified: true,
      badge: "AIIMS Faculty",
    },
    content: {
      text: "NEET Biology tip: Focus on NCERT first! 90% of questions come directly from the textbook. Don't fall into the trap of fancy reference books until you've mastered NCERT. Start with these chapters...",
      tags: ["NEET2025", "Biology", "NCERTFirst", "MedicalAspirants"],
    },
    engagement: { likes: 5621, comments: 892, shares: 456 },
    timestamp: "4h ago",
    examCategory: "NEET UG 2025",
  },
  {
    author: {
      name: "Rajesh Mishra",
      username: "rajeshupsccse",
      avatar: "R",
      verified: true,
      badge: "IAS 2023",
    },
    content: {
      text: "My UPSC journey: From 3 failed attempts to AIR 45. The game-changer? I stopped studying 14 hours and started studying smart. Quality over quantity. Here's my revised strategy that finally worked...",
      media: { type: "video" as const, url: "/placeholder.mp4" },
      tags: ["UPSCMotivation", "CivilServices", "IASPrep", "NeverGiveUp"],
    },
    engagement: { likes: 12453, comments: 1892, shares: 2341 },
    timestamp: "6h ago",
    examCategory: "UPSC CSE 2025",
  },
  {
    author: {
      name: "Sarah Chen",
      username: "sarahgre330",
      avatar: "S",
      verified: true,
      badge: "GRE 330+",
    },
    content: {
      text: "Just got my GRE score - 335! 🎉 For Quant, practice from ETS official materials. For Verbal, read The Economist daily. Here are the exact resources I used for my prep...",
      tags: ["GREprep", "StudyAbroad", "GraduateSchool", "Masters"],
    },
    engagement: { likes: 3421, comments: 567, shares: 234 },
    timestamp: "8h ago",
    examCategory: "GRE/GMAT Prep",
  },
];

export const HomeFeed = () => {
  return (
    <div className="min-h-screen">
      <TopBar 
        title="Your Feed" 
        subtitle="Stay updated with your learning community"
      />

      <div className="flex gap-6 p-6">
        {/* Main Feed */}
        <div className="flex-1 max-w-2xl space-y-6">
          {/* Stories */}
          <div className="glass rounded-2xl px-4">
            <StoryBar />
          </div>

          {/* Feed Tabs */}
          <Tabs defaultValue="foryou" className="w-full">
            <TabsList className="w-full glass p-1 rounded-xl">
              <TabsTrigger value="foryou" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                <Sparkles size={14} />
                For You
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                <Users size={14} />
                Following
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                <TrendingUp size={14} />
                Trending
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Posts */}
          <div className="space-y-4">
            {feedPosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-80 space-y-4">
          <ExamCategories />
          <TrendingTopics />
          <SuggestedConnections />
        </div>
      </div>
    </div>
  );
};
