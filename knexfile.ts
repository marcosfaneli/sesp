import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

module.exports = {
    client: 'pg',
    debug: true,
    connection: {
        host : process.env.DATABASE_HOST,
        port : Number(process.env.DATABASE_PORT),
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE_BD,
        charset  : 'utf8'
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true
}