# Hướng dẫn Triển khai EduBot AI (Luminance) lên GitHub & Vercel/Netlify

Dự án này được xây dựng bằng **React + Vite + Tailwind CSS** và sử dụng **Google Gemini API**. Dưới đây là các bước để bạn đưa ứng dụng từ AI Studio lên chạy online.

---

## Bước 1: Tải mã nguồn về máy
1. Trong giao diện AI Studio, chọn biểu tượng **Settings (Cài đặt)** hoặc menu xuất hiện ở góc (tùy phiên bản).
2. Chọn **Export to GitHub** (đưa thẳng lên kho lưu trữ của bạn) hoặc **Download ZIP** (tải về máy tính).

---

## Bước 2: Chạy ứng dụng dưới máy cục bộ (Local)
1. Giải nén tệp ZIP (nếu bạn tải về).
2. Mở thư mục dự án bằng **VS Code** hoặc terminal.
3. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
4. Tạo tệp `.env` ở thư mục gốc (ngang hàng với `package.json`):
   ```env
   GEMINI_API_KEY="DÁN_KHÓA_API_CỦA_BẠN_VÀO_ĐÂY"
   ```
5. Chạy thử nghiệm:
   ```bash
   npm run dev
   ```
   Mở trình duyệt theo địa chỉ `http://localhost:3000`.

---

## Bước 3: Triển khai lên GitHub Pages (Dùng cho Static Site)
Để ứng dụng chạy đúng trên GitHub Pages, tôi đã cấu hình `base: './'` trong tệp `vite.config.ts`. Điều này giúp các file CSS và JS được tải đúng đường dẫn dù website nằm ở thư mục con.

1. Đẩy code lên GitHub.
2. Vào **Settings > Pages**.
3. Tại **Build and deployment**, chọn **GitHub Actions** làm nguồn.
4. Bạn có thể sử dụng mẫu workflow của Vite cho GitHub Pages (search "Vite deploy GitHub Actions").

### Đối với Vercel:
1. Đẩy mã nguồn lên một repository trên **GitHub**.
2. Truy cập [Vercel.com](https://vercel.com) và đăng nhập bằng GitHub.
3. Chọn **Add New > Project**, tìm đến repository của bạn và nhấn **Import**.
4. **QUAN TRỌNG (Cấu hình API Key):** 
   - Tại phần **Environment Variables**, nhập:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: (Dán khóa API của bạn vào)
5. Nhấn **Deploy**.

---

## Bước 4: Triển khai lên GitHub Pages (Thủ công hơn)
Nếu bạn chọn GitHub Pages, bạn cần sử dụng **GitHub Actions** để tự động build.

1. Vào repository trên GitHub > **Settings** > **Secrets and variables** > **Actions**.
2. Nhấn **New repository secret**.
   - Name: `GEMINI_API_KEY`
   - Secret: (Dán khóa API)
3. Bạn cần một file workflow `.github/workflows/deploy.yml` (nếu chưa có) để GitHub tự động lấy khóa này khi đóng gói (build) ứng dụng.

---

## Lưu ý về bảo mật (CỰC KỲ QUAN TRỌNG)
- **KHÔNG** bao giờ dán trực tiếp API Key vào trong mã nguồn (file .tsx).
- Luôn sử dụng biến môi trường qua `process.env.GEMINI_API_KEY` (như tôi đã cài đặt sẵn trong `vite.config.ts`).
- Tệp `.env` đã được liệt kê trong `.gitignore` để không bị đẩy lên GitHub công khai.

Chúc bạn triển khai thành công trợ lý giáo dục của mình!
