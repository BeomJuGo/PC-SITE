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

export const fetchNaverPrice = async (query) => {
  try {
    const res = await fetch(`https://pc-site-backend.onrender.com/api/naver-price?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const item = data.items?.[0];
    return {
      price: item?.lprice || "가격 정보 없음",
      image: item?.image || "",
    };
  } catch {
    return { price: "가격 오류", image: "" };
  }
};

export const fetchGPTReview = async (partName) => {
  try {
    const res = await fetch("https://pc-site-backend.onrender.com/api/gpt-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partName }),
    });
    const data = await res.json();
    return {
      review: data.review || "한줄평 없음",
      specSummary: data.specSummary || "사양 없음",
    };
  } catch {
    return { review: "한줄평 오류", specSummary: "사양 오류" };
  }
};

export const fetchCpuBenchmark = async (cpuName) => {
  try {
    const res = await fetch(`https://pc-site-backend.onrender.com/api/cpu-benchmark?cpu=${encodeURIComponent(cpuName)}`);
    const data = await res.json();
    return data.benchmarkScore;
  } catch {
    return { singleCore: "점수 없음", multiCore: "점수 없음" };
  }
};

export const fetchFullPartData = async (category) => {
  const parts = await fetchParts(category);

  return await Promise.all(
    parts.map(async (part) => {
      const { price, image } = await fetchNaverPrice(part.name);
      const { review, specSummary } = await fetchGPTReview(part.name);
      const benchmarkScore = category === "cpu" ? await fetchCpuBenchmark(part.name) : "지원 예정";

      return { ...part, price, image, review, specSummary, benchmarkScore };
    })
  );
};

export const fetchPartDetail = async (category, id) => {
  const data = await fetchFullPartData(category);
  return data.find((d) => d.id.toString() === id.toString());
};

export const fetchPriceHistory = async () => {
  return [
    { date: "2024-12", price: 560000 },
    { date: "2025-01", price: 570000 },
    { date: "2025-02", price: 545000 },
    { date: "2025-03", price: 552000 },
  ];
};
