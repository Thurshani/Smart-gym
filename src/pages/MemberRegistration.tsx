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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Dumbbell,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const MemberRegistration = () => {
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone
        );
      case 2:
        return (
          formData.dateOfBirth &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword
        );
      case 3:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault(); // Prevent default form submission
    }

    if (!validateStep(3)) {
      toast({
        title: "Validation Error",
        description: "You must agree to the terms to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/register-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast({
        title: "Registration Successful!",
        description:
          "Your account has been created. Redirecting to your dashboard...",
      });

      // Automatically log the user in with the returned token and user data
      login(data.data);
    } catch (error) {
      toast({
        title: "Registration Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const progressPercentage = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80"
          >
            <Dumbbell className="h-6 w-6" />
            <span className="text-xl font-bold">FitFlow</span>
          </Link>
          <h1 className="text-3xl font-bold">Join FitFlow</h1>
          <p className="text-muted-foreground">
            Create your account and start your fitness journey
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span
                  className={
                    step >= 1
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }
                >
                  Personal Info
                </span>
                <span
                  className={
                    step >= 2
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }
                >
                  Account Setup
                </span>
                <span
                  className={
                    step >= 3
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }
                >
                  Terms & Finish
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-center text-sm text-muted-foreground">
                Step {step} of 3
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {step === 1 && <User className="h-5 w-5 text-primary" />}
              {step === 2 && <Lock className="h-5 w-5 text-primary" />}
              {step === 3 && <Calendar className="h-5 w-5 text-primary" />}
              {step === 1 && "Personal Information"}
              {step === 2 && "Account Security"}
              {step === 3 && "Terms & Conditions"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Secure your account"}
              {step === 3 && "Review and complete registration"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="your.email@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Account Security */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Create a strong password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm your password"
                    />
                    {formData.password &&
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-destructive">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Password Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                      <li>• Include at least one special character</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 3: Terms & Conditions */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-secondary/50 p-6 rounded-lg max-h-48 overflow-y-auto">
                    <h4 className="font-semibold mb-3">
                      Terms of Service & Privacy Policy
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        By creating an account with FitFlow, you agree to our
                        terms of service and privacy policy.
                      </p>
                      <p>
                        <strong>Token System:</strong> You understand that gym
                        visits are tracked using a token-based system where 1
                        token = unlimited visits to one gym per day.
                      </p>
                      <p>
                        <strong>Subscription:</strong> Your subscription will
                        auto-renew unless cancelled. You can manage your
                        subscription from your dashboard.
                      </p>
                      <p>
                        <strong>Privacy:</strong> We collect and process your
                        data according to our privacy policy. Your personal
                        information is secure and never shared with third
                        parties.
                      </p>
                      <p>
                        <strong>Gym Access:</strong> Access to partner gyms is
                        subject to individual gym policies and availability.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeToTerms", checked)
                        }
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="subscribeNewsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) =>
                          handleInputChange("subscribeNewsletter", checked)
                        }
                      />
                      <Label htmlFor="subscribeNewsletter" className="text-sm">
                        Send me fitness tips and updates (optional)
                      </Label>
                    </div>
                  </div>

                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                    <h4 className="font-medium text-accent mb-2">
                      Welcome to FitFlow!
                    </h4>
                    <p className="text-sm">
                      You're about to join thousands of members who use FitFlow
                      to access gyms across the city. After registration, you'll
                      choose your subscription plan and can start visiting gyms
                      immediately.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {step < 3 && (
                  <Button type="button" onClick={handleNext}>
                    Next & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {step === 3 && (
                  <Button type="submit">
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberRegistration;
