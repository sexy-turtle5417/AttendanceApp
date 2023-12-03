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
        const entry = await this.prismaClient.entry.create({ data, select: { id: true } })
        const { id } = entry
        const result: any = await this.prismaClient.$queryRaw`
            SELECT 
                entry.id,
                student.lrn,
                student.email,
                student.phoneNumber,
                CONCAT_WS(" ", student.firstname, NULLIF(student.middlename, ""), student.lastname) AS "fullname",
                gradelevel.gradelevel AS "gradeLevel",
                section.sectionName AS "sectionName",
                entry.timeIn,
                CONCAT(guardIn.firstname," ", guardIn.lastname) AS "entryCheckedBy",
                \`exit\`.timeOut,
                CONCAT(guardOut.firstname," ", guardOut.lastname) AS "exitCheckedBy"
            FROM entry
            LEFT JOIN student
            ON student.lrn = entry.studentlrn
            LEFT JOIN section
            ON section.id = student.sectionId
            LEFT JOIN gradeLevel
            ON section.level = gradelevel.level
            LEFT JOIN \`exit\`
            ON entry.id = \`exit\`.studententryId
            LEFT JOIN guard as guardIn
            ON guardIn.id = entry.guardId
            LEFT JOIN guard as guardOut
            ON guardOut.id = \`exit\`.guardid WHERE entry.id = ${id};`
            return result[0]
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
            where: { studentLrn, studentExit: undefined }, select: { id: true }, orderBy: {
                timeIn: "desc"
            }
        })
        return lastestEntry.id
    }
}