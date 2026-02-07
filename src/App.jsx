import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import ProgramSelect from './pages/ProgramSelect';
import ProfileManage from './pages/ProfileManage';

import MainRedirect from './pages/MainRedirect';
import ProductPage from './pages/ProductPage';
import ResultPage from './pages/ResultPage';
import CalendarResultPage from './pages/CalendarResultPage';
// import 추가 (상단):
import AstroCalendarResultPage from './pages/AstroCalendarResultPage';

// ========================================
// 라우터
// ========================================
export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* 인증 관련 */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/programs" element={<ProtectedRoute><ProgramSelect /></ProtectedRoute>} />
        <Route path="/profile-select" element={<ProtectedRoute><ProfileManage /></ProtectedRoute>} />
          
        <Route path="/" element={<MainRedirect />} />

        {/* 사주 상품들 */}
        <Route path="/saju" element={<ProductPage productKey="saju" />} />
        <Route path="/wealth" element={<ProductPage productKey="wealth" />} />
        <Route path="/love" element={<ProductPage productKey="love" />} />
        <Route path="/career" element={<ProductPage productKey="career" />} />
        <Route path="/full" element={<ProductPage productKey="full" />} />

        {/* 점성학 상품들 */}
        <Route path="/astro" element={<ProductPage productKey="astro" />} />
        <Route path="/astro-wealth" element={<ProductPage productKey="astro-wealth" />} />
        <Route path="/astro-love" element={<ProductPage productKey="astro-love" />} />
        <Route path="/astro-career" element={<ProductPage productKey="astro-career" />} />
        <Route path="/astro-full" element={<ProductPage productKey="astro-full" />} />

        {/* 결과 페이지 */}
        <Route path="/result/:orderId" element={<ResultPage />} />

        {/* 달력 */}
        <Route path="/calendar" element={<ProductPage productKey="calendar" />} />
        <Route path="/calendar/:orderId" element={<CalendarResultPage />} />
        // Routes 안에 추가 (달력 섹션에):
{/* 점성학 달력 */}
<Route path="/astro-calendar" element={<ProductPage productKey="astro-calendar" />} />
<Route path="/astro-calendar/:orderId" element={<AstroCalendarResultPage />} />
     </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}