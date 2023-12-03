import { PrismaClient } from "@prisma/client";
import { EntryResponseData } from "../../Entry/repositories/EntryRepository";
import { AttendanceRepository } from "./AttendanceRepository";

export class AttendanceRepositoryPrismaImpl implements AttendanceRepository{


    private prismaClient: PrismaClient

    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient
    }
    
    async findAllRecords(): Promise<EntryResponseData[]> {
        const records: EntryResponseData[] = await this.prismaClient.$queryRaw`
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
            ON guardOut.id = \`exit\`.guardid
            ORDER BY entry.timeIn DESC;`
        return records 
    }
}