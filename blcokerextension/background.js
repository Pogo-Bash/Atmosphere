// Retrieve the list of blocked URLs from storage
chrome.storage.sync.get("blockedUrls", function(result) {
  var blockedUrls = result.blockedUrls || [];

  // Listen for web requests and block the ones that match the blocked URLs
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (blockedUrls.some(function(url) { return details.url.indexOf(url) !== -1 })) {
        return { cancel: true };
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
});

// Listen for changes to the blocked URL list and update the storage accordingly
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateBlockedUrls") {
    chrome.storage.sync.set({ blockedUrls: request.blockedUrls }, function() {
      sendResponse();
    });
  }
});
