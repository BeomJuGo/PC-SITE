import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPartDetail, fetchPriceHistory } from "../utils/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const PartDetail = () => {
  const { id, category } = useParams();
  const [part, setPart] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const detail = await fetchPartDetail(category, id);
      const history = await fetchPriceHistory(category, id);
      setPart(detail);
      setPriceHistory(history);
    };
    fetchData();
  }, [id, category]);

  if (!part) return <div className="p-4">⏳ 불러오는 중...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{part.name}</h2>
      <div className="flex items-start gap-6 mb-4">
        <img src={part.image} alt={part.name} className="w-32 h-32 object-contain border" />
        <div>
          <p className="text-gray-700">💰 현재가: {Number(part.price).toLocaleString()}원</p>
          <p className="text-gray-700">⚙️ 싱글코어: {part.benchmarkScore?.singleCore}</p>
          <p className="text-gray-700">⚙️ 멀티코어: {part.benchmarkScore?.multiCore}</p>
        </div>
      </div>

      <p className="text-blue-600 italic whitespace-pre-line">{part.review}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">📈 최근 가격 변동</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PartDetail;
