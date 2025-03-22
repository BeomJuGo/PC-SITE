// ✅ 부품 리스트 (임시)
export const fetchParts = async (category) => {
  return {
    cpu: [
      { id: 1, name: "Intel Core i5-14600K" },
      { id: 2, name: "Intel Core i9-14900K" },
    ],
    gpu: [
      { id: 1, name: "NVIDIA RTX 4070" },
    ],
  }[category] || [];
};

// ✅ 가격 + 이미지 (danawa-py)
export const fetchPartInfo = async (query) => {
  try {
    const res = await fetch(`https://pc-site-backend.onrender.com/api/part-info?query=${encodeURIComponent(query)}`);
    return await res.json();
  } catch {
    return { price: "가격 오류", image: "" };
  }
};

// ✅ GPT 요약 정보
export const fetchGPTInfo = async (partName) => {
  try {
    const res = await fetch("https://pc-site-backend.onrender.com/api/gpt-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partName }),
    });
    return await res.json();
  } catch {
    return { review: "한줄평 오류", specSummary: "사양 요약 오류" };
  }
};

// ✅ CPU 벤치마크
export const fetchCpuBenchmark = async (name) => {
  try {
    const res = await fetch(`https://pc-site-backend.onrender.com/api/cpu-benchmark?cpu=${encodeURIComponent(name)}`);
    const data = await res.json();
    return data.benchmarkScore;
  } catch {
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

// ✅ GPU 벤치마크
export const fetchGpuBenchmark = async () => {
  return "지원 예정";
};

// ✅ 통합 부품 정보
export const fetchFullPartData = async (category) => {
  const parts = await fetchParts(category);
  return await Promise.all(
    parts.map(async (part) => {
      const { price, image } = await fetchPartInfo(part.name);
      const { review, specSummary } = await fetchGPTInfo(part.name);
      const benchmarkScore = category === "cpu"
        ? await fetchCpuBenchmark(part.name)
        : await fetchGpuBenchmark();

      return { ...part, price, image, review, specSummary, benchmarkScore };
    })
  );
};

// ✅ 상세페이지용 데이터
export const fetchPartDetail = async (category, id) => {
  const all = await fetchFullPartData(category);
  return all.find((d) => d.id.toString() === id.toString());
};

export const fetchPriceHistory = async () => {
  return [
    { date: "2024-12", price: 560000 },
    { date: "2025-01", price: 570000 },
    { date: "2025-02", price: 545000 },
    { date: "2025-03", price: 552000 },
  ];
};
