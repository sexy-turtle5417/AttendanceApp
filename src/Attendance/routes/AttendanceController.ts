import { Context, Hono } from "hono"
import { AttendanceRepository } from "../repositories/AttendanceRepository"

export class AttendanceController{

    private hono: Hono = new Hono()
    private attendanceRepository: AttendanceRepository

    constructor(attendanceRepository: AttendanceRepository){
        this.attendanceRepository = attendanceRepository
    }

    getRoute(): Hono {

        this.hono.get("/all", async (c: Context) => {
            const records =  await this.attendanceRepository.findAllRecords()
            return  c.json(records)
        })
        
        return this.hono
    }

}