import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength, IsUUID } from "class-validator";

export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    GHOST = "ghost",
}

@Entity()
export class TransactionAuditHistory {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id!: string;

    @Column({type: "uuid"})
    @IsNotEmpty()
    @IsUUID()
    user_id!: string;


    @Column({type: "uuid"})
    @IsNotEmpty()
    @IsUUID()
    transaction_id!: string;

    @Column({type: "varchar"})
    last_status!: string;

    @Column({type: "varchar"})
    status!: string;

    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updated_at!: Date;
}