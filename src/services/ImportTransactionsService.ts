import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

type TransactionsType = 'income' | 'outcome';

class ImportTransactionsService {
  async execute(file: string): Promise<Transaction[]> {
    // verificar se arquivo existe
    const fileLocation = path.join(uploadConfig.localPath, file);
    const CSVStream = fs.createReadStream(fileLocation);

    const parseStram = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = CSVStream.pipe(parseStram);

    const lines: string[] = [];

    parseCSV.on('data', async line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const createTransactionService = new CreateTransactionService();

    const createdTransactions: Transaction[] = [];

    for (const line of lines) {
      const datas = {
        title: line[0],
        type: line[1] as TransactionsType,
        value: Number(line[2]),
        category: line[3],
      };

      const { title, type, value, category } = datas;

      const new_transaction = await createTransactionService.execute({
        title,
        type,
        value,
        category,
      });
      createdTransactions.push(new_transaction);
      console.log(new_transaction);
    }

    return createdTransactions;
  }
}

export default ImportTransactionsService;
