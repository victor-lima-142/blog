import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class Base extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
    id: number;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "timestamp", default: null, nullable: true })
    deletedAt: Date;
}

export type EntityProps<T extends BaseEntity> = Omit<T, "hasId" | "remove" | "save" | "softRemove" | "recover" | "reload">;

export type EntityPropsWithoutTimestamps<T extends BaseEntity> = Omit<EntityProps<T>, "createdAt" | "updatedAt" | "deletedAt">;