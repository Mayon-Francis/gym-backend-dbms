export const TrainerQueries = {
    GetTrainers: `
        SELECT * FROM trainers`,
    GetTrainerById: `
        SELECT * FROM trainers WHERE id = $1`,
    GetTrainerByEmail: `
        SELECT * FROM trainers WHERE email = $1`,
    AddTrainer: `
        INSERT INTO trainers 
        (id, name, email, specialization, password, profile_image_url, place, phone_number) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
};