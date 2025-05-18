import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import { matchService } from "@/services/matchService";
import { useAuth } from "@/contexts/AuthContext";
import { ScheduleMatchDialog } from "@/components/matches/ScheduleMatchDialog";
import { MatchesList } from "@/components/matches/MatchesList";
import { Match } from "@/types/match";
import { User } from "@/services/userService";

const BACKUP_LOCATION = {
  type: "Point",
  coordinates: [19, 47.5],
};

export const Matches = () => {
  const [tab, setTab] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [allNearbyPlayers, setAllNearbyPlayers] = useState<User[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("beginner");
  const [searching, setSearching] = useState(false);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const { user: currentUser } = useAuth();

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const matches = await matchService.getUpcomingMatches();
      setUpcomingMatches(matches);
    } catch (error) {
      toast.error("Failed to load matches");
      console.error(error);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (!showModal || !selectedSkill) return;
    setSearching(true);
    const [lng, lat] = BACKUP_LOCATION.coordinates;
    userService
      .searchPlayers({ skillLevel: selectedSkill, lat, lng, radius: 10000 })
      .then(setAllNearbyPlayers)
      .catch(console.error)
      .finally(() => setSearching(false));
  }, [showModal, selectedSkill]);

  const handleScheduleMatch = async (data: { opponent: string; location: string; scheduledFor: string }) => {
    try {
      await matchService.scheduleMatch(data);
      toast.success("Match scheduled successfully!");
      setShowModal(false);
      fetchMatches();
    } catch (error) {
      toast.error("Failed to schedule match");
      console.error(error);
    }
  };

  const handleCancelMatch = async (matchId: string) => {
    try {
      await matchService.cancelMatch(matchId);
      toast.success("Match cancelled");
      fetchMatches();
    } catch (error) {
      toast.error("Failed to cancel match");
      console.error(error);
    }
  };

  const handleRescheduleMatch = (matchId: string) => {
    // Implement reschedule logic
    toast.info("Reschedule feature coming soon");
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

        <ScheduleMatchDialog
          open={showModal}
          onOpenChange={setShowModal}
          onSubmit={handleScheduleMatch}
          allNearbyPlayers={allNearbyPlayers}
          searching={searching}
          selectedSkill={selectedSkill}
          onSkillChange={setSelectedSkill}
          isSubmitting={false}
        />

        <Tabs defaultValue="upcoming" value={tab} onValueChange={setTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="upcoming" className="flex-1">
              Upcoming Matches
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1">
              Match History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <MatchesList
              matches={upcomingMatches}
              currentUserId={currentUser?._id}
              loading={loadingMatches}
              onReschedule={handleRescheduleMatch}
              onCancel={handleCancelMatch}
              onScheduleClick={() => setShowModal(true)}
            />
          </TabsContent>

          <TabsContent value="past">
            <MatchesList
              matches={[]}
              currentUserId={currentUser?._id}
              loading={false}
              onReschedule={handleRescheduleMatch}
              onCancel={handleCancelMatch}
              onScheduleClick={() => setShowModal(true)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Matches;