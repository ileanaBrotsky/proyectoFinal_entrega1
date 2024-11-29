
import mongoose from "mongoose"

export const conectarDB= async(url,db)=>{
    try {
        await mongoose.connect(
            url,
            {
            dbName: db  
            }
        )
        console.log(` DB connected!`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit()
    }
}