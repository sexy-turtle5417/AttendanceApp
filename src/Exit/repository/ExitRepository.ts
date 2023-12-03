export type ExitData = {
    studentEntryId: string,
    guardId: string
}

export type ExitResponseData = {
    id: string,
    lrn: string,
    email: string,
    phoneNumber: string,
    fullname: string,
    gradeLevel: string,
    sectionName: string,
    timeIn: Date,
    entryCheckedBy: string,
    timeOut: Date,
    exitCheckedBy: string
}

export class ExitDoesNotExistsError extends Error{
    constructor(message: string){
        super(message)
    }
}

export class RecordAlreadyClosedError extends Error{
    constructor(message: string){
        super(message)
    }
}

export interface ExitRepository{
    existsById(id: string): Promise<boolean>
    save(data: ExitData): Promise<ExitResponseData>
    deleteById(id: string): Promise<void>
}