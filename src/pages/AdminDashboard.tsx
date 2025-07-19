import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  AdminHeader,
  PlatformStats,
  RecentVisits,
  QuickActions,
  GymManagement,
  MemberManagement,
  Analytics,
  useAdminData,
} from "@/components/admin";

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const {
    isLoading,
    platformStats,
    gyms,
    members,
    recentVisits,
    handleGymAdded,
  } = useAdminData({ token });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <AdminHeader onLogout={logout} />

        {/* Platform Stats */}
        <PlatformStats stats={platformStats} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gyms">Gyms</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <RecentVisits visits={recentVisits} />

              {/* Quick Actions */}
              <QuickActions token={token} onGymAdded={handleGymAdded} />
            </div>
          </TabsContent>

          <TabsContent value="gyms" className="space-y-6">
            <GymManagement
              gyms={gyms}
              token={token}
              onGymAdded={handleGymAdded}
            />
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <MemberManagement members={members} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics stats={platformStats} recentVisits={recentVisits} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
