import { getRepository, getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // check category exists
    const categoryRepository = getRepository(Category);
    const existsCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id = '';

    if (!existsCategory) {
      const new_category = categoryRepository.create({
        title: category,
      });
      const created_category = await categoryRepository.save(new_category);
      category_id = created_category.id;
    } else {
      category_id = existsCategory.id;
    }

    const transactionRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Opration not is possibility', 400);
    }

    const new_transaction = transactionRepository.create({
      title,
      value,
      category_id,
      type,
    });

    const created_transaction = await transactionRepository.save(
      new_transaction,
    );

    return created_transaction;
  }
}

export default CreateTransactionService;
