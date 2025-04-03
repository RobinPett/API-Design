import fs from 'fs';
import path from 'path';

// List of schema files
const schemas = ['developerSchema.graphql', 'gameSchema.graphql'];
let combinedSchema = '';

// Function to read and combine schemas
schemas.forEach(file => {
  const schema = fs.readFileSync(path.join(__dirname, file), 'utf8');
  combinedSchema += schema + '\n';
});

// Write the combined schema to a root file
fs.writeFileSync(path.join(__dirname, 'rootSchema.graphql'), combinedSchema);
console.log('Schemas combined into rootSchema.graphql');
