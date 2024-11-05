let capturedImages = [];
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let photoCount = 0;
let capturedPhotos = [];
let photoCountElement = document.getElementById("photo-count");
let capturePhotoButton = document.getElementById("capture-photo");
let saveEmployeeButton = document.getElementById("save-employee");
let checkInButton = document.getElementById("check-in");
let checkOutButton = document.getElementById("check-out");
let employeeSelect = document.querySelector('select[name="employee-name"]');
const MAX_PHOTOS = 4;

// Khởi động camera
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error("Không thể truy cập camera: ", err);
        });
}
// Dừng camera
function stopCamera() {
    let stream = video.srcObject;
    if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
    }
    video.srcObject = null;
}

// Chụp ảnh và lưu vào mảng
capturePhotoButton.addEventListener("click", () => {
    if (photoCount < 4) {
        let context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Lưu ảnh dưới dạng base64
        let photoData = canvas.toDataURL("image/jpeg");
        capturedPhotos.push(photoData);

        photoCount++;
        photoCountElement.textContent = photoCount;

        if (photoCount === 4) {
            saveEmployeeButton.disabled = false;
        }
    } else {
        alert("Đã đủ 4 ảnh, không thể chụp thêm.");
    }
});

// Thêm nhân viên mới
saveEmployeeButton.addEventListener("click", () => {
    let employeeId = document.getElementById("employee-id").value;
    let employeeName = employeeSelect.value;

    if (!employeeId || !employeeName) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    // Gửi thông tin và ảnh lên API Flask
    fetch("http://hrhdgourmetchamcongstaff.rf.gd:5000/add-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: employeeName,
            employeeId: employeeId,
            photos: capturedPhotos,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status === "success") {
            alert(data.message);
            resetForm();
        } else {
            alert("Lỗi: " + data.message);
        }
    })
    .catch((error) => console.error("Lỗi khi thêm nhân viên:", error));
});

// Reset form sau khi thêm thành công
function resetForm() {
    document.getElementById("employee-id").value = "";
    employeeSelect.selectedIndex = 0;
    photoCount = 0;
    capturedPhotos = [];
    photoCountElement.textContent = photoCount;
    saveEmployeeButton.disabled = true;
}

// Xử lý chấm công
async function recognizeFace(attendanceType) {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    const base64Image = imageData.split(',')[1];

    const response = await fetch('http://hrhdgourmetchamcongstaff.rf.gd:5000/recognize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: base64Image,
            type: attendanceType
        })
    });

    const result = await response.json();
    alert(result.message);
}

document.getElementById('check-in').addEventListener('click', () => recognizeFace('in'));
document.getElementById('check-out').addEventListener('click', () => recognizeFace('out'));
// Bắt đầu camera khi người dùng tương tác
employeeSelect.addEventListener("change", startCamera);
checkInButton.addEventListener("click", startCamera);
checkOutButton.addEventListener("click", startCamera);