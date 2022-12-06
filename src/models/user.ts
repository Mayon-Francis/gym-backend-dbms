export interface IUser {
    id: string,
    name: string,
    email: string,
    created_at: Date,
    heightInCm?: number,
    weightInKg?: number,
    profileImageUrl?: string,
}