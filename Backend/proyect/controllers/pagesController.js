const pool =  require ('../db')

const getPages = async (req, res) =>{
    const { role } = req.query
    try {
        const result = await pool.query(
        `
        SELECT p.name, p.path
        FROM pages p
        JOIN assigned_pages ap ON ap.page_id = p.id
        WHERE ap.role = $1
        ORDER BY p.id
        `,
        [role]
        );
        
        res.status(200).json(result.rows)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {getPages}