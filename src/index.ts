#!/usr/bin/env node

import { InfographicGeneratorServer } from "./server.js";

async function main() {
  try {
    const server = new InfographicGeneratorServer();
    await server.run();
  } catch (error) {
    console.error("Fatal error starting server:", error);
    process.exit(1);
  }
}

main();
