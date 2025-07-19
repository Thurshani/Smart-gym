import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  TrendingUp,
  Calendar,
  Download,
  MapPin,
  Clock,
  BarChart3,
  Target,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

interface GymInfo {
  name: string;
  gymCode: string;
  location: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  capacity: number;
  facilities: string[];
}

interface VisitStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

interface RecentVisit {
  _id: string;
  member: {
    name: string;
    email: string;
  };
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  tokensUsed: number;
}

interface TodayVisit {
  _id: string;
  member: {
    name: string;
    email: string;
    phone?: string;
  };
  date: string;
  checkInTime: string;
  tokensUsed: number;
}

interface GymDashboardData {
  gym: GymInfo;
  visitStats: VisitStats;
  recentVisits: RecentVisit[];
  totalMembers: number;
}

interface TodayVisitsData {
  date: string;
  totalVisits: number;
  visits: TodayVisit[];
}

const GymDashboard = () => {
  const { logout, token } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<GymDashboardData | null>(
    null
  );
  const [todayVisits, setTodayVisits] = useState<TodayVisitsData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch gym dashboard data
  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/gym/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard data");
      }
      setDashboardData(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Fetch today's visits
  const fetchTodayVisits = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/gym/today-visits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch today's visits");
      }
      setTodayVisits(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchDashboardData(), fetchTodayVisits()]);
      setIsLoading(false);
    };

    if (token) {
      loadData();
    }
  }, [token]);

  // Auto-refresh today's visits every 30 seconds
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchTodayVisits();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  const handleExportReport = async () => {
    if (!token) return;
    setIsExporting(true);
    try {
      const response = await fetch(
        `/api/gym/reports?period=${timeRange}&format=csv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to export report");
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gym-visits-${timeRange}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Report exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading gym dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <p>Failed to load dashboard data. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {dashboardData.gym.name}
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground mt-2">
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Code: {dashboardData.gym.gymCode}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {dashboardData.gym.location.address}
                  {dashboardData.gym.location.city &&
                    `, ${dashboardData.gym.location.city}`}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Capacity: {dashboardData.gym.capacity}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Visits
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {dashboardData.visitStats.daily}
              </div>
              <p className="text-xs text-muted-foreground">
                {todayVisits
                  ? `${todayVisits.totalVisits} total check-ins`
                  : "Loading..."}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Target className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {dashboardData.totalMembers}
              </div>
              <p className="text-xs text-muted-foreground">Unique visitors</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {dashboardData.visitStats.weekly}
              </div>
              <p className="text-xs text-muted-foreground">Weekly visits</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <BarChart3 className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">
                {dashboardData.visitStats.monthly}
              </div>
              <p className="text-xs text-muted-foreground">Monthly visits</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visits">Live Check-ins</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visit Statistics */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Visit Statistics</CardTitle>
                  <CardDescription>
                    Breakdown of visits by time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Today</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                (dashboardData.visitStats.daily / 50) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm w-8">
                          {dashboardData.visitStats.daily}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Week</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                (dashboardData.visitStats.weekly / 300) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm w-8">
                          {dashboardData.visitStats.weekly}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Month</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-success h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                (dashboardData.visitStats.monthly / 1000) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm w-8">
                          {dashboardData.visitStats.monthly}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Year</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-info h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                (dashboardData.visitStats.yearly / 5000) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm w-8">
                          {dashboardData.visitStats.yearly}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Visits */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Visits</CardTitle>
                  <CardDescription>
                    Latest member check-ins to your gym
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.recentVisits.slice(0, 6).map((visit) => (
                      <div
                        key={visit._id}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{visit.member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(visit.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatTime(visit.checkInTime)}
                          </p>
                          <Badge variant="outline">
                            {visit.tokensUsed} token
                            {visit.tokensUsed !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visits" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Check-ins</span>
                  <Badge variant="secondary">
                    {todayVisits
                      ? `${todayVisits.totalVisits} total`
                      : "Loading..."}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Live view of members currently checked in and recent visits
                  <span className="block text-xs mt-1 text-muted-foreground">
                    Auto-refreshes every 30 seconds
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayVisits && todayVisits.visits.length > 0 ? (
                    todayVisits.visits.map((visit) => (
                      <div
                        key={visit._id}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{visit.member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {visit.member.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Check-in: {formatTime(visit.checkInTime)}
                          </p>
                          <Badge variant="default" className="bg-success">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No check-ins today yet</p>
                      <p className="text-sm">
                        Member visits will appear here in real-time
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>
                  Generate and download visit reports for different time periods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Today</SelectItem>
                      <SelectItem value="weekly">This Week</SelectItem>
                      <SelectItem value="monthly">This Month</SelectItem>
                      <SelectItem value="yearly">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isExporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isExporting ? "Exporting..." : "Export CSV"}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Reports include member names, check-in times, and token usage
                  for the selected period.
                </div>
              </CardContent>
            </Card>

            {/* Facilities Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Gym Information</CardTitle>
                <CardDescription>
                  Your gym's facilities and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Available Facilities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dashboardData.gym.facilities.map((facility, index) => (
                        <Badge key={index} variant="outline">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Gym Code:</span>{" "}
                      {dashboardData.gym.gymCode}
                    </div>
                    <div>
                      <span className="font-medium">Capacity:</span>{" "}
                      {dashboardData.gym.capacity} members
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GymDashboard;
