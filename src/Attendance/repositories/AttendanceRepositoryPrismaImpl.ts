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
            ON guardOut.id = \`Exit\`.guardid
            ORDER BY Entry.timeIn DESC LIMIT ${limit} OFFSET ${offset};`
        return {
            ...pageInfo,
            content: records
        }
    }
}