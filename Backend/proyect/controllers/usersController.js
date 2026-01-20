const pool = require('../db')

const getUser =  async (req, res) =>{

    const userId = req.query.userId

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({message: 'Error to get users'})
    }
}


const getProfessional =  async (req, res) =>{

    try {
        const result = await pool.query("SELECT * FROM users WHERE role = 'professional'")
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({message: 'Error to get users'})
    }
}

const editPhoto = async (req, res) =>{
    const userId = req.query.userId
    const image = req.file.filename;
    
    try {
        const result = await pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [image, userId])
        res.status(200).json({ avatar: image })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {getUser, editPhoto, getProfessional};
