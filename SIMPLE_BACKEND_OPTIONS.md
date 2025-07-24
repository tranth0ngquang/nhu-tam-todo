# Simple Backend Setup for Todo App

## 🎯 Giải pháp đơn giản: File Storage + Vercel

### ✨ Approach hiện tại:
- **Local**: File storage (data/todos.json)  
- **Production**: Memory storage (reset after 15 phút)

### 🚀 Cải thiện: Persistent File Storage

## Option 1: External JSON API (Đơn giản nhất)

### 1. Sử dụng JSONBin.io (Free)
```bash
# Free tier: 100 API calls/minute
# Persistent JSON storage
```

### 2. Setup trong .env.local:
```env
JSONBIN_API_KEY=your-api-key
JSONBIN_BIN_ID=your-bin-id
```

### 3. Tạo JSONBin storage service:
- Auto-sync mọi 30 giây
- Backup local nếu API fail
- Cross-device sync

## Option 2: GitHub Gist Storage (Free)

### 1. Create GitHub Personal Access Token
- Scope: `gist`
- Store in environment variables

### 2. Auto-commit changes to private gist
- File: `todos.json`
- Auto-sync across devices
- Version history built-in

## Option 3: Supabase (Free tier)

### 1. Create Supabase project
- Free: 500MB database
- Real-time subscriptions
- Built-in auth (nếu cần)

### 2. Simple table structure:
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY,
  title TEXT,
  completed BOOLEAN,
  priority TEXT,
  created_at TIMESTAMP
);
```

## 🎯 Recommendation: JSONBin.io

**Pros:**
- ✅ 5 phút setup
- ✅ Hoàn toàn free cho personal use
- ✅ No database knowledge needed
- ✅ API đơn giản như localStorage
- ✅ Cross-device sync
- ✅ Backup/restore dễ dàng

**Setup steps:**
1. Vào jsonbin.io → signup free
2. Create new bin với initial data: `[]`
3. Copy API key & bin ID
4. Add vào environment variables
5. Deploy → Done! 🎉
