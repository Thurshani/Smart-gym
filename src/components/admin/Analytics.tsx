import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { PlatformStats, RecentVisit } from "./types";

interface AnalyticsProps {
  stats: PlatformStats | null;
  recentVisits: RecentVisit[];
}

export const Analytics = ({ stats, recentVisits }: AnalyticsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Platform Analytics
        </CardTitle>
        <CardDescription>
          Comprehensive platform statistics and insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Members:</span>
                <span className="font-medium">
                  {stats?.totalMembers.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Gyms:</span>
                <span className="font-medium">{stats?.totalGyms || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Visits:</span>
                <span className="font-medium">
                  {stats?.totalVisits.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-medium">
                  ${stats?.totalRevenue.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active Subscriptions:</span>
                <span className="font-medium">
                  {stats?.activeSubscriptions || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <div className="space-y-2">
              {recentVisits.slice(0, 5).map((visit) => (
                <div key={visit._id} className="text-sm">
                  <span className="font-medium">{visit.member.name}</span>{" "}
                  visited <span className="font-medium">{visit.gym.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
