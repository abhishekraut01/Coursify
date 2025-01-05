import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); 
import express from 'express';
import cors from 'cors'

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true
}))
//setting up middlewares
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));


app.use('/api/v1/admin',adminController)
app.use('/api/v1/user',userController)
//http://localhost:3000/api/v1/admin


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; 
    const message = err.message || "Something went wrong!"; 

    // Send a structured error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // 
        },
    });
});


app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
});