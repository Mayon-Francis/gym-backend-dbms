export const TrainerAssignedQueries = {
    GetAll: `
        SELECT * FROM trainer_assigned`,
    GetEntriesByUserId: `
        SELECT * FROM trainer_assigned WHERE user_id = $1`,
    GetEntriesByTrainerId: `
        SELECT * FROM trainer_assigned WHERE trainer_id = $1`,
    GetEntryByUserIdTrainerId: `
        SELECT * FROM trainer_assigned WHERE user_id = $1 AND trainer_id = $2`,
    DeleteEntryByUserIdTrainerId: `
        DELETE FROM trainer_assigned WHERE user_id = $1 AND trainer_id = $2`,
    AddEntry: `
        INSERT INTO trainer_assigned 
        (id, user_id, trainer_id, status) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
    GetUsersByTrainerId: `
        SELECT * FROM users WHERE id IN (SELECT user_id FROM trainer_assigned WHERE trainer_id = $1)`,
        
};