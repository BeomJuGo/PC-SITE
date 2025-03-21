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
    console.log(`🟢 [프론트엔드 가격 API 요청] ${query}`);

    const response = await fetch(
      `https://pc-site-backend.onrender.com/api/naver-price?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    console.log(`🟢 [프론트엔드 가격 응답]`, data);
    return data.items[0]?.lprice || "가격 정보 없음";
  } catch (error) {
    console.error("❌ 네이버 쇼핑 API 요청 오류:", error);
    return "가격 정보를 가져올 수 없습니다.";
  }
};

// ✅ GPT API를 이용한 AI 한줄평 요청
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

// ✅ Geekbench 기반 CPU 벤치마크 점수 가져오기
export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const encodedName = encodeURIComponent(cpuName);
    console.log(`🔍 [Geekbench CPU 벤치마크 요청] ${encodedName}`);

    const response = await fetch(
      `https://pc-site-backend.onrender.com/api/cpu-benchmark?cpu=${encodedName}`
    );
    const data = await response.json();

    console.log(`✅ [Geekbench CPU 벤치마크 응답] ${cpuName}:`, data);
    return data.benchmarkScore || "점수 없음";
  } catch (error) {
    console.error("❌ Geekbench CPU 벤치마크 점수 가져오기 오류:", error);
    return "점수 없음";
  }
};

// ✅ GPU 벤치마크 점수 가져오기
export const fetchGpuBenchmark = async (gpuName) => {
  try {
    const cleanName = gpuName.split(":")[0];
    console.log(`🔍 [GPU 벤치마크 요청] ${cleanName}`);

    const response = await fetch(
      `https://pc-site-backend.onrender.com/api/gpu-benchmark?gpu=${encodeURIComponent(cleanName)}`
    );
    const data = await response.json();

    console.log(`✅ [GPU 벤치마크 응답] ${cleanName}:`, data);
    return data.benchmarkScore || "점수 없음";
  } catch (error) {
    console.error("❌ GPU 벤치마크 점수 가져오기 오류:", error);
    return "점수 없음";
  }
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
    console.error("❌ 부품 데이터 가져오기 오류:", error);
    return [];
  }
};
