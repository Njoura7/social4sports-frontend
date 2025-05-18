import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import type { User } from "@/services/userService";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const BACKUP_LOCATION = {
  type: 'Point',
  coordinates: [19, 47.5],
};

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'pro', label: 'Pro' },
];

const Matches = () => {
  const [tab, setTab] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [location, setLocation] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [opponentQuery, setOpponentQuery] = useState("");
  const [playerOptions, setPlayerOptions] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [allNearbyPlayers, setAllNearbyPlayers] = useState<User[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('beginner');

  const { user: currentUser } = useAuth();

  const upcomingMatches = [
    {
      id: 1,
      opponent: {
        id: 1,
        name: "Alex Johnson",
      },
      location: "Community Center",
      date: "Thursday, Oct 20",
      time: "7:00 PM",
      confirmed: true,
    },
    {
      id: 2,
      opponent: {
        id: 3,
        name: "Michael Chen",
      },
      location: "Recreation Park",
      date: "Saturday, Oct 22",
      time: "10:00 AM",
      confirmed: false,
    },
  ];

  const pastMatches = [
    {
      id: 3,
      opponent: {
        id: 2,
        name: "Sarah Williams",
      },
      location: "Community Center",
      date: "October 15, 2023",
      result: "Win",
      score: "11-7, 8-11, 11-6, 11-9",
    },
    {
      id: 4,
      opponent: {
        id: 4,
        name: "Emma Rodriguez",
      },
      location: "Recreation Park",
      date: "October 8, 2023",
      result: "Loss",
      score: "7-11, 11-8, 5-11, 9-11",
    },
    {
      id: 5,
      opponent: {
        id: 1,
        name: "Alex Johnson",
      },
      location: "Community Center",
      date: "October 1, 2023",
      result: "Win",
      score: "11-9, 11-7, 11-6",
    },
  ];

  // Fetch players when skill level changes or modal opens
  useEffect(() => {
    if (!showModal || !selectedSkill) return;
    setSearching(true);
    const [lng, lat] = BACKUP_LOCATION.coordinates;
    userService.searchPlayers({ skillLevel: selectedSkill, lat, lng, radius: 10000 })
      .then(players => setAllNearbyPlayers(players))
      .finally(() => setSearching(false));
  }, [showModal, selectedSkill]);

  // Filter players as the user types
  const filteredPlayers = opponentQuery
    ? allNearbyPlayers.filter(p =>
        p.fullName.toLowerCase().includes(opponentQuery.toLowerCase())
      )
    : allNearbyPlayers;

  const handleScheduleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!opponent) {
        toast.error("Please select an opponent from the list.");
        setIsSubmitting(false);
        return;
      }
      // Find the selected player's user ID
      const selectedPlayer = allNearbyPlayers.find(p => p._id === opponent);
      const opponentId = selectedPlayer ? selectedPlayer._id : "";
      const matchData = { opponent: opponentId, location, scheduledFor };
      console.log("📅 Scheduling match:", matchData);
      await api.post("/matches", matchData);
      toast.success("Match scheduled!");
      setShowModal(false);
      setOpponent("");
      setLocation("");
      setScheduledFor("");
      setOpponentQuery("");
    } catch (err: any) {
      toast.error("Failed to schedule match", { description: err?.message || "An error occurred." });
      console.error("❌ Schedule match error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Matches</h1>
          <Button className="bg-sport-blue hover:bg-sport-blue/90" onClick={() => setShowModal(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Match
          </Button>
        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a New Match</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleScheduleMatch} className="space-y-4">
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-full mb-2">
                  <SelectValue placeholder="Select Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={opponent} onValueChange={setOpponent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={searching ? "Searching..." : "Select Opponent"} />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1">
                    <Input
                      placeholder="Type to search..."
                      value={opponentQuery}
                      onChange={e => setOpponentQuery(e.target.value)}
                      disabled={isSubmitting}
                      className="mb-2"
                    />
                  </div>
                  {filteredPlayers.length === 0 && !searching && (
                    <div className="px-2 py-1 text-muted-foreground text-xs">No players found.</div>
                  )}
                  {filteredPlayers.map((player) => (
                    <SelectItem key={player._id} value={player._id}>
                      {player.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Input
                type="datetime-local"
                placeholder="Scheduled For"
                value={scheduledFor}
                onChange={e => setScheduledFor(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Scheduling..." : "Schedule Match"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="w-full mt-2" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="upcoming" value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="upcoming" className="flex-1">Upcoming Matches</TabsTrigger>
            <TabsTrigger value="past" className="flex-1">Match History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match) => (
                <Card key={match.id} className="sport-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/avatar-${match.opponent.id}.png`} alt={match.opponent.name} />
                          <AvatarFallback>
                            {match.opponent.name.charAt(0)}
                            {match.opponent.name.split(" ")[1]?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <h3 className="font-medium">{match.opponent.name}</h3>
                          <p className="text-sm text-gray-600">{match.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{match.date}</p>
                        <p className="text-sm text-gray-600">{match.time}</p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      {match.confirmed ? (
                        <Badge className="bg-green-500">Confirmed</Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-500 border-amber-500">
                          Awaiting Confirmation
                        </Badge>
                      )}
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-600">No upcoming matches scheduled.</p>
                  <Button className="mt-4 bg-sport-blue hover:bg-sport-blue/90">
                    Schedule a Match
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastMatches.map((match) => (
              <Card key={match.id} className="sport-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/avatar-${match.opponent.id}.png`} alt={match.opponent.name} />
                        <AvatarFallback>
                          {match.opponent.name.charAt(0)}
                          {match.opponent.name.split(" ")[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="font-medium">{match.opponent.name}</h3>
                        <p className="text-sm text-gray-600">{match.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={match.result === "Win" ? "default" : "destructive"}>
                        {match.result}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{match.date}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm">
                      <span className="font-medium">Score:</span> {match.score}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Matches;
