import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Transaction } from "./Transaction.entity.ts";

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar"})
    comment!: string;

    @Column({type: "uuid"})
    @IsNotEmpty()
    user_id!: string;

    @Column({type: "uuid"})
    @IsNotEmpty()
    transaction_id!: string;

    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updated_at!: Date;

    @ManyToOne(() => Transaction, (transaction) => transaction.notes) 
    @JoinColumn({ name: 'transaction_id' })
    transaction!: Transaction;
}