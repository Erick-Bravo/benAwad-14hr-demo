import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver,  } from "type-graphql";
import argon2 from "argon2";

//Different way you can use arguments in GraphQL
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hashedpassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedpassword,
    });
    await em.persistAndFlush(user);
    return User;
  }
}
