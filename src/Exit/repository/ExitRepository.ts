export type ExitData = {
    studentEntryId: string,
    guardId: string
}

export class ExitDoesNotExistsError extends Error{
    constructor(message: string){
        super(message)
    }
}

export interface ExitRepository{
    existsById(id: string): Promise<boolean>
    save(data: ExitData): Promise<any>
    deleteById(id: string): Promise<void>
}