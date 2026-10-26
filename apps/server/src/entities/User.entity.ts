import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength, IsUUID } from "class-validator";

export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    GHOST = "ghost",
}

@Entity(`users`)
export class User {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id!: string;

    @Column({type: "varchar"})
    @IsNotEmpty()
    first_name!: string;

    @Column({type: "varchar"})
    @IsNotEmpty()
    last_name!: string;

    @Column({type: "varchar"})
    @IsNotEmpty()
    user_name!: string;

    @Column({type: "varchar", unique: true})
    @IsNotEmpty()
    @IsEmail({}, { message: "Invalid email address" })
    email!: string;

    @Column({type: "varchar"})
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    password!: string;

    @Column({type: "boolean"})
    status!: boolean;

    @CreateDateColumn({type: "timestamp"})
    created_at!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updated_at!: Date;
}