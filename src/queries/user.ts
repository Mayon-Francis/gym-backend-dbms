export const UserQueries = {
    GetUsers: `
        SELECT * FROM users`,
    GetUserById: `
        SELECT * FROM users WHERE id = $1`,
    AddUser: `
        INSERT INTO users 
        (id, name, email, height_in_cm, weight_in_kg, profile_image_url) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
};