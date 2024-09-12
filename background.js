const API_KEY = AIzaSyAqiuDRHzs804tcfEK3gFXgYmsoeNYICBo

chrome.runtime.onInstalled.addListener(() => {
    console.log('Spoiler Free Sports extension installed!');
  });

  async function getVideoDetails(videoId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`);
    const data = await response.json();
    return data.items[0]?.snippet;
  }
  
  