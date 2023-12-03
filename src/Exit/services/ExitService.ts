export type StudentExitData = {
    studentLrn: string,
    guardId: string
}

export interface ExitService{
    addRecord(exitData: StudentExitData): Promise<any>
    deleteRecord(id: string): Promise<void>
}