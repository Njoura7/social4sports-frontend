
import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sport, setSport] = useState("pingpong");
  const [skillLevel, setSkillLevel] = useState("");
  const [avatar, setAvatar] = useState("avatar1.png");

  const avatarOptions = [
    { value: "1.png", label: "Avatar 1" },
    { value: "2.png", label: "Avatar 2" },
    { value: "3.png", label: "Avatar 3" },
    { value: "4.png", label: "Avatar 4" },
    { value: "5.png", label: "Avatar 5" },
    { value: "6.png", label: "Avatar 6" },
    { value: "7.png", label: "Avatar 7" },
    { value: "8.png", label: "Avatar 8" },
    { value: "9.png", label: "Avatar 9" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please ensure both passwords match",
      });
      return;
    }

    // In a real app, this would call a registration API
    toast.success("Registration successful", {
      description: "Welcome to Social4Sports!",
    });

    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSkillLevel("");
  };

  return (
    <PageLayout showMobileNav={false}>
      <div className="max-w-md mx-auto pt-10 animate-fade-in">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Join the Social4Sports community today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="mb-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full p-0 h-24 w-24">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={`/${avatar}`} alt="Profile picture" />
                          <AvatarFallback>{name.charAt(0) || "Avatar"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuLabel>Select Avatar</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="grid grid-cols-3 gap-2 p-2">
                        {avatarOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            className="p-1 cursor-pointer"
                            onClick={() => setAvatar(option.value)}
                          >
                            <Avatar>
                              <AvatarImage src={`/${option.value}`} alt={option.label} />
                              <AvatarFallback>{option.label.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground">Click to select avatar</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sport" className="text-sm font-medium">
                  Primary Sport
                </label>
                <Select defaultValue={sport} onValueChange={setSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pingpong">Ping Pong</SelectItem>
                    <SelectItem value="tennis" disabled>Tennis (Coming Soon)</SelectItem>
                    <SelectItem value="badminton" disabled>Badminton (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="skillLevel" className="text-sm font-medium">
                  Skill Level
                </label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-sport-blue hover:bg-sport-blue/90">
                Sign Up
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-sport-blue hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Register;
