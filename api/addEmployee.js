    // api/addEmployee.js
const mysql = require('mysql2/promise');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { name, employeeId, photos } = req.body;

    // Kết nối đến cơ sở dữ liệu MySQL trên InfinityFree
    const db = await mysql.createConnection({
        host: "sql312.infinityfree.com",
        user: "if0_37577660",
        password: "Hieu16012002",
        database: "if0_37577660_membershiphp"
    });

    try {
        // Lưu thông tin nhân viên vào MySQL
        await db.execute("INSERT INTO employees (name, employee_id) VALUES (?, ?)", [name, employeeId]);

        // Bạn cũng có thể lưu ảnh trong thư mục hoặc lưu đường dẫn vào cơ sở dữ liệu (nếu cần)
        // Còn ảnh base64, bạn có thể gửi qua một API khác nếu muốn lưu trữ

        res.status(200).json({ status: 'success', message: `Nhân viên ${name} đã được thêm thành công!` });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi khi thêm nhân viên', error });
    } finally {
        await db.end();
    }
}
