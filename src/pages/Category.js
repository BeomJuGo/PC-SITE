import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchParts, fetchNaverPrice, fetchGPTReview } from "../utils/api";  // ✅ GPT 리뷰 함수도 import

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
          const review = await fetchGPTReview(part.name);  // ✅ GPT 한줄평 요청
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
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">{category.toUpperCase()} 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map((part) => (
          <div key={part.id} className="p-4 border rounded-xl shadow-md bg-white hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{part.name}</h3>
            <p className="text-gray-600">💰 가격: {Number(part.price).toLocaleString()}원</p>
            <p className="text-gray-600">🔥 성능 점수: {part.score}</p>
            <p className="text-blue-600 italic mt-2">💬 AI 한줄평: {part.review}</p> {/* ✅ 한줄평 표시 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
