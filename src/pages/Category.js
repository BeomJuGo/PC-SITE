import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchParts } from "../utils/api";  // 기존 로컬 데이터 불러오는 함수
import { fetchNaverPrice } from "../utils/api";  // 네이버 API 호출 함수 추가

const Category = () => {
  const { category } = useParams();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 부품 목록을 가져온 후 네이버 가격도 추가
    fetchParts(category).then(async (data) => {
      const updatedParts = await Promise.all(
        data.map(async (part) => {
          const price = await fetchNaverPrice(part.name);  // 네이버에서 가격 정보 가져오기
          return { ...part, price };  // 가격 정보 추가
        })
      );
      setParts(updatedParts);
      setLoading(false);
    });
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">{category.toUpperCase()} 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map((part) => (
          <div key={part.id} className="p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{part.name}</h3>
            <p className="text-gray-600">💰 가격: {part.price}</p>
            <p className="text-gray-600">🔥 성능 점수: {part.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
