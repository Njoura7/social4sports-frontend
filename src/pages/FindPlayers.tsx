import { useState } from "react";
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

const FindPlayers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [distance, setDistance] = useState("");
  const [availability, setAvailability] = useState("");

  const players = [
    {
      id: 1,
      name: "Alex Johnson",
      skillLevel: "Intermediate",
      distance: "2.3 miles",
      availability: "Evenings, Weekends",
      matchesPlayed: 24,
      winRate: "67%",
    },
    {
      id: 2,
      name: "Sarah Williams",
      skillLevel: "Advanced",
      distance: "4.1 miles",
      availability: "Weekends",
      matchesPlayed: 47,
      winRate: "72%",
    },
    {
      id: 3,
      name: "Michael Chen",
      skillLevel: "Beginner",
      distance: "1.8 miles",
      availability: "Mornings, Weekends",
      matchesPlayed: 12,
      winRate: "50%",
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      skillLevel: "Intermediate",
      distance: "3.5 miles",
      availability: "Evenings",
      matchesPlayed: 31,
      winRate: "58%",
    },
  ];

  // Filter players based on selected skill level
  const filteredPlayers = skillLevel
    ? players.filter(player => 
        player.skillLevel.toLowerCase() === skillLevel.toLowerCase()
      )
    : players;

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
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={distance} onValueChange={setDistance}>
              <SelectTrigger>
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Within 1 mile</SelectItem>
                <SelectItem value="5">Within 5 miles</SelectItem>
                <SelectItem value="10">Within 10 miles</SelectItem>
                <SelectItem value="25">Within 25 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPlayers.map((player) => (
            <Card key={player.id} className="sport-card">
              <CardContent className="p-4 flex items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/avatar-${player.id}.png`} alt={player.name} />
                  <AvatarFallback>{player.name.charAt(0)}{player.name.split(" ")[1]?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{player.name}</h3>
                    <Badge variant={player.skillLevel === "Advanced" ? "default" : 
                               player.skillLevel === "Intermediate" ? "secondary" : 
                               "outline"}>
                      {player.skillLevel}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>{player.distance} away • Available: {player.availability}</p>
                    <p className="mt-1">{player.matchesPlayed} matches • {player.winRate} win rate</p>
                  </div>
                </div>
                <Button className="ml-4 bg-sport-blue hover:bg-sport-blue/90">Connect</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default FindPlayers;