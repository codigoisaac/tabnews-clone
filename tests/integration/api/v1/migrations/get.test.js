test("GET /migrations", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  const responseBody = await response.json();

  console.log({ getResponse: responseBody });

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody)).toBe(true);
});
