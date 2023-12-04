import { Guard } from "@prisma/client"

export type GuardData = {
    firstname: string,
    middlename?: string,
    lastname: string,
    email: string,
    password: string
}

export type GuardPublicInfo = Omit<Guard, "password">

export class EmailAlreadyTakenError extends Error{
    constructor(message: string){
        super(message)
    }
}

export class GuardDoesNotExistsError extends Error{
    constructor(message: string){
        super(message)
    }
}

export interface GuardRepository{
    existsById(id: string): Promise<boolean>
    existsByEmail(email: string): Promise<boolean>
    findById(id: string): Promise<GuardPublicInfo>
    fingByEmail(email: string): Promise<GuardPublicInfo>
    getPasswordByEmail(email: string): Promise<string>
    save(data: GuardData): Promise<Guard>
    deleteById(id: string): Promise<void>
}