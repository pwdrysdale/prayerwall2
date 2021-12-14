module.exports = function (wallaby) {
    return {
        files: ["src/**/*.js", "src/**/*.ts"],

        tests: ["src/__tests__/**/*spec.js", "src/__tests__/**/*spec.ts"],
        // for node.js tests you need to set env property as well
        // https://wallabyjs.com/docs/integration/node.html
    };
};
