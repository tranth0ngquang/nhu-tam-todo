# Todo List App

Ứng dụng quản lý danh sách công việc được xây dựng với Next.js và Shadcn UI.

## Tính năng

- ✅ Thêm, sửa, xóa công việc
- ✅ Đánh dấu công việc hoàn thành
- ✅ **Mức độ ưu tiên**: Thấp, Trung bình, Cao, Khẩn cấp
- ✅ **Sắp xếp thông minh**: 
  - Tab "Chưa làm": Ưu tiên cao nhất ở trên
  - Tab "Đã làm": Hoàn thành sớm nhất ở dưới (lịch sử)
- ✅ **Backend API**: Next.js API Routes thay vì localStorage
- ✅ **Multi-device**: Sync data qua network (2-3 máy)
- ✅ 2 tab: "Chưa làm" và "Đã làm"
- ✅ File-based JSON database (không cần MySQL/PostgreSQL)
- ✅ Giao diện đẹp với Shadcn UI và priority badges
- ✅ Responsive design tối ưu cho mobile
- ✅ Error handling và loading states
- ✅ TypeScript hỗ trợ

## Công nghệ sử dụng

- **Next.js 14+** - React framework với App Router
- **Next.js API Routes** - Backend API built-in
- **TypeScript** - Type safety
- **JSON File Database** - Simple file-based storage
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI components
- **Lucide React** - Icons

## Cách chạy dự án

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Mở trình duyệt và truy cập: `http://localhost:3001`

## Cấu trúc dự án

```
src/
├── app/
│   ├── api/
│   │   └── todos/       # API Routes
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── AddTodoForm.tsx
│   ├── TodoItem.tsx
│   └── TodoList.tsx
├── hooks/
│   └── useTodos.ts      # Custom hook quản lý todos
├── services/
│   └── todoService.ts   # API service layer
├── types/
│   └── todo.ts          # TypeScript types
├── lib/
│   └── utils.ts         # Utility functions
└── data/
    └── todos.json       # JSON Database
```

## Tính năng chi tiết

### Quản lý công việc
- **Thêm việc mới**: Nhấn nút "Thêm việc mới", điền thông tin, chọn mức độ ưu tiên và lưu
- **Sửa việc**: Nhấn icon chỉnh sửa trên từng item (có thể thay đổi cả ưu tiên)
- **Xóa việc**: Nhấn icon thùng rác
- **Đánh dấu hoàn thành**: Tick vào checkbox

### Mức độ ưu tiên
- 🔴 **Khẩn cấp**: Việc cần làm ngay lập tức
- 🟠 **Cao**: Việc quan trọng cần ưu tiên
- 🔵 **Trung bình**: Việc bình thường (mặc định)
- 🟢 **Thấp**: Việc có thể làm sau

### Sắp xếp thông minh
- **Tab "Chưa làm"**: Tự động sắp xếp theo độ ưu tiên (Khẩn cấp → Cao → Trung bình → Thấp)
- **Tab "Đã làm"**: Sắp xếp theo thời gian hoàn thành (việc hoàn thành sớm nhất ở dưới cùng)

### Lưu trữ dữ liệu
- Dữ liệu được lưu trong file `data/todos.json` trên server
- **Multi-device support**: Các máy khác có thể truy cập qua IP của máy chạy server
- Tự động sync khi có thay đổi
- Easy backup: Chỉ cần copy file JSON
- Không cần cài đặt database phức tạp

### Network Access (2-3 máy)
- **Máy chủ**: Chạy `npm run dev` trên máy chính
- **Máy khác**: Truy cập `http://IP-máy-chủ:3001`
- Ví dụ: `http://192.168.1.100:3001`
- Tất cả thay đổi được sync realtime

### Giao diện
- **Tab "Chưa làm"**: Hiển thị các công việc chưa hoàn thành
- **Tab "Đã làm"**: Hiển thị lịch sử các công việc đã hoàn thành
- **Responsive**: Hoạt động tốt trên mọi thiết bị

## Scripts

- `npm run dev` - Chạy development server (http://localhost:3000)
- `npm run build` - Build production (✅ Ready for deployment)
- `npm run start` - Chạy production server
- `npm run lint` - Kiểm tra code style

## Deployment

✅ **Production Ready**: Ứng dụng đã được tối ưu và sẵn sàng deploy lên Vercel hoặc các platform khác.

- Build thành công với TypeScript + ESLint validation
- Tất cả API routes hoạt động ổn định
- Static pages được tối ưu tự động
- Compatible với Vercel Serverless Functions

### **🚀 Deploy lên Vercel:**

1. **Push code lên GitHub**
2. **Connect với Vercel Dashboard**
3. **Setup Vercel KV (Redis):**
   - Vào Vercel Dashboard > Storage > Create KV Database
   - Copy `KV_REST_API_URL` và `KV_REST_API_TOKEN`
   - Add vào Environment Variables trong Vercel project
4. **Deploy**: Sẽ tự động success! 🎉

### **💾 Storage Solutions:**

#### **Local Development:**
- Sử dụng file `data/todos.json` 
- Tự động sync realtime giữa các máy trong mạng

#### **Production (Vercel):**
- Sử dụng **Vercel KV (Redis)** cho cloud storage
- Fast, scalable, serverless-friendly
- Automatic fallback to memory storage nếu KV unavailable

### **🔧 Environment Variables:**
```env
# Add these to Vercel Dashboard > Settings > Environment Variables
KV_REST_API_URL=your_kv_rest_api_url  
KV_REST_API_TOKEN=your_kv_rest_api_token
```

### **📱 Multi-device Access:**
- **Local**: `http://localhost:3000` và `http://YOUR-IP:3000`
- **Production**: `https://your-app.vercel.app`
- Data sync tự động across all devices
