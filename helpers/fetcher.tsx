export const fetcher = (...args: [any]) =>
  fetch(...args).then(async res => ({
    data: await res.json(),
    headers: res.headers,
  }));
