/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, refreshUserById } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let loadingToastId;
    try {
      loadingToastId = toast.loading("Logging in...");
      console.log("🔑 Attempting login with:", { email, password });
      const loginResult = await userService.login({ email, password });
      const { accessToken } = loginResult;
      localStorage.setItem("authToken", accessToken);
      console.log("✅ Login API response (accessToken):", accessToken);

      // Decode the accessToken to get the user ID
      const decoded: any = jwtDecode(accessToken);
      const userId = decoded.id;
      console.log("🆔 Decoded user ID from accessToken:", userId);

      // Fetch the user by ID
      const userById = await userService.getUserById(userId);
      console.log("✅ User fetched by ID:", userById);
      await refreshUserById(userById._id);

      toast.success("Login successful", {
        description: `Welcome back!`,
      });
      navigate("/profile");
    } catch (error: any) {
      toast.error("Login failed", {
        description: error?.response?.data?.message || error?.message || "Invalid credentials.",
      });
      console.table("❌ Login error:", error);
    } finally {
      setIsLoading(false);
      if (loadingToastId) toast.dismiss(loadingToastId);
    }
  };

  return (
    <PageLayout showMobileNav={false}>
      <div className="max-w-md mx-auto pt-10 animate-fade-in">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Social4Sports account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-sport-blue hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-sport-blue hover:bg-sport-blue/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-sport-blue hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Login;