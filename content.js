// Dictionary of team names and spoiler-related keywords
const spoilerDictionary = [
  'win', 'lose', 'defeated', 'score', 'highlights', 'vs', 'game', 'final', 'match', 
  'result', 'draw', 'penalty', 'goal','quarterback', 'touchdown', 'nba', 'nfl', 'mlb', 
  'championship', 'playoff', 'world cup', 'super bowl'
  // Add more teams, leagues, and buzzwords here
];

function blurThumbnails(interests) {
    const thumbnails = document.querySelectorAll('ytd-thumbnail img');
    thumbnails.forEach(img => {
        // Check if the interest or a spoiler keyword matches the video title or description
        const parent = img.closest('ytd-grid-video-renderer, ytd-video-renderer');
        const title = parent.querySelector('#video-title')?.textContent.toLowerCase();
        if (interests.some(interest => title.includes(interest)) || 
            spoilerDictionary.some(keyword => title.includes(keyword))) {
            img.style.filter = 'blur(8px)';
        }
    });
}

function updateTitles(interests) {
    const titles = document.querySelectorAll('h3.title, #video-title');
    titles.forEach(title => {
        const text = title.textContent.toLowerCase();
        if (interests.some(interest => text.includes(interest)) || 
            spoilerDictionary.some(keyword => text.includes(keyword))) {
            title.innerHTML = 'SPOILER FREE: *sporting event info*';
        }
    });
}

function modifyYouTubePage() {
    chrome.storage.sync.get('interests', (data) => {
        const interests = data.interests ? data.interests.split(',').map(i => i.trim().toLowerCase()) : [];
        blurThumbnails(interests);
        updateTitles(interests);
    });
}

async function modifyYouTubePage() {
    const videoElements = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer');
    for (const videoElement of videoElements) {
        const videoId = videoElement.querySelector('a').href.split('v=')[1];
        if (videoId) {
            const snippet = await getVideoDetails(videoId);
            if (snippet) {
                const titleElement = videoElement.querySelector('#video-title');
                if (titleElement) {
                    titleElement.innerHTML = 'SPOILER FREE: *sporting event info*';
                }
                const thumbnailElement = videoElement.querySelector('ytd-thumbnail img');
                if (thumbnailElement) {
                    thumbnailElement.style.filter = 'blur(8px)';
                }
            }
        }
    }
}

// Call the function to apply modifications
modifyYouTubePage();
document.addEventListener('DOMContentLoaded', modifyYouTubePage);
