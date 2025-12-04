import { StoryBar } from "./StoryBar";
import { PostCard } from "./PostCard";
import { TrendingTopics } from "./TrendingTopics";
import { SuggestedConnections } from "./SuggestedConnections";
import { ExamCategories } from "./ExamCategories";
import { TopBar } from "@/components/layout/TopBar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, TrendingUp, Loader2 } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

// Adapter function to transform database post to PostCard format
const adaptPostForCard = (post: any) => {
  const content = post.content || {};
  const caption = post.caption || content.text || "";
  const tags = content.tags || [];

  return {
    author: {
      name: post.user?.display_name || post.user?.handle || "Unknown User",
      username: post.user?.handle || "user",
      avatar: post.user?.avatar_url || post.user?.handle?.charAt(0).toUpperCase() || "U",
      verified: post.user?.is_verified || false,
      badge: post.user?.metadata?.badge,
    },
    content: {
      text: caption,
      media: content.media,
      tags: Array.isArray(tags) ? tags : [],
    },
    engagement: {
      likes: 0, // Will be populated from likes table
      comments: 0, // Will be populated from comments table
      shares: 0,
    },
    timestamp: formatDistanceToNow(new Date(post.created_at), { addSuffix: true }),
    examCategory: content.examCategory,
  };
};

export const HomeFeed = () => {
  const { posts, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = usePosts();

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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading posts...</p>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground text-sm">
                  Be the first to share something with the community!
                </p>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard key={post.id} {...adaptPostForCard(post)} />
                ))}

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="glass"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        "Load More Posts"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
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
