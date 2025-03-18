type ShareData = {
  name: string;
  url: string;
};

export const shareProduct = async ({ name, url }: ShareData) => {
  const shareTitle = `Check out ${name} at Lotus Aroma`;
  const shareText = `I found this amazing perfume at Lotus Aroma: ${name}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      fallbackSharing(url);
    }
  } else {
    fallbackSharing(url);
  }
};

const fallbackSharing = (url: string) => {
  const tempInput = document.createElement('input');
  document.body.appendChild(tempInput);
  tempInput.value = url;
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  alert('Link copied to clipboard! Share it with your friends.');
};
