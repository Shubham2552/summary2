// Function to fetch complete text data of the active tab
async function fetchAllTextContent(tabId) {
  // Execute a content script in the active tab to extract all text content
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    function: () => {
      // Extract all text content from the body of the active tab
      const allTextContent = document.body.innerText;
      return allTextContent;
    }
  });

  return result[0].result; // Return the extracted text content
}

// Function to generate summaries using AI21 Ai
async function generateSummaries(textContent) {
  const url = 'https://api.ai21.com/studio/v1/summarize';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: 'Bearer dEQVcSaiJJoF4YNx2DU7Vrn0OMhSTFqa' // API authorization token
    },
    body: JSON.stringify({ sourceType: 'TEXT', source: textContent })
  };
  
  // Send a POST request to the AI21 API for summarization
  const response = await fetch(url, options);

  if (response.ok) {
    const data = await response.json();
    return data.summary; // Return the generated summary
  } else {
    let result = await response.json();
    return result.detail; // Return error details if API call fails
  }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'fetchAndGenerateSummary') {
    // Fetch complete text content from the active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    const textContent = await fetchAllTextContent(activeTab.id);

    // Generate summaries using the extracted text content
    const pointSummary = await generateSummaries(textContent);

    // Send the generated summaries to the popup
    chrome.runtime.sendMessage({
      action: 'showSummary',
      pointSummary
    });
  }
});
