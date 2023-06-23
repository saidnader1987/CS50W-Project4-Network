export const AJAX = async function (
  url,
  uploadData = undefined,
  requestMethod = undefined
) {
  let fetchPro;
  try {
    fetchPro = uploadData
      ? fetch(url, {
          method: requestMethod === "post" ? "POST" : "PUT",
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Fetching response
    const res = await fetchPro;
    // Converting response to a an object
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
