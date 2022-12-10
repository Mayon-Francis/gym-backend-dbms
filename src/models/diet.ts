export interface IDiet {
    id: string;
    name: string;
    protien: number;
    quantity: number;
    trainer_id: string;
}

export interface IAssignedDiet {
    id: string;
    diet_id: string;
    user_id: string;
    no_of_times: number;
    time: string;
    date: string;
    completed: boolean;
}

export interface IAssignedDietCombo {
    id: string;
    name: string;
    protien: number;
    quantity: number;
    trainer_id: string;
    diet_id: string;
    user_id: string;
    no_of_times: number;
    time: string;
    date: string;
    completed: boolean;
}