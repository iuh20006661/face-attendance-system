// api/recognizeFace.js
const mysql = require('mysql2/promise');
const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { image, type } = req.body;

    try {
        // Gửi ảnh đến API nhận diện khuôn mặt
        const apiResponse = await axios.post('https://face-recognition-api-cxtv.onrender.com/recognize', {
            image: image,
            type: type
        });

        if (apiResponse.data.status === 'success') {
            const employeeName = apiResponse.data.message.split(' ')[1];

            // Kết nối đến cơ sở dữ liệu và ghi nhật ký chấm công
            const db = await mysql.createConnection({
                host: "sql312.infinityfree.com",
                user: "if0_37577660",
                password: "Hieu16012002",
                database: "if0_37577660_membershiphp"
            });

            await db.execute("INSERT INTO attendance_logs (employee_name, attendance_type) VALUES (?, ?)", [employeeName, type]);

            await db.end();

            res.status(200).json({ status: 'success', message: `Đã ${type} thành công cho nhân viên ${employeeName}` });
        } else {
            res.json({ status: 'fail', message: apiResponse.data.message });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi khi gọi API nhận diện khuôn mặt', error });
    }
}
