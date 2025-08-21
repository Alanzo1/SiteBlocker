let blockedSites = [];

// Load blocked sites from storage
chrome.storage.local.get('blockedSites', (data) => {
    blockedSites = data.blockedSites || [];
    console.log("Background initial blocked sites:", blockedSites);
});

// Update blocked sites when popup/main sends a message
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "updateSites") {
        blockedSites = msg.sites;
        console.log("Background updated blocked sites:", blockedSites);
    }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url) return; // ignore if no URL

    let isBlocked = false;

    for (let i = 0; i < blockedSites.length; i++) {
        if (tab.url.includes(blockedSites[i])) {
            isBlocked = true;
            console.log("Blocked site detected:", blockedSites[i]);
            break;
        }
    }

    if (isBlocked) {
        //redirect to a block page
        chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked.html") });
    }
});
