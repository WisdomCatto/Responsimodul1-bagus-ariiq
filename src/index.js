
import 'dotenv/config';
import express from 'express';

import loanroute from './routes/loanroute.js';
import bookroute from './routes/bookroute.js';
import memberroute from './routes/memberroute.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Library Loan REST API aktif',
    endpoints: {
      loans: {
        list: 'GET /api/loans',
        detail: 'GET /api/loans/:id',
        create: 'POST /api/loans',
        update: 'PUT /api/loans/:id',
        delete: 'DELETE /api/loans/:id'
      },

      books: {
        list: 'GET /api/books',
        detail: 'GET /api/books/:id',
        create: 'POST /api/books',
        update: 'PUT /api/books/:id',
        delete: 'DELETE /api/books/:id'
      },

      members: {
        list: 'GET /api/members',
        detail: 'GET /api/members/:id',
        create: 'POST /api/members',
        update: 'PUT /api/members/:id',
        delete: 'DELETE /api/members/:id'
      }
    }
  });
});

app.use('/api/loans', loanroute);
app.use('/api/books', bookroute);
app.use('/api/members', memberroute);

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint tidak ditemukan.'
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      error: 'Format JSON request tidak valid.'
    });
  }

  console.error(err);

  return res.status(500).json({
    error: 'Terjadi kesalahan pada server.'
  });
});

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(
      `Server berjalan di http://localhost:${port}`
    );
  });
}

export default app;
