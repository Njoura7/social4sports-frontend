
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Trophy, User, MessageSquare } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-10">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center ${isActive('/') ? 'text-sport-blue' : 'text-gray-500'}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link 
          to="/find" 
          className={`flex flex-col items-center ${isActive('/find') ? 'text-sport-blue' : 'text-gray-500'}`}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Find</span>
        </Link>
        <Link 
          to="/matches" 
          className={`flex flex-col items-center ${isActive('/matches') ? 'text-sport-blue' : 'text-gray-500'}`}
        >
          <Trophy className="h-5 w-5" />
          <span className="text-xs mt-1">Matches</span>
        </Link>
        <Link 
          to="/messages" 
          className={`flex flex-col items-center ${isActive('/messages') ? 'text-sport-blue' : 'text-gray-500'}`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs mt-1">Messages</span>
        </Link>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center ${isActive('/profile') ? 'text-sport-blue' : 'text-gray-500'}`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
