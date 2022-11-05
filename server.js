import dotenv from 'dotenv'

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({
    path: './config.env'
})
import app from './app.js'
import sequelize from './utils/database.js'

sequelize.sync().then(() => {
}).catch(err => {
    console.log(err)
})

const port = process.env.PORT || 8000
const server = app.listen(port,() => {
    console.log(`We listen the port ${port}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});