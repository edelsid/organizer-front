const createRequest = async (options) => {
  const res = fetch(options.url, {
    method: options.method,
  });

  const result = await res;
  if (!result.ok) {
    const err = await result.text();
    options.callback(false, err);
  }

  const response = await result.json();
  options.callback(true, response);
};

export default createRequest;
