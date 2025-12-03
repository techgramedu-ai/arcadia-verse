import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { HomeFeed } from "@/components/home/HomeFeed";
import { ReelsSection } from "@/components/reels/ReelsSection";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AIDashboard } from "@/components/ai/AIDashboard";
import { GroupsSection } from "@/components/groups/GroupsSection";
import { ExploreSection } from "@/components/explore/ExploreSection";
import { MessagesSection } from "@/components/messages/MessagesSection";
import { CosmicBackground } from "@/components/shared/CosmicBackground";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeFeed />;
      case "reels":
        return <ReelsSection />;
      case "profile":
        return <ProfileSection />;
      case "ai":
        return <AIDashboard />;
      case "groups":
        return <GroupsSection />;
      case "explore":
        return <ExploreSection />;
      case "messages":
        return <MessagesSection />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
        <CosmicBackground />
        
        <div className="relative z-10 flex">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 ml-64">
            {renderContent()}
          </main>
        </div>
    </div>
  );
};

export default Index;
