/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the request.
 * @param {object} options  Optional request options (method, headers, body, etc.)
 * @returns {Promise}       A Promise that resolves to the JSON data from the server.
 */
async function fetchModel(url, options = {}) {
  try {
    // Set default options with credentials included
    const defaultOptions = {
      credentials: 'include', // Quan trọng: gửi cookies với mỗi request
      ...options
    };

    const response = await fetch(`http://localhost:8081${url}`, defaultOptions);
    
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