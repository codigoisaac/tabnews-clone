import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, { retries: 100 });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      await response.json();
    }
  }
}

async function clearDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

const orchestrator = { waitForAllServices, clearDatabase };

export default orchestrator;
