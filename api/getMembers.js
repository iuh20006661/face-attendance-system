// api/getMembers.js
const mysql = require('mysql2/promise');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

    // Kết nối đến cơ sở dữ liệu MySQL trên InfinityFree
    const db = await mysql.createConnection({
        host: "sql312.infinityfree.com",
        user: "if0_37577660",
        password: "Hieu16012002",
        database: "if0_37577660_membershiphp"
    });

    try {
        const [rows] = await db.execute("SELECT fullname FROM members");
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi khi lấy danh sách nhân viên', error });
    } finally {
        await db.end();
    }
}
