
import PageLayout from "@/components/layout/PageLayout";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { playerService } from "@/services/playerService";
import { User } from "@/services/userService";
import { toast } from "sonner";


const FindPlayers = () => {
  const [skillLevel, setSkillLevel] = useState("any");
  const [radius, setRadius] = useState("10000");
  const [foundPlayers, setFoundPlayers] = useState<User[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchParams, setSearchParams] = useState<{
    latitude: number;
    longitude: number;
    skillLevel?: string;
    radius?: number;
  } | null>(null);



  // Get user location
  const getLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => reject(new Error("Could not retrieve location"))
      );
    });
  };

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      try {
        const location = await getLocation();
        setUserLocation(location);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Location error");
      }
    };

    initialize();
  }, []);

  // Update search params when filters change
  useEffect(() => {
    if (!userLocation) return;

    setSearchParams({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      skillLevel: skillLevel === 'any' ? undefined : skillLevel,
      radius: radius ? parseInt(radius, 10) : undefined
    });
  }, [userLocation, skillLevel, radius]);

  // Execute search with debounce
  useEffect(() => {
    if (!searchParams) return;

    const searchPlayers = async () => {
      try {
        const players = await playerService.findPlayers(searchParams);
        setFoundPlayers(players);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Search failed");
      }
    };

    const debounceTimer = setTimeout(searchPlayers, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchParams]);

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

        {!foundPlayers && <p className="text-center py-4">Loading players data...</p>}

        <div className="space-y-4">
          {foundPlayers.length > 0 ? (
            foundPlayers.map((player) => (
              <Card key={player._id} className="hover:shadow-md transition-shadow">
                <Link to={`/users/${player._id}`}>
                  <CardContent className="p-4 flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={player.avatar} alt={player.fullName} />
                      <AvatarFallback>
                        {player.fullName.charAt(0)}
                        {player.fullName.split(" ")[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{player.fullName}</h3>
                      </div>
                      <Badge
                        className="mt-2"
                        variant={
                          player.skillLevel === "pro" ? "default" :
                            player.skillLevel === "intermediate" ? "secondary" :
                              "outline"
                        }
                      >
                        {player.skillLevel}
                      </Badge>
                    </div>

                  </CardContent>
                </Link>
              </Card>
            ))
          ) : (
            !foundPlayers && userLocation && (
              <p className="text-center text-gray-500 py-8">
                No players found matching your criteria.
              </p>
            )
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default FindPlayers;