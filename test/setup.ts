const fs = require('fs').promises;
import { join } from "path"

global.beforeEach(async () => {
  try {
    await fs.rm(join(__dirname, '..', 'test.sqlite'))
  } catch (err) { }
  
})

/* essa função será executada antes de cada teste --> no caso, o banco de dados de teste (test.sqlite) será removido, o qual
será recriado automaticamente pelo typeorm;

"setupFilesAfterEnv": ["<rootDir>/setup.ts"] no jest-e2e.json que define que é esse arquivo (setup.ts) que deve ser rodado
antes de cada teste... */