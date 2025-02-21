function fetchWithTimeout(url, timeout = 10000) {
   return Promise.race([
    //  fetch(url).then(response => response.json()),
    mockAPI(url),
     new Promise((_, reject) =>
       setTimeout(() => reject(new Error(`Timeout: ${url}`)), timeout)
     )
   ]);
}

function mockAPI(url, avgTime = 5000) {
  return new Promise((resolve) => {
    const delay = Math.random() * avgTime * 2;

    const isInvalidURL = !url.startsWith("http");

    setTimeout(() => {
      if (isInvalidURL) {
        resolve({ url, error: `Invalid URL: ${url}` });
      } else {
        resolve({ url, data: `Response from ${url}` });
      }
    }, delay);
  });
}

 
 async function fetchURLs(urls, MAX_CONCURRENCY = 20) {
   const results = new Array(urls.length).fill(undefined)
   let index = 0;
   const executing = new Set();
 
   async function processNext() {
    if (index >= urls.length) return;
 
    const currentIndex = index++;
    const url = urls[currentIndex];
 
    const fetchPromise = fetchWithTimeout(url)
      .then(response => (results[currentIndex] = response))
      .catch(error => (results[currentIndex] = { error: error.message }))
      .finally(() => executing.delete(fetchPromise));
 
    executing.add(fetchPromise);
 
    if (executing.size >= MAX_CONCURRENCY) {
      await Promise.race([...executing]);
    }
 
    return processNext();
  }
 
  const workers = Array.from({ length: Math.min(MAX_CONCURRENCY, urls.length) }, () => processNext());

  await Promise.all([...workers]);
  await Promise.all([...executing])

  return results;
}

module.exports = fetchURLs