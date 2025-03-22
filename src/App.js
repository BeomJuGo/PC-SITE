// ✅ App.js - 라우팅 구성 파일
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Detail from "./pages/PartDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:category" element={<Category />} />
        <Route path="/detail/:category/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
};

export default App;
