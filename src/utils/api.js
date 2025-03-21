// ✅ 부품 리스트 가져오기
export const fetchParts = async (category) => {
  const partsData = {
    cpu: [
      { id: 1, name: "Intel Core i5-14600K" },
      { id: 2, name: "Intel Core i9-14900K" },
    ],
    gpu: [
      { id: 1, name: "NVIDIA RTX 4070" },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(partsData[category] || []);
    }, 500);
  });
};

// ✅ 네이버 쇼핑 API로 가격 정보 가져오기
export const fetchNaverPrice = async (query) => {
  try {
    const response = await fetch(
      `https://pc-site-backend.onrender.com/api/naver-price?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.items[0]?.lprice || "가격 정보 없음";
  } catch (error) {
    console.error("❌ 가격 정보 오류:", error);
    return "가격 정보를 가져올 수 없습니다.";
  }
};

// ✅ GPT API를 이용한 AI 한줄평 요청
export const fetchGPTReview = async (partName) => {
  try {
    const response = await fetch("https://pc-site-backend.onrender.com/api/gpt-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partName }),
    });
    const data = await response.json();
    return data.review || "한줄평 없음";
  } catch (error) {
    console.error("❌ GPT 한줄평 오류:", error);
    return "한줄평을 가져오는 데 실패했습니다.";
  }
};

// ✅ Geekbench 기반 CPU 벤치마크 점수 가져오기
export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const response = await fetch(
      `https://pc-site-backend.onrender.com/api/cpu-benchmark?cpu=${encodeURIComponent(cpuName)}`
    );
    const data = await response.json();

    // ✅ 객체 형태 점수 여부 확인
    if (typeof data.benchmarkScore === "object" && data.benchmarkScore !== null) {
      return {
        singleCore: data.benchmarkScore.singleCore || "점수 없음",
        multiCore: data.benchmarkScore.multiCore || "점수 없음",
      };
    }

    return { singleCore: data.benchmarkScore || "점수 없음", multiCore: "점수 없음" };
  } catch (error) {
    console.error("❌ CPU 벤치마크 오류:", error);
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

// ✅ GPU 벤치마크 점수 가져오기 (현재 지원 예정)
export const fetchGpuBenchmark = async (gpuName) => {
  return "지원 예정";
};

// ✅ 부품 데이터 + 가격 + AI 한줄평 + 벤치마크 점수 통합 가져오기
export const fetchFullPartData = async (category) => {
  try {
    const parts = await fetchParts(category);

    const enrichedParts = await Promise.all(
      parts.map(async (part) => {
        const price = await fetchNaverPrice(part.name);
        const review = await fetchGPTReview(part.name);

        let benchmarkScore = "점수 없음";
        if (category === "cpu") {
          benchmarkScore = await fetchCpuBenchmark(part.name);
        } else if (category === "gpu") {
          benchmarkScore = await fetchGpuBenchmark(part.name);
        }

        return { ...part, price, review, benchmarkScore };
      })
    );

    return enrichedParts;
  } catch (error) {
    console.error("❌ 부품 데이터 통합 오류:", error);
    return [];
  }
};
