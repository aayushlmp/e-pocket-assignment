import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MinLength,
  IsUUID,
} from "class-validator";
import { UserRole, Status } from "@e-pocket-assignment/shared/enums";

@Entity(`users`)
export class User {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  @IsOptional()
  id!: string;

  @Column({ type: "varchar", name: "first_name" })
  @IsNotEmpty()
  firstName!: string;

  @Column({ type: "varchar", name: "last_name" })
  @IsNotEmpty()
  lastName!: string;

  @Column({ type: "varchar", name: "user_name" })
  @IsNotEmpty()
  userName!: string;

  @Column({ type: "varchar", unique: true, name: "email" })
  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @Column({ type: "varchar", name: "password", select: false })
  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  password!: string;

  @Column({ type: "text", name: "refresh_token", default: null })
  @IsOptional()
  refreshToken!: string;

  @Column({ type: "text", name: "avatar", default: null })
  @IsOptional()
  avatar!: string;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.ACTIVE,
    name: "status",
  })
  status!: Status;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
    name: "role",
  })
  role!: UserRole;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  @IsOptional()
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  @IsOptional()
  updatedAt!: Date;
}
