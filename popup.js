document.addEventListener("DOMContentLoaded", () => {
    const professorNameInput = document.getElementById("professorName");
    const searchButton = document.getElementById("searchButton");
    const resultsDiv = document.getElementById("results");

    const schoolDropdown = document.getElementById("schoolDropdown");
    const customSchoolIdInput = document.getElementById("customSchoolId");
    const setSchoolButton = document.getElementById("setSchoolButton");
    const statusMessage = document.getElementById("statusMessage");

    let selectedSchoolId = null;

    // load the saved school ID or default to ASU
    chrome.storage.sync.get("schoolId", (data) => {
        selectedSchoolId = data.schoolId || "15723"; // use ASU ID if no school is set
        schoolDropdown.value = ["15723", "1402", "1364"].includes(selectedSchoolId) ? selectedSchoolId : "custom"; // set dropdown value
        if (schoolDropdown.value === "custom") {
            customSchoolIdInput.value = selectedSchoolId; // populate custom input if custom ID is used
            customSchoolIdInput.classList.remove("hidden");
        }
    });

    // toggle visibility of custom school ID input field
    schoolDropdown.addEventListener("change", () => {
        if (schoolDropdown.value === "custom") {
            customSchoolIdInput.classList.remove("hidden");
        } else {
            customSchoolIdInput.classList.add("hidden");
            customSchoolIdInput.value = ""; // clear input when not in use
        }
    });

    // set and save the school ID
    setSchoolButton.addEventListener("click", () => {
        if (schoolDropdown.value === "custom") {
            selectedSchoolId = customSchoolIdInput.value.trim();
            if (!selectedSchoolId) { // validate custom ID input
                statusMessage.textContent = "Please enter a valid custom school ID.";
                return;
            }
        } else {
            selectedSchoolId = schoolDropdown.value;
        }

        chrome.storage.sync.set({ schoolId: selectedSchoolId }, () => {
            statusMessage.textContent = "School ID set successfully!"; // confirm save
        });
    });

    // search for a professor
    searchButton.addEventListener("click", () => {
        const professorName = professorNameInput.value.trim();
        if (!professorName) { // validate professor name input
            resultsDiv.textContent = "Please enter a professor name.";
            return;
        }
        
        chrome.storage.sync.get("schoolId", (data) => {
            const schoolId = data.schoolId || "15723"; // use ASU ID if no school is set
            const query = encodeURIComponent(professorName); // encode professor name for URL
            const searchUrl = `https://www.ratemyprofessors.com/search/professors/${schoolId}?q=${query}`;
            resultsDiv.innerHTML = `<a href="${searchUrl}" target="_blank">View Results on RateMyProfessors</a>`; // display search link
        });
    });
});
