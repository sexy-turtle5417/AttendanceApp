import { EntryResponseData } from "../../Entry/repositories/EntryRepository";

export interface AttendanceRepository{
    findAllRecords(): Promise<EntryResponseData[]>
}