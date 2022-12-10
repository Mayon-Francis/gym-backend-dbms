export interface IWorkout {
    id: string
    name: string;
    part_of_body: string;
    description: string;
    trainer_id: string;
}

export interface IAssignedWorkoutCombo {
    id: string;
    user_id: string;
    workout_id: string;
    date: string;
    completed: boolean;
    sets: number;
    reps: number;
    name: string;
    part_of_body: string;
    description: string;
    trainer_id: string;
}
