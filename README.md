Deskripsi umum & tujuan proyek
Project ini adalah project database peminjaman buku perpustakaan dengan CRUD, yang dimana kita dapat menambahkan member, books, dan loans yang di inginkan melalui postman.
Struktur data / schema
books: id (UUID, PK), title (VARCHAR), author (VARCHAR), stock (INTEGER), created_at (TIMESTAMPTZ).

members: id (UUID, PK), name (VARCHAR), email (VARCHAR, UNIQUE), created_at (TIMESTAMPTZ).

loans: id (UUID, PK), member_id (UUID, FK), book_id (UUID, FK), loan_date (DATE), due_date (DATE), return_date (DATE), status (VARCHAR), created_at (TIMESTAMPTZ).

Contoh request dan response
Request menambah buku
[POST /api/books]
{
  "title": "Pemrograman Python",
  "author": "Andi Wijaya",
  "stock": 10
}
Respond
{
  "message": "Buku berhasil ditambahkan.",
  "data": {
    "id": "UUID_BUKU",
    "title": "Pemrograman Python",
    "author": "Andi Wijaya",
    "stock": 10,
    "created_at": "2026-10-10T10:00:00+00:00"
  }
}

Panduan instalasi & cara menjalankan lokal
1. Install dependency: 
a. Jalankan
npm install
npm install express @supabase/supabase-js dotenv
npm install --save-dev nodemon

b. Buat .env dengan supabase anda
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=ISI_SECRET_KEY_SUPABASE
PORT=3000

c. Jalankan server
gunakan perintah:
npm run dev
jika berhasil maka:
Server berjalan di http://localhost:3000

d. Test API
di postman coba buka link ini dengan perintah GET
[GET] http://localhost:3000/

[GET] http://localhost:3000/api/books

[GET] http://localhost:3000/api/members

[GET] http://localhost:3000/api/loans

Link hasil deployment Vercel
