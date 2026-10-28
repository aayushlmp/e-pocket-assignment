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

  @Column({ type: "uuid", name: "transaction_id" })
  @IsNotEmpty()
  @IsUUID()
  transactionId!: string;

  @Column({
    type: "enum",
    name: "last_status",
    enum: TransactionStatus,
    default: null,
    nullable: true,
  })
  lastStatus!: TransactionStatus;

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
}
