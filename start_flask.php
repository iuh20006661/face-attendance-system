<?php
// Tạo một command để chạy server Flask
$command = "python /home/volx_6/htdocs/face-attendance-system/api/face_recognition_api.py > /dev/null 2>&1 &"; // Đảm bảo đường dẫn đến file Python là chính xác
exec($command, $output, $return_var);

// Kiểm tra xem server có chạy thành công không
if ($return_var === 0) {
    echo json_encode(["status" => "success", "message" => "Server Flask đã được khởi động."]);
} else {
    echo json_encode(["status" => "fail", "message" => "Không thể khởi động server Flask."]);
}
?>
