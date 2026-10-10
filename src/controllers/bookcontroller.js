
import * as bookModel from '../models/bookmodel.js';

function handleError(res, error, message) {
  console.error(error);

  if (error.code === '23503') {
    return res.status(409).json({
      error: 'Buku masih digunakan dalam data peminjaman.'
    });
  }

  if (error.code === '23514') {
    return res.status(400).json({
      error: 'Stok buku tidak boleh negatif.'
    });
  }

  return res.status(500).json({ error: message });
}

export async function getAllBooks(req, res) {
  try {
    const data = await bookModel.getAllBooks();
    return res.status(200).json({ total: data.length, data });
  } catch (error) {
    return handleError(res, error, 'Gagal mengambil data buku.');
  }
}

export async function getBookById(req, res) {
  try {
    const data = await bookModel.getBookById(req.params.id);

    if (!data) {
      return res.status(404).json({ error: 'Buku tidak ditemukan.' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return handleError(res, error, 'Gagal mengambil detail buku.');
  }
}

export async function createBook(req, res) {
  try {
    const { title, author, stock = 0 } = req.body;

    if (
      typeof title !== 'string' || !title.trim() ||
      typeof author !== 'string' || !author.trim()
    ) {
      return res.status(400).json({
        error: 'Judul dan penulis wajib diisi.'
      });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        error: 'Stok harus berupa bilangan bulat minimal 0.'
      });
    }

    const data = await bookModel.createBook({
      title: title.trim(),
      author: author.trim(),
      stock
    });

    return res.status(201).json({
      message: 'Buku berhasil ditambahkan.',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Gagal menambahkan buku.');
  }
}

export async function updateBook(req, res) {
  try {
    const allowed = ['title', 'author', 'stock'];
    const payload = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'Masukkan data buku yang ingin diperbarui.'
      });
    }

    if (
      ('title' in payload &&
        (typeof payload.title !== 'string' || !payload.title.trim())) ||
      ('author' in payload &&
        (typeof payload.author !== 'string' || !payload.author.trim()))
    ) {
      return res.status(400).json({
        error: 'Judul dan penulis tidak boleh kosong.'
      });
    }

    if (
      'stock' in payload &&
      (!Number.isInteger(payload.stock) || payload.stock < 0)
    ) {
      return res.status(400).json({
        error: 'Stok harus berupa bilangan bulat minimal 0.'
      });
    }

    if (payload.title) payload.title = payload.title.trim();
    if (payload.author) payload.author = payload.author.trim();

    const data = await bookModel.updateBook(req.params.id, payload);

    if (!data) {
      return res.status(404).json({ error: 'Buku tidak ditemukan.' });
    }

    return res.status(200).json({
      message: 'Buku berhasil diperbarui.',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Gagal memperbarui buku.');
  }
}

export async function deleteBook(req, res) {
  try {
    const data = await bookModel.deleteBook(req.params.id);

    if (!data) {
      return res.status(404).json({ error: 'Buku tidak ditemukan.' });
    }

    return res.status(200).json({
      message: 'Buku berhasil dihapus.',
      id: data.id
    });
  } catch (error) {
    return handleError(res, error, 'Gagal menghapus buku.');
  }
}
