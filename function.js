let lastPost = null;
const updateLyrics = () => {
  const currentLyricsElement = document.querySelector('.SimLRC>.active');
  const currentLyrics = currentLyricsElement ? currentLyricsElement.firstChild.textContent : '';
  let currentLyricsTranslate = currentLyricsElement && currentLyrics !== currentLyricsElement.lastChild.textContent ? currentLyricsElement.lastChild.textContent : '';
  let currentMusicName = document.querySelector('.musicInfo > div')?.innerHTML + " - " + document.querySelector('.musicInfo > b')?.innerHTML;
  // console.log('Lyrics:', currentLyrics);
  // console.log('Translation:', currentLyricsTranslate);

  if (!currentLyricsTranslate || currentLyricsTranslate == "") {
    currentLyricsTranslate = currentMusicName;
  }

  if (lastPost === currentLyrics) {
    return;
  }

  fetch(
    `http://127.0.0.1:50063/component/lyrics/lyrics/`,
    {
        method: "POST",
        body: JSON.stringify({
          lyric: currentLyrics,
          extra: currentLyricsTranslate
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .catch(error => {
      console.error('Error:', error);
    });

};

const waitForElement = async (selector) => {
  while (!document.querySelector(selector)) {
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector);
};

const initObserver = async () => {
  const parentElement = await waitForElement('.SimLRC');
  if (parentElement) {
    const observer = new MutationObserver(updateLyrics);
    observer.observe(parentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    updateLyrics();
  }
};

initObserver();
