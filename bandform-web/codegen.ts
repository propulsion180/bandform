import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../bandform-backend/src/main/resources/graphql/schema.graphqls',
  documents: ['frontend/**/*.tsx', 'frontend/**/*.ts'],
  generates: {
    './frontend/gql/': {
      preset: 'client',
    },
  },
  ignoreNoDocuments: true,
};

export default config;
