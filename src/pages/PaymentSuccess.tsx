import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Coins, Calendar, Download, ArrowRight, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(10);

  // Mock payment data - in real app this would come from URL params or API
  const paymentData = {
    plan: "Monthly Pass",
    amount: 99.99,
    tokens: 30,
    transactionId: "TXN-" + Math.random().toString(36).substr(2, 9),
    memberName: "Alex Johnson",
    renewalDate: "2024-02-15"
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/member-dashboard";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 text-primary">
            <Dumbbell className="h-6 w-6" />
            <span className="text-xl font-bold">FitFlow</span>
          </div>
        </div>

        {/* Success Card */}
        <Card className="shadow-elegant text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl text-success">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Welcome to FitFlow, {paymentData.memberName}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-gradient-card p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold">Subscription Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Plan</p>
                  <p className="font-medium">{paymentData.plan}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount Paid</p>
                  <p className="font-medium">${paymentData.amount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tokens Added</p>
                  <p className="font-medium flex items-center gap-1">
                    <Coins className="h-4 w-4 text-accent" />
                    {paymentData.tokens}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Renewal</p>
                  <p className="font-medium">{paymentData.renewalDate}</p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <Badge variant="outline" className="font-mono">{paymentData.transactionId}</Badge>
              </div>
            </div>

            {/* What's Next */}
            <div className="text-left space-y-4">
              <h3 className="text-lg font-semibold text-center">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Your tokens are ready</p>
                    <p className="text-sm text-muted-foreground">
                      {paymentData.tokens} tokens have been added to your account
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Find a gym near you</p>
                    <p className="text-sm text-muted-foreground">
                      Use your dashboard to locate and check into partner gyms
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Start your fitness journey</p>
                    <p className="text-sm text-muted-foreground">
                      One token gives you unlimited access to a gym for the entire day
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" asChild>
                  <Link to="/member-dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Redirecting to dashboard in {countdown} seconds...</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <h4 className="font-medium text-accent mb-2">Welcome to the FitFlow Community!</h4>
              <p className="text-sm">
                You now have access to our network of partner gyms. Check your email for 
                a welcome guide with tips on getting the most out of your membership.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Questions? Contact our support team at support@fitflow.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;