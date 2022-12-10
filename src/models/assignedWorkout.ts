export interface IAssignedWorkout {
    id: string;
    user_id: string;
    workout_id: string;
    date: string;
    completed: boolean;
    sets: number;
    reps: number;
}