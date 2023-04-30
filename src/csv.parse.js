import assert from 'node:assert'; 
import { parse } from 'csv-parse'; 
import fs from 'node:fs';

const databasePath = new URL('files/tasks.csv', import.meta.url); 

(async () => {
  const tasksBuffer = fs.readFileSync(databasePath); 
  const parser = parse(tasksBuffer); 

  let count = 0; 

  // Iterate through each records
  for await (const record of parser) {
      if(count === 0) {
        count++; 
        continue;
      }

      const task = {
        title: record[0], 
        description: record[1]
      }; 

      await fetch('http://localhost:3333/tasks', { method: 'POST', body: JSON.stringify(task) }); 
      count++; 
  }

  // Validation
  assert.strictEqual(count, 6);
})();