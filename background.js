chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "searchQuickRate", // menu item id
        title: "Search RateMyProfessors for '%s'", // menu text shows selected text
        contexts: ["selection"] // only show when text is selected
    });
});

// handle the right-click menu click
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "searchQuickRate") { // ensure correct menu item
        const selectedText = info.selectionText.trim(); // get the selected text

        chrome.storage.sync.get("schoolId", (data) => {
            const schoolId = data.schoolId || "15723"; // default to ASU if no school is set
            const query = encodeURIComponent(selectedText); // encode text for the URL
            const searchUrl = `https://www.ratemyprofessors.com/search/professors/${schoolId}?q=${query}`; // build search url

            chrome.tabs.create({ url: searchUrl }); // open search in a new tab
        });
    }
});