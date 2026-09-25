# 🎓 INTERNHUB – HỆ THỐNG QUẢN LÝ TUYỂN DỤNG VÀ THỰC TẬP SINH UET

> **Dự án thuộc Học phần Thực hành Doanh nghiệp – Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội (UET - VNU)**  
> **Tác giả / Mã sinh viên**: `23021642`  
> **Email**: `23021642@vnu.edu.vn`  
> **Công nghệ**: Spring Boot 3 (Java 17) + Spring Security (JWT) + React 19 (Vite) + Tailwind/Vanilla CSS + MySQL Database (XAMPP)

---

## 📌 1. Giới thiệu tổng quan

**InternHub** là nền tảng quản trị và kết nối thực tập chuyên nghiệp dành riêng cho sinh viên Đại học Công nghệ (UET) cùng các doanh nghiệp công nghệ hàng đầu (FPT Software, Viettel Solutions, TechCorp Innovation Lab...). Hệ thống giải quyết bài toán quản lý quy trình thực tập theo mô hình khép kín: **Đăng tin ➔ Nộp hồ sơ & CV ➔ Sàng lọc & Phỏng vấn ➔ Tiếp nhận thực tập & Đánh giá**.

---

## 🌟 2. Các tính năng chính theo phân quyền (Roles)

### 🎓 2.1. Dành cho Sinh viên (Student)
- **Đăng ký & Đăng nhập**: Xác thực tài khoản sinh viên với email VNU (`@vnu.edu.vn`).
- **Hồ sơ cá nhân & CV**:
  - Quản lý mã sinh viên, trường đại học, chuyên ngành, điểm GPA tích lũy.
  - Gắn thẻ các kỹ năng chuyên môn (Java, Spring Boot, React, Python, Docker, AI...).
  - Đính kèm liên kết GitHub, LinkedIn, Portfolio.
  - **Tải lên file CV trực tiếp** (hỗ trợ file PDF/HTML) hoặc liên kết CV trực tuyến.
- **Tìm kiếm & Lọc việc làm**:
  - Tìm kiếm theo từ khóa vị trí, công ty.
  - Lọc theo kỹ năng chuyên môn, hình thức làm việc (Thực tập / Toàn thời gian), địa điểm, mức trợ cấp.
- **Ứng tuyển & Quản lý hồ sơ (Application Pipeline)**:
  - Nộp đơn ứng tuyển kèm Thư giới thiệu (Cover Letter) tùy chỉnh.
  - **Ràng buộc chống nộp trùng**: Hệ thống tự động ngăn chặn nộp nhiều lần vào cùng một vị trí.
  - Theo dõi trạng thái hồ sơ theo thời gian thực: `Đã nộp (APPLIED)` ➔ `Đang xét duyệt (REVIEWING)` ➔ `Mời phỏng vấn (INTERVIEW)` ➔ `Đã nhận (ACCEPTED)` / `Từ chối (REJECTED)`.
  - Nhận thông báo lịch phỏng vấn chi tiết (Thời gian, Link Google Meet/Zoom, Ghi chú ôn tập).

### 🏢 2.2. Dành cho Doanh nghiệp (Company)
- **Quản lý thông tin doanh nghiệp**: Cập nhật logo nhận diện, địa chỉ trụ sở, website, quy mô nhân sự, lĩnh vực hoạt động.
- **Đăng & Quản lý tin tuyển dụng**:
  - Tạo mới tin tuyển dụng với mức trợ cấp, chỉ tiêu tuyển dụng, hạn nộp, mô tả công việc, yêu cầu và quyền lợi.
  - Chỉnh sửa, đóng/mở tin tuyển dụng linh hoạt.
- **Sàng lọc & Đánh giá ứng viên**:
  - **Cô lập dữ liệu nghiêm ngặt (Multi-tenant Data Isolation)**: Doanh nghiệp chỉ quản lý tin đăng và danh sách ứng viên thuộc về doanh nghiệp mình.
  - Lọc ứng viên theo vị trí tuyển dụng hoặc theo trạng thái hồ sơ.
  - Xem thông tin chi tiết ứng viên: GPA, kỹ năng, mở CV trực tiếp và đọc thư giới thiệu.
- **Lên lịch phỏng vấn & Phê duyệt**:
  - Chuyển trạng thái hồ sơ, gửi nhận xét đánh giá.
  - Đặt lịch hẹn ngày giờ, đính kèm link họp trực tuyến và hướng dẫn cho ứng viên.

### 👑 2.3. Dành cho Quản trị viên (Admin)
- **Dashboard Thống kê & Phân tích tổng quan**:
  - Thống kê tổng số sinh viên, doanh nghiệp đối tác, tin tuyển dụng mở, tổng lượt ứng tuyển và tỷ lệ trúng tuyển.
  - Biểu đồ phân bố hồ sơ theo từng giai đoạn và cơ cấu hình thức làm việc.
