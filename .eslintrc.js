module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ["airbnb-base"],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        quotes: ["error", "double"],
        camelcase: 1,
        "no-underscore-dangle": 0,
        "operator-linebreak": 0,
        "prefer-arrow-callback": 0,
        "import/extensions": 0,
        indent: ["error", 4],
        "no-restricted-syntax": 0,
        "no-await-in-loop": 0,
        "guard-for-in": 1,
        "object-shorthand": 0,
        "prefer-destructuring": [
            "error",
            {
                array: false,
                object: true,
            },
        ],
        "no-prototype-builtins": 0,
        "no-param-reassign": [2, { props: false }],
    },
};
