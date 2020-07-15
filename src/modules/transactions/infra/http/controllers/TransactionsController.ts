import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTransactionService from '@modules/transactions/services/CreateTransactionService';
import ListUserTransactionsService from '@modules/transactions/services/ListUserTransactionsService';

export default class TransactionsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listUserTransactions = container.resolve(ListUserTransactionsService);

    const transactions = await listUserTransactions.execute({ user_id });

    return response.json(transactions);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { to_id, value } = request.body;

    const createTransaction = container.resolve(CreateTransactionService);

    const transaction = await createTransaction.execute({
      from_id: user_id,
      to_id,
      value,
    });

    return response.json(transaction);
  }
}
