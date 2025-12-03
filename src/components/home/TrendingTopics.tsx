import { TrendingUp, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrendingTopic {
  id: string;
  category: string;
  title: string;
  posts: number;
  isHot?: boolean;
}

const trendingTopics: TrendingTopic[] = [
  { id: "1", category: "JEE Advanced 2025", title: "#JEEPreparation", posts: 125000, isHot: true },
  { id: "2", category: "NEET UG 2025", title: "#NEETBiology", posts: 98000, isHot: true },
  { id: "3", category: "UPSC CSE", title: "#CivilServices", posts: 76000 },
  { id: "4", category: "CAT 2025", title: "#MBAAspirants", posts: 54000 },
  { id: "5", category: "GATE 2025", title: "#GATEEngineering", posts: 42000 },
  { id: "6", category: "GRE/GMAT", title: "#StudyAbroad", posts: 38000 },
];

export const TrendingTopics = () => {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cosmic-gold to-cosmic-pink flex items-center justify-center">
            <TrendingUp size={16} className="text-primary-foreground" />
          </div>
          <h3 className="font-display font-semibold text-foreground">Trending Now</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary gap-1">
          See All
          <ArrowRight size={14} />
        </Button>
      </div>

      <div className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div
            key={topic.id}
            className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">{topic.category}</span>
                  {topic.isHot && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-cosmic-gold">
                      <Flame size={10} className="fill-cosmic-gold" />
                      HOT
                    </span>
                  )}
                </div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {topic.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(topic.posts / 1000).toFixed(0)}K posts
                </p>
              </div>
              <span className="text-muted-foreground text-sm font-display">
                #{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
