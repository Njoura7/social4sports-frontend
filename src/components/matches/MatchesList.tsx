import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Match } from "@/types/match";
import { MatchCard } from "./MatchCard";

interface MatchesListProps {
  matches: Match[];
  currentUserId?: string;
  loading: boolean;
  error?: Error;
  onReschedule: (matchId: string) => void;
  onCancel: (matchId: string) => void;
  onScheduleClick: () => void;
}

export const MatchesList = ({
  matches,
  currentUserId,
  loading,
  error,
  onReschedule,
  onCancel,
  onScheduleClick
}: MatchesListProps) => {
  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading matches...
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-500">Error loading matches</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-600">No matches found</p>
          <Button className="mt-4 bg-sport-blue hover:bg-sport-blue/90" onClick={onScheduleClick}>
            Schedule a Match
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard
          key={match._id}
          match={match}
          currentUserId={currentUserId}
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};