import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Match, matchService } from "@/services/matchService";


interface RecordResultDialogProps {
    matchId: string;
    onResultRecorded: (matchId: string, updatedMatch?: Match) => void;
    children: React.ReactNode;
}

export const RecordResultDialog = ({
    matchId,
    onResultRecorded,
    children,
}: RecordResultDialogProps) => {
    const [open, setOpen] = useState(false);
    const [score, setScore] = useState<string[]>([]);
    const [currentSet, setCurrentSet] = useState("");
    const [result, setResult] = useState<"Win" | "Loss">("Win");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddSet = () => {
        if (!/^\d+-\d+$/.test(currentSet)) {
            toast.error("Please enter score in format '11-9'");
            return;
        }

        if (currentSet.trim()) {
            setScore([...score, currentSet]);
            setCurrentSet("");
        }
    };

    const handleSubmit = async () => {
        if (score.length === 0) {
            toast.error("Please add at least one set score");
            return;
        }

        setIsSubmitting(true);
        try {
            // Get the updated match data from the response
            const updatedMatch = await matchService.recordResult({
                matchId,
                score,
                result,
            });

            // Pass both matchId and updatedMatch
            onResultRecorded(matchId, updatedMatch);
            setOpen(false);
            toast.success("Result recorded!");
        } catch (error) {
            toast.error("Failed to record result");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record Match Result</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Set Scores (e.g., "11-9")</Label>
                        <div className="flex gap-2 mt-2">
                            <Input
                                value={currentSet}
                                onChange={(e) => setCurrentSet(e.target.value)}
                                placeholder="11-9"
                            />
                            <Button onClick={handleAddSet}>Add Set</Button>
                        </div>

                        {score.length > 0 && (
                            <div className="mt-2 space-y-1">
                                <p className="text-sm font-medium">Added Sets:</p>
                                <div className="flex flex-wrap gap-2">
                                    {score.map((s, i) => (
                                        <div key={i} className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                                            Set {i + 1}: {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <RadioGroup
                        value={result}
                        onValueChange={(value: "Win" | "Loss") => setResult(value)}
                        className="space-y-2"
                    >
                        <Label>Match Outcome</Label>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Win" id="win" />
                            <Label htmlFor="win">You won</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Loss" id="loss" />
                            <Label htmlFor="loss">You lost</Label>
                        </div>
                    </RadioGroup>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || score.length === 0}
                        >
                            {isSubmitting ? "Saving..." : "Save Result"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};