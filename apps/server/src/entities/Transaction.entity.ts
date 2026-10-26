import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { IsNotEmpty, IsUUID } from "class-validator";
import { Note } from "../entities/Note.entity.ts"
import { TransactionStatus } from '@e-pocket-assignment/shared/enums';

@Entity(`transactions`)
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id!: string;

    @Column({type: "uuid"})
    @IsNotEmpty()
    @IsUUID()
    customer_id!: string;

    @Column({type: "varchar"})
    @IsNotEmpty()
    customer_name!: string;

    @Column({type: "varchar"})
    @IsNotEmpty()
    source_currency_code!: string;

    @Column({type: "varchar"})
    @IsNotEmpty()
    target_currency_code!: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: "decimal", precision: 10, scale: 4 })
    exchangeRate!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    fees!: number;

    @Column({
        type: "enum",
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status!: TransactionStatus

    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updated_at!: Date;

    @OneToMany(() => Note, (note) => note.transaction, {cascade: true})
    notes!: Note[];
}