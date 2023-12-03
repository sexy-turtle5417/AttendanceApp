import { PrismaClient } from "@prisma/client";
import { EmailAlreadyTakenError, GuardData, GuardDoesNotExistsError, GuardPublicInfo, GuardRepository } from "./GuardRepository";
import { Guard } from "@prisma/client";

export class GuardRepositoryPrismaImpl implements GuardRepository{

    private prismaClient: PrismaClient
    
    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient
    }

    async findById(id: string): Promise<GuardPublicInfo> {
        if(! await this.existsById(id)){
            throw new GuardDoesNotExistsError(`Guard with id ${id} does not exists`)
        }
        const guard: GuardPublicInfo = await this.prismaClient.guard.findUniqueOrThrow({
            where: { id },
            select: {
                id: true,
                firstname: true,
                middlename: true,
                lastname: true,
                email: true
            }
        });
        return guard;
    }

    async fingByEmail(email: string): Promise<GuardPublicInfo> {
        if(!await this.existsByEmail(email)){
            throw new GuardDoesNotExistsError(`Guard with email ${email} deos not exist`)
        }
        const guard: GuardPublicInfo = await this.prismaClient.guard.findUniqueOrThrow({
            where: { email },
            select: {
                id: true,
                firstname: true,
                middlename: true,
                lastname: true,
                email: true
            }
        })
        return guard
    }

    async existsById(id: string): Promise<boolean> {
        const existingGuard = await this.prismaClient.guard.findUnique({ 
            where: { id },
            select: { id: true }
        })
        if(!existingGuard) return false
        return true
    }
    async existsByEmail(email: string): Promise<boolean> {
        const existingGuard = await this.prismaClient.guard.findUnique({
            where: { email },
            select: { id: true }
        })
        if(!existingGuard) return false
        return false
    }

    async save(data: GuardData): Promise<Guard> {
        if(await this.existsByEmail(data.email)){
            throw new EmailAlreadyTakenError(`Guard with the email ${data.email} does not exists`)
        }
        const guard = await this.prismaClient.guard.create({ data })
        return guard;
    }
    async deleteById(id: string): Promise<void> {
        if(! await this.existsById(id)){
            throw new GuardDoesNotExistsError(`Guard with id ${id} does not exists`)
        }
        await this.prismaClient.guard.delete( { where: { id }})
    }
}