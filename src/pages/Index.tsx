import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dumbbell,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import gymHero from "@/assets/gym-hero.jpg";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [userType, setUserType] = useState<"member" | "gym" | "admin">(
    "member"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.data);
      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting you to your dashboard...`,
      });
    } catch (error) {
      toast({
        title: "Login Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${gymHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80" />
        </div>

        <div className="relative z-10 container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-white space-y-6 animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Dumbbell className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">FitFlow</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Smart Gym
              <span className="text-accent block">Management</span>
            </h1>
            <p className="text-xl text-white/90 max-w-md">
              Streamline memberships, track visits, and manage your fitness
              community with our token-based system.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span>Token-Based Visits</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span>Secure Management</span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-background/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg animate-fade-in-up">
            <Tabs
              value={userType}
              onValueChange={(value) => setUserType(value as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="member">Member</TabsTrigger>
                <TabsTrigger value="gym">Gym</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              <form onSubmit={handleLogin}>
                <TabsContent value={userType}>
                  <Card className="bg-transparent border-0 shadow-none">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl capitalize">
                        {userType} Login
                      </CardTitle>
                      <CardDescription>
                        Access your {userType} dashboard
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Logging in..." : "Login"}
                      </Button>
                      {userType === "member" && (
                        <p className="text-center text-sm text-muted-foreground">
                          Don't have an account?{" "}
                          <Link
                            to="/register"
                            className="underline text-primary"
                          >
                            Register now
                          </Link>
                        </p>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>
              </form>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How FitFlow Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple token-based system that makes gym management effortless for
              everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>For Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Buy subscription plans, get tokens, and check into any
                  participating gym. One token = unlimited visits per day at one
                  gym.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Dumbbell className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>For Gyms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track member visits with detailed analytics. Export reports
                  and manage your gym profile with ease.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
                <CardTitle>For Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete control over the platform. Manage gyms and members,
                  view global analytics, and oversee operations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Dumbbell className="h-6 w-6" />
            <span className="text-xl font-bold">FitFlow</span>
          </div>
          <p className="text-primary-foreground/80">
            Smart gym management made simple. Built for the modern fitness
            community.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
