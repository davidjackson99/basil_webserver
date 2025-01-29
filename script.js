let bioactiveData = [];

fetch('data/bioactive_data.json')
    .then(response => response.json())
    .then(data => bioactiveData = data)
    .catch(error => console.error('Error loading the data:', error));

// Fetch data for conditions
fetch('data/bioactives_single_condition_filtered_final.json')
    .then(response => response.json())
    .then(data => conditionData = data)
    .catch(error => console.error('Error loading condition data:', error));

fetch('data/data_merged.json')
    .then(response => response.json())
    .then(data => foodData = data)
    .catch(error => console.error('Error loading condition data:', error));

fetch('data/bioactives_single_condition_non_condition.json')
    .then(response => response.json())
    .then(data => otherData = data)
    .catch(error => console.error('Error loading condition data:', error));

document.getElementById('searchInput').addEventListener('input', function() {
    showRecommendations(this.value);
});

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    handleSearch();
});

function showRecommendations(value) {
    const input = value.toLowerCase();
    const autocompleteList = document.getElementById('autocomplete-list');
    autocompleteList.innerHTML = ''; // Clear previous recommendations
    if (!value) return;

    let dataToUse = [];
    let propName = ''; // To store the property name based on the type
    const searchType = document.getElementById('searchType').value;

    switch (searchType) {
        case 'bioactive':
            dataToUse = bioactiveData;
            propName = 'Bioactive'; // Property name in bioactive data
            break;
        case 'condition':
            dataToUse = conditionData;
            propName = 'Condition'; // Property name in condition data
            break;
        case 'food':
            dataToUse = foodData;
            propName = 'food_name'; // Assuming 'orig_food_common_name' is the property name in food data
            break;
        case 'other':
            dataToUse = otherData;
            propName = 'Condition'; // Assuming 'Condition' is the property name in food data
            break;
        default:
            return; // Do nothing if no valid type is selected
    }

    let seen = new Set(); // Set to keep track of unique entries

    dataToUse.forEach(item => {
        const name = item[propName].toLowerCase(); // Dynamically access the property
        if (name.startsWith(input) && !seen.has(name)) {
            seen.add(name);
            const listItem = document.createElement('div');
            listItem.innerHTML = `<strong>${item[propName]}</strong>`; // Use the dynamic property
            listItem.addEventListener("click", function() {
                document.getElementById('searchInput').value = item[propName]; // Use the dynamic property
                autocompleteList.innerHTML = '';
                handleSearch(); // Trigger the search when an item is clicked
            });
            autocompleteList.appendChild(listItem);
        }
    });
}


function handleSearch() {
    const searchType = document.getElementById('searchType').value;
    const searchQuery = document.getElementById('searchInput').value.trim();

    if (searchType === 'bioactive') {
        window.location.href = `details.html?bioactive=${encodeURIComponent(searchQuery)}`;
    } else if (searchType === 'condition') {
        window.location.href = `condition_details.html?condition=${encodeURIComponent(searchQuery)}`;
    }
    else if (searchType === 'food') {
        window.location.href = `food_details.html?food=${encodeURIComponent(searchQuery)}`;
    }
    else if (searchType === 'other') {
        window.location.href = `other_details.html?other=${encodeURIComponent(searchQuery)}`;
    }
}
