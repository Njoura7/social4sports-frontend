import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { User } from "@/services/userService";
import { toast } from "sonner";

interface ScheduleMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { opponent: string; location: string; scheduledFor: string }) => Promise<void>;
  allNearbyPlayers: User[];
  searching: boolean;
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
  isSubmitting: boolean;
}

const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "pro", label: "Pro" },
];

export const ScheduleMatchDialog = ({
  open,
  onOpenChange,
  onSubmit,
  allNearbyPlayers,
  searching,
  selectedSkill,
  onSkillChange,
  isSubmitting
}: ScheduleMatchDialogProps) => {
  const [opponent, setOpponent] = useState("");
  const [location, setLocation] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [opponentQuery, setOpponentQuery] = useState("");

  const filteredPlayers = opponentQuery.trim()
    ? allNearbyPlayers.filter((p) =>
        p.fullName.toLowerCase().includes(opponentQuery.trim().toLowerCase())
      )
    : allNearbyPlayers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ opponent, location, scheduledFor });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a New Match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={selectedSkill} onValueChange={onSkillChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Skill Level" />
            </SelectTrigger>
            <SelectContent>
              {skillLevels.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
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
                  onChange={(e) => setOpponentQuery(e.target.value)}
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
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <Input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
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
  );
};