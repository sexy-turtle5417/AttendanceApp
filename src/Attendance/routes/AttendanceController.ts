import { Context, Hono } from "hono"
import { AttendanceRepository, ExceededNumberOfPagesError } from "../repositories/AttendanceRepository"

export class AttendanceController{

    private hono: Hono = new Hono()
    private attendanceRepository: AttendanceRepository

    constructor(attendanceRepository: AttendanceRepository){
        this.attendanceRepository = attendanceRepository
    }

    getRoute(): Hono {

        this.hono.get("/records/:pagenumber", async (c: Context) => {
            const pageNumber: number = Number(c.req.param('pagenumber'))
            try{
                const records =  await this.attendanceRepository.findRecords(pageNumber)
                return  c.json(records)
            }
            catch(err){
                if(err instanceof ExceededNumberOfPagesError){
                    c.status(400)
                    return c.json({ message: err.message})
                }
            }
        })
        
        return this.hono
    }

}