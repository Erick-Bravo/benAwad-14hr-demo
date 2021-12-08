"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const constants_1 = require("./constants");
const main = async () => {
    const orm = await core_1.MikroORM.init({
        entities: [],
        dbName: 'lireddit',
        user: "erickbravo",
        password: "scaryterry",
        debug: !constants_1.__prod__,
        type: "postgresql",
    });
};
main();
console.log("Goodbye world");
//# sourceMappingURL=index.js.map