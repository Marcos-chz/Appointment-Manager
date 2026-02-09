const pool = require('../db');
const { createTableAppointment, insertAppointment } = require('../sql');


const getAppointment = async (req, res) => {
    const userId = req.query.id;

    try {
        await updateAppointmentsStatus();
        
        const result = await pool.query(`
            SELECT 
                a.*, 
                p.name || ' ' || p.lastname AS professional_name,
                p.lastname AS professional_lastname
            FROM appointments a
            JOIN users p ON a.professional = p.id
            WHERE a.user_id = $1
        `, [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getAppointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getAppointmentById = async (req, res) => {
    const a_id = req.params.id;

    try {
        const result = await pool.query(`
            SELECT 
                a.*, 
                p.name || ' ' || p.lastname AS professional_name,
                p.lastname AS professional_lastname,
                u.name || ' ' || u.lastname AS user_name
            FROM appointments a
            JOIN users p ON a.professional = p.id
            JOIN users u ON a.user_id = u.id
            WHERE a.id = $1
        `, [a_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error en getAppointmentById:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getAppointmentByPro = async (req, res) => {
    const p_id = req.query.id;

    try {
        const result = await pool.query(`
            SELECT 
                a.*, 
                u.name || ' ' || u.lastname AS user_name,
                u.email,
                u.avatar
            FROM appointments a
            JOIN users u ON a.user_id = u.id
            WHERE a.professional = $1
        `, [p_id]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getAppointmentByPro:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


const newAppointment = async (req, res) => {
    const {professional, date, time, message, userId} = req.body

    try {
        const result = await pool.query(insertAppointment, [professional, date, time, message, userId])
        res.status(200).json((result).rows[0])
    } catch (error) {
        res.status(500).json({message: 'Server error'})
        console.error(error)
    }
} 

const deleteAppointment = async (req, res) =>{
    const a_id = req.params.id
    try {
        const result = await pool.query('DELETE FROM appointments WHERE id=$1', [a_id])
        res.status(200).json({message: 'Appointment Deleted'})
    } catch (error) {
        res.status(500).json({message: 'Server error'})
        console.error(error)
    }
}

const updateAppointment = async (req, res) => {
    const { professional, date, time, status, message, userId } = req.body;
    const a_id = req.params.id;

    try {
        await pool.query(`
            UPDATE appointments
            SET 
                professional = COALESCE($1, professional),
                date         = COALESCE($2, date),
                time         = COALESCE($3, time),
                status       = COALESCE($4, status),
                message      = COALESCE($5, message),
                user_id      = COALESCE($6, user_id)
            WHERE id = $7
        `, [
            professional ?? null,
            date ?? null,
            time ?? null,
            status ?? null,
            message ?? null,
            userId ?? null,
            a_id
        ]);

        res.status(200).json({ message: 'Appointment Updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const changeStatus = async (req, res) => {
    const { status } = req.body;
    const a_id = req.params.id;

    try {
        await pool.query(
            'UPDATE appointments SET status = $1 WHERE id = $2',
            [status, a_id]
        );

        res.status(200).json({ message: 'Status updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};






const updateAppointmentsStatus = async () => {
  await pool.query(`
    UPDATE appointments
    SET status = 'completed'
    WHERE status = 'accepted'
      AND (date < CURRENT_DATE
        OR (date = CURRENT_DATE AND time < CURRENT_TIME));
  `);

  await pool.query(`
    UPDATE appointments
    SET status = 'expired'
    WHERE status = 'pending'
      AND (date < CURRENT_DATE
        OR (date = CURRENT_DATE AND time < CURRENT_TIME));
  `);
};


module.exports = {
  newAppointment,
  getAppointment,
  getAppointmentById,
  getAppointmentByPro,
  deleteAppointment,
  updateAppointment,
  changeStatus
}