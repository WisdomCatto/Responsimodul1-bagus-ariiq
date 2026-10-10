import * as loanModel from '../models/loanmodel.js';

const validStatuses = [
  'Dipinjam',
  'Dikembalikan',
  'Terlambat'
];

function isValidDate(value) {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function validLoanDates(data) {
  if (data.loan_date && !isValidDate(data.loan_date)) {
    return false;
  }

  if (data.due_date && !isValidDate(data.due_date)) {
    return false;
  }

  if (
    data.return_date !== undefined &&
    data.return_date !== null &&
    !isValidDate(data.return_date)
  ) {
    return false;
  }

  if (
    data.loan_date &&
    data.due_date &&
    data.due_date < data.loan_date
  ) {
    return false;
  }

  if (
    data.return_date &&
    data.loan_date &&
    data.return_date < data.loan_date
  ) {
    return false;
  }

  return true;
}

function handleError(res, error, message) {
  console.error(error);

  if (error.code === '23503' || error.code === '23514') {
    return res.status(400).json({
      error: 'Data referensi tidak valid atau melanggar aturan database.'
    });
  }

  if (error.code === '23505') {
    return res.status(409).json({
      error: 'Data melanggar aturan unik database.'
    });
  }

  return res.status(500).json({ error: message });
}

// GET /api/loans
export async function getAllLoans(req, res) {
  try {
    const { status, member_id, book_id } = req.query;

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Status filter tidak valid.'
      });
    }

    const data = await loanModel.getAllLoans({
      status,
      member_id,
      book_id
    });

    return res.status(200).json({
      total: data.length,
      data
    });
  } catch (error) {
    return handleError(
      res, error, 'Gagal mengambil data peminjaman.'
    );
  }
}

// GET /api/loans/:id
export async function getLoanById(req, res) {
  try {
    const data = await loanModel.getLoanById(req.params.id);

    if (!data) {
      return res.status(404).json({
        error: 'Data peminjaman tidak ditemukan.'
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return handleError(
      res, error, 'Gagal mengambil detail peminjaman.'
    );
  }
}

// POST /api/loans
export async function createLoan(req, res) {
  try {
    const {
      member_id,
      book_id,
      loan_date,
      due_date,
      return_date,
      status = 'Dipinjam'
    } = req.body;

    if (!member_id || !book_id || !due_date) {
      return res.status(400).json({
        error: 'member_id, book_id, dan due_date wajib diisi.'
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Status peminjaman tidak valid.'
      });
    }

    const payload = {
      member_id,
      book_id,
      due_date,
      status
    };

    if (loan_date !== undefined) {
      payload.loan_date = loan_date;
    }

    if (return_date !== undefined) {
      payload.return_date = return_date;
    }

    if (!validLoanDates(payload)) {
      return res.status(400).json({
        error: 'Format atau urutan tanggal tidak valid.'
      });
    }

    const data = await loanModel.createLoan(payload);

    return res.status(201).json({
      message: 'Peminjaman berhasil dibuat.',
      data
    });
  } catch (error) {
    return handleError(
      res, error, 'Gagal membuat peminjaman.'
    );
  }
}

// PUT /api/loans/:id
export async function updateLoan(req, res) {
  try {
    const allowedFields = [
      'member_id',
      'book_id',
      'loan_date',
      'due_date',
      'return_date',
      'status'
    ];

    const payload = Object.fromEntries(
      Object.entries(req.body).filter(
        ([key]) => allowedFields.includes(key)
      )
    );

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'Tidak ada field valid untuk diperbarui.'
      });
    }

    if (
      payload.status !== undefined &&
      !validStatuses.includes(payload.status)
    ) {
      return res.status(400).json({
        error: 'Status peminjaman tidak valid.'
      });
    }

    if (!validLoanDates(payload)) {
      return res.status(400).json({
        error: 'Format atau urutan tanggal tidak valid.'
      });
    }

    const existing = await loanModel.getLoanRecordById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        error: 'Data peminjaman tidak ditemukan.'
      });
    }

    const merged = { ...existing, ...payload };

    if (!validLoanDates(merged)) {
      return res.status(400).json({
        error: 'Urutan tanggal peminjaman tidak valid.'
      });
    }

    const data = await loanModel.updateLoan(
      req.params.id,
      payload
    );

    if (!data) {
      return res.status(404).json({
        error: 'Data peminjaman tidak ditemukan.'
      });
    }

    return res.status(200).json({
      message: 'Peminjaman berhasil diperbarui.',
      data
    });
  } catch (error) {
    return handleError(
      res, error, 'Gagal memperbarui peminjaman.'
    );
  }
}

// DELETE /api/loans/:id
export async function deleteLoan(req, res) {
  try {
    const data = await loanModel.deleteLoan(req.params.id);

    if (!data) {
      return res.status(404).json({
        error: 'Data peminjaman tidak ditemukan.'
      });
    }

    return res.status(200).json({
      message: 'Peminjaman berhasil dihapus.',
      id: data.id
    });
  } catch (error) {
    return handleError(
      res, error, 'Gagal menghapus peminjaman.'
    );
  }
}