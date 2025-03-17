// ✅ 부품 데이터 (임시 JSON 데이터)
export const fetchParts = async (category) => {
    const partsData = {
      cpu: [
        { id: 1, name: "Intel Core i7-13700K", score: 90 },
        { id: 2, name: "AMD Ryzen 7 5800X", score: 85 },
        { id: 2, name: "AMD Ryzen 7 5600X", score: 80 },
      ],
      gpu: [
        { id: 1, name: "NVIDIA RTX 4070", score: 95 },
        { id: 2, name: "AMD Radeon RX 7900 XT", score: 92 },
        { id: 2, name: "AMD Radeon RX 7900", score: 90 },
        { id: 2, name: "RTX 5070", score: 90 },
        { id: 2, name: "RTX 5080", score: 92 },
      ],
    };
  
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(partsData[category] || []);
      }, 500); // 0.5초 딜레이 (실제 API 요청처럼)
    });
  };
  
  // ✅ 네이버 쇼핑 API를 통해 가격 가져오기
  export const fetchNaverPrice = async (query) => {
    try {
      console.log(`🟢 [프론트엔드 API 요청] ${query}`);
      
      const response = await fetch(`http://localhost:5000/api/naver-price?query=${encodeURIComponent(query)}`);
      const data = await response.json();
  
      console.log(`🟢 [프론트엔드 API 응답]`, data);
      
      return data.items[0]?.lprice || "가격 정보 없음";
    } catch (error) {
      console.error("❌ 네이버 쇼핑 API 요청 오류:", error);
      return "가격 정보를 가져올 수 없습니다.";
    }
  };
  
