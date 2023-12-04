import { PrismaClient } from "@prisma/client";
import { EntryData, EntryDoesNotExistsError, EntryRepository, EntryResponseData } from "./EntryRepository";

export class EntryRepositoryPrismaImpl implements EntryRepository{

    private prismaClient: PrismaClient

    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient
    }

    async count(): Promise<number> {
        const numOfRecords = await this.prismaClient.entry.count()
        return numOfRecords;
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

    async save(data: EntryData): Promise<EntryResponseData> {
        const entry = await this.prismaClient.entry.create({ data, select: { id: true } }).then( async (data) => {
            const { id } = data
            const result: EntryResponseData[] = await this.prismaClient.$queryRaw`
            SELECT 
                Entry.id,
                Student.lrn,
                Student.email,
                Student.phoneNumber,
                CONCAT_WS(" ", Student.firstname, NULLIF(Student.middlename, ""), Student.lastname) AS "fullname",
                GradeLevel.gradeLevel AS "gradeLevel",
                Section.sectionName AS "sectionName",
                Entry.timeIn,
                CONCAT(guardIn.firstname," ", guardIn.lastname) AS "entryCheckedBy",
                \`Exit\`.timeOut,
                CONCAT(guardOut.firstname," ", guardOut.lastname) AS "exitCheckedBy"
            FROM Entry
            LEFT JOIN Student
            ON Student.lrn = Entry.studentlrn
            LEFT JOIN Section
            ON Section.id = Student.sectionId
            LEFT JOIN GradeLevel
            ON Section.level = GradeLevel.level
            LEFT JOIN \`Exit\`
            ON Entry.id = \`Exit\`.studententryId
            LEFT JOIN Guard as guardIn
            ON guardIn.id = Entry.guardId
            LEFT JOIN Guard as guardOut
            ON guardOut.id = \`Exit\`.guardid WHERE Entry.id = ${id};`
            return result[0]
        })
        return entry;
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