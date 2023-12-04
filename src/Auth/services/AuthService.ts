export type AuthResponse = {
    accessToken: string,
    refreshToken: string
}

export type AuthData = {
    email: string,
    password: string
}

export type Payload = {
    id: string,
    email: string
}

export class UnAuthorizedError extends Error{
    constructor(message: string){
        super(message)
    }
}

export interface AuthService{
    authenticate(authData: AuthData): Promise<AuthResponse>
    refresh(refreshToken: string): Promise<AuthResponse>
}