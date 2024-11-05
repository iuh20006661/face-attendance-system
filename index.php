<?php
// Kết nối với cơ sở dữ liệu MySQL
$conn = new mysqli("sql312.infinityfree.com", "if0_37577660", "Hieu16012002", "if0_37577660_membershiphp");

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

// Lấy danh sách fullname từ bảng members
$sql = "SELECT fullname FROM members";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chấm Công Nhận Diện Khuôn Mặt</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background-color: #eef2f7;
            color: #2c3e50;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            width: 100%;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background-color: #3498db;
            color: #fff;
            padding: 20px;
            text-align: center;
        }

        .header h1 {
            font-size: 1.8rem;
            font-weight: 700;
        }

        .content {
            padding: 20px;
        }

        h2 {
            font-size: 1.5rem;
            color: #34495e;
            margin-bottom: 10px;
        }

        select, input {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
        }

        button {
            width: 100%;
            padding: 12px;
            background-color: #3498db;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #2980b9;
        }

        #photo-count {
            font-weight: bold;
            color: #e74c3c;
        }

        video {
            width: 100%;
            border-radius: 6px;
            margin-top: 10px;
        }

        .status-message {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Chấm Công Nhận Diện Khuôn Mặt</h1>
        </div>
        <div class="content">
            <!-- Nút Open API -->
            <button id="open-api">Kiểm Tra API</button>

            <!-- Form thêm nhân viên -->
            <h2>Thêm Nhân Viên Mới</h2>
            <select name="employee-name" required>
                <option value="">Chọn tên nhân viên</option>
                <?php
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<option value='" . $row['fullname'] . "'>" . $row['fullname'] . "</option>";
                    }
                }
                ?>
            </select>
            <input type="text" id="employee-id" placeholder="Mã Nhân Viên" required>
            <button id="capture-photo">Chụp Ảnh</button>
            <p class="status-message">Ảnh đã chụp: <span id="photo-count">0</span>/4</p>
            <button id="save-employee" disabled>Thêm Nhân Viên</button>

            <!-- Khu vực chấm công -->
            <h2>Chấm Công</h2>
            <video id="video" autoplay></video>
            <canvas id="canvas" style="display:none;"></canvas>
            <button id="check-in">Chấm Công Vào</button>
            <button id="check-out">Chấm Công Ra</button>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        // Xử lý nút Kiểm tra API
        document.getElementById("open-api").addEventListener("click", () => {
    fetch("start_flask.php")
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
        })
        .catch(() => {
            alert("Không thể khởi động server Flask.");
        });
});

    </script>
</body>
</html>
