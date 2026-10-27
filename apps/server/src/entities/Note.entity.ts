import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { Transaction } from "./Transaction.entity.ts";

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    @IsOptional()
    id!: string;

    @Column({type: "varchar", name: "comment"})
    comment!: string;

    @Column({type: "uuid"})
    @IsNotEmpty()
    userId!: string;

    @Column({type: "uuid"})
    @IsNotEmpty()
    transactionId!: string;

    @CreateDateColumn({type: "timestamp", name: "created_at"})
    createdAt!: Date;

    @UpdateDateColumn({type: "timestamp", name: "updated_at"})
    updatedAt!: Date;

    @ManyToOne(() => Transaction, (transaction) => transaction.notes) 
    @JoinColumn({ name: 'transaction_id' })
    transaction!: Transaction;
}