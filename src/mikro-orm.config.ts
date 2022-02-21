import { Options } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

//__dirname is the absolute directory (default path before the path you are creating)
const config: Options = {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: "lireddit",
  user: "erickbravo",
  password: "scaryterry",
  debug: !__prod__,
  type: "postgresql",
};

export default config

