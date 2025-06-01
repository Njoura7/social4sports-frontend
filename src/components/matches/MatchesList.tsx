import { Card, CardContent } from "@/components/ui/card";
import { MatchCard } from "./MatchCard"
import { Button } from "@/components/ui/button";
import { Match } from "@/types/match";

interface MatchesListProps {
  matches: Match[];
  currentUserId: string;
  loading?: boolean;
  onReschedule?: (matchId: string) => void;
  onCancel?: (matchId: string) => void;
  onConfirm?: (matchId: string) => void;
  onResultRecorded?: (matchId: string, updatedMatch?: Match) => void;
  onScheduleClick?: () => void;
}

export const MatchesList = ({
  matches,
  currentUserId,
  loading,
  onReschedule,
  onCancel,
  onConfirm,
  onResultRecorded,
  onScheduleClick
}: MatchesListProps) => {
  console.log("MatchesList", matches);
  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading matches...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-600">No matches found</p>
          <Button
            className="mt-4 bg-sport-blue hover:bg-sport-blue/90"
            onClick={onScheduleClick}
          >
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
          onConfirm={onConfirm}
          onResultRecorded={onResultRecorded}
        />
      ))}
    </div>
  );
};