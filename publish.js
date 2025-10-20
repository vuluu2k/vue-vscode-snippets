#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Đọc package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Hàm tăng version
function incrementVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);
  
  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  return parts.join('.');
}

// Hàm publish extension
async function publishExtension(token, versionType = 'patch') {
  try {
    console.log('🚀 Bắt đầu quá trình publish extension...');
    
    // 1. Tăng version
    const currentVersion = packageJson.version;
    const newVersion = incrementVersion(currentVersion, versionType);
    
    console.log(`📦 Tăng version từ ${currentVersion} lên ${newVersion}`);
    
    // Cập nhật package.json
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    
    // 2. Kiểm tra token
    if (!token) {
      console.error('❌ Vui lòng cung cấp Personal Access Token');
      console.log('Cách sử dụng: node publish.js YOUR_TOKEN [version_type]');
      console.log('Version types: patch (default), minor, major');
      process.exit(1);
    }
    
    // 3. Tạo namespace nếu chưa có
    console.log('🏗️  Kiểm tra namespace...');
    try {
      execSync(`ovsx create-namespace ${packageJson.publisher} -p ${token}`, { stdio: 'pipe' });
      console.log('✅ Namespace đã được tạo hoặc đã tồn tại');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Namespace đã tồn tại');
      } else {
        console.log('⚠️  Có thể namespace đã tồn tại hoặc có lỗi khác');
      }
    }
    
    // 4. Publish extension
    console.log('📤 Publishing extension lên OpenVSX...');
    execSync(`ovsx publish -p ${token}`, { stdio: 'inherit' });
    
    console.log('🎉 Extension đã được publish thành công!');
    console.log(`📋 Thông tin:`);
    console.log(`   - Publisher: ${packageJson.publisher}`);
    console.log(`   - Name: ${packageJson.name}`);
    console.log(`   - Version: ${newVersion}`);
    console.log(`   - URL: https://open-vsx.org/extension/${packageJson.publisher}/${packageJson.name}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi publish:', error.message);
    
    // Rollback version nếu có lỗi
    if (packageJson.version !== currentVersion) {
      packageJson.version = currentVersion;
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log('🔄 Đã rollback version về trạng thái ban đầu');
    }
    
    process.exit(1);
  }
}

// Lấy arguments từ command line
const args = process.argv.slice(2);
const token = args[0];
const versionType = args[1] || 'patch';

// Validate version type
const validVersionTypes = ['patch', 'minor', 'major'];
if (!validVersionTypes.includes(versionType)) {
  console.error('❌ Version type không hợp lệ. Sử dụng: patch, minor, hoặc major');
  process.exit(1);
}

// Chạy publish
publishExtension(token, versionType);
