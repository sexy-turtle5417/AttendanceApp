import { PrismaClient } from "@prisma/client";
import { EntryRepository, EntryResponseData } from "../../Entry/repositories/EntryRepository";
import { AttendanceRepository, ExceededNumberOfPagesError, PageInfo } from "./AttendanceRepository";

export class AttendanceRepositoryPrismaImpl implements AttendanceRepository{


    private prismaClient: PrismaClient
    private entryRepository: EntryRepository

    constructor(entryRepository: EntryRepository,prismaClient: PrismaClient){
        this.prismaClient = prismaClient
        this.entryRepository = entryRepository
    }
    
    async findRecords(pageNumber: number): Promise<any> {
        const numberOfRecords = await this.entryRepository.count()
        const limit = 20
        const currentPage = pageNumber - 1
        const offset = currentPage * limit
        const pages = Math.ceil(numberOfRecords / limit )

        if(pageNumber > pages){
            throw new ExceededNumberOfPagesError(`You have exceeded the total pages`)
        }

        const pageInfo: PageInfo = {
            itemsPerPage: limit,
            pageNumber: currentPage + 1,
            totalPages: pages
        }

        const records: any = await this.prismaClient.$queryRaw`
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
            ORDER BY entry.timeIn DESC LIMIT ${limit} OFFSET ${offset};`
        return {
            ...pageInfo,
            content: records
        }
    }
}