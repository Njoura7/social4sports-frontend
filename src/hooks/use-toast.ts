
// Re-export from sonner for simplicity
import { toast } from "sonner";

export { toast };

export const useToast = () => {
  return { toast };
};
