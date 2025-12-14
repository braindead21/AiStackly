"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

interface ToolUsage {
  toolId: string;
  toolName: string;
  count: number;
}

interface DailyAnalytics {
  date: string;
  totalRequests: number;
  totalTokens: number;
  toolsUsed: ToolUsage[];
}

interface AnalyticsData {
  analytics: DailyAnalytics[];
  totalRequests: number;
  totalTokens: number;
  mostUsedTools: ToolUsage[];
  dailyStreak: number;
  totalTokensUsed: number;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAnalytics();
    }
  }, [session, days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?days=${days}`);
      const result = await res.json();
      
      if (result.success) {
        setData(result);
      } else {
        setError(result.error || "Failed to fetch analytics");
      }
    } catch (err) {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] pt-24 flex items-center justify-center">
          <div className="fixed inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 relative"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] pt-24 pb-12">
        <div className="fixed inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-300">Track your AI tool usage and performance</p>
          </div>

          {/* Period Filter */}
          <div className="mb-6">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value={7} className="bg-gray-800 text-white">Last 7 days</option>
              <option value={14} className="bg-gray-800 text-white">Last 14 days</option>
              <option value={30} className="bg-gray-800 text-white">Last 30 days</option>
              <option value={90} className="bg-gray-800 text-white">Last 90 days</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {data && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
                  <div className="text-sm text-gray-400 mb-2">Daily Streak</div>
                  <div className="text-3xl font-bold text-white">{data.dailyStreak}</div>
                  <div className="text-xs text-gray-500 mt-1">{data.dailyStreak === 1 ? "day" : "days"} in a row</div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
                  <div className="text-sm text-gray-400 mb-2">Total Requests</div>
                  <div className="text-3xl font-bold text-white">{data.totalRequests}</div>
                  <div className="text-xs text-gray-500 mt-1">in selected period</div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
                  <div className="text-sm text-gray-400 mb-2">Total Tokens</div>
                  <div className="text-3xl font-bold text-white">
                    {(data.totalTokens / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-500 mt-1">in selected period</div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
                  <div className="text-sm text-gray-400 mb-2">All-Time Tokens</div>
                  <div className="text-3xl font-bold text-white">
                    {(data.totalTokensUsed / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-500 mt-1">since joining</div>
                </div>
              </div>

              {/* Most Used Tools */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Most Used Tools</h2>
                {data.mostUsedTools.length === 0 ? (
                  <p className="text-gray-400">No tool usage data yet</p>
                ) : (
                  <div className="space-y-4">
                    {data.mostUsedTools.map((tool, index) => (
                      <div key={tool.toolId} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{tool.toolName}</div>
                          <div className="text-sm text-gray-400">{tool.count} uses</div>
                        </div>
                        <div className="w-48 bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-indigo-500 h-3 rounded-full"
                            style={{
                              width: `${(tool.count / data.mostUsedTools[0].count) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Daily Breakdown */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Daily Activity</h2>
                {data.analytics.length === 0 ? (
                  <p className="text-gray-400">No activity data yet</p>
                ) : (
                  <div className="space-y-6">
                    {data.analytics.map((day) => (
                      <div key={day.date} className="border-b border-gray-700 pb-6 last:border-b-0">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-white">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </h3>
                          <div className="flex gap-6 text-sm">
                            <span className="text-gray-400">
                              <span className="font-semibold text-white">{day.totalRequests}</span> requests
                            </span>
                            <span className="text-gray-400">
                              <span className="font-semibold text-white">{day.totalTokens}</span> tokens
                            </span>
                          </div>
                        </div>
                        
                        {day.toolsUsed.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {day.toolsUsed.map((tool) => (
                              <span
                                key={tool.toolId}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              >
                                {tool.toolName} <span className="ml-2 font-semibold">×{tool.count}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
