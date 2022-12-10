export const DietQueries = {
    AddDiet: `
        INSERT INTO diets
        (id, name, protein, quantity, trainer_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    AssignDiet: `
        INSERT INTO assigned_diets
        (id, diet_id, user_id, no_of_times, time)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    GetDietByNameAndTrainerId: `
        SELECT * FROM diets
        WHERE name = $1 AND trainer_id = $2`,
    GetDietsByUserId: `
        SELECT *
        FROM diets
        INNER JOIN assigned_diets ON assigned_diets.diet_id = diets.id  
        WHERE diets.id IN (SELECT diet_id FROM assigned_diets WHERE user_id = $1)`,
    ToggleCompletedStatus: `
        UPDATE assigned_diets
        SET completed = NOT completed
        WHERE id = $1 AND user_id = $2`,
};