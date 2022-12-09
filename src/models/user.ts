export interface IUser {
    id: string,
    name: string,
    password: string,
    email: string,
    created_at: Date,
    height_in_cm?: number,
    weight_in_kg?: number,
    profile_image_url?: string,
}