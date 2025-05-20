import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { playerService } from "@/services/playerService";
import { User } from "@/services/userService"; // Assuming User type is exported from userService

const FindPlayers = () => {
  const [skillLevel, setSkillLevel] = useState("");
  const [radius, setRadius] = useState("10000"); // Default radius 10km
  const [foundPlayers, setFoundPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for user's current location
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Effect to get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        (err) => {
          console.error("Error getting user location:", err);
          setError("Could not retrieve your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleSearch = async () => {
    if (!userLocation) {
      setError("Please wait while we get your location.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await playerService.findPlayers({
        skillLevel: skillLevel === 'any' ? undefined : skillLevel,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: radius ? parseInt(radius, 10) : undefined,
      });
      setFoundPlayers(response);
    } catch (err) {
      console.error("Error searching for players:", err);
      setError("Failed to search for players. Please try again.");
    }
    setLoading(false);
  };

  // Trigger search automatically once location is available or filters change
  useEffect(() => {
    if (userLocation) {
      handleSearch();
    }
    // Add skillLevel and radius as dependencies to re-run search when they change
  }, [userLocation, skillLevel, radius]);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Find Players</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Skill Level</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger>
                <SelectValue placeholder="Distance Radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">Within 1 km</SelectItem>
                <SelectItem value="5000">Within 5 km</SelectItem>
                <SelectItem value="10000">Within 10 km</SelectItem>
                <SelectItem value="25000">Within 25 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && <p>Loading players...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {foundPlayers.length > 0 ? (
            foundPlayers.map((player) => (
              <Card key={player._id} className="sport-card">
                <CardContent className="p-4 flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={player.avatar} alt={player.fullName} />
                    <AvatarFallback>{player.fullName.charAt(0)}{player.fullName.split(" ")[1]?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{player.fullName}</h3>
                     
                    </div>
               
                     <Badge className="mt-4" variant={player.skillLevel === "pro" ? "default" :
                                 player.skillLevel === "intermediate" ? "secondary" :
                                 "outline"}>
                        {player.skillLevel}
                      </Badge>

                  </div>
                  <Button className="ml-4 bg-sport-blue hover:bg-sport-blue/90">Connect</Button>
                </CardContent>
              </Card>
            ))
          ) : (
            !loading && !error && userLocation && <p>No players found matching your criteria.</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default FindPlayers;