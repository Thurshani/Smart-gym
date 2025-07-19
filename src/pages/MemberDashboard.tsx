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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  Coins,
  Calendar,
  MapPin,
  CreditCard,
  Trophy,
  Clock,
  CheckCircle2,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface Gym {
  _id: string;
  name: string;
  location: {
    address: string;
  };
}

interface Visit {
  gym: Gym;
  date: string;
  checkInTime: string;
}

interface VisitStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
}

interface MemberData {
  name: string;
  tokens: number;
  subscription: {
    plan: string;
    endDate: string;
    startDate: string;
  };
}

interface SubscriptionPlan {
  id: string;
  name: string;
  tokens: number;
  price: number;
  popular: boolean;
}

const MemberDashboard = () => {
  const { toast } = useToast();
  const { token, user, logout } = useAuth();
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [recentGyms, setRecentGyms] = useState<Gym[]>([]);
  const [visitHistory, setVisitHistory] = useState<Visit[]>([]);
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gymCode, setGymCode] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/member/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard data");
      }
      setMemberData(data.data.member);
      setRecentGyms(data.data.recentGyms);
      setVisitHistory(data.data.recentVisits);
      setVisitStats(data.data.visitStats);
      setSubscriptionPlans(data.data.subscriptionPlans || []);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const handleCheckIn = async (gymId: string) => {
    if (!token) return;
    try {
      const response = await fetch("/api/member/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gymId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Check-in failed");
      }
      toast({
        title: "Success",
        description: "You have successfully checked in!",
      });
      fetchDashboardData(); // Re-fetch data to update UI
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handlePurchaseSubscription = async () => {
    if (!selectedPlan || !token) return;

    setIsPurchasing(true);
    try {
      const response = await fetch("/api/member/purchase-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Purchase failed");
      }

      toast({
        title: "Success!",
        description: `Successfully purchased ${getSelectedPlanName()}! Your tokens have been updated.`,
      });

      // Reset selection and refresh data
      setSelectedPlan("");
      fetchDashboardData();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const getSelectedPlanName = () => {
    const plan = subscriptionPlans.find((p) => p.id === selectedPlan);
    return plan ? plan.name : "";
  };

  // Calculate subscription progress
  const calculateSubscriptionProgress = () => {
    if (!memberData?.subscription || !visitHistory)
      return { used: 0, total: 0, percentage: 0 };

    const plan = subscriptionPlans.find(
      (p) => p.id === memberData.subscription.plan
    );
    if (!plan) return { used: 0, total: 0, percentage: 0 };

    // Calculate tokens used since subscription start date
    const subscriptionStart = new Date(memberData.subscription.startDate);
    const tokensUsedInCurrentPeriod = visitHistory.filter(
      (visit) => new Date(visit.date) >= subscriptionStart
    ).length; // Each visit uses 1 token

    const planTokens = plan.tokens;
    const percentage = Math.round(
      (tokensUsedInCurrentPeriod / planTokens) * 100
    );

    return {
      used: tokensUsedInCurrentPeriod,
      total: planTokens,
      percentage: Math.min(percentage, 100), // Cap at 100%
    };
  };

  // Calculate visit streak
  const calculateStreak = () => {
    if (!visitHistory || visitHistory.length === 0) return 0;

    const sortedVisits = [...visitHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const visit of sortedVisits) {
      const visitDate = new Date(visit.date);
      visitDate.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor(
        (currentDate.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === streak || (streak === 0 && dayDiff <= 1)) {
        streak++;
        currentDate = new Date(visitDate);
      } else {
        break;
      }
    }

    return streak;
  };

  const subscriptionProgress = calculateSubscriptionProgress();
  const visitStreak = calculateStreak();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Member Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">FitFlow</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Token Balance & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Tokens
              </CardTitle>
              <Coins className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {memberData?.tokens}
              </div>
              <p className="text-xs text-muted-foreground">
                Renews on{" "}
                {new Date(
                  memberData?.subscription.endDate || ""
                ).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitStats?.thisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Gym visits completed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {visitStreak} days
              </div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="checkin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checkin">Check In</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Check-in Card */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Quick Check-in
                  </CardTitle>
                  <CardDescription>
                    Enter a gym code or select from your recent visits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gym-code">Gym Code</Label>
                    <Input
                      id="gym-code"
                      placeholder="Enter 6-digit gym code"
                      value={gymCode}
                      onChange={(e) => setGymCode(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleCheckIn(gymCode)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Check In ({memberData?.tokens} tokens available)
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Gyms */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Gyms</CardTitle>
                  <CardDescription>
                    Quick access to your favorite spots
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentGyms.map((gym) => (
                    <div
                      key={gym._id}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{gym.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {gym.location.address}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckIn(gym._id)}
                      >
                        Check In
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  {memberData?.subscription.plan} - Active until{" "}
                  {new Date(
                    memberData?.subscription.endDate || ""
                  ).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tokens Used</span>
                    <span className="font-medium">
                      {subscriptionProgress.used} / {subscriptionProgress.total}
                    </span>
                  </div>
                  <Progress
                    value={subscriptionProgress.percentage}
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {subscriptionProgress.percentage}% of your{" "}
                    {memberData?.subscription.plan} tokens used.
                    {subscriptionProgress.percentage < 50
                      ? " Great start!"
                      : subscriptionProgress.percentage < 80
                      ? " Great progress!"
                      : " Almost done!"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Renew or Upgrade</CardTitle>
                <CardDescription>
                  Choose your next subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-accent">
                          Popular
                        </Badge>
                      )}
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <div className="text-2xl font-bold">${plan.price}</div>
                        <p className="text-sm text-muted-foreground">
                          {plan.tokens} tokens
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedPlan && (
                  <Button
                    className="w-full mt-4 bg-accent hover:bg-accent/90"
                    onClick={handlePurchaseSubscription}
                    disabled={isPurchasing}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isPurchasing ? "Processing..." : "Complete Payment"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Visit History</CardTitle>
                <CardDescription>Your recent gym check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visitHistory.map((visit, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{visit.gym.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(visit.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(visit.checkInTime).toLocaleTimeString()}
                        </p>
                        <Badge variant="outline">1 token</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberDashboard;
