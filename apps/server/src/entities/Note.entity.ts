import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { Transaction } from "./Transaction.entity.ts";

@Entity("notes")
export class Note {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  @IsOptional()
  id!: string;

  @Column({ type: "text", name: "comment" })
  comment!: string;

  @Column({ type: "uuid", name: "user_id" })
  @IsNotEmpty()
  userId!: string;

  @Column({ type: "uuid", name: "transaction_id" })
  @IsNotEmpty()
  transactionId!: string;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.notes)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Transaction;
}
