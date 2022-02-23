import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

//Different way you can use arguments in GraphQL
//Input types we use for Mutations
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

//Object types we use for Arguments
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
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
      username: options.username.toLocaleLowerCase(),
      password: hashedpassword,
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: options.username.toLocaleLowerCase(),
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username or password",
            message: "username or password are incorrect",
          },
        ],
      };
    }
    const validate = await argon2.verify(user.password, options.password);
    if (!validate) {
      return {
        errors: [
          {
            field: "username or password",
            message: "username or password are incorrect",
          },
        ],
      };
    }
    return {
        user
    };
  }
}