- **Quản trị người dùng & Phân quyền**:
  - Xem danh sách tất cả tài khoản người dùng trên hệ thống.
  - Lọc theo vai trò (`ROLE_STUDENT`, `ROLE_COMPANY`, `ROLE_ADMIN`).
  - Khóa / Kích hoạt tài khoản, chỉnh sửa thông tin tài khoản người dùng.
- **Kiểm duyệt & Quản lý toàn bộ tin tuyển dụng**:
  - Xem, chỉnh sửa và xóa tất cả các tin tuyển dụng của mọi doanh nghiệp.
  - Quản lý danh mục kỹ năng hệ thống (thêm/xóa skill tags).
  - Gửi thông báo phát thanh (Broadcast Notification) tới toàn bộ người dùng.

---

## 🛠️ 3. Kiến trúc Công nghệ & Cấu trúc Thư mục

### Công nghệ sử dụng
- **Frontend**: React 19, Vite, Lucide Icons, Vanilla/Modern CSS Design System (Glassmorphism, Responsive UI).
- **Backend**: Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security, JWT (JSON Web Token), Lombok, Maven.
- **Database**: MySQL 8.0+ (hỗ trợ XAMPP / MySQL Workbench).

### Cấu trúc dự án
```text
internhub/
├── backend/                        # Mã nguồn Spring Boot REST API
│   ├── src/main/java/com/internhub/app/
│   │   ├── config/                 # Cấu hình Security & DataInitializer
│   │   ├── controller/             # REST API Controllers (Auth, Job, Application, Admin, Profile)
│   │   ├── dto/                    # Request/Response Data Transfer Objects
│   │   ├── model/                  # JPA Entities (User, Job, Application, StudentProfile, CompanyProfile, Skill)
│   │   ├── repository/             # Spring Data JPA Repositories
│   │   ├── security/               # JWT Token Provider, Filters & UserPrincipal
│   │   └── service/                # Business Logic Services
│   ├── src/main/resources/
│   │   └── application.properties  # Cấu hình Database MySQL & Port
│   └── pom.xml                     # Quản lý dependencies Maven
├── frontend/                       # Mã nguồn giao diện React (Vite)
│   ├── public/                     # Logo doanh nghiệp SVG, favicon, sample CV
│   ├── src/
│   │   ├── api/                    # API Client & Data Fallback
│   │   ├── components/             # Navbar, Footer, JobCard, JobDetailModal, ApplyModal, AuthModal...
│   │   ├── context/                # AuthContext (Quản lý State & LocalStorage)
│   │   ├── pages/                  # HomePage, JobsPage, CompaniesPage, StudentDashboard, CompanyDashboard, AdminDashboard, ProfilePage
│   │   ├── index.css               # Hệ thống Stylesheets & Animation
│   │   └── App.jsx                 # Routing & Layout
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql                  # Script khởi tạo cơ sở dữ liệu MySQL
└── README.md                       # Tài liệu hướng dẫn sử dụng
```

---

## 🚀 4. Hướng dẫn cài đặt & Khởi chạy dự án

### Yêu cầu môi trường
- **Java JDK 17** trở lên.
- **Node.js 18** trở lên & `npm`.
- **MySQL 8.0** trở lên (hoặc **XAMPP**).

---

### Bước 1: Khởi động Cơ sở dữ liệu MySQL (XAMPP / Workbench)

