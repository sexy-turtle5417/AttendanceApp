import { PrismaClient } from "@prisma/client";
import { EntryData, EntryDoesNotExistsError, EntryRepository } from "./EntryRepository";

export class EntryRepositoryPrismaImpl implements EntryRepository{

    private prismaClient: PrismaClient

    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient
    }

    async existsById(id: string): Promise<boolean> {
        const existingEntry = await this.prismaClient.entry.findUnique({
            where: { id }, select: { id: false }
        })
        if(!existingEntry) return false
        return true
    }

    async existsByStudentLrn(studentLrn: string): Promise<boolean>{
        const existingEntry = await this.prismaClient.entry.count({
            where: { studentLrn }
        })
        if(existingEntry > 0) return true
        return false
    }

    async save(data: EntryData): Promise<any> {
        const entry = await this.prismaClient.entry.create({ data })
        return entry
    }

    async deleteById(id: string): Promise<void> {
        if(await this.existsById(id))
            await this.prismaClient.entry.delete({ where: { id }})
        else
            throw new EntryDoesNotExistsError(`The Entry with id '${id}' does not exist`)
    }

    async findIdOfLatestEntryByLrn(studentLrn: string): Promise<string> {
        if(!await this.existsByStudentLrn(studentLrn)){
            throw new EntryDoesNotExistsError(`Their are no entries with the lrn '${studentLrn}'`);
        }
        const lastestEntry = await this.prismaClient.entry.findFirstOrThrow({
            where: { studentLrn }, select: { id: true }
        })
        return lastestEntry.id
    }
}