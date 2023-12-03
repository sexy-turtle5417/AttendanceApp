import { PrismaClient } from "@prisma/client";
import { ExitData, ExitDoesNotExistsError, ExitRepository } from "./ExitRepository";

export class ExitRepositoryPrismaImpl implements ExitRepository{

    private prismaClient: PrismaClient

    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient
    }

    async existsById(id: string): Promise<boolean> {
        const existingRecord = await this.prismaClient.exit.findUnique({
            where: { id }, select: { id: true }
        })
        if(!existingRecord) return false
        return true
    }

    async save(data: ExitData): Promise<any> {
        const exit = await this.prismaClient.exit.create({ data })
        return exit
    }

    async deleteById(id: string): Promise<void> {
        if(!await this.existsById(id))
            throw new ExitDoesNotExistsError(`Exit with the id of '${id}' does not exists`)
        else
            await this.prismaClient.exit.delete({ where: { id }})
    }

}