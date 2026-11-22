# Apps site (static, free hosting)

Trang web tĩnh, không cần build. Nội dung nằm trong 2 file JSON:

- `site.json`: tên thương hiệu, slogan, QR ủng hộ, liên hệ, giới thiệu.
- `apps.json`: danh sách ứng dụng. Thêm app = thêm một mục.

## Đổi tên thương hiệu
Sửa `"brand"` trong `site.json`. Điền `contact.email`, `contact.issues_url`, `donate.intl_url` (PayPal/Ko-fi) nếu có.

## Thêm một ứng dụng mới
1. Sao chép mục `heic2jpg` trong `apps.json`, đổi `id` (chữ thường, không dấu, không khoảng trắng), tên, mô tả, tính năng.
2. Đặt file cài đặt vào `downloads/` (hoặc dùng link GitHub Releases trong `download`).
3. Tính SHA256 và dán vào `sha256`:
   `Get-FileHash .\downloads\TenApp.exe -Algorithm SHA256`
4. Thêm khóa mới vào `categories` trong `site.json` nếu dùng nhóm mới.

## Xem thử trên máy
Phải chạy qua web server (mở file trực tiếp sẽ không tải được JSON):

    python -m http.server 8080

rồi mở http://localhost:8080

## Đưa lên GitHub Pages (miễn phí)
1. Tạo tài khoản GitHub, tạo repo mới (ví dụ `apps`), đặt ở chế độ Public.
2. Đưa toàn bộ nội dung thư mục này lên repo (kéo thả trên web github.com hoặc dùng git).
   Đừng đặt kho git trong Google Drive; để ở thư mục thường như `C:\dev`.
3. Repo → Settings → Pages → Source: "Deploy from a branch", nhánh `main`, thư mục `/ (root)`.
4. Sau 1-2 phút web có địa chỉ `https://<tên-github>.github.io/apps/`.

## File lớn (.exe)
GitHub Pages cho phép file dưới 100 MB. Nếu nhiều app hoặc file lớn, dùng GitHub Releases:
tạo Release, tải file lên, rồi dán link tải vào `download` trong `apps.json`.

## Tên miền riêng (tùy chọn)
Mua tên miền rồi trỏ vào GitHub Pages (Settings → Pages → Custom domain).
