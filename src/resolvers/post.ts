import { MyContext } from "../types";
import { Ctx, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
    //For Query, we literally just need to pass in the type entity
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {})
    }
}