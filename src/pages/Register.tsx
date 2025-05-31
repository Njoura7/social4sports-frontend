/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { PointLocation } from "@/hooks/useGeolocation";

const avatars = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png"];

export default function Register() {
  const { location, error: locationError, loading: locationLoading, getLocation } = useGeolocation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "pro">("beginner");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const BACKUP_LOCATION: PointLocation = {
    type: 'Point',
    coordinates: [19, 47.5],
  };

  // Automatically prompt for location on mount
  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location) {
      console.log('📍 Location fetched:', location);
    }
  }, [location]);

  useEffect(() => {
    if (locationError) {
      console.warn('❌ Location error:', locationError);
    }
  }, [locationError]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Log the location object and coordinates
      let usedLocation = location;
      if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        usedLocation = BACKUP_LOCATION;
        console.warn('⚠️ No geolocation available, using backup location:', BACKUP_LOCATION);
      } else {
        console.log('🌍 Using geolocation coordinates:', location.coordinates);
      }
      const payload: any = {
        fullName,
        email,
        password,
        avatar,
        skillLevel,
        location: usedLocation,
      };
      console.log('📝 Registering user with data:', payload);
      await register(payload);

      toast.success("Registered successfully!");
      navigate("/login");
      // Optionally redirect or login
    } catch (err: any) {
      if (err?.message?.includes("Email already in use")) {
        toast.error("This email is already registered.", {
          description: "Please use another email or log in instead.",
          action: {
            label: "Go to Login",
            onClick: () => navigate("/login"),
          },
        });
      } else {
        toast.error("Registration failed.", {
          description: err?.message || "An unexpected error occurred. Please try again.",
        });
      }
      console.error('❌ Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Register</CardTitle>
            <CardDescription className="text-center">
              Create your account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2 mb-2">
              <Button
                type="button"
                variant="outline"
                onClick={getLocation}
                disabled={locationLoading}
                className="w-full"
              >
                {locationLoading ? "Getting Location..." : "Get Location"}
              </Button>
              {location && (
                <p className="text-xs text-green-600 text-center mt-1">
                  Location: [{location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}]<br />
                  <span className="text-xs">Raw coordinates: {JSON.stringify(location.coordinates)}</span>
                </p>
              )}
              {!location && (
                <p className="text-xs text-yellow-600 text-center mt-1">
                  Using backup location: [47.5, 19]<br />
                  <span className="text-xs">Raw coordinates: [19, 47.5]</span>
                </p>
              )}
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Choose Avatar
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={`${avatar}`} />
                          <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                        <span>{avatar}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Avatar</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {avatars.map((img) => (
                      <DropdownMenuItem
                        key={img}
                        onClick={() => setAvatar(img)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={`${img}`} />
                            <AvatarFallback>AV</AvatarFallback>
                          </Avatar>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Skill Level
                </label>
                <Select
                  value={skillLevel}
                  onValueChange={value =>
                    setSkillLevel(value as "beginner" | "intermediate" | "pro")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
