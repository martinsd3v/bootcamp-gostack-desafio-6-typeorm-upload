import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(data?: Transaction[]): Promise<Balance> {
    let transactions: Transaction[] = [];

    if (!data) transactions = await this.find();
    else transactions = data;

    const income =
      transactions?.reduce((sum, transaction) => {
        if (transaction.type === 'income') {
          return sum + transaction.value;
        }
        return sum;
      }, 0) || 0;

    const outcome =
      transactions?.reduce((sum, transaction) => {
        if (transaction.type === 'outcome') {
          return sum + transaction.value;
        }
        return sum;
      }, 0) || 0;

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };
    return balance;
  }
}

export default TransactionsRepository;
