export async function makeRequest(method, data) {
  const url = `${process.env.REACT_APP_API_ENDPOINT}/user/${method}/`;
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await result.json();
}
