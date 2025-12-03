import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  FileText, 
  Video, 
  Palette,
  Zap,
  DollarSign,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";

const aiFeatures = [
  {
    id: "profile-builder",
    icon: <FileText size={24} />,
    title: "AI Profile Builder",
    description: "Auto-generate professional bio, skills analysis, and career recommendations",
    color: "from-cosmic-cyan to-cosmic-blue",
    action: "Build Profile",
  },
  {
    id: "feed-curator",
    icon: <Brain size={24} />,
    title: "Smart Feed Curator",
    description: "AI-curated content based on your learning goals and interests",
    color: "from-cosmic-magenta to-cosmic-pink",
    action: "Customize Feed",
  },
  {
    id: "connect-suggestions",
    icon: <Users size={24} />,
    title: "AI Connect",
    description: "Smart suggestions for friends, mentors, and potential collaborators",
    color: "from-cosmic-violet to-cosmic-magenta",
    action: "Find Connections",
  },
  {
    id: "studio",
    icon: <Video size={24} />,
    title: "AI Studio",
    description: "Auto-edit videos, generate thumbnails, and create content templates",
    color: "from-cosmic-gold to-cosmic-pink",
    action: "Open Studio",
  },
  {
    id: "monetization",
    icon: <DollarSign size={24} />,
    title: "Monetization Dashboard",
    description: "Track earnings, optimize content for revenue, and find brand deals",
    color: "from-cosmic-green to-cosmic-cyan",
    action: "View Earnings",
  },
  {
    id: "career-path",
    icon: <Target size={24} />,
    title: "Career Path AI",
    description: "Personalized career guidance based on your skills and aspirations",
    color: "from-cosmic-blue to-cosmic-violet",
    action: "Explore Careers",
  },
];

const quickInsights = [
  { label: "Profile Strength", value: "85%", trend: "+5%", color: "text-cosmic-cyan" },
  { label: "Engagement Rate", value: "12.4%", trend: "+2.1%", color: "text-cosmic-magenta" },
  { label: "Content Score", value: "92", trend: "+8", color: "text-cosmic-gold" },
  { label: "Reach This Week", value: "45.2K", trend: "+15%", color: "text-cosmic-green" },
];

const aiRecommendations = [
  {
    type: "content",
    title: "Create a JEE Physics series",
    reason: "High demand in your network",
    impact: "+5K followers potential",
  },
  {
    type: "connect",
    title: "Connect with @physicswallah",
    reason: "Mutual interests & high relevance",
    impact: "Collaboration opportunity",
  },
  {
    type: "optimize",
    title: "Post at 7 PM IST",
    reason: "Your audience is most active",
    impact: "+40% engagement",
  },
];

export const AIDashboard = () => {
  return (
    <div className="min-h-screen">
      <TopBar 
        title="AI Command Center" 
        subtitle="Your intelligent assistant for growth"
      />

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="glass rounded-3xl p-8 border border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-cyan/10 via-cosmic-magenta/10 to-cosmic-violet/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cosmic-cyan/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cosmic-magenta/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cosmic-cyan to-cosmic-magenta flex items-center justify-center shadow-glow-md animate-float">
                <Sparkles size={32} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gradient-cosmic">
                  Welcome to AI Universe
                </h1>
                <p className="text-muted-foreground">
                  Powered by advanced AI to accelerate your growth
                </p>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-4 gap-4">
              {quickInsights.map((insight, index) => (
                <div key={index} className="glass rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{insight.label}</p>
                  <p className={cn("font-display text-2xl font-bold", insight.color)}>
                    {insight.value}
                  </p>
                  <p className="text-xs text-cosmic-green">{insight.trend}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Features Grid */}
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">AI Tools</h2>
          <div className="grid grid-cols-3 gap-4">
            {aiFeatures.map((feature) => (
              <div
                key={feature.id}
                className="glass rounded-2xl p-6 hover:shadow-glow-sm transition-all group cursor-pointer"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                  feature.color
                )}>
                  <span className="text-primary-foreground">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <Button variant="neon" size="sm" className="w-full">
                  {feature.action}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="grid grid-cols-2 gap-6">
          {/* Smart Recommendations */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-cosmic-gold" />
              <h3 className="font-display font-semibold text-foreground">AI Recommendations</h3>
            </div>
            <div className="space-y-3">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{rec.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                    </div>
                    <span className="text-xs text-cosmic-green font-medium">{rec.impact}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="glass" className="w-full mt-4">
              View All Recommendations
            </Button>
          </div>

          {/* AI Chat Assistant */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={20} className="text-primary" />
              <h3 className="font-display font-semibold text-foreground">AI Assistant</h3>
            </div>
            <div className="h-48 rounded-xl bg-muted/30 p-4 mb-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-cyan to-cosmic-magenta flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-primary-foreground" />
                  </div>
                  <div className="glass rounded-xl rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm text-foreground">
                      Hi Rahul! Based on your recent activity, I suggest creating content about JEE Physics - it's trending in your network! 🚀
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask AI anything..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-glow-sm transition-all"
              />
              <Button variant="cosmic" size="icon">
                <Rocket size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-cosmic-violet" />
              <h3 className="font-display font-semibold text-foreground">Growth Analytics</h3>
            </div>
            <Button variant="glass" size="sm">View Full Analytics</Button>
          </div>
          
          <div className="h-48 rounded-xl bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Analytics charts will appear here</p>
              <p className="text-xs text-primary mt-1">+23% growth this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
