import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-sport-blue">
          Social<span className="text-sport-green">4</span>Sports
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        {isAuthenticated ? (
          <>
            <Link to="/find" className="text-gray-700 hover:text-sport-blue transition-colors">
              Find Players
            </Link>
            <Link to="/matches" className="text-gray-700 hover:text-sport-blue transition-colors">
              Matches
            </Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-sport-blue transition-colors">
              Leaderboard
            </Link>
          </>
        ) : null}
      </div>

      <div className="flex items-center space-x-3">
        {isAuthenticated && user ? (
          <>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5 text-gray-700" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/messages">
                <MessageSquare className="h-5 w-5 text-gray-700" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || "/avatar-placeholder.png"} alt="User avatar" />
                    <AvatarFallback>
                      {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;