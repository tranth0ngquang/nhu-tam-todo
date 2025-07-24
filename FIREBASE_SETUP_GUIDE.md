# 🔥 Firebase Setup Guide - Real-time Todo Storage

## Bước 1: Tạo Firebase Project

### 1.1 Vào Firebase Console
- Truy cập: https://console.firebase.google.com/
- Đăng nhập với Google account
- Click **"Create a project"**

### 1.2 Thiết lập Project
```
Project name: nhu-tam-todo (hoặc tên bạn muốn)
✅ Enable Google Analytics (optional)
```

### 1.3 Chờ project được tạo (~30 giây)

---

## Bước 2: Setup Web App

### 2.1 Add Web App
- Trong project dashboard, click **"Web" icon** (`</>`)
- App nickname: `nhu-tam-todo-web`
- ✅ **Tick "Also set up Firebase Hosting"** (optional)
- Click **"Register app"**

### 2.2 Copy Firebase Config
- Sẽ hiển thị code như này:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC9X2Y3Z4W5V6U7T8R9...",
  authDomain: "nhu-tam-todo.firebaseapp.com",
  projectId: "nhu-tam-todo",
  storageBucket: "nhu-tam-todo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### ⚠️ **TODO 1: Update Firebase Config**
- Copy config này
- Dán vào file: `src/lib/firebase.ts`
- Thay thế config hiện tại

---

## Bước 3: Enable Firestore Database

### 3.1 Vào Firestore
- Trong sidebar, click **"Firestore Database"**
- Click **"Create database"**

### 3.2 Security Rules
- Chọn **"Start in test mode"** (cho development)
- Click **"Next"**

### 3.3 Location
- Chọn **"asia-southeast1 (Singapore)"** (gần VN nhất)
- Click **"Done"**

### ⚠️ **TODO 2: Update Security Rules**
Sau khi test xong, vào **"Rules"** tab và update:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to todos collection
    match /todos/{document} {
      allow read, write: if true; // Tạm thời cho test
      // TODO: Add authentication later
    }
  }
}
```

---

## Bước 4: Switch từ JSONBin sang Firebase

### ⚠️ **TODO 3: Update API Routes**
Trong các file này, uncomment Firebase imports:

**File: `src/app/api/todos/route.ts`**
```typescript
// Đổi từ:
import { getAllTodos, createTodo } from '@/services/jsonBinStorage';

// Thành:
import { getAllTodos, createTodo } from '@/services/firebaseStorage';
```

**File: `src/app/api/todos/[id]/route.ts`**
```typescript
// Đổi từ:
import { updateTodo, deleteTodo } from '@/services/jsonBinStorage';

// Thành:
import { updateTodo, deleteTodo } from '@/services/firebaseStorage';
```

---

## Bước 5: Test & Deploy

### 5.1 Test Local
```bash
npm run dev
```

### 5.2 Check Firebase Console
- Vào **"Firestore Database"**
- Tạo todo mới trong app
- Xem data xuất hiện trong Firebase Console

### 5.3 Deploy
```bash
git add .
git commit -m "Switch to Firebase Firestore"
git push
```

---

## ✅ Kết quả sau khi setup:

- ✅ **Real-time sync** across devices
- ✅ **Persistent storage** forever
- ✅ **Free tier**: 50,000 reads/day
- ✅ **Scalable** architecture
- ✅ **Offline support** built-in
- ✅ **No server maintenance**

## 🚀 Bonus Features (có thể thêm sau):

- **Authentication**: Google/Email login
- **Multi-user**: Mỗi user có todos riêng
- **Real-time collaboration**: Nhiều người edit cùng lúc
- **Push notifications**: Nhắc nhở deadline
- **File attachments**: Upload ảnh vào todos

## 💡 Tips:

1. **Development**: Dùng test mode rules
2. **Production**: Setup authentication + security rules
3. **Monitoring**: Xem usage trong Firebase Console
4. **Backup**: Firebase tự backup, không cần lo

---

**Ready to go? Follow các TODO steps above! 🔥**
