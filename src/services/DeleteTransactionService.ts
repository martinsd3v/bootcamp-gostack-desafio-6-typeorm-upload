import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getRepository(Transaction);
    const existsTransaction = await repository.findOne({ where: { id } });
    if (existsTransaction) {
      await repository.remove(existsTransaction);
    } else {
      throw new AppError('transaction not found', 404);
    }
  }
}

export default DeleteTransactionService;
