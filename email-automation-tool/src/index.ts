import express from 'express'
import dotenv from 'dotenv'
import {redirect} from './routes/redirect'
import { scheduleEmailProcessing } from './jobs/readEmails';

const app = express()
app.use(express.json())

dotenv.config()

console.log(process.env.GOOGLE_CLIENT_ID);
app.get('/server-start', async(req, res)=>{
    try{
        console.log('Initializing email automation tool...');  
        await scheduleEmailProcessing();
        console.log('Email check job scheduled to run every 3 minutes.');
        console.log('Worker is now waiting for jobs...');
    }catch(error){
        console.error('Error initializing the email automation tool:', error);
    }
})


app.use('/gmail',redirect) 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})