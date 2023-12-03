import { EntryData } from "../../Entry/repositories/EntryRepository"
import { ExitResponseData } from "../repository/ExitRepository"

export type StudentExitData = {
    studentLrn: string,
    guardId: string
}

export interface ExitService{
    addRecord(exitData: StudentExitData): Promise<ExitResponseData>
    deleteRecord(id: string): Promise<void>
}