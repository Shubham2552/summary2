// Send a message to the background script to initiate fetching and generating summaries.
chrome.runtime.sendMessage({ action: 'fetchAndGenerateSummary' });

// Listen for messages from the background script and display the summary points.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showSummary') {
    // Retrieve the 'point' div element.
    const pointDiv = document.getElementById('point');

    // Break the summary into points and display them as a list in the popup.
    const points = message.pointSummary.split('.');
    pointDiv.innerHTML = '<ul>';
    points.forEach(point => {
      if (point) {
        pointDiv.innerHTML += `<li>${point}</li>`;
      }
    });
    pointDiv.innerHTML += '</ul>';
  }
});

// When the popup's DOM content is loaded, set up event listeners.
document.addEventListener('DOMContentLoaded', function () {
  // Retrieve the 'copyButton' and 'point' elements.
  const copyButton = document.getElementById('copyButton');
  const pointDiv = document.getElementById('point');

  // Add a click event listener to the 'copyButton' to copy points to clipboard.
  copyButton.addEventListener('click', function () {
    const points = pointDiv.textContent;
    copyToClipboard(points);
    alert('Points copied to clipboard!');
  });
});

// Copies the provided text to the clipboard using a temporary textarea element.
function copyToClipboard(text) {
  // Create a temporary textarea element.
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Append the textarea to the document body, select its content, copy, and remove it.
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}
