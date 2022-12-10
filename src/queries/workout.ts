export const WorkoutQueries = {
    GetWorkoutsById: `
        SELECT * FROM workouts WHERE id = $1`,
    GetWorkoutsByTrainerId: `
        SELECT * FROM workouts WHERE trainer_id = $1`,
    AddWorkout: `
        INSERT INTO workouts 
        (id, name, part_of_body, description, trainer_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    GetWorkoutByNameAndTrainerId: `
        SELECT * FROM workouts WHERE name = $1 AND trainer_id = $2`,
};