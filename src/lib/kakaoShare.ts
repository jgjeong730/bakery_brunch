/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Kakao: any;
  }
}

/**
 * 카카오톡 공유 카드용 정보. OG 태그 스크랩에 기대지 않고 여기서 직접
 * 제목·설명·이미지를 지정한다 — 크롤러가 사이트를 어떻게 읽든 카드가
 * 항상 똑같이 예쁘게 뜬다.
 */
const APP_URL = 'https://jgjeong730.github.io/bakery_brunch/';
const APP_TITLE = '전국 베이커리 & 브런치 카페';
const APP_DESC = '여행지 주변의 평판 좋은 베이커리 카페와 브런치 카페를 지도에서 찾아보세요.';
const APP_IMAGE = `${APP_URL}share-card.png`;

let pending: Promise<void> | null = null;

function loadKakaoSdk(): Promise<void> {
  if (pending) return pending;

  const key = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!key) {
    return Promise.reject(new Error('VITE_KAKAO_JS_KEY 가 설정되지 않았습니다.'));
  }

  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    script.onload = () => {
      if (!window.Kakao.isInitialized()) window.Kakao.init(key);
      resolve();
    };
    script.onerror = () => reject(new Error('카카오 SDK 로드 실패'));
    document.head.appendChild(script);
  });

  return pending;
}

export async function shareAppToKakao() {
  await loadKakaoSdk();
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: APP_TITLE,
      description: APP_DESC,
      imageUrl: APP_IMAGE,
      // 실제 비율을 안 알려주면 카카오가 정사각형으로 가정하고 가운데만
      // 잘라서 보여준다 — 1200x630 이미지의 좌우가 그렇게 잘려나갔다.
      imageWidth: 1200,
      imageHeight: 630,
      link: { mobileWebUrl: APP_URL, webUrl: APP_URL },
    },
    buttons: [
      {
        title: '앱으로 보기',
        link: { mobileWebUrl: APP_URL, webUrl: APP_URL },
      },
    ],
  });
}
