import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your AI Stackly profile",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/");
  }

  await dbConnect();
  const user = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/");
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const lastLogin = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-8 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-100">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-6 hover:border-indigo-500/50 transition-all">
              <div className="text-sm text-gray-400 mb-2">Daily Streak</div>
              <div className="text-3xl font-bold text-indigo-400">{user.dailyStreak}</div>
              <div className="text-xs text-gray-500 mt-1">
                {user.dailyStreak === 1 ? "day" : "days"} in a row
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-6 hover:border-green-500/50 transition-all">
              <div className="text-sm text-gray-400 mb-2">Saved Outputs</div>
              <div className="text-3xl font-bold text-green-400">{user.savedOutputsCount}</div>
              <div className="text-xs text-gray-500 mt-1">total saved</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="text-sm text-gray-400 mb-2">Favorite Tools</div>
              <div className="text-3xl font-bold text-purple-400">{user.favoriteToolsCount}</div>
              <div className="text-xs text-gray-500 mt-1">tools pinned</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-6 hover:border-orange-500/50 transition-all">
              <div className="text-sm text-gray-400 mb-2">Tokens Used</div>
              <div className="text-3xl font-bold text-orange-400">
                {(user.totalTokensUsed / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-500 mt-1">total tokens</div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Account Information</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-700/50">
                <span className="text-gray-400 font-medium">Member Since</span>
                <span className="text-gray-100">{joinDate}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-700/50">
                <span className="text-gray-400 font-medium">Last Login</span>
                <span className="text-gray-100">{lastLogin}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-700/50">
                <span className="text-gray-400 font-medium">Account Status</span>
                <span className="text-green-400 font-semibold">Active</span>
              </div>

              <div className="flex justify-between py-3">
                <span className="text-gray-400 font-medium">Email Verified</span>
                <span className="text-green-400 font-semibold">Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
