import { Field, ID, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
@ObjectType('UserType')
export class User extends BaseEntity {
    @Field(() => ID, { nullable: true })
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    password: string;

    // @Field()
    // @Column()
    // state: string;

    @CreateDateColumn()
    createdAt!: string;

    @UpdateDateColumn()
    updatedAt!: string;
}