# Auto Publish Script cho Vue VSCode Snippets

Script này giúp tự động publish extension lên OpenVSX với việc tăng version tự động.

## Cách sử dụng

### 1. Thiết lập Environment Variable

Tạo file `.env` hoặc export token:

```bash
# Cách 1: Export trong terminal
export OPENVSX_TOKEN="your_personal_access_token_here"

# Cách 2: Tạo file .env
echo "OPENVSX_TOKEN=your_personal_access_token_here" > .env
```

### 2. Chạy script

```bash
# Publish với patch version (1.0.0 -> 1.0.1)
npm run publish:patch

# Publish với minor version (1.0.0 -> 1.1.0)
npm run publish:minor

# Publish với major version (1.0.0 -> 2.0.0)
npm run publish:major

# Publish mặc định (patch)
npm run publish
```

### 3. Chạy trực tiếp

```bash
# Với token trực tiếp
node publish.js YOUR_TOKEN patch

# Các loại version
node publish.js YOUR_TOKEN patch   # 1.0.0 -> 1.0.1
node publish.js YOUR_TOKEN minor   # 1.0.0 -> 1.1.0
node publish.js YOUR_TOKEN major   # 1.0.0 -> 2.0.0
```

## Tính năng

- ✅ Tự động tăng version (patch/minor/major)
- ✅ Tự động tạo namespace nếu chưa có
- ✅ Rollback version nếu có lỗi
- ✅ Hiển thị thông tin chi tiết sau khi publish
- ✅ Kiểm tra token và validation

## Lưu ý

- Đảm bảo đã ký Eclipse Contributor Agreement (ECA)
- Token chỉ hiển thị một lần khi tạo trên OpenVSX
- Script sẽ tự động rollback version nếu publish thất bại
