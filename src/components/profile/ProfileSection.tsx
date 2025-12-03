import { 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Briefcase, 
  GraduationCap, 
  Award,
  Edit3,
  Share2,
  MoreHorizontal,
  Sparkles,
  FileText,
  Users,
  Grid,
  Play,
  Bookmark,
  Target,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";

const profileData = {
  name: "Rahul Kumar",
  username: "rahulkumar2025",
  avatar: "R",
  coverGradient: "from-cosmic-violet via-cosmic-magenta to-cosmic-cyan",
  bio: "JEE 2025 Aspirant | Physics Lover | Content Creator | Sharing my journey from Kota to IIT",
  location: "Kota, Rajasthan",
  joined: "Joined March 2024",
  website: "techgramlabs.site/rahul",
  currentTarget: "JEE Advanced 2025",
  stats: {
    posts: 128,
    followers: "12.5K",
    following: 342,
    reels: 45,
  },
  achievements: [
    { icon: "🏆", title: "Top Creator", subtitle: "Physics Category" },
    { icon: "⭐", title: "Rising Star", subtitle: "10K+ Followers" },
    { icon: "📚", title: "Knowledge Guru", subtitle: "500+ Study Hours" },
  ],
  skills: ["Physics", "Mathematics", "Problem Solving", "Content Creation", "Mentoring"],
  education: [
    { institution: "Allen Career Institute", degree: "JEE Preparation", year: "2024-25" },
    { institution: "Delhi Public School", degree: "Class 12 (PCM)", year: "2024" },
  ],
  experience: [
    { role: "Physics Content Creator", company: "TechgramLabs", duration: "6 months" },
    { role: "Peer Mentor", company: "Allen Career Institute", duration: "3 months" },
  ],
};

const posts = [
  { id: "1", type: "image", likes: "2.4K" },
  { id: "2", type: "video", likes: "5.1K" },
  { id: "3", type: "image", likes: "1.8K" },
  { id: "4", type: "image", likes: "3.2K" },
  { id: "5", type: "video", likes: "8.9K" },
  { id: "6", type: "image", likes: "1.5K" },
];

export const ProfileSection = () => {
  return (
    <div className="min-h-screen">
      <TopBar title="My Profile" subtitle="Your professional identity" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Cover & Profile */}
        <div className="glass rounded-3xl overflow-hidden">
          {/* Cover */}
          <div className={cn(
            "h-48 bg-gradient-to-r relative",
            profileData.coverGradient
          )}>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <Button
              variant="glass"
              size="icon"
              className="absolute top-4 right-4"
            >
              <Edit3 size={16} />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              <div className="story-ring inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cosmic-cyan to-cosmic-magenta flex items-center justify-center text-4xl font-bold text-foreground border-4 border-background">
                  {profileData.avatar}
                </div>
              </div>
              <Button
                variant="glass"
                size="icon"
                className="absolute bottom-2 right-0"
              >
                <Edit3 size={14} />
              </Button>
            </div>

            {/* Name & Actions */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    {profileData.name}
                  </h1>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-magenta flex items-center justify-center">
                    <Sparkles size={12} className="text-primary-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground">@{profileData.username}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="cosmic">
                  <Edit3 size={16} className="mr-2" />
                  Edit Profile
                </Button>
                <Button variant="glass" size="icon">
                  <Share2 size={16} />
                </Button>
                <Button variant="glass" size="icon">
                  <MoreHorizontal size={16} />
                </Button>
              </div>
            </div>

            {/* Bio */}
            <p className="text-foreground mb-4">{profileData.bio}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Target size={14} className="text-primary" />
                {profileData.currentTarget}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {profileData.location}
              </span>
              <span className="flex items-center gap-1">
                <LinkIcon size={14} />
                <a href="#" className="text-primary hover:underline">{profileData.website}</a>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {profileData.joined}
              </span>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="font-display font-bold text-xl text-foreground">{profileData.stats.posts}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-xl text-foreground">{profileData.stats.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-xl text-foreground">{profileData.stats.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-xl text-foreground">{profileData.stats.reels}</p>
                <p className="text-sm text-muted-foreground">Reels</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-3 gap-4">
          {profileData.achievements.map((achievement, index) => (
            <div key={index} className="glass rounded-2xl p-4 text-center hover:shadow-glow-sm transition-all">
              <span className="text-3xl mb-2 block">{achievement.icon}</span>
              <p className="font-semibold text-foreground">{achievement.title}</p>
              <p className="text-xs text-muted-foreground">{achievement.subtitle}</p>
            </div>
          ))}
        </div>

        {/* AI Profile Builder */}
        <div className="glass rounded-2xl p-6 border border-primary/30 glow-cyan">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cosmic-cyan to-cosmic-magenta flex items-center justify-center">
                <Sparkles size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">AI Profile Builder</h3>
                <p className="text-sm text-muted-foreground">Let AI enhance your professional profile</p>
              </div>
            </div>
            <Button variant="cosmic" size="sm">
              Generate
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Button variant="glass" size="sm" className="gap-2">
              <FileText size={14} />
              Generate Bio
            </Button>
            <Button variant="glass" size="sm" className="gap-2">
              <Target size={14} />
              Skill Analysis
            </Button>
            <Button variant="glass" size="sm" className="gap-2">
              <TrendingUp size={14} />
              Career Path
            </Button>
          </div>
        </div>

        {/* Professional Details */}
        <div className="grid grid-cols-2 gap-4">
          {/* Education */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground">Education</h3>
            </div>
            <div className="space-y-3">
              {profileData.education.map((edu, index) => (
                <div key={index} className="p-3 rounded-xl bg-muted/30">
                  <p className="font-medium text-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                  <p className="text-xs text-primary">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-secondary" />
              <h3 className="font-semibold text-foreground">Experience</h3>
            </div>
            <div className="space-y-3">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="p-3 rounded-xl bg-muted/30">
                  <p className="font-medium text-foreground">{exp.role}</p>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-primary">{exp.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-cosmic-gold" />
            <h3 className="font-semibold text-foreground">Skills & Expertise</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full glass p-1 rounded-xl">
            <TabsTrigger value="posts" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Grid size={14} />
              Posts
            </TabsTrigger>
            <TabsTrigger value="reels" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Play size={14} />
              Reels
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Bookmark size={14} />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square rounded-xl bg-gradient-to-br from-muted to-card relative group cursor-pointer overflow-hidden"
                >
                  {post.type === "video" && (
                    <div className="absolute top-2 right-2">
                      <Play size={16} className="text-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <span className="text-foreground text-sm font-medium">❤️ {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reels" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {posts.filter(p => p.type === "video").map((post) => (
                <div
                  key={post.id}
                  className="aspect-[9/16] rounded-xl bg-gradient-to-br from-muted to-card relative group cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={24} className="text-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
              <p>Your saved posts will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
