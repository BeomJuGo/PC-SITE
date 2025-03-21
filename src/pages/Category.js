import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchParts, fetchNaverPrice, fetchGPTReview } from "../utils/api";

const Category = () => {
  const { category } = useParams();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const rawParts = await fetchParts(category);

      const enrichedParts = await Promise.all(
        rawParts.map(async (part) => {
          const price = await fetchNaverPrice(part.name);
          const review = await fetchGPTReview(part.name);
          return { ...part, price, review };
        })
      );

      setParts(enrichedParts);
      setLoading(false);
    };

    fetchData();
  }, [category]);

  if (loading) {
    return <div className="text-center p-4 text-gray-500">⏳ 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-3xl font-bold mb-4">{category.toUpperCase()} 목록</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <div
            key={part.id}
            className="w-full max-w-md mx-auto p-5 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{part.name}</h3>
            <p className="text-gray-700 mb-1">💰 가격: {Number(part.price).toLocaleString()}원</p>
            <p className="text-gray-700 mb-1">🔥 성능 점수: {part.score}</p>
            <p className="text-blue-600 italic mt-2 whitespace-pre-line break-words leading-relaxed w-full">
              💬 AI 한줄평: {part.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
