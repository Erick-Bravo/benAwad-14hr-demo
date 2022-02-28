import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

//stacked "decorators"
@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type: "date"})
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
  
  @Field()
  @Property({ type: "text", unique: true })
  username!: string; 

  //No field to prevent selection of password
  @Property({ type: "text" })
  password!: string; 
}