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
        return await this.prismaClient.exit.create({ data }).then(async () => {
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
            ON guardOut.id = \`exit\`.guardid WHERE entry.id = ${data.studentEntryId};`
            return result[0];
        })
    }

    async deleteById(id: string): Promise<void> {
        if(!await this.existsById(id))
            throw new ExitDoesNotExistsError(`Exit with the id of '${id}' does not exists`)
        else
            await this.prismaClient.exit.delete({ where: { id }})
    }

}