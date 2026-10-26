
import { Repository } from "typeorm";
import { Transaction } from "../entities/Transaction.entity.ts";

export class TransactionService {
  constructor(private userRepository: Repository<Transaction>) {}
}
