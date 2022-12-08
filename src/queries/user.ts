export const UserQueries = {
    GetUsers: `
        SELECT * FROM users`,
    GetUserById: `
        SELECT * FROM users WHERE id = $1`,
    GetUserByEmail: `
        SELECT * FROM users WHERE email = $1`,
    AddUser: `
        INSERT INTO users 
        (id, name, email, password, height_in_cm, weight_in_kg, profile_image_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,

        // TODO: FIX THIS
    GetUsersByIds: `
        SELECT * FROM users WHERE id IN (\'6de54a97-dd02-469f-b0bd-8bfb0bc62b38\', \'6de54a97-dd02-469f-b0bd-8bfb0bc62b38\')`
        // SELECT * FROM users WHERE id IN $1`
};