import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**'],
  },
];

export default eslintConfig;
