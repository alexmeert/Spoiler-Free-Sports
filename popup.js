// Example list of sports for autocomplete
const sports = ['Football', 'Basketball', 'Baseball', 'Soccer', 'Tennis', 'Hockey', 'Golf'];

// Updated mapping for sports to colors
const sportColors = {
  'Football': '#6f4f28', // Brown color for football
  'Basketball': '#FF6F00', // Example color for basketball
  'Baseball': '#DDDDDD', // Example color for baseball
  'Soccer': '#009B77', // Example color for soccer
  'Tennis': '#4CAF50', // Example color for tennis
  'Hockey': '#000000', // Example color for hockey
  'Golf': '#004d00' // Darker green for golf
};

const interestInput = document.getElementById('interest-input');
const autocompleteList = document.getElementById('autocomplete-list');
const tagsContainer = document.getElementById('tags-container');

// Function to filter sports based on user input
function filterSports(query) {
  return sports.filter(sport => sport.toLowerCase().includes(query.toLowerCase()));
}

// Function to display autocomplete suggestions
function showSuggestions(suggestions) {
  autocompleteList.innerHTML = ''; // Clear previous suggestions
  if (suggestions.length === 0) return;

  suggestions.forEach(sport => {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.textContent = sport;
    item.addEventListener('click', () => {
      addTag(sport);
      interestInput.value = '';
      autocompleteList.innerHTML = ''; // Clear suggestions
      saveTags(); // Save the new tag immediately after it's added
    });
    autocompleteList.appendChild(item);
  });
}

// Handle user input for autocomplete
interestInput.addEventListener('input', () => {
  const query = interestInput.value.trim();
  if (query) {
    const suggestions = filterSports(query);
    showSuggestions(suggestions);
  } else {
    autocompleteList.innerHTML = ''; // Clears suggestions if input is empty
  }
});

// Handle keydown event to add tag on Enter
interestInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const value = interestInput.value.trim();
    if (value && sports.includes(value) && !isTagAlreadyAdded(value)) {
      addTag(value);
      interestInput.value = '';
      autocompleteList.innerHTML = ''; // Clear suggestions
      saveTags(); // Save the new tag immediately after it's added
    }
  }
});

// Check if a tag is already added to prevent duplicates
function isTagAlreadyAdded(value) {
  const existingTags = Array.from(document.querySelectorAll('#tags-container .tag')).map(tag => tag.dataset.value);
  return existingTags.includes(value);
}

function addTag(value) {
  if (isTagAlreadyAdded(value)) {
    alert((value) + ' is already in your interests!');
    return;
  }

  const tag = document.createElement('div');
  tag.className = 'tag';
  tag.dataset.value = value;
  tag.style.backgroundColor = sportColors[value] || '#007bff'; // Default color if sport not found
  tag.innerHTML = `
    ${value}
    <button class="remove-tag" onclick="removeTag(this)">x</button>
  `;
  tagsContainer.appendChild(tag);
}

// Remove a tag and update storage immediately
function removeTag(button) {
  const tag = button.parentElement;
  tag.remove();
  saveTags(); // Save the updated list of tags after one is removed
}

// Save the current list of tags to Chrome's storage
function saveTags() {
  const tags = Array.from(document.querySelectorAll('#tags-container .tag')).map(tag => tag.dataset.value);
  chrome.storage.sync.set({ interests: tags }, () => {
    console.log('Interests saved:', tags); // Optionally log the saved interests
  });
}

// Manually trigger the save button
document.getElementById('save-interest').addEventListener('click', () => {
  saveTags(); // Save tags manually when the "Save Interests" button is clicked
});

// Load saved interests when popup opens
chrome.storage.sync.get('interests', (data) => {
  if (data.interests) {
    data.interests.forEach(interest => addTag(interest));
  }
});
