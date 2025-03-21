import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">💻 가성비 PC 부품 추천</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/cpu" className="p-4 bg-gray-100 rounded-lg text-center">
          🖥️ CPU
        </Link>
        <Link to="/gpu" className="p-4 bg-gray-100 rounded-lg text-center">
          🎮 GPU
        </Link>
        <Link to="/메인보드" className="p-4 bg-gray-100 rounded-lg text-center">
          🔧 메인보드
        </Link>
        <Link to="/메모리" className="p-4 bg-gray-100 rounded-lg text-center">
          📀 메모리
        </Link>
        <Link to="/AI추천" className="p-4 bg-gray-100 rounded-lg text-center">
          🧠AI 추천(CHAT GPT)
        </Link>
      </div>
    </div>
  );
};

export default Home;
