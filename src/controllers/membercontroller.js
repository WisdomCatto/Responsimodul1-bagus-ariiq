
import * as memberModel from '../models/membermodel.js';

function handleError(res, error, message) {
  console.error(error);

  if (error.code === '23505') {
    return res.status(409).json({
      error: 'Email sudah digunakan oleh member lain.'
    });
  }

  if (error.code === '23503') {
    return res.status(409).json({
      error: 'Member masih memiliki data peminjaman.'
    });
  }

  return res.status(500).json({ error: message });
}

export async function getAllMembers(req, res) {
  try {
    const data = await memberModel.getAllMembers();
    return res.status(200).json({ total: data.length, data });
  } catch (error) {
    return handleError(res, error, 'Gagal mengambil data member.');
  }
}

export async function getMemberById(req, res) {
  try {
    const data = await memberModel.getMemberById(req.params.id);

    if (!data) {
      return res.status(404).json({ error: 'Member tidak ditemukan.' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return handleError(res, error, 'Gagal mengambil detail member.');
  }
}

export async function createMember(req, res) {
  try {
    const { name, email } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: 'Nama member wajib diisi.'
      });
    }

    if (
      email !== undefined &&
      email !== null &&
      (typeof email !== 'string' || !email.trim())
    ) {
      return res.status(400).json({
        error: 'Email harus berupa teks yang valid atau null.'
      });
    }

    const payload = { name: name.trim() };

    if (email !== undefined) {
      payload.email = email === null ? null : email.trim();
    }

    const data = await memberModel.createMember(payload);

    return res.status(201).json({
      message: 'Member berhasil ditambahkan.',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Gagal menambahkan member.');
  }
}

export async function updateMember(req, res) {
  try {
    const allowed = ['name', 'email'];
    const payload = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        error: 'Masukkan data member yang ingin diperbarui.'
      });
    }

    if (
      'name' in payload &&
      (typeof payload.name !== 'string' || !payload.name.trim())
    ) {
      return res.status(400).json({
        error: 'Nama member tidak boleh kosong.'
      });
    }

    if (
      'email' in payload &&
      payload.email !== null &&
      (typeof payload.email !== 'string' || !payload.email.trim())
    ) {
      return res.status(400).json({
        error: 'Email harus berupa teks yang valid atau null.'
      });
    }

    if (typeof payload.name === 'string') {
      payload.name = payload.name.trim();
    }

    if (typeof payload.email === 'string') {
      payload.email = payload.email.trim();
    }

    const data = await memberModel.updateMember(req.params.id, payload);

    if (!data) {
      return res.status(404).json({ error: 'Member tidak ditemukan.' });
    }

    return res.status(200).json({
      message: 'Member berhasil diperbarui.',
      data
    });
  } catch (error) {
    return handleError(res, error, 'Gagal memperbarui member.');
  }
}

export async function deleteMember(req, res) {
  try {
    const data = await memberModel.deleteMember(req.params.id);

    if (!data) {
      return res.status(404).json({ error: 'Member tidak ditemukan.' });
    }

    return res.status(200).json({
      message: 'Member berhasil dihapus.',
      id: data.id
    });
  } catch (error) {
    return handleError(res, error, 'Gagal menghapus member.');
  }
}
