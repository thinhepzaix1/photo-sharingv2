/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @returns {Promise}       A Promise that resolves to the JSON data from the server.
 */
async function fetchModel(url) {
  try {
    const response = await fetch(`http://localhost:3000${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export default fetchModel;