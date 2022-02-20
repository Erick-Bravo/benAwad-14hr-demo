import { Query, Resolver } from "type-graphql";
import { Post } from "src/entities/Post";

@Resolver()
export class PostResolver {
    //For Query, we literally just need to pass in the type entity
    @Query(() => [Post])
    posts() {
        return "Hello world"
    }
}