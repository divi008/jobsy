import React from "react";
import PageLayout from "./PageLayout";

export default function PlacementData({ user, showUserGuideModal, setShowUserGuideModal, showAnnouncement, setShowAnnouncement, announcementIdx, announcements, isSliding }) {
  return (
    <PageLayout
      user={user}
      onUserGuide={() => setShowUserGuideModal(true)}
      showAnnouncement={showAnnouncement}
      setShowAnnouncement={setShowAnnouncement}
      announcementIdx={announcementIdx}
      announcements={announcements}
      isSliding={isSliding}
    >
      {/* Placeholder for Placement Data content */}
      <div className="w-full max-w-4xl min-h-[300px] bg-white/80 rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#28c76f]/30">
        <span className="text-2xl text-gray-400">Placement Data content will go here...</span>
      </div>
    </PageLayout>
  );
} 