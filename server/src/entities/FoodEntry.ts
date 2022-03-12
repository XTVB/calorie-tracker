import BigNumber from "bignumber.js";
import { isDefined } from "../utils/isDefined";
import { ObjectType, Field, Float } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class FoodEntry extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  calories!: number;

  @Field()
  @Column({ type: "timestamptz" })
  date!: Date;

  @Field(() => Float, { nullable: true })
  @Column("decimal", {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      from: (value: string | null): BigNumber | undefined =>
        isDefined(value) ? new BigNumber(value) : undefined,
      to: (value: BigNumber | undefined): string | null =>
        isDefined(value) ? value.toString() : null,
    },
  })
  price?: BigNumber;

  @Field()
  @Column()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.entries, {
    onDelete: "CASCADE",
  })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
