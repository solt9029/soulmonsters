import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

async function generateTypes() {
  const definitionsFactory = new GraphQLDefinitionsFactory();

  await definitionsFactory.generate({
    typePaths: ['../schema/*.graphql'],
    path: join(process.cwd(), 'src/graphql/index.ts'),
  });

  console.log('GraphQL types generated successfully!');
}

generateTypes().catch(err => {
  console.error('Error generating GraphQL types:', err);
  process.exit(1);
});
