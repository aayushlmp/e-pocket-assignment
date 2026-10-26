import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { IsNotEmpty, IsUUID } from "class-validator";
import { Note } from "../entities/Note.entity.ts"

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

    // Pro-Tip: Use decimal/numeric types for financial data. float can cause rounding issues.
    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: "decimal", precision: 10, scale: 4 })
    exchangeRate!: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    fees!: number;

    @Column({type: "varchar"})
    status!: string;

    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updated_at!: Date;

    @OneToMany(() => Note, (note) => note.transaction, {cascade: true})
    notes!: Note[];
}