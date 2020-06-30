import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfigs from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfigs);

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find({
    relations: ['category'],
  });
  const balance = await repository.getBalance(transactions);
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const createTransaction = new CreateTransactionService();

  const { title, value, type, category } = request.body;

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransaction = new DeleteTransactionService();
  const { id } = request.params;
  await deleteTransaction.execute(id);

  return response.status(204).json({ deleted: true });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();
    const file = request.file.filename;
    const importedTransactions = await importTransactions.execute(file);
    return response.json({ transactions: importedTransactions });
  },
);

export default transactionsRouter;
