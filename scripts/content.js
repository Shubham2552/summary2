// Get the current tab id.
const tabId = chrome.tabs.getCurrentTabId();

// Get the DOM of the active tab.
async ()=>{
  const dom = await chrome.scripting.executeScript({
    target: { tabId: tabId },
  });
}


// Get the HTML of the active page.
const html = dom.querySelector('html').innerHTML;

// Send the HTML to the background script.
chrome.tabs.sendMessage(tabId, { html });

