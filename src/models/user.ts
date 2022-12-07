export interface IUser {
    id: string,
    name: string,
    password: string,
    email: string,
    created_at: Date,
    heightInCm?: number,
    weightInKg?: number,
    profileImageUrl?: string,
}