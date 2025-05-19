import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { userService, User } from "@/services/userService";
import { matchService } from "@/services/matchService";
import { useAuth } from "@/contexts/AuthContext";
import { ScheduleMatchDialog } from "@/components/matches/ScheduleMatchDialog";
import { MatchesList } from "@/components/matches/MatchesList";
import { Match } from "@/types/match";

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
  const [pastMatches, setPastMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState({
    upcoming: false,
    past: false
  });
  const { user: currentUser } = useAuth();

  const fetchUpcomingMatches = async () => {
    setLoadingMatches(prev => ({ ...prev, upcoming: true }));
    try {
      const matches = await matchService.getUpcomingMatches();
      setUpcomingMatches(matches);
    } catch (error) {
      toast.error("Failed to load upcoming matches");
      console.error(error);
    } finally {
      setLoadingMatches(prev => ({ ...prev, upcoming: false }));
    }
  };

  const fetchPastMatches = async () => {
    setLoadingMatches(prev => ({ ...prev, past: true }));
    try {
      const matches = await matchService.getPastMatches();
      setPastMatches(matches);
    } catch (error) {
      toast.error("Failed to load past matches");
      console.error(error);
    } finally {
      setLoadingMatches(prev => ({ ...prev, past: false }));
    }
  };



  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  useEffect(() => {
    if (tab === "past" && pastMatches.length === 0) {
      fetchPastMatches();
    }
  }, [tab]);

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
      fetchUpcomingMatches();
    } catch (error) {
      toast.error("Failed to schedule match");
      console.error(error);
    }
  };

  const handleConfirmMatch = async (matchId: string) => {
    try {
      const currentMatch = upcomingMatches.find(m => m._id === matchId);
      if (!currentMatch) {
        throw new Error('Match not found in current state');
      }

      const updatedMatch = await matchService.confirmMatch(matchId);

      // Merge with existing player data
      const mergedMatch = {
        ...updatedMatch,
        initiator: currentMatch.initiator,
        opponent: currentMatch.opponent
      };

      setUpcomingMatches(prev =>
        prev.map(m => m._id === matchId ? mergedMatch : m)
      );
      toast.success('Match confirmed!');
    } catch (error) {
      console.error('Confirmation failed:', error);
      if (error.message.includes('not found') || error.message.includes('not allowed')) {
        // If the match is not found or not allowed, refresh the matches list
        await fetchUpcomingMatches();
        toast.error('Match status has changed. Please try again.');
      } else {
        toast.error(error.message || 'Failed to confirm match');
      }
    }
  };

  const handleResultRecorded = async (matchId: string, updatedMatch?: Match) => {
    try {
      if (updatedMatch) {
        const currentMatch = upcomingMatches.find(m => m._id === matchId);
        if (!currentMatch) {
          throw new Error('Match not found in current state');
        }

        const mergedMatch = {
          ...updatedMatch,
          initiator: currentMatch.initiator,
          opponent: currentMatch.opponent
        };

        setUpcomingMatches(prev => prev.filter(m => m._id !== matchId));
        setPastMatches(prev => [...prev, mergedMatch]);
      }
      // Always refresh both lists to ensure consistency
      await Promise.all([fetchUpcomingMatches(), fetchPastMatches()]);
    } catch (error) {
      console.error('Failed to update match result:', error);
      toast.error('Failed to update match result. Please try again.');
      // Refresh both lists to ensure consistency
      await Promise.all([fetchUpcomingMatches(), fetchPastMatches()]);
    }
  };
  const handleCancelMatch = async (matchId: string) => {
    try {
      await matchService.cancelMatch(matchId);
      toast.success("Match cancelled");
      fetchUpcomingMatches();
    } catch (error) {
      toast.error("Failed to cancel match");
      console.error(error);
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
              loading={loadingMatches.upcoming}
              onReschedule={() => toast.info("Reschedule feature coming soon")}
              onCancel={handleCancelMatch}
              onConfirm={handleConfirmMatch}
              onResultRecorded={handleResultRecorded}
              onScheduleClick={() => setShowModal(true)}
            />
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <MatchesList
              matches={pastMatches}
              currentUserId={currentUser?._id}
              loading={loadingMatches.past}
              onReschedule={() => toast.info("Reschedule feature coming soon")}
              onCancel={handleCancelMatch}
              onConfirm={handleResultRecorded}
              onResultRecorded={handleResultRecorded}
              onScheduleClick={() => setShowModal(true)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Matches;