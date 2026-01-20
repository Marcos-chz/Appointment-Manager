const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    password:  '1@M234567',
    host: 'localhost',
    port: 5432,
    database: 'appointments_db'
})

module.exports = pool