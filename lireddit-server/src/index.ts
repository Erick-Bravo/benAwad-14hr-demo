import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

const main = async () => {
    const orm = await MikroORM.init({
        entities: [],
        dbName: 'lireddit',
        user: "erickbravo",
        password: "scaryterry",
        debug: !__prod__,
        type: "postgresql",
    });
};

main();

console.log("Goodbye world");