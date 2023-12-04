import { PrismaClient } from "@prisma/client";
import { ExitData, ExitDoesNotExistsError, ExitRepository, ExitResponseData, RecordAlreadyClosedError } from "./ExitRepository";

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

    async save(data: ExitData): Promise<ExitResponseData> {
        return await this.prismaClient.exit.create({ data }).then(async () => {
            const result: ExitResponseData[] = await this.prismaClient.$queryRaw`
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
                ON guardOut.id = \`Exit\`.guardid WHERE Entry.id = ${data.studentEntryId};`
                return result[0];
        }).catch((err) => {
            throw new RecordAlreadyClosedError(`The record '${data.studentEntryId}' is already resolved`)
        })
    }

    async deleteById(id: string): Promise<void> {
        if(!await this.existsById(id))
            throw new ExitDoesNotExistsError(`Exit with the id of '${id}' does not exists`)
        else
            await this.prismaClient.exit.delete({ where: { id }})
    }

}