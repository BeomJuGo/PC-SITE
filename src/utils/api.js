// 부품 리스트 가져오기
export const fetchParts = async (category) => {
  const partsData = {
    cpu: [
      { id: 1, name: "Intel Core i5-14600K", score: 90 },
      { id: 2, name: "Intel Core i9-14900K", score: 21 },
      { id: 3, name: "Intel Core i5-14400F", score: 31 },
      { id: 4, name: "Intel Core Ultra7 265K", score: 51 },
      { id: 5, name: "Intel Core Ultra9 285K", score: 61 },
      { id: 6, name: "Intel Core Ultra5 225F", score: 11 },
      { id: 7, name: "AMD Ryzen 5 7500F", score: 11 },
      { id: 8, name: "AMD Ryzen 7 9600X", score: 11 },
      { id: 9, name: "AMD Ryzen 7 9700X", score: 11 },
      { id: 10, name: "AMD Ryzen 9 9950X", score: 11 },
    ],
    gpu: [
      { id: 1, name: "NVIDIA RTX 4070", score: 95 },
      { id: 2, name: "AMD Radeon RX 7900 XT", score: 92 },
      { id: 3, name: "AMD Radeon RX 7900", score: 90 },
      { id: 4, name: "RTX 5070", score: 90 },
      { id: 5, name: "RTX 5080", score: 92 },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(partsData[category] || []);
    }, 500); // 0.5초 딜레이 (실제 API 요청처럼)
  });
};

// 네이버 쇼핑 API로 가격 정보 가져오기
export const fetchNaverPrice = async (query) => {
  try {
    console.log(`🟢 [프론트엔드 가격 API 요청] ${query}`);

    const response = await fetch(`https://pc-site-backend.onrender.com/api/naver-price?query=${encodeURIComponent(query)}`);
    const data = await response.json();

    console.log(`🟢 [프론트엔드 가격 응답]`, data);

    return data.items[0]?.lprice || "가격 정보 없음";
  } catch (error) {
    console.error("❌ 네이버 쇼핑 API 요청 오류:", error);
    return "가격 정보를 가져올 수 없습니다.";
  }
};

// GPT API를 이용한 AI 한줄평 요청
export const fetchGPTReview = async (partName) => {
  try {
    console.log(`💬 [GPT 한줄평 요청] ${partName}`);

    const response = await fetch("https://pc-site-backend.onrender.com/api/gpt-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ partName }),
    });

    const data = await response.json();

    console.log("💬 [GPT 응답]", data);
    return data.review || "한줄평 없음";
  } catch (error) {
    console.error("❌ GPT 한줄평 요청 오류:", error);
    return "한줄평을 가져오는 데 실패했습니다.";
  }
};
