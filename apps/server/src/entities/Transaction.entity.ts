import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { Note } from "../entities/Note.entity.ts";
import { TransactionStatus } from "@e-pocket-assignment/shared/enums";

@Entity(`transactions`)
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  @IsOptional()
  id!: string;

  @Column({ type: "uuid", name: "customer_id" })
  @IsNotEmpty()
  @IsUUID()
  customerId!: string;

  @Column({ type: "varchar", name: "customer_name" })
  @IsNotEmpty()
  customerName!: string;

  @Column({ type: "varchar", name: "source_currency_code" })
  @IsNotEmpty()
  sourceCurrencyCode!: string;

  @Column({ type: "varchar", name: "target_currency_code" })
  @IsNotEmpty()
  targetCurrencyCode!: string;

  @Column({ type: "decimal", name: "amount", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "decimal", name: "exchange_rate", precision: 10, scale: 4 })
  exchangeRate!: number;

  @Column({ type: "decimal", name: "fees", precision: 10, scale: 2 })
  fees!: number;

  @Column({
    type: "enum",
    name: "status",
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => Note, (note) => note.transaction, { cascade: true })
  notes!: Note[];
}
