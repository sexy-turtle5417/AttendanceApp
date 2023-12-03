import { EntryResponseData } from "../../Entry/repositories/EntryRepository";

export type PageInfo = {
    pageNumber: number,
    itemsPerPage: number
    totalPages: number
}

export class ExceededNumberOfPagesError extends Error{
    constructor(message: string){
        super(message)
    }
}
export interface AttendanceRepository{
    findRecords(pageNumber: number): Promise<any>
}