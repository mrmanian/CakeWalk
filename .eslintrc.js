module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": true,
      }
    ],
    "no-console": ["error", { allow: ["log"] }],
    "no-alert": 0,
    "react/prop-types": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "react/no-array-index-key": 0,
    "jsx-a11y/control-has-associated-label": 0,
    "react/destructuring-assignment": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
  },
};
