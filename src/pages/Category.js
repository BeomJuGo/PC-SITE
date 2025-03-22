import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchFullPartData } from "../utils/api";

const Category = () => {
  const { category } = useParams();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const enrichedParts = await fetchFullPartData(category);
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
          <Link
            to={`/detail/${category}/${part.id}`}
            key={part.id}
            className="w-full max-w-md mx-auto p-5 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition flex flex-col h-auto cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{part.name}</h3>
              {part.image && (
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-20 h-20 object-contain border border-gray-300 rounded-md ml-4"
                />
              )}
            </div>

            <p className="text-gray-700 mb-1">
              💰 가격: {isNaN(Number(part.price)) ? part.price : `${Number(part.price).toLocaleString()}원`}
            </p>

            {category === "cpu" ? (
              <div className="text-gray-700 mb-1">
                ⚙️ Geekbench 점수:
                <ul className="ml-4 list-disc">
                  <li>싱글 코어: {part.benchmarkScore?.singleCore || "점수 없음"}</li>
                  <li>멀티 코어: {part.benchmarkScore?.multiCore || "점수 없음"}</li>
                </ul>
              </div>
            ) : (
              <p className="text-gray-700 mb-1">
                ⚙️ 벤치마크 점수: {part.benchmarkScore}
              </p>
            )}

            <p className="text-blue-600 italic mt-2 whitespace-pre-line break-words leading-relaxed w-full">
              💬 AI 한줄평: {part.review}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
