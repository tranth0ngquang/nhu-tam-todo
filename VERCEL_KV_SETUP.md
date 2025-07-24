# Setup Vercel KV để Data Persistent

## ❗ Vấn đề hiện tại:
- Data bị reset sau 10-15 phút không hoạt động
- Vercel Functions "ngủ" → memory storage bị clear
- Cần persistent storage để giữ data lâu dài

## 🚀 Giải pháp: Setup Vercel KV (Redis)

### Step 1: Tạo KV Database
1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `nhu-tam-todo`
3. Vào tab **Storage** 
4. Click **Create Database** → **KV**
5. Đặt tên: `todo-storage`

### Step 2: Get Environment Variables
Sau khi tạo KV, copy 2 values:
```env
KV_REST_API_URL=https://your-kv-url.upstash.io
KV_REST_API_TOKEN=your-secret-token
```

### Step 3: Add Environment Variables
1. Vào **Settings** → **Environment Variables**
2. Add 2 variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
3. Save

### Step 4: Redeploy
1. Push any commit để trigger redeploy
2. Hoặc manual redeploy từ Deployments tab

## ✅ Sau khi setup:
- ✅ Data sẽ persistent across restarts
- ✅ No more data loss
- ✅ Fast Redis performance
- ✅ Automatic sync across all users

## 💰 Pricing:
- **Free tier**: 10,000 requests/month
- **Pro**: $20/month unlimited
- Perfect cho personal/small team use

## 🔧 Alternative (Manual):
Nếu không muốn setup KV, có thể:
1. Export data thường xuyên
2. Sử dụng local development chủ yếu
3. Chấp nhận data reset định kỳ
