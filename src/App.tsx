import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopicLayout from './components/TopicLayout';
import Home from './pages/Home';
import Materi from './pages/Materi';
import Simulasi from './pages/Simulasi';
import Latihan from './pages/Latihan';
import Ulangan from './pages/Ulangan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topik/:topicId" element={<TopicLayout />}>
          <Route index element={<Navigate to="materi" replace />} />
          <Route path="materi" element={<Materi />} />
          <Route path="simulasi" element={<Simulasi />} />
          <Route path="latihan" element={<Latihan />} />
          <Route path="ulangan" element={<Ulangan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
