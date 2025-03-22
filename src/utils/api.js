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

// ✅ 네이버 가격 정보 + 이미지 가져오기
export const fetchNaverPrice = async (query) => {
  try {
    const response = await fetch(
      `https://pc-site-backend.onrender.com/api/naver-price?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    const item = data.items?.[0];

    return {
      price: item?.lprice || "가격 정보 없음",
      image: item?.image || "",
    };
  } catch (error) {
    return { price: "가격 정보를 가져올 수 없습니다.", image: "" };
  }
};

// ✅ GPT 한줄평 요청
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
    return "한줄평을 가져오는 데 실패했습니다.";
  }
};

// ✅ CPU 벤치마크 점수 요청
export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const response = await fetch(
      `https://pc-site-backend.onrender.com/api/cpu-benchmark?cpu=${encodeURIComponent(cpuName)}`
    );
    const data = await response.json();
    return data.benchmarkScore || { singleCore: "점수 없음", multiCore: "점수 없음" };
  } catch (error) {
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

// ✅ GPU 벤치마크는 아직 미지원
export const fetchGpuBenchmark = async (gpuName) => {
  return "지원 예정";
};

// ✅ 모든 부품 정보 통합 가져오기
export const fetchFullPartData = async (category) => {
  const parts = await fetchParts(category);

  const enrichedParts = await Promise.all(
    parts.map(async (part) => {
      const { price, image } = await fetchNaverPrice(part.name);
      const review = await fetchGPTReview(part.name);

      let benchmarkScore = "점수 없음";
      if (category === "cpu") {
        benchmarkScore = await fetchCpuBenchmark(part.name);
      } else if (category === "gpu") {
        benchmarkScore = await fetchGpuBenchmark(part.name);
      }

      return { ...part, price, image, review, benchmarkScore };
    })
  );

  return enrichedParts;
};

// ✅ 부품 상세 정보 요청
export const fetchPartDetail = async (category, id) => {
  const res = await fetch(`https://pc-site-backend.onrender.com/api/part-detail?category=${category}&id=${id}`);
  return await res.json();
};

// ✅ 가격 변동 그래프용 데이터 요청
export const fetchPriceHistory = async (category, id) => {
  const res = await fetch(`https://pc-site-backend.onrender.com/api/price-history?category=${category}&id=${id}`);
  return await res.json();
};
