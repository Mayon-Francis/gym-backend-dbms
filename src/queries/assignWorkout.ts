export const AssignWorkoutQueries = {
    AddAssignedWorkout: `
        INSERT INTO assigned_workouts
        (id, user_id, workout_id, date, completed, sets, reps)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    GetWorkoutsByUserId: `
        SELECT * 
        FROM workouts 
        INNER JOIN assigned_workouts ON assigned_workouts.workout_id = workouts.id
        WHERE workouts.id IN (SELECT workout_id FROM assigned_workouts WHERE user_id = $1)
        `,
};