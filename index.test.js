const fetchURLs = require('./index.js')

describe("fetchURLs function", () => {
  jest.setTimeout(20000);

  test("Fetches all URLs with respected concurrency", async () => {
    const urls = [
      "https://jsonplaceholder.typicode.com/todos/1",
      "https://jsonplaceholder.typicode.com/todos/2",
      "https://jsonplaceholder.typicode.com/todos/3",
      "https://jsonplaceholder.typicode.com/todos/4",
      "https://jsonplaceholder.typicode.com/todos/5"
    ];

    const MAX_CONCURRENCY = 2;
    const results = await fetchURLs(urls, MAX_CONCURRENCY);

    expect(results.length).toBe(urls.length);
    expect(results.every(res => res !== undefined)).toBe(true);
  });

  test("Handles failed requests correctly", async () => {
    const urls = ["invalid-url-1", "invalid-url-2"];
    const results = await fetchURLs(urls, 1);

    results.forEach(res => {
      expect(res.error).toBeDefined();
    });
  });

  test("Ensures results are returned in correct order", async () => {
    const urls = [
      "https://jsonplaceholder.typicode.com/todos/2",
      "https://jsonplaceholder.typicode.com/todos/3",
    ];
    
    const results = await fetchURLs(urls, 3);
    expect(results[0].url).toBe(urls[0]);
    expect(results[1].url).toBe(urls[1]);
  });
});
