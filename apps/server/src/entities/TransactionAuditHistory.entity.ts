import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, IsUUID } from "class-validator";
import { TransactionStatus } from "@e-pocket-assignment/shared/enums";

@Entity()
export class TransactionAuditHistory {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id!: string;

  @Column({ type: "uuid", name: "user_id" })
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @Column({ type: "uuid" })
  @IsNotEmpty()
  @IsUUID()
  transaction_id!: string;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  last_status!: TransactionStatus;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
