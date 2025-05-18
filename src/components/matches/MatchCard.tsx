import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Match, UserRef } from "@/types/match";

interface MatchCardProps {
  match: Match;
  currentUserId?: string;
  onReschedule: (matchId: string) => void;
  onCancel: (matchId: string) => void;
  onConfirm: (matchId: string) => void;
}

const getInitials = (name?: string) => {
  if (!name) return '??';
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getPlayerName = (player: UserRef, currentUserId?: string) => {
  if (player._id === currentUserId) return 'You';
  return player.fullName || player.email?.split('@')[0] || 'Opponent';
};

export const MatchCard = ({ 
  match, 
  currentUserId, 
  onReschedule, 
  onCancel,
  onConfirm
}: MatchCardProps) => {
  const isOpponent = currentUserId === match.opponent._id;
  const isInitiator = currentUserId === match.initiator._id;
  const showConfirmButton = isOpponent && match.status === "AwaitingConfirmation";
  const showCancelButton = (isInitiator || isOpponent) && 
                         match.status !== "Completed" && 
                         match.status !== "Cancelled";

  const initiatorName = getPlayerName(match.initiator, currentUserId);
  const opponentName = getPlayerName(match.opponent, currentUserId);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              <Avatar className="h-10 w-10 border-2 border-white">
                {match.initiator.avatar && (
                  <AvatarImage src={`/avatars/${match.initiator.avatar}`} />
                )}
                <AvatarFallback>
                  {getInitials(match.initiator.fullName || match.initiator.email)}
                </AvatarFallback>
              </Avatar>
              <Avatar className="h-10 w-10 border-2 border-white">
                {match.opponent.avatar && (
                  <AvatarImage src={`/avatars/${match.opponent.avatar}`} />
                )}
                <AvatarFallback>
                  {getInitials(match.opponent.fullName || match.opponent.email)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h3 className="font-medium flex items-center">
                <span className={isInitiator ? "font-bold" : ""}>
                  {initiatorName}
                </span>
                <span className="mx-2 text-gray-400">vs</span>
                <span className={isOpponent ? "font-bold" : ""}>
                  {opponentName}
                </span>
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm text-gray-600">
                  {match.location || "Location not specified"}
                </p>
                {match.initiator.skillLevel && match.opponent.skillLevel && (
                  <span className="text-xs text-gray-400">• {match.initiator.skillLevel} vs {match.opponent.skillLevel}</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="font-medium">
              {new Date(match.scheduledFor).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(match.scheduledFor).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <Badge
            className={
              match.status === "Confirmed" ? "bg-green-100 text-green-800" :
              match.status === "Completed" ? "bg-blue-100 text-blue-800" :
              match.status === "Cancelled" ? "bg-gray-100 text-gray-800" :
              "bg-amber-100 text-amber-800"
            }
            variant="outline"
          >
            {match.status.replace(/([A-Z])/g, ' $1').trim()}
          </Badge>
          
          <div className="space-x-2">
            {showConfirmButton && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => onConfirm(match._id)}
              >
                Confirm Match
              </Button>
            )}
            {showCancelButton && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => onCancel(match._id)}
              >
                {isInitiator ? "Cancel Match" : "Decline"}
              </Button>
            )}
            {match.status === "Completed" && match.score && (
              <Badge variant="secondary">
                Score: {match.score.join("-")}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};