1. Mở **XAMPP Control Panel** $\to$ Bấm **Start** tại dịch vụ **MySQL** (Cổng mặc định: `3306`).
2. *(Tùy chọn)* Truy cập `http://localhost/phpmyadmin` hoặc **MySQL Workbench** và thực thi script có sẵn tại [database/schema.sql](file:///d:/internhub/database/schema.sql):
```sql
CREATE DATABASE IF NOT EXISTS internhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE internhub;
-- Chạy nội dung file database/schema.sql
```
*(Nếu database chưa tạo, Spring Boot cũng sẽ tự động tạo database `internhub` và tự nạp toàn bộ dữ liệu mẫu).*

---

### Bước 2: Khởi chạy Backend (Spring Boot API)

Mở terminal tại thư mục `backend`:

```powershell
cd d:\internhub\backend
.\mvnw.cmd spring-boot:run
```

- **Backend REST API**: `http://localhost:8080`

---

### Bước 3: Khởi chạy Frontend (React + Vite)

Mở một cửa sổ terminal khác tại thư mục `frontend`:

```powershell
cd d:\internhub\frontend
npm install
npm run dev
```

- Truy cập giao diện ứng dụng tại: **`http://localhost:5173`**

---

## 🔑 5. Danh sách Tài khoản mẫu (Demo Accounts)

Hệ thống có sẵn các tài khoản mẫu cho từng vai trò:

| Vai trò | Tên đăng nhập | Mật khẩu | Tên hiển thị / Đơn vị |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin` | `admin123` | Quản Trị Viên InternHub - UET |
| **Doanh nghiệp (Viettel)** | `viettel_solutions` | `123456` | Viettel Enterprise Solutions |
| **Doanh nghiệp (FPT)** | `fpt_software` | `123456` | FPT Software Tuyển Dụng |
| **Doanh nghiệp (TechCorp)** | `techcorp` | `company123` | TechCorp Innovation Lab |
| **Sinh viên (UET 1)** | `student_uet` | `student123` | Nguyễn Văn An (GPA 3.68 - K66 CLC) |
| **Sinh viên (UET 2)** | `student2` | `123456` | Trần Thị Mai Linh (GPA 3.82 - KHMT) |

---

## 📡 6. Bảng danh mục RESTful API Endpoints

| Nhóm chức năng | Endpoint | Phương thức | Quyền truy cập | Mô tả chức năng |
| :--- | :--- | :---: | :---: | :--- |
| **Xác thực** | `/api/auth/register` | `POST` | Public | Đăng ký tài khoản mới (Sinh viên / Doanh nghiệp) |
| **Xác thực** | `/api/auth/login` | `POST` | Public | Đăng nhập và nhận JWT Access Token |
| **Tin tuyển dụng** | `/api/jobs` | `GET` | Public | Lấy danh sách tin tuyển dụng (kèm bộ lọc tìm kiếm) |
| **Tin tuyển dụng** | `/api/jobs/{id}` | `GET` | Public | Xem chi tiết tin tuyển dụng |
| **Tin tuyển dụng** | `/api/jobs` | `POST` | `ROLE_COMPANY`, `ROLE_ADMIN` | Đăng tin tuyển dụng mới |
| **Tin tuyển dụng** | `/api/jobs/{id}` | `PUT` | `ROLE_COMPANY`, `ROLE_ADMIN` | Chỉnh sửa nội dung tin tuyển dụng |
| **Tin tuyển dụng** | `/api/jobs/{id}` | `DELETE` | `ROLE_COMPANY`, `ROLE_ADMIN` | Xóa tin tuyển dụng |
| **Hồ sơ ứng tuyển** | `/api/applications` | `POST` | `ROLE_STUDENT` | Nộp hồ sơ ứng tuyển (chống nộp trùng) |
| **Hồ sơ ứng tuyển** | `/api/applications/student` | `GET` | `ROLE_STUDENT` | Xem danh sách các việc đã ứng tuyển |
| **Hồ sơ ứng tuyển** | `/api/applications/company` | `GET` | `ROLE_COMPANY` | Xem danh sách ứng viên nộp vào công ty |
| **Hồ sơ ứng tuyển** | `/api/applications/{id}/status` | `PUT` | `ROLE_COMPANY`, `ROLE_ADMIN` | Cập nhật trạng thái, lên lịch phỏng vấn |
| **Quản trị hệ thống** | `/api/admin/stats` | `GET` | `ROLE_ADMIN` | Thống kê số liệu dashboard tổng quan |
| **Quản trị hệ thống** | `/api/admin/users` | `GET` | `ROLE_ADMIN` | Quản lý danh sách toàn bộ người dùng |
| **Quản trị hệ thống** | `/api/admin/users/{id}/toggle-status`| `PUT` | `ROLE_ADMIN` | Khóa / Kích hoạt tài khoản người dùng |

---

## 📑 7. Tài liệu & Kiểm thử API với Swagger UI (OpenAPI 3.0)

Hệ thống đã tích hợp sẵn **Swagger UI** giúp kiểm thử trực quan toàn bộ API:

- **Swagger UI Interactive Web**: **`http://localhost:8080/swagger-ui/index.html`**
- **OpenAPI JSON Schema**: `http://localhost:8080/v3/api-docs`
- **Bộ API Postman Collection**: Có sẵn tại file [database/InternHub_API_Collection.json](file:///d:/internhub/database/InternHub_API_Collection.json) để import và chạy thử nghiệm.

### Hướng dẫn kiểm thử tự động (JUnit 5 + MockMvc):
Mở terminal tại thư mục `backend` và chạy lệnh:
```powershell
.\mvnw.cmd test
```
Kết quả kiểm thử tự động sẽ trả về **`BUILD SUCCESS (100% Passed)`** làm minh chứng đạt chuẩn chất lượng.

---

## 📋 8. Kế hoạch Phân nhánh Git & Đóng góp

Dự án tuân thủ mô hình **Git Flow** chuẩn:
- **`main`**: Nhánh lưu trữ các phiên bản phát hành ổn định (Release).
- **`develop`**: Nhánh tích hợp tính năng.
- **`feature/auth`**: Triển khai xác thực, đăng nhập/đăng ký, JWT và phân quyền.
- **`feature/jobs`**: Triển khai quản lý việc làm, tìm kiếm và bộ lọc kỹ năng.
- **`feature/application`**: Triển khai quy trình ứng tuyển, upload CV và chống nộp trùng.
- **`feature/admin`**: Triển khai dashboard thống kê, quản trị người dùng và cô lập dữ liệu.
