export interface ITrainerAssignStatus {
    id: string;
    user_id: string;
    trainer_id: string;
    status: "pending" | "accepted"
}