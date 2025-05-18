export interface UserRef {
    _id: string;
    email?: string;
    avatar?: string;
    skillLevel?: string;
    fullName?: string;
  }
  
  export interface Match {
    _id: string;
    initiator: UserRef;
    opponent: UserRef;
    location: string;
    scheduledFor: string;
    status: "AwaitingConfirmation" | "Confirmed" | "Cancelled" | "Completed";
    score?: string[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
  }
  
  export interface ScheduleMatchData {
    opponent: string;
    location: string;
    scheduledFor: string;
  }