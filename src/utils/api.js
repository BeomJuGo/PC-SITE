// ✅ 부품 리스트 (임시 데이터)
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
    setTimeout(() => resolve(partsData[category] || []), 500);
  });
};

// ✅ 네이버 가격 + 이미지
export const fetchNaverPrice = async (query) => {
  try {
    const res = await fetch(
      `https://pc-site-backend.onrender.com/api/naver-price?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    const item = data.items?.[0];
    return {
      price: item?.lprice || "가격 정보 없음",
      image: item?.image || "",
    };
  } catch (error) {
    return {
      price: "가격 정보를 가져올 수 없습니다.",
      image: "",
    };
  }
};

// ✅ GPT 한줄평
export const fetchGPTReview = async (partName) => {
  try {
    const res = await fetch("https://pc-site-backend.onrender.com/api/gpt-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partName }),
    });
    const data = await res.json();
    return data.review || "한줄평 없음";
  } catch (error) {
    return "한줄평을 가져오는 데 실패했습니다.";
  }
};

// ✅ CPU 벤치마크 (싱글/멀티 코어)
export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const res = await fetch(
      `https://pc-site-backend.onrender.com/api/cpu-benchmark?cpu=${encodeURIComponent(cpuName)}`
    );
    const data = await res.json();
    return data.benchmarkScore || { singleCore: "점수 없음", multiCore: "점수 없음" };
  } catch {
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

// ✅ GPU 벤치마크 (지원 예정)
export const fetchGpuBenchmark = async () => {
  return "지원 예정";
};

// ✅ 카드용 전체 데이터 통합
export const fetchFullPartData = async (category) => {
  const parts = await fetchParts(category);
  const enriched = await Promise.all(
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
  return enriched;
};

// ✅ 상세페이지: 단일 부품 데이터 (백엔드에 저장된 데이터 기준)
export const fetchPartDetail = async (category, id) => {
  const res = await fetch(`https://pc-site-backend.onrender.com/api/part-detail?category=${category}&id=${id}`);
  return await res.json();
};

// ✅ 가격 히스토리 (백엔드에서 날짜별 가격 데이터 제공)
export const fetchPriceHistory = async (category, id) => {
  const res = await fetch(`https://pc-site-backend.onrender.com/api/price-history?category=${category}&id=${id}`);
  return await res.json();
};
