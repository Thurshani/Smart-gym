import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Dumbbell, Activity, DollarSign, Calendar } from "lucide-react";
import { PlatformStats as PlatformStatsType } from "./types";

interface PlatformStatsProps {
  stats: PlatformStatsType | null;
}

export const PlatformStats = ({ stats }: PlatformStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {stats?.totalMembers.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Active registered members
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Gyms</CardTitle>
          <Dumbbell className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {stats?.totalGyms || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Partner gyms on platform
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          <Activity className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {stats?.totalVisits.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">All-time gym visits</p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            ${stats?.totalRevenue.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">Subscription revenue</p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Subscriptions
          </CardTitle>
          <Calendar className="h-4 w-4 text-info" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">
            {stats?.activeSubscriptions || 0}
          </div>
          <p className="text-xs text-muted-foreground">Current active plans</p>
        </CardContent>
      </Card>
    </div>
  );
};
