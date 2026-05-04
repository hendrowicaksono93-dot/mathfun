import { 
  Calculator, Superscript, Scale, ShoppingCart, Percent, 
  Triangle, Shapes, PieChart, Focus, Layers, 
  Share2, TrendingUp, Box, ListOrdered, Circle, 
  GripHorizontal, Maximize, Cylinder, Move3D, Dices, TriangleRight
} from 'lucide-react';

export const topics = [
  { id: 'bilangan-bulat', name: 'Bilangan Bulat', icon: Calculator, color: 'bg-blue-500', isReady: true },
  { id: 'aljabar', name: 'Aljabar', icon: Superscript, color: 'bg-indigo-500', isReady: true },
  { id: 'plsv-ptlsv', name: 'Persamaan & Pertidaksamaan Linear Satu Variabel', icon: Scale, color: 'bg-violet-500', isReady: true },
  { id: 'aritmatika-sosial', name: 'Aritmatika Sosial', icon: ShoppingCart, color: 'bg-emerald-500', isReady: true },
  { id: 'perbandingan', name: 'Perbandingan', icon: Percent, color: 'bg-teal-500', isReady: true },
  { id: 'unsur-geometri', name: 'Unsur Geometri (Titik, Garis, Sudut)', icon: Triangle, color: 'bg-cyan-500', isReady: true },
  { id: 'pythagoras', name: 'Teorema Pythagoras', icon: TriangleRight, color: 'bg-sky-500', isReady: true },
  { id: 'bangun-datar', name: 'Bangun Datar (Segitiga & Segiempat)', icon: Shapes, color: 'bg-blue-500', isReady: true },
  { id: 'statistika', name: 'Statistika', icon: PieChart, color: 'bg-fuchsia-500', isReady: true },
  { id: 'menyederhanakan-aljabar', name: 'Menyederhanakan Aljabar', icon: Focus, color: 'bg-purple-500', isReady: true },
  { id: 'himpunan', name: 'Himpunan', icon: Layers, color: 'bg-pink-500', isReady: true },
  { id: 'relasi-fungsi', name: 'Relasi dan Fungsi', icon: Share2, color: 'bg-rose-500', isReady: true },
  { id: 'persamaan-garis-lurus', name: 'Persamaan Garis Lurus', icon: TrendingUp, color: 'bg-red-500', isReady: true },
  { id: 'bangun-ruang-sisi-datar', name: 'Bangun Ruang Sisi Datar', icon: Box, color: 'bg-orange-500', isReady: true },
  { id: 'barisan-deret', name: 'Barisan dan Deret', icon: ListOrdered, color: 'bg-amber-500', isReady: true },
  { id: 'lingkaran', name: 'Lingkaran', icon: Circle, color: 'bg-yellow-500', isReady: true },
  { id: 'spldv', name: 'SPLDV', icon: GripHorizontal, color: 'bg-lime-500', isReady: true },
  { id: 'geometri-kesebangunan', name: 'Geometri (Kesebangunan dan Kongruen)', icon: Maximize, color: 'bg-green-500', isReady: true },
  { id: 'bangun-ruang-sisi-lengkung', name: 'Bangun Ruang Sisi Lengkung', icon: Cylinder, color: 'bg-teal-600', isReady: true },
  { id: 'transformasi-geometri', name: 'Transformasi Geometri', icon: Move3D, color: 'bg-cyan-600', isReady: true },
  { id: 'peluang', name: 'Peluang', icon: Dices, color: 'bg-blue-600', isReady: true }
];
