// ✅ 임시 부품 리스트 (CPU, GPU 등)
export const fetchParts = async (category) => {
  const partsData = {
    cpu: [
      {
        id: 1,
        name: "Intel Core i5-14600K",
        specs: {
          cores: 14,
          threads: 20,
          baseClock: "3.5GHz",
          boostClock: "5.3GHz",
          TDP: "125W",
        },
      },
      {
        id: 2,
        name: "Intel Core i9-14900K",
        specs: {
          cores: 24,
          threads: 32,
          baseClock: "3.2GHz",
          boostClock: "6.0GHz",
          TDP: "125W",
        },
      },
    ],
    gpu: [
      {
        id: 1,
        name: "NVIDIA RTX 4070",
        specs: {
          memory: "12GB GDDR6X",
          baseClock: "1920MHz",
          boostClock: "2475MHz",
          TDP: "200W",
        },
      },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => resolve(partsData[category] || []), 500);
  });
};

// ✅ 네이버 가격 및 이미지 크롤링
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
  } catch (err) {
    return {
      price: "가격 정보를 가져올 수 없습니다.",
      image: "",
    };
  }
};

// ✅ GPT 요약 한줄평
export const fetchGPTReview = async (partName) => {
  try {
    const res = await fetch("https://pc-site-backend.onrender.com/api/gpt-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partName }),
    });
    const data = await res.json();
    return data.review || "한줄평 없음";
  } catch {
    return "한줄평을 가져오는 데 실패했습니다.";
  }
};

// ✅ Geekbench 기반 CPU 벤치마크
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

// ✅ GPU 벤치마크 (현재는 더미 데이터)
export const fetchGpuBenchmark = async () => {
  return "지원 예정";
};

// ✅ 카드용 전체 데이터 (가격, 이미지, 벤치마크, 리뷰 포함)
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

      return {
        ...part,
        price,
        image,
        review,
        benchmarkScore,
      };
    })
  );

  return enriched;
};

// ✅ 상세 페이지용 단일 부품 데이터
export const fetchPartDetail = async (category, id) => {
  const parts = await fetchFullPartData(category);
  return parts.find((p) => p.id.toString() === id.toString());
};

// ✅ 가격 변동 히스토리 (더미 데이터)
export const fetchPriceHistory = async () => {
  return [
    { date: "2024-12", price: 560000 },
    { date: "2025-01", price: 570000 },
    { date: "2025-02", price: 545000 },
    { date: "2025-03", price: 552000 },
  ];
};
