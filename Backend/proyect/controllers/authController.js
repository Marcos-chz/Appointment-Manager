const pool = require('../db');
const bcrypt = require('bcrypt');
const { insertUsers } = require('../sql');
const jwt = require('jsonwebtoken')


const signUp = async (req, res) => {
    const { name, lastname, email, password, role} = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const result = await pool.query(insertUsers, [name, lastname, email, hashedPassword, role]);
        res.status(200).json(result.rows[0]);
        console.log('User added');
        
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).send({ error: 'Email is already used' });
        }
        res.status(500).send({ error: 'Error to post users', details: err.message });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'user not found' });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        return res.status(200).json({message: 'Login Succesful', token})

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server Error', details: err.message });
    }
};

module.exports = {
  signUp,
  signIn,
};
