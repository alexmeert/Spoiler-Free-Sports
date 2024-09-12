function blurThumbnails(interests) {
  const thumbnails = document.querySelectorAll('ytd-thumbnail img');
  thumbnails.forEach(img => {
    // Check if the interest matches the video title or description
    const parent = img.closest('ytd-grid-video-renderer, ytd-video-renderer');
    const title = parent.querySelector('#video-title')?.textContent.toLowerCase();
    if (interests.some(interest => title.includes(interest))) {
      img.style.filter = 'blur(8px)';
    }
  });
}

function updateTitles(interests) {
  const titles = document.querySelectorAll('h3.title');
  titles.forEach(title => {
    const text = title.textContent.toLowerCase();
    if (interests.some(interest => text.includes(interest))) {
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
  // Example function to process video elements
  const videoElements = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer');
  for (const videoElement of videoElements) {
    const videoId = videoElement.querySelector('a').href.split('v=')[1];
    if (videoId) {
      const snippet = await getVideoDetails(videoId);
      if (snippet) {
        // Example: Change title if it matches user interests
        const titleElement = videoElement.querySelector('#video-title');
        if (titleElement) {
          titleElement.innerHTML = 'SPOILER FREE: *sporting event info*';
        }
        
        // Example: Blur thumbnail
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