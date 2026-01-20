const pool = require('../db');
const { createTableAvailability } = require('../sql');


const getAvailability = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(
            'SELECT * FROM availability WHERE professional_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



const getAvailableSlots = async (req, res) => {
  const { professionalId, date } = req.params;

  try {
    // Obtener todas las franjas de disponibilidad del profesional para ese día
    const availability = await pool.query(
      `SELECT start_time, end_time
       FROM availability
       WHERE professional_id = $1
         AND day_of_week = EXTRACT(DOW FROM $2::date)
       ORDER BY start_time`,
      [professionalId, date]
    );

    console.log(availability.rows);

    if (availability.rows.length === 0) return res.json([]);

    // Obtener los turnos ya reservados
    const appointments = await pool.query(
      `SELECT time 
       FROM appointments 
       WHERE professional = $1
         AND date = $2`,
      [professionalId, date]
    );
    const reservedTimes = appointments.rows.map(r => r.time);

    const SLOT_DURATION = 60; // Duración de cada slot en minutos
    const slots = [];

    availability.rows.forEach(({ start_time, end_time }) => {
      let [h, m] = start_time.split(':').map(Number);
      const [endH, endM] = end_time.split(':').map(Number);

      while (h < endH || (h === endH && m < endM)) {
        const nextH = h + Math.floor((m + SLOT_DURATION) / 60);
        const nextM = (m + SLOT_DURATION) % 60;

        // Crear string de la hora actual
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

        // Solo agregar si no está reservado y no excede la franja
        if (!reservedTimes.includes(timeStr)) {
          slots.push(timeStr);
        }

        h = nextH;
        m = nextM;
      }
    });

    res.json(slots);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching availability" });
  }
};




const insertAvailability = async (req, res) => {
    const { userId, day, startTime, endTime } = req.body;

    try {
        // Check if the exact same schedule already exists
        const exists = await pool.query(
            `SELECT * FROM availability
             WHERE professional_id = $1
               AND day_of_week = $2
               AND start_time = $3
               AND end_time = $4`,
            [userId, day, startTime, endTime]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ message: 'This schedule already exists for this day.' });
        }

        // Check for partial overlap with existing schedules
        const overlap = await pool.query(
            `SELECT * FROM availability
             WHERE professional_id = $1
               AND day_of_week = $2
               AND NOT ($3 >= end_time OR $4 <= start_time)`,
            [userId, day, startTime, endTime]
        );

        if (overlap.rows.length > 0) {
            return res.status(400).json({ message: 'This schedule overlaps with an existing one.' });
        }

        // 3️⃣ Insert the new schedule
        const result = await pool.query(
            `INSERT INTO availability (professional_id, day_of_week, start_time, end_time)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, day, startTime, endTime]
        );

        res.status(200).json(result.rows[0]);
        console.log('Data inserted successfully');

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error(error);
    }
};


// const createTable = async (req, res) =>{

//     try {
//         const result = await pool.query(createTableAvailability)
//         console.log('tabla creada')
//     } catch (error) {
//         console.error(error)
//     }
// }

// createTable()

module.exports = {insertAvailability, getAvailability, getAvailableSlots}