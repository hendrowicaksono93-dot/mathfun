import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { topics } from '../lib/topics';
import { Dice6 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Simulasi() {
  const { topicId } = useParams();
  const currentTopic = topics.find(t => t.id === topicId) || topics[0];

  let desc = "";
  let SimulasiComponent = SimulasiBilanganBulat;

  switch(currentTopic.id) {
    case 'aljabar':
      desc = "Gunakan mesin canggih ini untuk memvisualisasikan bagaimana nilai huruf digantikan dengan angka.";
      SimulasiComponent = SimulasiAljabar;
      break;
    case 'plsv-ptlsv':
      desc = "Gunakan timbangan keseimbangan ini untuk memahami konsep ruas kiri dan ruas kanan pada persamaan.";
      SimulasiComponent = SimulasiPLSV;
      break;
    case 'aritmatika-sosial':
      desc = "Gunakan kalkulator bisnis ini untuk mensimulasikan persentase keuntungan, kerugian, dan harga jual barang.";
      SimulasiComponent = SimulasiAritmatikaSosial;
      break;
    case 'perbandingan':
      desc = "Eksplorasi hubungan senilai dan berbalik nilai melalui studi kasus dunia nyata.";
      SimulasiComponent = SimulasiPerbandingan;
      break;
    case 'unsur-geometri':
      desc = "Visualisasikan hubungan antara garis sejajar dan sudut yang terbentuk oleh garis transversal.";
      SimulasiComponent = SimulasiUnsurGeometri;
      break;
    case 'pythagoras':
      desc = "Atur panjang alas dan tinggi segitiga siku-siku untuk melihat perubahan panjang sisi miring (Teorema Pythagoras).";
      SimulasiComponent = SimulasiPythagoras;
      break;
    case 'bangun-datar':
      desc = "Ubah-ubah ukuran sisi untuk melihat bagaimana keliling dan luas bangun datar berubah secara real-time.";
      SimulasiComponent = SimulasiBangunDatar;
      break;
    case 'statistika':
      desc = "Simulasi pengumpulan, perhitungan, dan representasi data statistika.";
      SimulasiComponent = SimulasiStatistika;
      break;
    case 'menyederhanakan-aljabar':
      desc = "Simulasi interaktif untuk mengelompokkan dan menyederhanakan suku sejenis pada bentuk aljabar.";
      SimulasiComponent = SimulasiMenyederhanakanAljabar;
      break;
    case 'himpunan':
      desc = "Simulasi interaktif diagram Venn untuk operasi himpunan (Irisan, Gabungan, Selisih).";
      SimulasiComponent = SimulasiHimpunan;
      break;
    case 'relasi-fungsi':
      desc = "Simulasi interaktif untuk membedakan antara Relasi dan Fungsi menggunakan Diagram Panah.";
      SimulasiComponent = SimulasiRelasiFungsi;
      break;
    case 'persamaan-garis-lurus':
      desc = "Eksplorasi interaktif gradien (kemiringan) dan konstanta pada grafik persamaan garis lurus y = mx + c.";
      SimulasiComponent = SimulasiPGL;
      break;
    case 'bangun-ruang-sisi-datar':
      desc = "Rumus Volume dan Luas Permukaan Balok/Kubus interaktif.";
      SimulasiComponent = SimulasiBRSD;
      break;
    case 'barisan-deret':
      desc = "Eksplorasi interaktif barisan Aritmatika dan Geometri.";
      SimulasiComponent = SimulasiBarisanDeret;
      break;
    case 'lingkaran':
      desc = "Eksplorasi interaktif Panjang Busur dan Luas Juring berdasarkan Sudut Pusat.";
      SimulasiComponent = SimulasiLingkaran;
      break;
    case 'spldv':
      desc = "Eksplorasi interaktif penyelesaian SPLDV dengan metode grafik dan koefisien.";
      SimulasiComponent = SimulasiSPLDV;
      break;
    case 'geometri-kesebangunan':
      desc = "Eksplorasi interaktif perbandingan sisi dan skala pada bangun yang sebangun.";
      SimulasiComponent = SimulasiKesebangunan;
      break;
    case 'bangun-ruang-sisi-lengkung':
      desc = "Pahami kaitan Volume antara Tabung, Kerucut, dan Bola secara interaktif.";
      SimulasiComponent = SimulasiBRSL;
      break;
    case 'transformasi-geometri':
      desc = "Eksplorasi translasi, refleksi, rotasi, dan dilatasi secara interaktif.";
      SimulasiComponent = SimulasiTransformasi;
      break;
    case 'peluang':
      desc = "Simulasi percobaan peluang acak (dadu, koin).";
      SimulasiComponent = SimulasiPeluang;
      break;
    default:
      desc = "Gunakan pengatur operasi bilangan bulat ini untuk memahami konsep matematika dasar.";
      SimulasiComponent = SimulasiBilanganBulat;
      break;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Simulasi Interaktif {currentTopic.name}</h1>
          <p className="text-slate-500 text-sm mt-1">{desc}</p>
        </div>
      </div>

      <SimulasiComponent />
    </div>
  );
}

function SimulasiPGL() {
  const [m, setM] = useState<number>(1);
  const [c, setC] = useState<number>(0);

  // Constants for Cartesian Grid
  const gridSize = 300;
  const halfGrid = gridSize / 2;
  const scale = 15; // 1 unit = 15px

  // Generate ticks
  const ticks = [];
  for (let i = -10; i <= 10; i++) {
    ticks.push(i);
  }

  // Calculate coordinates for the line y = mx + c
  // We want coordinates that span the width of our SVG viewBox (-10 to 10 in our scale)
  const renderLine = () => {
    // x range is from -10 to 10
    const x1 = -10;
    const y1 = m * x1 + c;

    const x2 = 10;
    const y2 = m * x2 + c;

    // Convert to SVG coordinates: 
    // SVG (0,0) is top-left, we want (0,0) to be at (halfGrid, halfGrid)
    // Positive Y in math is up, in SVG is down. So y_svg = halfGrid - (y_math * scale)
    const svgX1 = halfGrid + (x1 * scale);
    const svgY1 = halfGrid - (y1 * scale);
    
    const svgX2 = halfGrid + (x2 * scale);
    const svgY2 = halfGrid - (y2 * scale);

    return (
      <line 
         x1={svgX1} y1={svgY1} x2={svgX2} y2={svgY2} 
         stroke="#3b82f6" strokeWidth="3" 
         className="transition-all duration-300 ease-linear shadow-lg drop-shadow-md"
      />
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 grid lg:grid-cols-[1fr_300px] gap-8">
      
      {/* Left side: Coordinate Grid */}
      <div className="flex flex-col items-center">
         <div className="relative border-2 border-slate-300 w-[300px] h-[300px] bg-slate-50 overflow-hidden shadow-inner">
            <svg viewBox={`0 0 ${gridSize} ${gridSize}`} className="w-full h-full">
               
               {/* Minor Grid Lines */}
               {ticks.map(t => (
                  <g key={`grid-x-${t}`}>
                     <line x1={halfGrid + t * scale} y1={0} x2={halfGrid + t * scale} y2={gridSize} stroke="#e2e8f0" strokeWidth={t === 0 ? 0 : 1} />
                  </g>
               ))}
               {ticks.map(t => (
                  <g key={`grid-y-${t}`}>
                     <line x1={0} y1={halfGrid - t * scale} x2={gridSize} y2={halfGrid - t * scale} stroke="#e2e8f0" strokeWidth={t === 0 ? 0 : 1} />
                  </g>
               ))}

               {/* Primary Axes */}
               <line x1={0} y1={halfGrid} x2={gridSize} y2={halfGrid} stroke="#64748b" strokeWidth="2" /> {/* X Axis */}
               <line x1={halfGrid} y1={0} x2={halfGrid} y2={gridSize} stroke="#64748b" strokeWidth="2" /> {/* Y Axis */}

               {/* Render the PGL line */}
               {renderLine()}

               {/* Point of Intersection with Y-axis */}
               <circle 
                  cx={halfGrid} 
                  cy={halfGrid - c * scale} 
                  r="5" fill="#f43f5e" 
               />
               <text x={halfGrid + 8} y={halfGrid - c * scale - 8} fontSize="12" fill="#f43f5e" className="font-bold">
                  (0, {c})
               </text>

            </svg>
         </div>
      </div>

      {/* Right side: Controls */}
      <div className="flex flex-col gap-6">
         <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
           <h3 className="font-bold text-slate-700 mb-2">Persamaan:</h3>
           <div className="font-mono text-2xl font-bold text-blue-700 bg-white inline-block px-4 py-2 rounded border border-blue-200 w-full text-center">
              y = {m !== 0 ? (m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`) : ''}
              {m !== 0 && c > 0 ? ` + ${c}` : m !== 0 && c < 0 ? ` - ${Math.abs(c)}` : m === 0 ? c : ''}
              {m === 0 && c === 0 && '0'}
           </div>
         </div>

         <div className="space-y-4">
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="font-bold text-slate-600 text-sm">Gradien (m)</label>
                 <span className="font-mono bg-blue-100 text-blue-800 px-2 rounded text-xs font-bold">{m}</span>
               </div>
               <input 
                 type="range" min="-5" max="5" step="1" 
                 value={m} onChange={(e) => setM(parseInt(e.target.value))}
                 className="w-full accent-blue-600"
               />
               <p className="text-xs text-slate-500 mt-1">Mengatur kemiringan garis. m positif miring ke kanan, m negatif miring ke kiri, m=0 mendatar.</p>
            </div>

            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="font-bold text-slate-600 text-sm">Konstanta (c)</label>
                 <span className="font-mono bg-rose-100 text-rose-800 px-2 rounded text-xs font-bold">{c}</span>
               </div>
               <input 
                 type="range" min="-8" max="8" step="1" 
                 value={c} onChange={(e) => setC(parseInt(e.target.value))}
                 className="w-full accent-rose-600"
               />
               <p className="text-xs text-slate-500 mt-1">Titik potong sumbu Y. Garis menyentuh garis vertikal tepat pada nilai y = {c}.</p>
            </div>
         </div>
      </div>

    </div>
  );
}

function SimulasiBRSD() {
  const [p, setP] = useState(5);
  const [l, setL] = useState(4);
  const [t, setT] = useState(3);

  const isKubus = p === l && l === t;
  const V = p * l * t;
  const Luas = 2 * (p * l + p * t + l * t);

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 max-w-full overflow-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h3 className="font-bold text-slate-800">Kalkulator Bangun Ruang Sisi Datar Interaktif</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Ubah ukuran panjang, lebar, dan tinggi untuk melihat perubahannya secara interaktif! Jika ketiganya sama, maka akan menjadi Kubus.
            </p>
         </div>
         {isKubus && (
           <span className="bg-sky-100 text-sky-800 px-3 py-1 font-bold rounded-full text-xs">
             ✨ Bangun ini adalah KUBUS!
           </span>
         )}
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-8 mt-8">
        <div className="space-y-6">
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="font-bold text-slate-600 text-sm">Panjang (p)</label>
                 <span className="font-mono bg-indigo-100 text-indigo-800 px-2 rounded text-xs font-bold">{p}</span>
               </div>
               <input 
                 type="range" min="1" max="10" step="1" 
                 value={p} onChange={(e) => setP(parseInt(e.target.value))}
                 className="w-full accent-indigo-600"
               />
            </div>
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="font-bold text-slate-600 text-sm">Lebar (l)</label>
                 <span className="font-mono bg-fuchsia-100 text-fuchsia-800 px-2 rounded text-xs font-bold">{l}</span>
               </div>
               <input 
                 type="range" min="1" max="10" step="1" 
                 value={l} onChange={(e) => setL(parseInt(e.target.value))}
                 className="w-full accent-fuchsia-600"
               />
            </div>
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="font-bold text-slate-600 text-sm">Tinggi (t)</label>
                 <span className="font-mono bg-emerald-100 text-emerald-800 px-2 rounded text-xs font-bold">{t}</span>
               </div>
               <input 
                 type="range" min="1" max="10" step="1" 
                 value={t} onChange={(e) => setT(parseInt(e.target.value))}
                 className="w-full accent-emerald-600"
               />
            </div>
        </div>

        <div>
           {/* Pseudo-3D representation Using CSS */}
           <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-8 mb-6 overflow-hidden flex items-center justify-center min-h-[250px] relative">
              <div 
                 className="relative transition-all duration-300"
                 style={{
                    width: `${p * 20}px`, 
                    height: `${t * 20}px`,
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(-20deg) rotateY(30deg) translateZ(0)'
                 }}
              >
                 {/* Depan */}
                 <div className="absolute inset-0 bg-blue-400 opacity-80 border-2 border-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    {p} × {t}
                 </div>
                 {/* Belakang */}
                 <div className="absolute inset-0 bg-blue-300 opacity-80 border-2 border-blue-600" style={{ transform: `translateZ(-${l * 20}px)` }}></div>
                 {/* Kiri */}
                 <div className="absolute inset-y-0 left-0 bg-blue-500 opacity-80 border-2 border-blue-600 origin-left" style={{ width: `${l * 20}px`, transform: `rotateY(90deg)` }}></div>
                 {/* Kanan */}
                 <div className="absolute inset-y-0 right-0 bg-blue-500 opacity-80 border-2 border-blue-600 origin-right" style={{ width: `${l * 20}px`, transform: `rotateY(-90deg)` }}></div>
                 {/* Atas */}
                 <div className="absolute inset-x-0 top-0 bg-blue-200 opacity-80 border-2 border-blue-600 origin-top" style={{ height: `${l * 20}px`, transform: `rotateX(-90deg)` }}></div>
                 {/* Bawah */}
                 <div className="absolute inset-x-0 bottom-0 bg-blue-800 opacity-80 border-2 border-blue-600 origin-bottom" style={{ height: `${l * 20}px`, transform: `rotateX(90deg)` }}></div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg">
                 <h4 className="font-bold text-amber-800 text-sm mb-1">Volume (V)</h4>
                 <div className="text-sm text-amber-900 font-mono mb-2">p × l × t</div>
                 <div className="text-xl font-bold font-mono text-amber-600 bg-white border border-amber-100 rounded inline-block px-3 py-1">
                   {p} × {l} × {t} = {V}
                 </div>
              </div>
              <div className="bg-purple-50 p-4 border border-purple-200 rounded-lg">
                 <h4 className="font-bold text-purple-800 text-sm mb-1">Luas Permukaan (L)</h4>
                 <div className="text-sm text-purple-900 font-mono mb-2">2(p×l + p×t + l×t)</div>
                 <div className="text-xl font-bold font-mono text-purple-600 bg-white border border-purple-100 rounded inline-block px-3 py-1">
                   {Luas}
                 </div>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}

function SimulasiBarisanDeret() {
  const [type, setType] = useState<'aritmatika'|'geometri'>('aritmatika');
  const [a, setA] = useState(2);
  const [br, setBr] = useState(3); // b for aritmatika, r for geometri
  const [n] = useState(10); // show 10 items

  // Calculate sequence
  const sequence: number[] = [];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const val = type === 'aritmatika' ? (a + i * br) : (a * Math.pow(br, i));
    sequence.push(val);
    sum += val;
  }

  const maxVal = Math.max(...sequence);

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 overflow-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h3 className="font-bold text-slate-800">Visualisasi Barisan</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Lihat bagaimana nilai setiap suku bertambah. Aritmatika bertambah konstan, sedangkan Geometri dapat bertambah melengkung (eksponensial).
            </p>
         </div>
         <div className="inline-flex bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => { setType('aritmatika'); setA(2); setBr(3); }} 
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${type === 'aritmatika' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Aritmatika
           </button>
           <button 
             onClick={() => { setType('geometri'); setA(2); setBr(2); }} 
             className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${type === 'geometri' ? 'bg-white text-pink-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Geometri
           </button>
         </div>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8 mt-8">
        <div className="space-y-6">
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="font-bold text-slate-600 text-sm">Suku Pertama (a)</label>
                 <span className="font-mono bg-slate-100 text-slate-800 px-2 rounded text-xs font-bold">{a}</span>
               </div>
               <input 
                 type="range" min="1" max="10" step="1" 
                 value={a} onChange={(e) => setA(parseInt(e.target.value))}
                 className={`w-full ${type === 'aritmatika' ? 'accent-indigo-600' : 'accent-pink-600'}`}
               />
            </div>
            
            {type === 'aritmatika' ? (
              <div>
                 <div className="flex justify-between items-center mb-1">
                   <label className="font-bold text-slate-600 text-sm">Beda (b)</label>
                   <span className="font-mono bg-indigo-100 text-indigo-800 px-2 rounded text-xs font-bold">{br}</span>
                 </div>
                 <input 
                   type="range" min="-5" max="10" step="1" 
                   value={br} onChange={(e) => setBr(parseInt(e.target.value))}
                   className="w-full accent-indigo-600"
                 />
                 <p className="text-xs text-slate-500 mt-1">Penambahan/Pengurangan setiap suku.</p>
              </div>
            ) : (
              <div>
                 <div className="flex justify-between items-center mb-1">
                   <label className="font-bold text-slate-600 text-sm">Rasio (r)</label>
                   <span className="font-mono bg-pink-100 text-pink-800 px-2 rounded text-xs font-bold">{br}</span>
                 </div>
                 <input 
                   type="range" min="-3" max="5" step="1" 
                   value={br} onChange={(e) => setBr(parseInt(e.target.value))}
                   className="w-full accent-pink-600"
                 />
                 <p className="text-xs text-slate-500 mt-1">Pengali setiap suku.</p>
              </div>
            )}
            
            <div className={`p-4 rounded-xl border ${type === 'aritmatika' ? 'bg-indigo-50 border-indigo-200' : 'bg-pink-50 border-pink-200'}`}>
               <div className="text-sm font-bold mb-1 opacity-70">Suku Ke-10 ({`U₁₀`})</div>
               <div className={`text-2xl font-mono font-bold ${type === 'aritmatika' ? 'text-indigo-700' : 'text-pink-700'}`}>
                 {sequence[9]}
               </div>
               <div className="w-full h-px bg-current opacity-20 my-2"></div>
               <div className="text-sm font-bold mb-1 opacity-70">Jumlah 10 Suku ({`S₁₀`})</div>
               <div className={`text-2xl font-mono font-bold ${type === 'aritmatika' ? 'text-indigo-700' : 'text-pink-700'}`}>
                 {sum}
               </div>
            </div>
            
        </div>

        <div>
           {/* Visual Chart representing the sequence */}
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-4 h-[250px] flex items-end gap-2 relative">
             {/* Chart bars */}
             {sequence.map((val, idx) => {
               const heightPercent = maxVal === 0 ? 0 : Math.max(0, (Math.abs(val) / Math.abs(maxVal)) * 100);
               const isNegative = val < 0;
               return (
                 <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                   <div 
                      className={`w-full max-w-[40px] rounded-t-sm transition-all duration-300 ${type === 'aritmatika' ? 'bg-indigo-400' : 'bg-pink-400'} ${isNegative ? 'bg-opacity-40' : ''}`}
                      style={{ height: `${heightPercent}%` }}
                   ></div>
                   
                   {/* Tooltip on hover */}
                   <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-mono font-bold px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                     U{idx+1} = {val}
                   </div>
                   
                   <div className="absolute -bottom-6 text-[10px] font-bold text-slate-500">U{idx+1}</div>
                 </div>
               );
             })}
             
             {/* Zero line if there are negatives */}
             <div className="absolute left-6 right-6 border-b border-dashed border-slate-400" style={{bottom: '0'}}></div>
           </div>
           
           {/* Row of numbers */}
           <div className={`flex flex-wrap gap-2 p-4 rounded-lg border ${type === 'aritmatika' ? 'bg-indigo-50 border-indigo-100' : 'bg-pink-50 border-pink-100'}`}>
             {sequence.map((val, idx) => (
                <div key={idx} className="flex items-center text-sm">
                   <span className={`font-mono font-bold px-2 py-1 bg-white rounded shadow-sm ${type === 'aritmatika' ? 'text-indigo-700' : 'text-pink-700'}`}>{val}</span>
                   {idx < sequence.length - 1 && (
                     <span className="mx-1 text-slate-400 font-bold">,</span>
                   )}
                </div>
             ))}
             <span className="text-slate-400 tracking-widest pl-2">...</span>
           </div>
           
        </div>

      </div>

    </div>
  );
}

function SimulasiLingkaran() {
  const [r, setR] = useState(14);
  const [angle, setAngle] = useState(90);

  // SVG parameters
  const cx = 150;
  const cy = 150;
  const radiusSvg = 120; // fixed visual radius
  
  // Calculate polar to cartesian for SVG path
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  const start = polarToCartesian(cx, cy, radiusSvg, 0); // Always start at 12 o'clock
  const end = polarToCartesian(cx, cy, radiusSvg, angle);
  const largeArcFlag = angle <= 180 ? "0" : "1";
  
  // Create arc path
  const arcPath = [
    "M", start.x, start.y, 
    "A", radiusSvg, radiusSvg, 0, largeArcFlag, 1, end.x, end.y
  ].join(" ");

  // Create pie path (arc + line to center + line to start)
  const piePath = [
    "M", start.x, start.y,
    "A", radiusSvg, radiusSvg, 0, largeArcFlag, 1, end.x, end.y,
    "L", cx, cy,
    "Z"
  ].join(" ");

  const piText = r % 7 === 0 ? "22/7" : "3,14";
  const piVal = r % 7 === 0 ? 22/7 : 3.14;

  const getDecimalString = (num: number) => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  }

  const keliling = 2 * piVal * r;
  const luas = piVal * r * r;
  
  const panjangBusur = (angle / 360) * keliling;
  const luasJuring = (angle / 360) * luas;

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 grid lg:grid-cols-[300px_1fr] gap-8">
      
      {/* Visual representation */}
      <div className="flex flex-col items-center">
         <div className="bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden shadow-inner w-[300px] h-[300px] relative flex justify-center items-center">
            <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-md">
               {/* Lingkaran Luar / Dasar */}
               <circle cx={cx} cy={cy} r={radiusSvg} fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
               
               {/* Juring */}
               {angle > 0 && <path d={piePath} fill="#fce7f3" stroke="#ec4899" strokeWidth="1" opacity="0.8" />}
               
               {/* Busur Lengkung (di-highlight) */}
               {angle > 0 && <path d={arcPath} fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" />}
               
               {/* Jari-jari awal */}
               <line x1={cx} y1={cy} x2={start.x} y2={start.y} stroke="#64748b" strokeWidth="2" />
               
               {/* Titik Pusat */}
               <circle cx={cx} cy={cy} r="5" fill="#334155" />
            </svg>
            
            {/* Angle Indicator Overlay */}
            {angle > 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ marginTop: '-20px' }}>
                <span className="bg-white/80 px-2 py-0.5 rounded text-xs font-bold text-slate-800 shadow-sm border border-slate-200">{angle}°</span>
              </div>
            )}
         </div>
         <p className="text-xs text-slate-500 mt-3 text-center px-4">Area merah muda adalah Juring. Garis merah tebal adalah Busur.</p>
      </div>

      {/* Controls and Stats */}
      <div className="flex flex-col gap-6">
         <div className="space-y-4">
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="font-bold text-slate-600 text-sm">Sudut Pusat (α)</label>
                 <span className="font-mono bg-pink-100 text-pink-800 px-2 rounded text-xs font-bold">{angle}°</span>
               </div>
               <input 
                 type="range" min="0" max="360" step="5" 
                 value={angle} onChange={(e) => setAngle(parseInt(e.target.value))}
                 className="w-full accent-pink-600"
               />
               <p className="text-xs text-slate-500 mt-1">Mengatur besarnya juring yang dipotong dari lingkaran utuh.</p>
            </div>

            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="font-bold text-slate-600 text-sm">Jari-jari (r)</label>
                 <span className="font-mono bg-blue-100 text-blue-800 px-2 rounded text-xs font-bold">{r} cm</span>
               </div>
               <input 
                 type="range" min="1" max="50" step="1" 
                 value={r} onChange={(e) => setR(parseInt(e.target.value))}
                 className="w-full accent-blue-600"
               />
               <p className="text-xs text-slate-500 mt-1">Mempengaruhi keliling dan luas area secara keseluruhan. (π = {piText})</p>
            </div>
         </div>

         <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl relative overflow-hidden">
               <div className="absolute -right-4 -top-4 opacity-10">
                 <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /></svg>
               </div>
               <h4 className="font-bold text-indigo-800 text-sm mb-1 uppercase">Panjang Busur</h4>
               <div className="text-xs text-indigo-600 font-mono mb-2">({angle}/360) × Keliling</div>
               <div className="text-2xl border bg-white border-indigo-100 px-3 py-1 font-bold font-mono text-indigo-700 rounded mb-1">
                 {getDecimalString(panjangBusur)}<span className="text-sm ml-1 text-slate-500 font-sans">cm</span>
               </div>
               <div className="text-xs text-slate-500">Keliling utuh = {getDecimalString(keliling)}</div>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl relative overflow-hidden">
               <div className="absolute -right-4 -top-4 opacity-10">
                  <svg width="80" height="80" viewBox="0 0 200 200"><path d="M 100 100 L 100 10 A 90 90 0 0 1 183 66 Z" fill="currentColor"/></svg>
               </div>
               <h4 className="font-bold text-rose-800 text-sm mb-1 uppercase">Luas Juring</h4>
               <div className="text-xs text-rose-600 font-mono mb-2">({angle}/360) × Luas</div>
               <div className="text-2xl border bg-white border-rose-100 px-3 py-1 font-bold font-mono text-rose-700 rounded mb-1">
                 {getDecimalString(luasJuring)}<span className="text-sm ml-1 text-slate-500 font-sans">cm²</span>
               </div>
               <div className="text-xs text-slate-500">Luas utuh = {getDecimalString(luas)}</div>
            </div>
         </div>
         
      </div>

    </div>
  );
}

function SimulasiSPLDV() {
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(5);
  const [a2, setA2] = useState(2);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(1);

  // Determinant
  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  const hasSolution = D !== 0;
  const x = hasSolution ? Dx / D : 0;
  const y = hasSolution ? Dy / D : 0;

  // For visualization: find points for a1x + b1y = c1
  // If y = 0, x = c1/a1; If x = 0, y = c1/b1
  // We'll draw on a grid from -10 to 10
  const getLinePoints = (a: number, b: number, c: number) => {
    if (b !== 0) {
       // y = (-ax + c) / b
       const x1 = -10; const y1 = (-a * x1 + c) / b;
       const x2 = 10; const y2 = (-a * x2 + c) / b;
       return { x1, y1, x2, y2 };
    } else {
       // x = c/a (vertical line)
       const xVal = c / a;
       return { x1: xVal, y1: -10, x2: xVal, y2: 10 };
    }
  };

  const line1 = getLinePoints(a1, b1, c1);
  const line2 = getLinePoints(a2, b2, c2);

  // Scale coordinates for 300x300 SVG (center is 150,150; 1 unit = 15px)
  const scale = (val: number) => 150 + val * 15;
  const descale = (val: number) => 150 - val * 15; // inversion for y-axis in SVG

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h3 className="font-bold text-slate-800">Visualisasi SPLDV</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Ubah koefisien (a, b, c) untuk melihat bagaimana garis bergerak dan berpotongan. Titik merah adalah penyelesaiannya.
            </p>
         </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Controls */}
        <div className="space-y-8">
           <div className="grid md:grid-cols-2 gap-8">
              {/* Persamaan 1 */}
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 italic">
                 <div className="text-xs font-bold text-indigo-400 mb-4 uppercase tracking-widest">Persamaan 1</div>
                 <div className="flex items-center gap-2 mb-4 font-mono font-bold text-indigo-900 justify-center scale-110">
                   {a1}x + {b1}y = {c1}
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <label className="text-[10px] w-4 font-bold opacity-50">a₁</label>
                       <input type="range" min="-10" max="10" step="1" value={a1} onChange={(e) => setA1(parseInt(e.target.value))} className="flex-1 accent-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3">
                       <label className="text-[10px] w-4 font-bold opacity-50">b₁</label>
                       <input type="range" min="-10" max="10" step="1" value={b1} onChange={(e) => setB1(parseInt(e.target.value))} className="flex-1 accent-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3">
                       <label className="text-[10px] w-4 font-bold opacity-50">c₁</label>
                       <input type="range" min="-20" max="20" step="1" value={c1} onChange={(e) => setC1(parseInt(e.target.value))} className="flex-1 accent-indigo-600" />
                    </div>
                 </div>
              </div>

              {/* Persamaan 2 */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 italic">
                 <div className="text-xs font-bold text-amber-400 mb-4 uppercase tracking-widest">Persamaan 2</div>
                 <div className="flex items-center gap-2 mb-4 font-mono font-bold text-amber-900 justify-center scale-110">
                   {a2}x + {b2}y = {c2}
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <label className="text-[10px] w-4 font-bold opacity-50">a₂</label>
                       <input type="range" min="-10" max="10" step="1" value={a2} onChange={(e) => setA2(parseInt(e.target.value))} className="flex-1 accent-amber-600" />
                    </div>
                    <div className="flex items-center gap-3">
                       <label className="text-[10px] w-4 font-bold opacity-50">b₂</label>
                       <input type="range" min="-10" max="10" step="1" value={b2} onChange={(e) => setB2(parseInt(e.target.value))} className="flex-1 accent-amber-600" />
                    </div>
                    <div className="flex items-center gap-3">
                       <label className="text-[10px] w-4 font-bold opacity-50">c₂</label>
                       <input type="range" min="-20" max="20" step="1" value={c2} onChange={(e) => setC2(parseInt(e.target.value))} className="flex-1 accent-amber-600" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                Hasil Penyelesaian (x, y):
              </h4>
              {hasSolution ? (
                <div className="flex gap-4 items-center">
                   <div className="bg-white px-4 py-2 rounded-lg border border-slate-300 font-mono font-bold text-xl text-slate-800">
                     x = {Number.isInteger(x) ? x : x.toFixed(2)}
                   </div>
                   <div className="bg-white px-4 py-2 rounded-lg border border-slate-300 font-mono font-bold text-xl text-slate-800">
                     y = {Number.isInteger(y) ? y : y.toFixed(2)}
                   </div>
                </div>
              ) : (
                <div className="text-rose-600 font-bold text-sm bg-rose-50 p-3 rounded border border-rose-100">
                  Tidak ada penyelesaian tunggal (garis sejajar atau berhimpit).
                </div>
              )}
           </div>
        </div>

        {/* Graph */}
        <div className="flex flex-col items-center">
            <div className="w-[300px] h-[300px] bg-slate-50 border border-slate-300 rounded overflow-hidden relative shadow-inner">
               <svg width="300" height="300" viewBox="0 0 300 300">
                  {/* Grid */}
                  {[...Array(21)].map((_, i) => (
                    <React.Fragment key={i}>
                       <line x1={i * 15} y1="0" x2={i * 15} y2="300" stroke="#e2e8f0" strokeWidth="1" />
                       <line x1="0" y1={i * 15} x2="300" y2={i * 15} stroke="#e2e8f0" strokeWidth="1" />
                    </React.Fragment>
                  ))}
                  
                  {/* Axes */}
                  <line x1="150" y1="0" x2="150" y2="300" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="0" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="2" />

                  {/* Line 1 */}
                  <line 
                    x1={scale(line1.x1)} y1={descale(line1.y1)} 
                    x2={scale(line1.x2)} y2={descale(line1.y2)} 
                    stroke="#4f46e5" strokeWidth="3" 
                  />

                  {/* Line 2 */}
                  <line 
                    x1={scale(line2.x1)} y1={descale(line2.y1)} 
                    x2={scale(line2.x2)} y2={descale(line2.y2)} 
                    stroke="#d97706" strokeWidth="3" 
                  />

                  {/* Intersection Point */}
                  {hasSolution && (
                    <circle cx={scale(x)} cy={descale(y)} r="6" fill="#f43f5e" stroke="white" strokeWidth="2" />
                  )}
               </svg>
            </div>
            <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-wider">
               <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-indigo-600 rounded"></span> Pers 1</div>
               <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-amber-600 rounded"></span> Pers 2</div>
               <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-rose-500 rounded-full"></span> Titik HP</div>
            </div>
        </div>
      </div>
    </div>
  );
}

function SimulasiKesebangunan() {
  const [scale, setScale] = useState(2);
  const [w, setW] = useState(40);
  const [h, setH] = useState(30);

  const scaledW = w * scale;
  const scaledH = h * scale;

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
         <div>
            <h3 className="font-bold text-slate-800">Visualisasi Kesebangunan</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Perhatikan bagaimana perbandingan sisi tetap sama saat ukuran diperbesar. Bangun A dan Bangun B adalah <strong>Sebangun</strong>.
            </p>
         </div>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-10">
        {/* Controls */}
        <div className="space-y-6">
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Ukuran Asal (Bangun A)</label>
              <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-[10px] font-bold mb-1">
                     <span>LEBAR (p₁)</span>
                     <span className="text-indigo-600">{w} px</span>
                   </div>
                   <input type="range" min="10" max="60" value={w} onChange={(e) => setW(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                 </div>
                 <div>
                   <div className="flex justify-between text-[10px] font-bold mb-1">
                     <span>TINGGI (l₁)</span>
                     <span className="text-indigo-600">{h} px</span>
                   </div>
                   <input type="range" min="10" max="60" value={h} onChange={(e) => setH(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                 </div>
              </div>
           </div>

           <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <label className="block text-xs font-bold text-emerald-600 uppercase mb-3">Faktor Skala (k)</label>
              <div className="flex justify-between text-lg font-mono font-bold text-emerald-800 mb-1">
                 <span>Skala 1 : {scale}</span>
              </div>
              <input type="range" min="1" max="4" step="0.5" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
              <p className="text-[10px] text-emerald-700 mt-2 italic">Setiap sisi Bangun B adalah {scale} kali lipat Bangun A.</p>
           </div>

           <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Perbandingan Sisi</div>
              <div className="flex items-center justify-between font-mono text-sm">
                 <span className="text-slate-600">p₂ / p₁</span>
                 <span className="font-bold text-indigo-600">{scaledW} / {w} = {scale}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                 <span className="text-slate-600">l₂ / l₁</span>
                 <span className="font-bold text-indigo-600">{scaledH} / {h} = {scale}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-sm">
                 <span className="text-slate-600">L₂ / L₁</span>
                 <span className="font-bold text-rose-600">{(scaledW*scaledH)} / {(w*h)} = {scale * scale}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">*Perbandingan Luas adalah kuadrat dari faktor skala (k²).</p>
           </div>
        </div>

        {/* Drawing Area */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center min-h-[400px] p-8 gap-12 flex-wrap">
           {/* Bangun A */}
           <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                 <div 
                   style={{ width: `${w*2}px`, height: `${h*2}px` }} 
                   className="bg-indigo-400/20 border-2 border-indigo-600 rounded shadow-sm flex items-center justify-center transition-all duration-300"
                 >
                    <span className="text-[10px] font-bold text-indigo-800">A</span>
                 </div>
                 {/* Dimension helpers */}
                 <div className="absolute -top-5 left-0 right-0 text-center text-[10px] font-bold text-slate-400">{w}</div>
                 <div className="absolute -left-5 top-0 bottom-0 flex items-center text-[10px] font-bold text-slate-400">{h}</div>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Asli</span>
           </div>

           <div className="text-3xl font-bold text-slate-300">→</div>

           {/* Bangun B */}
           <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                 <div 
                   style={{ width: `${scaledW*2}px`, height: `${scaledH*2}px` }} 
                   className="bg-emerald-400/20 border-2 border-emerald-600 rounded bg-grid font-bold text-emerald-800 shadow-md flex items-center justify-center transition-all duration-300"
                 >
                    <span className="text-sm font-bold text-emerald-900">B</span>
                 </div>
                 {/* Dimension helpers */}
                 <div className="absolute -top-6 left-0 right-0 text-center text-xs font-bold text-emerald-600">{scaledW}</div>
                 <div className="absolute -left-10 top-0 bottom-0 flex items-center text-xs font-bold text-emerald-600">{scaledH}</div>
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Diperbesar (×{scale})</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function SimulasiBRSL() {
  const [r, setR] = useState(10);
  const [h, setH] = useState(20);

  const pi = 3.14159;
  const vTabung = pi * r * r * h;
  const vKerucut = (1 / 3) * pi * r * r * h;
  const vBola = (4 / 3) * pi * Math.pow(r, 3);

  const format = (n: number) => Math.round(n).toLocaleString('id-ID');

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
         <div className="flex-1">
            <h3 className="font-bold text-slate-800">Eksperimen Volume BRSL</h3>
            <p className="text-sm text-slate-600 mt-1">
              Bandingkan kapasitas isi (Volume) antara tiga bangun ruang dengan jari-jari yang sama.
            </p>
         </div>
         <button 
           onClick={() => setH(2 * r)}
           className="shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-sm"
         >
           Kondisi Ideal (t = 2r)
         </button>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-10">
        <div className="space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">
           <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase">Jari-jari Alas (r)</div>
              <div className="flex items-center gap-4">
                 <input type="range" min="5" max="30" value={r} onChange={(e) => setR(parseInt(e.target.value))} className="flex-1 accent-indigo-600" />
                 <span className="font-mono font-bold text-indigo-700 w-12 text-right">{r}</span>
              </div>
           </div>

           <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2 uppercase">Tinggi Bangun (t)</div>
              <div className="flex items-center gap-4">
                 <input type="range" min="10" max="60" value={h} onChange={(e) => setH(parseInt(e.target.value))} className="flex-1 accent-indigo-600" />
                 <span className="font-mono font-bold text-indigo-700 w-12 text-right">{h}</span>
              </div>
           </div>

           <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                 <div className="text-[10px] uppercase font-bold text-sky-500 mb-1">Tabung</div>
                 <div className="text-lg font-mono font-bold text-slate-800">{format(vTabung)} <span className="text-[10px] opacity-40">cm³</span></div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                 <div className="text-[10px] uppercase font-bold text-rose-500 mb-1">Kerucut (1/3 Tabung)</div>
                 <div className="text-lg font-mono font-bold text-slate-800">{format(vKerucut)} <span className="text-[10px] opacity-40">cm³</span></div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                 <div className="text-[10px] uppercase font-bold text-violet-500 mb-1">Bola (4/3 πr³)</div>
                 <div className="text-lg font-mono font-bold text-slate-800">{format(vBola)} <span className="text-[10px] opacity-40">cm³</span></div>
              </div>
           </div>
        </div>

        <div className="bg-slate-100 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-around gap-12 min-h-[400px] shadow-inner border-2 border-slate-200 border-dashed">
           <div className="flex flex-col items-center group">
              <div className="relative" style={{ height: `${h * 4}px` }}>
                 <svg width="100" height={h * 4 + 40} viewBox={`0 0 100 ${h * 4 + 40}`}>
                    <ellipse cx="50" cy="20" rx={r * 1.5} ry={r * 0.4} fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                    <rect x={50 - r * 1.5} y="20" width={r * 3} height={h * 4} fill="#bae6fd" opacity="0.6" stroke="#0284c7" strokeWidth="0" />
                    <ellipse cx="50" cy={20 + h * 4} rx={r * 1.5} ry={r * 0.4} fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                    <line x1={50 - r * 1.5} y1="20" x2={50 - r * 1.5} y2={20 + h * 4} stroke="#0284c7" strokeWidth="2" />
                    <line x1={50 + r * 1.5} y1="20" x2={50 + r * 1.5} y2={20 + h * 4} stroke="#0284c7" strokeWidth="2" />
                 </svg>
              </div>
              <span className="mt-4 text-xs font-black text-sky-800 uppercase tracking-widest">Tabung</span>
           </div>

           <div className="flex flex-col items-center group">
              <div className="relative" style={{ height: `${h * 4}px` }}>
                 <svg width="100" height={h * 4 + 40} viewBox={`0 0 100 ${h * 4 + 40}`}>
                    <path d={`M50,20 L${50 - r * 1.5},${20 + h * 4} A${r * 1.5},${r * 0.4} 0 0,0 ${50 + r * 1.5},${20 + h * 4} Z`} fill="#fff1f2" stroke="#e11d48" strokeWidth="2" />
                    <ellipse cx="50" cy={20 + h * 4} rx={r * 1.5} ry={r * 0.4} fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="4" />
                 </svg>
              </div>
              <span className="mt-4 text-xs font-black text-rose-800 uppercase tracking-widest">Kerucut</span>
           </div>

           <div className="flex flex-col items-center group">
              <div className="relative" style={{ height: `${h * 4}px`, display: 'flex', alignItems: 'center' }}>
                 <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={r * 1.5} fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" />
                    <ellipse cx="50" cy="50" rx={r * 1.5} ry={r * 0.4} fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
                 </svg>
              </div>
              <span className="mt-4 text-xs font-black text-violet-800 uppercase tracking-widest">Bola</span>
           </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
         <h4 className="text-xs font-bold text-amber-800 mb-1 uppercase tracking-wide">Analisis Perbandingan:</h4>
         <p className="text-[11px] text-amber-700 leading-relaxed italic">
           Coba klik tombol <strong>"Kondisi Ideal"</strong>. Pada saat tinggi tabung sama dengan diameter bola (t = 2r), perbandingan volumenya adalah <strong>Kerucut (1) : Bola (2) : Tabung (3)</strong>. Ini berarti volume bola adalah dua kali volume kerucut, dan volume tabung adalah tiga kali volume kerucut!
         </p>
      </div>
    </div>
  );
}

function SimulasiTransformasi() {
  const [point, setPoint] = useState({ x: 2, y: 2 });
  const [tX, setTX] = useState(1);
  const [tY, setTY] = useState(1);
  const [refKey, setRefKey] = useState('sumbu-x');
  const [rotAngle, setRotAngle] = useState(90);
  const [dilScale, setDilScale] = useState(2);

  const calculateRef = () => {
    if (refKey === 'sumbu-x') return { x: point.x, y: -point.y };
    if (refKey === 'sumbu-y') return { x: -point.x, y: point.y };
    if (refKey === 'y=x') return { x: point.y, y: point.x };
    return { x: -point.y, y: -point.x }; // y = -x
  };

  const calculateRot = () => {
    const rad = (rotAngle * Math.PI) / 180;
    const nx = point.x * Math.cos(rad) - point.y * Math.sin(rad);
    const ny = point.x * Math.sin(rad) + point.y * Math.cos(rad);
    return { x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 };
  };

  const transResult = { x: point.x + tX, y: point.y + tY };
  const refResult = calculateRef();
  const rotResult = calculateRot();
  const dilResult = { x: point.x * dilScale, y: point.y * dilScale };

  // Grid coordinates to SVG pixels
  const toPX = (val: number, isX: boolean) => 150 + val * 25 * (isX ? 1 : -1);

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 overflow-hidden">
      <div className="mb-6">
         <h3 className="font-bold text-slate-800">Lab Transformasi Geometri</h3>
         <p className="text-sm text-slate-600">Simulasikan perubahan posisi titik (x,y) pada koordinat Cartesius.</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        <div className="space-y-4">
           {/* Point Selection */}
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Titik Asal A(x,y)</label>
              <div className="grid grid-cols-2 gap-3">
                 <div>
                   <input type="number" value={point.x} onChange={e => setPoint({...point, x: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded-lg text-sm" placeholder="x" />
                 </div>
                 <div>
                   <input type="number" value={point.y} onChange={e => setPoint({...point, y: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded-lg text-sm" placeholder="y" />
                 </div>
              </div>
           </div>

           {/* Tabs for Types */}
           <div className="space-y-3">
              {/* Translasi */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                 <h4 className="text-xs font-bold text-indigo-800 mb-3 flex items-center justify-between">
                   TRANSLASI <span>T({tX}, {tY})</span>
                 </h4>
                 <div className="flex gap-2">
                    <input type="range" min="-5" max="5" value={tX} onChange={e => setTX(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                    <input type="range" min="-5" max="5" value={tY} onChange={e => setTY(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                 </div>
              </div>

              {/* Refleksi */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                 <h4 className="text-xs font-bold text-rose-800 mb-3">REFLEKSI</h4>
                 <select value={refKey} onChange={e => setRefKey(e.target.value)} className="w-full p-2 border rounded text-xs bg-white">
                    <option value="sumbu-x">Sumbu X</option>
                    <option value="sumbu-y">Sumbu Y</option>
                    <option value="y=x">Garis y = x</option>
                    <option value="y=-x">Garis y = -x</option>
                 </select>
              </div>

              {/* Rotasi */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                 <h4 className="text-xs font-bold text-amber-800 mb-3">ROTASI (0,0)</h4>
                 <div className="flex gap-1 overflow-x-auto pb-1">
                    {[90, 180, 270, -90].map(ang => (
                      <button 
                        key={ang} 
                        onClick={() => setRotAngle(ang)}
                        className={`px-3 py-1 rounded text-[10px] font-bold ${rotAngle === ang ? 'bg-amber-600 text-white' : 'bg-white border'}`}
                      >
                        {ang}°
                      </button>
                    ))}
                 </div>
              </div>

              {/* Dilatasi */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                 <h4 className="text-xs font-bold text-emerald-800 mb-3">DILATASI [O, k]</h4>
                 <div className="flex items-center gap-3">
                    <input type="range" min="0.5" max="3" step="0.5" value={dilScale} onChange={e => setDilScale(parseFloat(e.target.value))} className="flex-1 accent-emerald-600" />
                    <span className="text-xs font-mono font-bold">k={dilScale}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Visual Area */}
        <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center min-h-[450px] relative overflow-hidden">
           <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
              {/* Grid Lines */}
              {Array.from({length: 13}).map((_, i) => (
                <g key={i}>
                  <line x1={i * 25} y1="0" x2={i * 25} y2="300" stroke="#1e293b" strokeWidth="0.5" />
                  <line x1="0" y1={i * 25} x2="300" y2={i * 25} stroke="#1e293b" strokeWidth="0.5" />
                </g>
              ))}
              {/* Axis */}
              <line x1="150" y1="0" x2="150" y2="300" stroke="#475569" strokeWidth="2" />
              <line x1="0" y1="150" x2="300" y2="150" stroke="#475569" strokeWidth="2" />

              {/* Reflection Line */}
              {refKey === 'y=x' && <line x1="0" y1="300" x2="300" y2="0" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4" opacity="0.5" />}
              {refKey === 'y=-x' && <line x1="0" y1="0" x2="300" y2="300" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4" opacity="0.5" />}

              {/* Points */}
              {/* Origin Point A */}
              <circle cx={toPX(point.x, true)} cy={toPX(point.y, false)} r="5" fill="#fff" />
              <text x={toPX(point.x, true)+8} y={toPX(point.y, false)-8} fill="#fff" fontSize="10" fontWeight="bold">A({point.x},{point.y})</text>

              {/* Result Point A' */}
              <circle cx={toPX(transResult.x, true)} cy={toPX(transResult.y, false)} r="5" fill="#6366f1" opacity="0.3" />
              <circle cx={toPX(refResult.x, true)} cy={toPX(refResult.y, false)} r="5" fill="#f43f5e" opacity="0.3" />
              <circle cx={toPX(rotResult.x, true)} cy={toPX(rotResult.y, false)} r="5" fill="#fbbf24" opacity="0.3" />
              <circle cx={toPX(dilResult.x, true)} cy={toPX(dilResult.y, false)} r="5" fill="#10b981" opacity="0.3" />

              {/* Result Labels with specific colors */}
              <text x={toPX(transResult.x, true)+8} y={toPX(transResult.y, false)+15} fill="#818cf8" fontSize="8">Translasi: ({transResult.x},{transResult.y})</text>
              <text x={toPX(refResult.x, true)+8} y={toPX(refResult.y, false)+15} fill="#fb7185" fontSize="8">Refleksi: ({refResult.x},{refResult.y})</text>
           </svg>

           {/* Results Legend */}
           <div className="absolute top-4 right-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700 backdrop-blur-sm text-[10px] space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span>Translasi: ({transResult.x}, {transResult.y})</span>
              </div>
              <div className="flex items-center gap-2 text-rose-400">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span>Refleksi: ({refResult.x}, {refResult.y})</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>Rotasi: ({rotResult.x}, {rotResult.y})</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Dilatasi: ({dilResult.x}, {dilResult.y})</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function SimulasiPeluang() {
  const [history, setHistory] = useState<number[]>([]);
  const [totalRolls, setTotalRolls] = useState(0);
  const [counts, setCounts] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });

  const rollDice = () => {
    const res = Math.floor(Math.random() * 6) + 1;
    setTotalRolls(prev => prev + 1);
    setHistory(prev => [res, ...prev].slice(0, 5));
    setCounts(prev => ({ ...prev, [res]: prev[res] + 1 }));
  };

  const reset = () => {
    setHistory([]);
    setTotalRolls(0);
    setCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 overflow-hidden">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h3 className="font-bold text-slate-800">Eksperimen Peluang (Dadu)</h3>
            <p className="text-sm text-slate-600">Lakukan percobaan pelemparan dadu berulang kali untuk melihat peluang empiris.</p>
         </div>
         <div className="flex gap-2">
            <button onClick={rollDice} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
               <Dice6 size={18} /> Lempar Dadu
            </button>
            <button onClick={reset} className="px-4 py-2 border border-slate-200 rounded-xl text-xs hover:bg-slate-50">Reset</button>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
               <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Statistik Percobaan</h4>
               <div className="grid grid-cols-3 gap-3">
                  {[1,2,3,4,5,6].map(num => (
                    <div key={num} className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                       <span className="text-lg font-bold text-slate-800">{num}</span>
                       <span className="text-[10px] text-indigo-600 font-bold">{counts[num]} kali</span>
                       <span className="text-[9px] text-slate-400">({totalRolls > 0 ? (counts[num]/totalRolls * 100).toFixed(1) : 0}%)</span>
                    </div>
                  ))}
               </div>
               <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between text-xs">
                  <span className="text-slate-500 font-bold">Total Lemparan:</span>
                  <span className="font-mono font-black text-indigo-600">{totalRolls}</span>
               </div>
            </div>

            <div className="flex gap-4 items-center">
               <div className="text-xs font-bold text-slate-500">Riwayat Terakhir:</div>
               <div className="flex gap-2">
                  {history.map((h, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 animate-in fade-in zoom-in">
                       {h}
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-indigo-900 rounded-3xl p-8 relative flex items-center justify-center overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)]"></div>
            {history.length > 0 ? (
               <motion.div 
                 key={totalRolls}
                 initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                 animate={{ rotate: 0, scale: 1, opacity: 1 }}
                 className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center p-6"
               >
                  {history[0] === 1 && <div className="w-4 h-4 bg-slate-800 rounded-full" />}
                  {history[0] === 2 && <div className="w-full flex justify-between px-4"><div className="w-4 h-4 bg-slate-800 rounded-full"/><div className="w-4 h-4 bg-slate-800 rounded-full"/></div>}
                  {history[0] === 3 && <div className="space-y-2"><div className="w-4 h-4 bg-slate-800 rounded-full"/><div className="w-4 h-4 bg-slate-800 rounded-full"/><div className="w-4 h-4 bg-slate-800 rounded-full"/></div>}
                  {history[0] >= 4 && (
                    <div className="grid grid-cols-2 gap-4">
                       <div className="w-4 h-4 bg-slate-800 rounded-full"/>
                       <div className="w-4 h-4 bg-slate-800 rounded-full"/>
                       <div className="w-4 h-4 bg-slate-800 rounded-full"/>
                       <div className="w-4 h-4 bg-slate-800 rounded-full"/>
                       {history[0] >= 5 && <div className="col-span-2 flex justify-center"><div className="w-4 h-4 bg-slate-800 rounded-full"/></div>}
                       {history[0] === 6 && <div className="w-4 h-4 bg-slate-800 rounded-full"/>}
                    </div>
                  )}
               </motion.div>
            ) : (
               <div className="text-white/40 text-center">
                  <Dice6 size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Klik tombol "Lempar Dadu" untuk memulai eksperimen</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

function SimulasiUmum() {
  return (
    <div className="bg-white rounded-xl p-8 border border-slate-200 text-center shadow-sm mt-6">
       <div className="text-slate-400 mb-3 flex justify-center">
         <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
       </div>
       <h3 className="text-lg font-bold text-slate-800 mb-1">Simulasi Sedang Disiapkan</h3>
       <p className="text-slate-500 text-sm">Fitur simulasi interaktif untuk topik ini akan segera hadir pada pembaruan selanjutnya.</p>
    </div>
  );
}

function SimulasiStatistika() {
  const [data, setData] = useState([60, 75, 80, 80, 90]);
  
  const addValue = () => setData([...data, Math.floor(Math.random() * 41) + 60].sort());
  const reset = () => setData([60, 75, 80, 80, 90]);

  const sum = data.reduce((a,b) => a+b, 0);
  const mean = (sum / data.length).toFixed(1);
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      <div className="flex gap-4 mb-4">
        <button onClick={addValue} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold shadow-sm">Tambah Data Acak</button>
        <button onClick={reset} className="px-4 py-2 bg-slate-200 text-slate-700 rounded text-sm font-bold">Reset</button>
      </div>
      <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg mb-6">
         <h4 className="font-bold text-sm text-slate-500 mb-2">Nilai Data:</h4>
         <div className="text-lg font-mono text-slate-800">{data.join(', ')}</div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
         <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-xs uppercase font-bold text-slate-500">Rata-rata (Mean)</h4>
            <div className="text-3xl font-mono text-fuchsia-600 mt-2">{mean}</div>
         </div>
         <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <h4 className="text-xs uppercase font-bold text-slate-500">Banyak Data (n)</h4>
            <div className="text-3xl font-mono text-emerald-600 mt-2">{data.length}</div>
         </div>
      </div>
    </div>
  );
}

function SimulasiHimpunan() {
  const [op, setOp] = useState<'A' | 'B' | 'irisan' | 'gabungan' | 'selisihAB' | 'selisihBA'>('irisan');
  
  // Definition of the regions styles
  let aColor = 'bg-blue-200/40 text-transparent'; // Top-left semi-circle
  let bColor = 'bg-rose-200/40 text-transparent'; // Top-right semi-circle
  let intColor = 'bg-purple-300/40 text-transparent'; // Intersection

  if (op === 'A') {
    aColor = 'bg-blue-500/80 text-white';
    intColor = 'bg-blue-500/80 text-white';
  } else if (op === 'B') {
    bColor = 'bg-rose-500/80 text-white';
    intColor = 'bg-rose-500/80 text-white';
  } else if (op === 'irisan') {
    intColor = 'bg-purple-600/80 text-white';
  } else if (op === 'gabungan') {
    aColor = 'bg-emerald-500/80 text-white';
    bColor = 'bg-emerald-500/80 text-white';
    intColor = 'bg-emerald-500/80 text-white';
  } else if (op === 'selisihAB') {
    aColor = 'bg-amber-500/80 text-white';
  } else if (op === 'selisihBA') {
    bColor = 'bg-cyan-500/80 text-white';
  }

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 grid md:grid-cols-[250px_1fr] gap-8 items-start">
      
      <div className="space-y-4">
         <h3 className="font-bold text-slate-800 border-b pb-2">Pilih Operasi</h3>
         <div className="flex flex-col gap-2">
           <button onClick={() => setOp('A')} className={`text-left px-4 py-2 text-sm font-bold rounded-lg transition-all ${op === 'A' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Himpunan A</button>
           <button onClick={() => setOp('B')} className={`text-left px-4 py-2 text-sm font-bold rounded-lg transition-all ${op === 'B' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Himpunan B</button>
           <button onClick={() => setOp('irisan')} className={`text-left px-4 py-2 text-sm font-bold rounded-lg transition-all ${op === 'irisan' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>A ∩ B (Irisan)</button>
           <button onClick={() => setOp('gabungan')} className={`text-left px-4 py-2 text-sm font-bold rounded-lg transition-all ${op === 'gabungan' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>A ∪ B (Gabungan)</button>
           <button onClick={() => setOp('selisihAB')} className={`text-left px-4 py-2 text-sm font-bold rounded-lg transition-all ${op === 'selisihAB' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>A - B (Selisih A)</button>
           <button onClick={() => setOp('selisihBA')} className={`text-left px-4 py-2 text-sm font-bold rounded-lg transition-all ${op === 'selisihBA' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>B - A (Selisih B)</button>
         </div>
      </div>

      <div className="flex flex-col items-center">
         
         <div className="relative w-[300px] sm:w-[400px] h-[250px] sm:h-[300px] bg-slate-50 border-2 border-slate-300 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
            <div className="absolute top-2 left-3 font-bold text-slate-400 font-mono text-xl">S</div>
            
            {/* Himpunan A Shape */}
            <div className={`absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full border border-slate-400 mix-blend-multiply transition-colors duration-500 ease-in-out ${op === 'A' || op === 'gabungan' ? 'border-2 font-bold' : ''} ${aColor} flex items-center justify-start pl-8`} style={{ clipPath: 'circle(50% at 50% 50%)' }}>
               <span className={`text-2xl ${op === 'A' || op === 'gabungan' || op==='selisihAB' ? 'text-white font-bold' : 'text-slate-400'}`}>A</span>
            </div>
            
            {/* Himpunan B Shape */}
            <div className={`absolute top-1/2 right-[35%] translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full border border-slate-400 mix-blend-multiply transition-colors duration-500 ease-in-out ${op === 'B' || op === 'gabungan' ? 'border-2 font-bold' : ''} ${bColor} flex items-center justify-end pr-8`} style={{ clipPath: 'circle(50% at 50% 50%)' }}>
               <span className={`text-2xl ${op === 'B' || op === 'gabungan' || op==='selisihBA' ? 'text-white font-bold' : 'text-slate-400'}`}>B</span>
            </div>

            {/* Overlap Shape */}
            <div className={`absolute top-1/2 left-1/2 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] -translate-x-[85%] -translate-y-1/2 rounded-full overflow-hidden pointer-events-none`}>
              <div className={`absolute inset-0 translate-x-[70%] rounded-full ${intColor} mix-blend-normal transition-colors duration-500 ease-in-out border-slate-400`}></div>
            </div>

         </div>

         <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center max-w-sm w-full">
            <h4 className="font-bold text-slate-800 mb-2">Penjelasan:</h4>
            <p className="text-sm text-slate-600 min-h-[60px]">
              {op === 'A' && "Menyorot seluruh anggota Himpunan A."}
              {op === 'B' && "Menyorot seluruh anggota Himpunan B."}
              {op === 'irisan' && "A ∩ B (Irisan) menyoroti area di mana lingkaran A dan B bertumpang tindih. Ini mewakili anggota yang ada di A dan juga ada di B."}
              {op === 'gabungan' && "A ∪ B (Gabungan) menyoroti seluruh area A dan area B. Ini mewakili semua anggota yang ada di setidaknya satu dari kedua himpunan."}
              {op === 'selisihAB' && "A - B menyoroti anggota himpunan A yang TIDAK tumpang tindih dengan B."}
              {op === 'selisihBA' && "B - A menyoroti anggota himpunan B yang TIDAK tumpang tindih dengan A."}
            </p>
         </div>

      </div>

    </div>
  );
}

function SimulasiRelasiFungsi() {
  // Hubungan pasangan (domain -> kodomain)
  // domain: 1, 2, 3
  // kodomain: A, B, C
  const [links, setLinks] = useState<{from: number, to: string}[]>([]);
  
  const domain = [1, 2, 3];
  const kodomain = ['A', 'B', 'C'];
  
  const [activeDomain, setActiveDomain] = useState<number | null>(null);

  const handleDomainClick = (d: number) => {
    if (activeDomain === d) {
      setActiveDomain(null); // toggle off
    } else {
      setActiveDomain(d); // ready to map
    }
  };

  const handleKodomainClick = (k: string) => {
    if (activeDomain !== null) {
      // Toggle the link
      const exists = links.some(l => l.from === activeDomain && l.to === k);
      if (exists) {
        setLinks(links.filter(l => !(l.from === activeDomain && l.to === k)));
      } else {
        setLinks([...links, { from: activeDomain, to: k }]);
      }
      setActiveDomain(null);
    }
  };

  const clearLinks = () => {
    setLinks([]);
    setActiveDomain(null);
  };

  // Cek apakah Fungsi
  // Syarat: Tiap domain punya TEPAT 1 pasangan
  let isFungsi = false;
  let isRelasi = false;
  let reason = "Belum ada hubungan. Coba hubungkan anggota Domain ke Kodomain.";

  if (links.length > 0) {
    isRelasi = true;
    
    const domainCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    links.forEach(l => {
      domainCounts[l.from] = (domainCounts[l.from] || 0) + 1;
    });

    const isSemuaDomainPunyaPasangan = Object.values(domainCounts).every(count => count > 0);
    const hasSelingkuh = Object.values(domainCounts).some(count => count > 1);

    if (isSemuaDomainPunyaPasangan && !hasSelingkuh) {
      isFungsi = true;
      reason = "Ini adalah FUNGSI. Setiap anggota Domain dipasangkan dengan tepat satu anggota Kodomain.";
    } else if (hasSelingkuh) {
      isFungsi = false;
      const selingkuhKeys = Object.keys(domainCounts).filter(k => domainCounts[parseInt(k)] > 1).join(', ');
      reason = `Ini BUKAN fungsi. Anggota Domain (${selingkuhKeys}) memiliki lebih dari satu pasangan.`;
    } else if (!isSemuaDomainPunyaPasangan) {
      isFungsi = false;
      const jombloKeys = Object.keys(domainCounts).filter(k => domainCounts[parseInt(k)] === 0).join(', ');
      reason = `Ini BUKAN fungsi. Ada anggota Domain yang tidak memiliki pasangan: (${jombloKeys}).`;
    }
  }

  // Draw lines
  // we just use a simple SVG overlay
  const renderLines = () => {
    return links.map((link, idx) => {
      // Very simple hardcoded relative positions approximation
      // Domain items are left side, Kodomain items are right side
      // 3 items each -> at 1/6, 3/6, 5/6 heights approx
      const startX = '20%';
      const endX = '80%';
      const startY = link.from === 1 ? '16.6%' : link.from === 2 ? '50%' : '83.3%';
      const endY = link.to === 'A' ? '16.6%' : link.to === 'B' ? '50%' : '83.3%';
      
      return (
        <line 
          key={idx}
          x1={startX} y1={startY} x2={endX} y2={endY} 
          stroke={isFungsi ? "#10b981" : "#f43f5e"} // emerald vs rose
          strokeWidth="3" 
          markerEnd="url(#arrow)"
          opacity="0.8"
        />
      );
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6 max-w-full overflow-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h3 className="font-bold text-slate-800">Buat Relasi/Fungsi Sendiri</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              1. Klik anggota <strong>Domain</strong> di kiri.<br/>
              2. Klik anggota <strong>Kodomain</strong> di kanan untuk menghubungkan.<br/>
              Mari lihat apakah hubungan yang kamu buat termasuk fungsi!
            </p>
         </div>
         <button onClick={clearLinks} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg border border-slate-300">
           Reset Diagram
         </button>
      </div>

      <div className="relative bg-slate-50 border-2 border-slate-200 rounded-xl max-w-2xl mx-auto py-8">
         <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 w-full px-4 sm:px-12 relative z-10">
            
            {/* Domain */}
            <div className="flex flex-col items-center gap-6">
              <h4 className="font-bold text-slate-700 pb-2 border-b-2 border-indigo-200 w-full text-center">Domain</h4>
              <div className="bg-indigo-50 border-2 border-indigo-200 w-full py-6 rounded-full flex flex-col items-center gap-8 relative overflow-hidden h-[300px] justify-around">
                {domain.map(d => (
                  <button 
                    key={d}
                    onClick={() => handleDomainClick(d)}
                    className={`w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center transition-all z-10 shadow-sm ${activeDomain === d ? 'bg-indigo-500 text-white ring-4 ring-indigo-300 scale-110' : 'bg-white text-indigo-700 border-2 border-indigo-300 hover:bg-indigo-100'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center pointer-events-none">
                <span className="text-sm font-bold text-slate-400 bg-white px-2 py-1 rounded border shadow-sm">Pilih & Hubungkan</span>
            </div>

            {/* Kodomain */}
            <div className="flex flex-col items-center gap-6">
              <h4 className="font-bold text-slate-700 pb-2 border-b-2 border-amber-200 w-full text-center">Kodomain</h4>
              <div className="bg-amber-50 border-2 border-amber-200 w-full py-6 rounded-full flex flex-col items-center gap-8 relative overflow-hidden h-[300px] justify-around">
                {kodomain.map(k => (
                  <button 
                    key={k}
                    onClick={() => handleKodomainClick(k)}
                    className={`w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center transition-all z-10 shadow-sm ${activeDomain !== null ? 'hover:bg-amber-100 bg-white border-2 border-amber-400 text-amber-700 cursor-pointer animate-pulse' : 'bg-white text-amber-700 border-2 border-amber-300'}`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

         </div>

         {/* SVG Overlay for Connections */}
         <svg className="absolute inset-0 w-full h-[400px] pointer-events-none z-0 mt-16 sm:px-12" preserveAspectRatio="none">
           <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={isFungsi ? "#10b981" : "#f43f5e"} />
              </marker>
           </defs>
           {renderLines()}
         </svg>
      </div>

      <div className="mt-8">
        {!isRelasi ? (
           <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-center text-slate-500">
             Belum ada hubungan yang dibuat.
           </div>
        ) : (
           <div className={`p-5 rounded-xl border-2 flex items-start gap-4 ${isFungsi ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="text-3xl shrink-0 mt-1">{isFungsi ? '✅' : '❌'}</div>
              <div>
                 <h4 className={`font-bold text-lg ${isFungsi ? 'text-emerald-800' : 'text-rose-800'}`}>
                   {isFungsi ? 'Ini adalah Fungsi!' : 'Ini Bukan Fungsi (Hanya Relasi)'}
                 </h4>
                 <p className={`mt-1 text-sm ${isFungsi ? 'text-emerald-700' : 'text-rose-700'}`}>
                   {reason}
                 </p>
                 {isFungsi && (
                   <div className="mt-3 bg-white bg-opacity-60 p-3 rounded text-xs text-emerald-800 font-mono">
                     Terdapat {links.length} pasangan himpunan. <br/>
                     Domain: {'{1, 2, 3}'}<br/>
                     Range: {'{'}
                     {Array.from(new Set(links.map(l => l.to))).sort().join(', ')}
                     {'}'}
                     <br/>
                     {Array.from(new Set(links.map(l => l.to))).length < 3 && <span className="text-rose-600 mt-1 font-bold inline-block">Meskipun Range-nya lebih kecil dari Kodomain, tidak apa-apa selama semua syarat domain terpenuhi.</span>}
                   </div>
                 )}
              </div>
           </div>
        )}
      </div>

    </div>
  );
}

function SimulasiAljabar() {
  // We'll create a "Mesin Fungsi Aljabar" / Substitution Machine
  const [x, setX] = useState<number>(3);
  const [y, setY] = useState<number>(2);

  const [expression, setExpression] = useState('2x + 3y');

  const calculateResult = () => {
    switch (expression) {
      case '2x + 3y': return (2 * x) + (3 * y);
      case 'x² - 5y': return (x * x) - (5 * y);
      case '2(x + y)': return 2 * (x + y);
      case '4x - y²': return (4 * x) - (y * y);
      default: return 0;
    }
  };

  const getStepText = () => {
    switch (expression) {
      case '2x + 3y': return `2(${x}) + 3(${y}) = ${2 * x} + ${3 * y} = ${(2 * x) + (3 * y)}`;
      case 'x² - 5y': return `(${x})² - 5(${y}) = ${x * x} - ${5 * y} = ${(x * x) - (5 * y)}`;
      case '2(x + y)': return `2(${x} + ${y}) = 2(${x + y}) = ${2 * (x + y)}`;
      case '4x - y²': return `4(${x}) - (${y})² = ${4 * x} - ${y * y} = ${(4 * x) - (y * y)}`;
      default: return '';
    }
  };

  const expressionsList = [
    '2x + 3y',
    'x² - 5y',
    '2(x + y)',
    '4x - y²'
  ];

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Inputs Section */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">1. Tentukan Nilai Variabel</h3>
             
             <div className="space-y-4">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-xl font-mono shadow-sm border border-indigo-200">x</div>
                 <div className="flex-1">
                   <input 
                      type="range" min="-10" max="10" 
                      value={x} onChange={(e) => setX(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                   />
                 </div>
                 <div className="w-12 text-center font-bold font-mono text-xl text-slate-700">{x}</div>
               </div>

               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center font-bold text-xl font-mono shadow-sm border border-rose-200">y</div>
                 <div className="flex-1">
                   <input 
                      type="range" min="-10" max="10" 
                      value={y} onChange={(e) => setY(Number(e.target.value))}
                      className="w-full accent-rose-600"
                   />
                 </div>
                 <div className="w-12 text-center font-bold font-mono text-xl text-slate-700">{y}</div>
               </div>
             </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">2. Pilih Bentuk Aljabar</h3>
             <div className="grid grid-cols-2 gap-3">
               {expressionsList.map(expr => (
                 <button
                   key={expr}
                   onClick={() => setExpression(expr)}
                   className={`px-4 py-3 rounded-lg font-mono font-bold text-sm transition-all border ${
                     expression === expr 
                       ? 'bg-indigo-600 text-white border-indigo-700 shadow-md transform scale-[1.02]' 
                       : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'
                   }`}
                 >
                   {expr}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Machine Section */}
        <div className="md:col-span-7">
           <div className="bg-slate-800 rounded-3xl p-8 border-[6px] border-slate-700 shadow-2xl relative overflow-hidden flex flex-col items-center">
               <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
               <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
               
               <h2 className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Aljabar Processing Unit v1.0</h2>

               {/* Machine Input screen */}
               <div className="bg-[#1e293b] p-6 rounded-2xl border-4 border-slate-900 shadow-inner w-full text-center space-y-4">
                  <p className="text-indigo-400 text-xs font-mono uppercase tracking-widest">Input Persamaan:</p>
                  <div className="text-4xl md:text-5xl font-mono text-emerald-400 font-bold tracking-wider drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                      {expression}
                  </div>
               </div>

               {/* Processing Arrows */}
               <div className="text-slate-600 my-4 flex flex-col items-center">
                 <div className="w-1 h-6 bg-slate-600 mb-1"></div>
                 <div className="text-xs uppercase tracking-widest border border-slate-600 px-3 py-1 rounded text-slate-400 font-bold bg-slate-800 z-10">Substitusi</div>
                 <div className="w-1 h-6 bg-slate-600 mt-1"></div>
               </div>

               {/* Simulation output visualization */}
               <div className="w-full bg-[#0f172a] rounded-xl p-5 border border-slate-700 shadow-inner overflow-hidden relative group">
                  <p className="text-rose-400 text-[10px] uppercase font-bold tracking-widest mb-3">Langkah Komputasi:</p>
                  <div className="font-mono text-lg md:text-xl text-yellow-300 break-all leading-relaxed relative z-10">
                     {getStepText()}
                  </div>
                  {/* Matrix visual effect */}
                  <div className="absolute top-0 right-0 opacity-10 font-mono text-[8px] text-emerald-500 pointer-events-none break-all w-32 h-full overflow-hidden leading-none">
                    10110010101101010101100101 010101
                  </div>
               </div>
               
               {/* Final Result Container */}
               <div className="mt-6 flex justify-center w-full">
                  <div className="bg-emerald-500 text-slate-900 border-b-4 border-emerald-700 rounded-xl px-10 py-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <span className="text-xs uppercase font-bold tracking-widest opacity-80 block text-center mb-1">Hasil:</span>
                    <span className="text-4xl font-mono font-black">{calculateResult()}</span>
                  </div>
               </div>

           </div>
        </div>

      </div>
    </div>
  );
}

function SimulasiBilanganBulat() {
  const [startVal, setStartVal] = useState<number>(0);
  const [operation, setOperation] = useState<string>('+');
  const [changeVal, setChangeVal] = useState<number>(0);

  const calculateResult = () => {
    if (operation === '+') return startVal + changeVal;
    if (operation === '-') return startVal - changeVal;
    if (operation === '×') return startVal * changeVal;
    if (operation === '÷') return changeVal !== 0 ? startVal / changeVal : 0;
    return 0;
  };

  const currentResult = calculateResult();

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Settings */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">1. Atur Operasi</h3>
             
             <div className="space-y-6">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Angka Awal</label>
                  <div className="flex items-center gap-4">
                    <input 
                       type="range" min="-20" max="20" 
                       value={startVal} onChange={(e) => setStartVal(Number(e.target.value))}
                       className="flex-1 accent-indigo-600"
                    />
                    <div className="w-12 text-center font-bold font-mono text-xl text-slate-700 bg-white border border-slate-200 rounded py-1">{startVal}</div>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Pilih Operasi</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['+', '-', '×', '÷'].map(op => (
                      <button
                        key={op}
                        onClick={() => setOperation(op)}
                        className={`py-2 rounded font-mono font-bold text-lg transition-colors border ${
                          operation === op 
                            ? 'bg-indigo-600 text-white border-indigo-700' 
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                       {op}
                      </button>
                    ))}
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Angka Kedua</label>
                  <div className="flex items-center gap-4">
                    <input 
                       type="range" min="-20" max="20" 
                       value={changeVal} onChange={(e) => setChangeVal(Number(e.target.value))}
                       className="flex-1 accent-rose-600"
                    />
                    <div className="w-12 text-center font-bold font-mono text-xl text-slate-700 bg-white border border-slate-200 rounded py-1">{changeVal}</div>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="md:col-span-7 space-y-6">
           <div className="bg-indigo-900 rounded-3xl p-8 border-[6px] border-indigo-800 shadow-xl relative overflow-hidden flex flex-col items-center min-h-[300px] justify-center text-center">
              <h2 className="text-indigo-300 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Visualisasi Persamaan</h2>
              
              <div className="flex items-center gap-4 justify-center text-5xl md:text-6xl font-mono text-white mb-8">
                 <div className="bg-indigo-800/80 px-4 py-3 rounded-2xl border border-indigo-700 text-indigo-100">
                    {startVal}
                 </div>
                 <div className="text-orange-400">
                    {operation}
                 </div>
                 <div className="bg-indigo-800/80 px-4 py-3 rounded-2xl border border-indigo-700 text-rose-300">
                    {changeVal < 0 ? `(${changeVal})` : changeVal}
                 </div>
              </div>

              <div className="text-3xl text-indigo-400 mb-6">=</div>

              <div className="bg-white text-indigo-900 rounded-2xl border-b-[6px] border-slate-300 px-12 py-4 shadow-lg transform transition-all hover:scale-105">
                 <span className="text-5xl md:text-7xl font-mono font-black">
                    {operation === '÷' && changeVal === 0 ? 'Error' : currentResult}
                 </span>
              </div>
           </div>

           <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-sm text-slate-600 shadow-inner">
              <span className="font-bold uppercase tracking-widest text-indigo-600 text-xs block mb-1">Logika:</span>
              {operation === '+' && <p>Tanda (+) berarti digabungkan. Jika positif bertemu negatif, saling mengurangkan dari 0.</p>}
              {operation === '-' && <p>Tanda (-) jika bertemu angka negatif akan menjadi bentuk (+), karena mengurangi hutang berarti bertambah positif.</p>}
              {operation === '×' && <p>Jika tanda keduanya sama, hasilnya positif. Jika berbeda, hasilnya negatif.</p>}
              {operation === '÷' && changeVal !== 0 && <p>Aturan tanda pada pembagian sama dengan perkalian.</p>}
              {operation === '÷' && changeVal === 0 && <p className="text-rose-600 font-bold">Pembagian dengan 0 tidak terdefinisi.</p>}
           </div>
        </div>

      </div>
    </div>
  );
}

function SimulasiPLSV() {
  const [leftX, setLeftX] = useState(1);
  const [leftConst, setLeftConst] = useState(3);
  const [rightX, setRightX] = useState(0);
  const [rightConst, setRightConst] = useState(5);

  const calculateX = () => {
    const diffX = leftX - rightX;
    const diffConst = rightConst - leftConst;
    if (diffX === 0) {
      if (diffConst === 0) return "Takterhingga";
      return "Tidak Ada Solusi";
    }
    const val = diffConst / diffX;
    if (!Number.isInteger(val)) return val.toFixed(1);
    return val.toString();
  };

  const currentResult = calculateX();

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Settings */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">1. Atur Timbangan (Sisi Kiri)</h3>
             
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex justify-between tracking-widest mb-2 block">
                    <span>Jumlah Kotak 'x'</span>
                    <span className="text-indigo-600 font-mono text-lg">{leftX}</span>
                  </label>
                  <input type="range" min="0" max="5" value={leftX} onChange={(e) => setLeftX(Number(e.target.value))} className="w-full accent-indigo-600" />
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between mb-2 block">
                    <span>Beban Angka (Satuan)</span>
                    <span className="text-emerald-600 font-mono text-lg">{leftConst}</span>
                  </label>
                  <input type="range" min="-10" max="20" value={leftConst} onChange={(e) => setLeftConst(Number(e.target.value))} className="w-full accent-emerald-600" />
               </div>
             </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">2. Atur Timbangan (Sisi Kanan)</h3>
             
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex justify-between tracking-widest mb-2 block">
                    <span>Jumlah Kotak 'x'</span>
                    <span className="text-indigo-600 font-mono text-lg">{rightX}</span>
                  </label>
                  <input type="range" min="0" max="5" value={rightX} onChange={(e) => setRightX(Number(e.target.value))} className="w-full accent-indigo-600" />
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between mb-2 block">
                    <span>Beban Angka (Satuan)</span>
                    <span className="text-emerald-600 font-mono text-lg">{rightConst}</span>
                  </label>
                  <input type="range" min="-10" max="20" value={rightConst} onChange={(e) => setRightConst(Number(e.target.value))} className="w-full accent-emerald-600" />
               </div>
             </div>
          </div>

        </div>

        {/* Visualization */}
        <div className="md:col-span-7 space-y-6">
           <div className="bg-slate-100 rounded-3xl p-8 border-4 border-slate-200 shadow-inner relative overflow-hidden flex flex-col items-center min-h-[300px] justify-center text-center">
              
              <h2 className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-8">Kondisi Timbangan Persamaan</h2>

              {/* The Balance Scale visual */}
              <div className="w-full max-w-sm flex flex-col items-center relative gap-4">
                 
                 <div className="flex w-full justify-between items-end gap-4 relative z-10 px-8">
                    {/* Left pan */}
                    <div className="w-32 border-b-4 border-slate-700 pb-2 flex flex-wrap justify-center gap-1 min-h-[40px] items-end">
                       {Array.from({length: leftX}).map((_, i) => (
                         <div key={`lx-${i}`} className="bg-indigo-500 w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold">x</div>
                       ))}
                       {leftConst !== 0 && (
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold ${leftConst > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                           {leftConst > 0 ? `+${leftConst}` : leftConst}
                         </div>
                       )}
                    </div>
                    {/* Right pan */}
                    <div className="w-32 border-b-4 border-slate-700 pb-2 flex flex-wrap justify-center gap-1 min-h-[40px] items-end">
                       {Array.from({length: rightX}).map((_, i) => (
                         <div key={`rx-${i}`} className="bg-indigo-500 w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold">x</div>
                       ))}
                       {rightConst !== 0 && (
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold ${rightConst > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                           {rightConst > 0 ? `+${rightConst}` : rightConst}
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Scale Stand */}
                 <div className="w-full h-2 bg-slate-400 rounded-full relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-slate-500 rounded-full"></div>
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-600 rounded-full"></div>
                 </div>

              </div>

              <div className="mt-20 font-mono text-2xl font-bold text-slate-700 tracking-wider bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
                 {leftX === 0 ? '' : leftX === 1 ? 'x' : `${leftX}x`}
                 {leftX > 0 && leftConst > 0 ? ' + ' : leftX === 0 && leftConst > 0 ? '' : leftConst < 0 && leftX > 0 ? ' - ' : ''}
                 {leftConst !== 0 ? Math.abs(leftConst) : leftX === 0 && leftConst === 0 ? '0' : ''}
                 <span className="mx-4 text-purple-600">=</span>
                 {rightX === 0 ? '' : rightX === 1 ? 'x' : `${rightX}x`}
                 {rightX > 0 && rightConst > 0 ? ' + ' : rightX === 0 && rightConst > 0 ? '' : rightConst < 0 && rightX > 0 ? ' - ' : ''}
                 {rightConst !== 0 ? Math.abs(rightConst) : rightX === 0 && rightConst === 0 ? '0' : ''}
              </div>

           </div>

           <div className="flex items-center justify-between bg-emerald-50 p-5 rounded-xl border border-emerald-200">
               <div>
                  <h3 className="text-xs uppercase font-bold text-emerald-800 tracking-widest mb-1">Penyelesaian (Nilai X)</h3>
                  <p className="text-xs text-emerald-600">Agar timbangan ini seimbang (kiri = kanan), maka kotak 'x' harus memiliki isi sebesar:</p>
               </div>
               <div className="bg-white px-6 py-3 rounded-lg border-2 border-emerald-500 shadow-sm text-2xl font-black font-mono text-emerald-600">
                  {currentResult}
               </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function SimulasiAritmatikaSosial() {
  const [hargaBeli, setHargaBeli] = useState<number>(50000);
  const [persentase, setPersentase] = useState<number>(10);
  const [isUntung, setIsUntung] = useState<boolean>(true);

  // Kalkulasi
  const nominal = (hargaBeli * persentase) / 100;
  const hargaJual = isUntung ? hargaBeli + nominal : Math.max(0, hargaBeli - nominal);

  const formatRp = (num: number) => {
    return "Rp " + num.toLocaleString('id-ID');
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        
        {/* Settings */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Kasus Perdagangan</h3>
             
             <div className="space-y-5">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                    1. Modal / Harga Beli Pokok
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input 
                      type="number" 
                      value={hargaBeli} 
                      onChange={(e) => setHargaBeli(Number(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-3 pl-10 pr-4 font-mono font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                    2. Skenario
                  </label>
                  <div className="flex gap-4">
                     <button 
                       onClick={() => setIsUntung(true)}
                       className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${isUntung ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}
                     >
                       Mencari Untung
                     </button>
                     <button 
                       onClick={() => setIsUntung(false)}
                       className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${!isUntung ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}
                     >
                       Mengalami Rugi
                     </button>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex justify-between tracking-widest mb-2 block">
                    <span>3. Persentase {isUntung ? 'Untung' : 'Rugi'}</span>
                    <span className={`font-mono text-lg ${isUntung ? 'text-emerald-600' : 'text-rose-600'}`}>{persentase}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={persentase} 
                    onChange={(e) => setPersentase(Number(e.target.value))} 
                    className={`w-full ${isUntung ? 'accent-emerald-600' : 'accent-rose-600'}`} 
                  />
               </div>
             </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="space-y-6 flex flex-col h-full">
           <div className={`flex-1 rounded-3xl p-6 border-4 shadow-inner relative overflow-hidden flex flex-col justify-center ${isUntung ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              
              <h2 className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-center ${isUntung ? 'text-emerald-400' : 'text-rose-400'}`}>Laporan Akuntansi</h2>

              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-white/50 pb-3">
                    <span className="text-slate-600 font-medium">Harga Beli</span>
                    <span className="font-mono text-slate-800 font-bold">{formatRp(hargaBeli)}</span>
                 </div>
                 
                 <div className="flex justify-between items-center border-b border-white/50 pb-3">
                    <span className={`${isUntung ? 'text-emerald-700' : 'text-rose-700'} font-medium`}>
                       {isUntung ? 'Untung' : 'Rugi'} ({persentase}%)
                    </span>
                    <span className={`font-mono font-bold ${isUntung ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {isUntung ? '+' : '-'} {formatRp(nominal)}
                    </span>
                 </div>

                 <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-800 font-black text-lg">HARGA JUAL</span>
                    <span className="font-mono text-2xl font-black text-indigo-700 bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
                       {formatRp(hargaJual)}
                    </span>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

function SimulasiPerbandingan() {
  const [mode, setMode] = useState<'senilai' | 'berbalik'>('senilai');
  
  // State for Senilai (Bensin -> Jarak)
  const [bensin, setBensin] = useState(2); // Liter
  const rasioSenilai = 15; // 1 Liter = 15 Km
  const jarak = bensin * rasioSenilai;
  
  // State for Berbalik (Pekerja -> Waktu Hari)
  const [pekerja, setPekerja] = useState(5); // Orang
  const totalBebanKerja = 100; // Orang-hari
  const waktu = totalBebanKerja / pekerja;

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      
      <div className="flex flex-col md:flex-row gap-2 mb-8 bg-slate-100 p-1.5 rounded-lg w-full md:w-fit font-bold text-sm">
        <button 
          onClick={() => setMode('senilai')}
          className={`px-4 py-2 rounded-md transition-all flex-1 md:flex-none ${mode === 'senilai' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Senilai (Bensin & Jarak)
        </button>
        <button 
          onClick={() => setMode('berbalik')}
          className={`px-4 py-2 rounded-md transition-all flex-1 md:flex-none ${mode === 'berbalik' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Berbalik Nilai (Pekerja & Waktu)
        </button>
      </div>

      {mode === 'senilai' && (
        <div className="grid md:grid-cols-2 gap-8 items-center bg-indigo-50 p-6 md:p-8 rounded-2xl border border-indigo-100">
           <div className="space-y-6">
             <div>
               <h3 className="font-bold text-indigo-900 text-lg mb-2">Simulasi Perbandingan Senilai</h3>
               <p className="text-slate-600 text-sm">Makin banyak <strong>bensin</strong>, makin jauh <strong>jarak tempuhnya</strong>.</p>
             </div>
             
             <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-sm">
               <label className="text-sm font-bold text-slate-700 mb-3 flex justify-between">
                 <span>Isi Bensin (Liter):</span>
                 <span className="text-indigo-600">{bensin} Liter</span>
               </label>
               <input 
                 type="range" 
                 min="1" 
                 max="10" 
                 value={bensin}
                 onChange={(e) => setBensin(parseInt(e.target.value))}
                 className="w-full accent-indigo-600"
               />
             </div>
           </div>

           <div className="bg-white/60 p-6 rounded-2xl text-center flex flex-col justify-center items-center min-h-[250px] border-2 border-indigo-200 border-dashed">
             <span className="text-slate-500 font-bold mb-2 uppercase tracking-widest text-xs">Odometer Jarak Tempuh</span>
             <div className="text-5xl font-black font-mono text-indigo-700 mb-2">
               {jarak} <span className="text-2xl">km</span>
             </div>
             <p className="text-xs font-mono text-indigo-500 bg-indigo-100 px-3 py-1 rounded-full">{bensin} × {rasioSenilai} km/L</p>
           </div>
        </div>
      )}

      {mode === 'berbalik' && (
        <div className="grid md:grid-cols-2 gap-8 items-center bg-orange-50 p-6 md:p-8 rounded-2xl border border-orange-100">
           <div className="space-y-6">
             <div>
               <h3 className="font-bold text-orange-900 text-lg mb-2">Simulasi Perbandingan Berbalik Nilai</h3>
               <p className="text-slate-600 text-sm">Makin banyak <strong>pekerja</strong>, makin cepat <strong>waktu selesainya</strong>.</p>
             </div>
             
             <div className="bg-white p-5 rounded-xl border border-orange-200 shadow-sm">
               <label className="text-sm font-bold text-slate-700 mb-3 flex justify-between">
                 <span>Jumlah Pekerja (Orang):</span>
                 <span className="text-orange-600">{pekerja} Orang</span>
               </label>
               <input 
                 type="range" 
                 min="1" 
                 max="20" 
                 step="1"
                 value={pekerja}
                 onChange={(e) => setPekerja(parseInt(e.target.value))}
                 className="w-full accent-orange-600"
               />
               <p className="text-[10px] text-slate-400 mt-2">Beban kerja total: {totalBebanKerja} orang-hari</p>
             </div>
           </div>

           <div className="bg-white/60 p-6 rounded-2xl text-center flex flex-col justify-center items-center min-h-[250px] border-2 border-orange-200 border-dashed">
             <span className="text-slate-500 font-bold mb-2 uppercase tracking-widest text-xs">Estimasi Waktu Selesai</span>
             <div className="text-5xl font-black font-mono text-orange-700 mb-2">
               {Number.isInteger(waktu) ? waktu : waktu.toFixed(1)} <span className="text-2xl">Hari</span>
             </div>
             <p className="text-xs font-mono text-orange-500 bg-orange-100 px-3 py-1 rounded-full">{totalBebanKerja} ÷ {pekerja}</p>
             
             <div className="flex flex-wrap gap-1 mt-6 justify-center w-full max-w-[200px]">
               {Array.from({ length: pekerja }).map((_, i) => (
                 <div key={i} className="w-3 h-3 bg-slate-800 rounded-sm"></div>
               ))}
             </div>
             <span className="text-[10px] text-slate-500 w-full mt-2 block">Setiap kotak = 1 Pekerja</span>
           </div>
        </div>
      )}

    </div>
  );
}

function SimulasiUnsurGeometri() {
  const [angle, setAngle] = useState(45); // Sudut lancip awal

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        
        <div className="space-y-6">
          <h3 className="font-bold text-slate-800 text-lg">Hubungan Antar Sudut pada Garis Sejajar</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Geser slider di bawah ini untuk mengubah kemiringan garis potong (transversal). Perhatikan bagaimana sudut-sudut lain ikut berubah!
          </p>

          <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100 shadow-inner">
             <label className="text-sm font-bold text-slate-700 mb-3 flex justify-between">
               <span>Kemiringan Sudut (∠1):</span>
               <span className="text-cyan-700 font-mono text-lg">{angle}°</span>
             </label>
             <input 
               type="range" 
               min="20" 
               max="160" 
               value={angle}
               onChange={(e) => setAngle(parseInt(e.target.value))}
               className="w-full accent-cyan-600"
             />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
             <h4 className="font-bold text-slate-700 text-xs uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Kesimpulan Sifat Sudut</h4>
             <ul className="space-y-3 font-mono text-sm">
                <li className="flex justify-between">
                  <span className="text-blue-700">Sehadap:</span>
                  <span className="font-bold">∠1 = ∠5 = {angle}°</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-rose-700">Bertolak Belakang:</span>
                  <span className="font-bold">∠1 = ∠3 = {angle}°</span>
                </li>
                <li className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600">Pelurus:</span>
                  <span className="font-bold text-purple-700">∠2 = {180 - angle}°</span>
                </li>
             </ul>
          </div>
        </div>

        {/* Visualisasi Canvas-like using CSS and rotation */}
        <div className="bg-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[350px]">
           
           <div className="relative w-full max-w-[250px] h-[200px]">
              {/* Garis Sejajar Atas */}
              <div className="absolute top-[40px] left-0 right-0 h-1.5 bg-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              {/* Garis Sejajar Bawah */}
              <div className="absolute bottom-[40px] left-0 right-0 h-1.5 bg-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              
              {/* Garis Potong (Transversal) */}
              <div 
                className="absolute top-[-50px] bottom-[-50px] w-1.5 bg-cyan-400 z-20 left-1/2 transform origin-center shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}
              ></div>

              {/* Labels Atas */}
              <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-0 h-0 z-30">
                 {/* Top Left, Top Right, Bottom Right, Bottom Left relative to intersection */}
                 <div className="absolute font-mono font-black text-cyan-300 transform -translate-x-12 -translate-y-8">∠2</div>
                 <div className="absolute font-mono font-black text-white transform translate-x-4 -translate-y-8">∠1</div>
                 <div className="absolute font-mono font-black text-cyan-300 transform translate-x-4 translate-y-3">∠4</div>
                 <div className="absolute font-mono font-black text-white transform -translate-x-14 translate-y-3">∠3</div>
              </div>

              {/* Labels Bawah */}
              <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-0 h-0 z-30">
                 <div className="absolute font-mono font-black text-cyan-300 transform -translate-x-12 -translate-y-8">∠6</div>
                 <div className="absolute font-mono font-black text-white transform translate-x-4 -translate-y-8">∠5</div>
                 <div className="absolute font-mono font-black text-cyan-300 transform translate-x-4 translate-y-3">∠8</div>
                 <div className="absolute font-mono font-black text-white transform -translate-x-14 translate-y-3">∠7</div>
              </div>
           </div>
           
           <p className="text-slate-400 text-xs mt-8">Garis putih adalah garis sejajar. Garis biru muda memotong keduanya.</p>
        </div>

      </div>
    </div>
  );
}

function SimulasiPythagoras() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = Math.sqrt(a*a + b*b);
  const isInteger = Number.isInteger(c);

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 shadow-sm">
             <label className="text-sm font-bold text-slate-700 mb-3 flex justify-between">
               <span>Sisi Alas (a):</span>
               <span className="text-sky-700 font-mono text-lg">{a}</span>
             </label>
             <input 
               type="range" 
               min="1" 
               max="20" 
               value={a}
               onChange={(e) => setA(parseInt(e.target.value))}
               className="w-full accent-sky-600 mb-6"
             />

             <label className="text-sm font-bold text-slate-700 mb-3 flex justify-between">
               <span>Sisi Tinggi (b):</span>
               <span className="text-sky-700 font-mono text-lg">{b}</span>
             </label>
             <input 
               type="range" 
               min="1" 
               max="20" 
               value={b}
               onChange={(e) => setB(parseInt(e.target.value))}
               className="w-full accent-sky-600"
             />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
             <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm font-mono text-sm mb-3">
               <span>c² = {a}² + {b}²</span>
               <span>c² = {a*a} + {b*b}</span>
             </div>
             <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm font-mono text-sm">
               <span>c² = {a*a + b*b}</span>
               <span className="text-xl font-bold text-sky-700">c = {isInteger ? c : c.toFixed(2)}</span>
             </div>
             {isInteger && <div className="mt-3 text-center text-xs text-emerald-600 font-bold bg-emerald-50 py-1 rounded">Membentuk Tripel Pythagoras!</div>}
          </div>
        </div>

        {/* Dynamic Triangle Visualizer */}
        <div className="flex items-center justify-center bg-slate-800 p-8 rounded-2xl min-h-[300px]">
           <div className="relative" style={{ width: a * 10, height: b * 10 }}>
              {/* Sisi a */}
              <div className="absolute bottom-0 left-0 bg-blue-400 h-1 flex items-end justify-center pb-2" style={{ width: a * 10 }}>
                <span className="text-white font-mono text-xs translate-y-6">a={a}</span>
              </div>
              {/* Sisi b */}
              <div className="absolute bottom-0 left-0 bg-rose-400 w-1 flex items-center justify-end pr-2" style={{ height: b * 10 }}>
                <span className="text-white font-mono text-xs -translate-x-6">b={b}</span>
              </div>
              {/* Sisi c (Miring) */}
              <svg className="absolute bottom-0 left-0 overflow-visible" width={a * 10} height={b * 10} style={{ transform: 'scaleY(-1)' }}>
                <line x1="0" y1={b * 10} x2={a * 10} y2="0" stroke="#10b981" strokeWidth="2" />
              </svg>
              {/* Label C centered on the line */}
              <div className="absolute font-mono font-bold text-emerald-400" 
                style={{ 
                  left: (a * 10)/2 + 10,
                  bottom: (b * 10)/2 + 10
                }}
              >c={isInteger ? c : c.toFixed(1)}</div>
              {/* Siku-siku mark */}
              <div className="absolute bottom-0 left-0 w-3 h-3 border-t border-r border-white/50"></div>
           </div>
        </div>
      </div>
    </div>
  );
}

function SimulasiBangunDatar() {
  const [shape, setShape] = useState<'persegi_panjang' | 'segitiga'>('persegi_panjang');
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(5);

  const isSquare = width === height;

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      
      <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-lg w-fit">
        <button 
          onClick={() => setShape('persegi_panjang')}
          className={`px-4 py-2 text-sm font-bold rounded-md ${shape === 'persegi_panjang' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >Segiempat</button>
        <button 
          onClick={() => setShape('segitiga')}
          className={`px-4 py-2 text-sm font-bold rounded-md ${shape === 'segitiga' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >Segitiga Siku-siku</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
           <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
             <label className="text-sm font-bold text-slate-700 mb-3 flex justify-between">
               <span>Lebar/Alas:</span>
               <span className="text-blue-700 font-mono text-lg">{width} unit</span>
             </label>
             <input type="range" min="2" max="20" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} className="w-full accent-blue-600 mb-6" />

             <label className="text-sm font-bold text-slate-700 mb-3 flex justify-between">
               <span>Tinggi:</span>
               <span className="text-blue-700 font-mono text-lg">{height} unit</span>
             </label>
             <input type="range" min="2" max="20" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className="w-full accent-blue-600" />
           </div>

           <div className="flex gap-4">
             <div className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
               <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Luas</h4>
               <div className="text-2xl font-mono text-emerald-600 font-bold">
                 {shape === 'persegi_panjang' ? width * height : (width * height) / 2}
               </div>
               <div className="text-[10px] text-slate-400 mt-1">unit²</div>
             </div>
             <div className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
               <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Keliling</h4>
               <div className="text-2xl font-mono text-rose-600 font-bold">
                 {shape === 'persegi_panjang' ? 2 * (width + height) : (width + height + Math.sqrt(width*width + height*height)).toFixed(1)}
               </div>
               <div className="text-[10px] text-slate-400 mt-1">unit</div>
             </div>
           </div>
        </div>

        <div className="bg-slate-100 border-2 border-slate-200 border-dashed rounded-2xl min-h-[300px] flex items-center justify-center p-8 relative overflow-hidden">
           {/* Grid Background */}
           <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           <div className="z-10 relative bg-blue-500/80 border-2 border-blue-600 flex items-center justify-center text-white font-bold"
                style={{ 
                  width: width * 10, 
                  height: height * 10,
                  clipPath: shape === 'segitiga' ? 'polygon(0 100%, 100% 100%, 0 0)' : 'none'
                }}>
              <span className="mix-blend-overlay">
                {shape === 'persegi_panjang' ? (isSquare ? 'Persegi' : 'Persegi Panjang') : 'Segitiga'}
              </span>
           </div>
           
        </div>
      </div>
    </div>
  );
}

function SimulasiMenyederhanakanAljabar() {
  const [xCount1, setXCount1] = useState(2);
  const [yCount1, setYCount1] = useState(1);
  const [xCount2, setXCount2] = useState(3);
  const [yCount2, setYCount2] = useState(2);

  const totalX = xCount1 + xCount2;
  const totalY = yCount1 + yCount2;

  const [step, setStep] = useState(1);

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 mt-6">
      
      <div className="flex justify-center gap-2 mb-8">
         <button onClick={() => setStep(1)} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${step === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>1: Bentuk Awal</button>
         <button onClick={() => setStep(2)} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${step === 2 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>2: Kelompokkan</button>
         <button onClick={() => setStep(3)} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${step === 3 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>3: Sederhanakan</button>
      </div>

      <div className="grid md:grid-cols-[1fr_200px] gap-8">
        <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl p-6 relative min-h-[300px]">
           {/* Step 1: Spread out */}
           {step === 1 && (
             <div className="flex flex-wrap gap-4 items-center justify-center h-full">
                <div className="flex gap-2 p-3 bg-blue-100 border border-blue-200 rounded-xl">
                  {Array.from({ length: Math.abs(xCount1) }).map((_, i) => (
                    <div key={`x1-${i}`} className="w-10 h-10 bg-blue-500 text-white font-bold flex items-center justify-center rounded">X</div>
                  ))}
                  {xCount1 === 0 && <div className="text-slate-400 text-sm">0x</div>}
                </div>
                
                <div className="text-xl font-bold text-slate-400">+</div>
                
                <div className="flex gap-2 p-3 bg-amber-100 border border-amber-200 rounded-xl">
                  {Array.from({ length: Math.abs(yCount1) }).map((_, i) => (
                    <div key={`y1-${i}`} className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">Y</div>
                  ))}
                  {yCount1 === 0 && <div className="text-slate-400 text-sm">0y</div>}
                </div>

                <div className="text-xl font-bold text-slate-400">+</div>
                
                <div className="flex gap-2 p-3 bg-blue-100 border border-blue-200 rounded-xl">
                  {Array.from({ length: Math.abs(xCount2) }).map((_, i) => (
                    <div key={`x2-${i}`} className="w-10 h-10 bg-blue-500 text-white font-bold flex items-center justify-center rounded">X</div>
                  ))}
                  {xCount2 === 0 && <div className="text-slate-400 text-sm">0x</div>}
                </div>

                <div className="text-xl font-bold text-slate-400">+</div>

                <div className="flex gap-2 p-3 bg-amber-100 border border-amber-200 rounded-xl">
                  {Array.from({ length: Math.abs(yCount2) }).map((_, i) => (
                    <div key={`y2-${i}`} className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">Y</div>
                  ))}
                  {yCount2 === 0 && <div className="text-slate-400 text-sm">0y</div>}
                </div>
             </div>
           )}

           {/* Step 2: Grouped */}
           {step === 2 && (
             <div className="flex flex-col gap-6 items-center justify-center h-full">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-100/50 border border-blue-200 border-dashed rounded-xl flex flex-wrap gap-2 w-[280px] justify-center min-h-[70px]">
                    {Array.from({ length: Math.abs(xCount1) }).map((_, i) => (
                      <div key={`gx1-${i}`} className="w-10 h-10 bg-blue-500 text-white font-bold flex items-center justify-center rounded">X</div>
                    ))}
                    {Array.from({ length: Math.abs(xCount2) }).map((_, i) => (
                      <div key={`gx2-${i}`} className="w-10 h-10 bg-blue-500 text-white font-bold flex items-center justify-center rounded">X</div>
                    ))}
                    {totalX === 0 && <div className="text-slate-400 text-sm self-center">Kosong</div>}
                  </div>
                  <div className="font-mono font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded w-64 text-center">Suku X dikelompokkan</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-4 bg-amber-100/50 border border-amber-200 border-dashed rounded-xl flex flex-wrap gap-2 w-[280px] justify-center min-h-[70px]">
                     {Array.from({ length: Math.abs(yCount1) }).map((_, i) => (
                      <div key={`gy1-${i}`} className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">Y</div>
                    ))}
                    {Array.from({ length: Math.abs(yCount2) }).map((_, i) => (
                      <div key={`gy2-${i}`} className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">Y</div>
                    ))}
                    {totalY === 0 && <div className="text-slate-400 text-sm self-center">Kosong</div>}
                  </div>
                  <div className="font-mono font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded w-64 text-center">Suku Y dikelompokkan</div>
                </div>
             </div>
           )}

           {/* Step 3: Simplified */}
           {step === 3 && (
             <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-emerald-50 w-full max-w-sm rounded-2xl p-6 border border-emerald-200 shadow-sm">
                   <div className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 border-b border-emerald-200 pb-2">Bentuk Paling Sederhana</div>
                   <div className="flex justify-center items-center gap-4 text-4xl font-mono text-emerald-700 font-bold">
                     <div>{totalX}x</div>
                     <div className="text-emerald-300">+</div>
                     <div>{totalY}y</div>
                   </div>
                </div>
                <p className="text-slate-500 text-sm">Koefisien dijumlahkan. Variabel x dan y tidak dapat digabung karena tidak sejenis.</p>
             </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
              <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Kelompok 1</label>
              <div className="flex items-center justify-between mb-2">
                 <span className="text-blue-600 font-bold text-sm">Suku X</span>
                 <div className="flex items-center bg-slate-100 rounded-lg p-1">
                   <button onClick={() => { setXCount1(Math.max(0, xCount1 - 1)); setStep(1); }} className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 font-bold">-</button>
                   <span className="w-8 text-center font-mono text-sm font-bold">{xCount1}</span>
                   <button onClick={() => { setXCount1(Math.min(8, xCount1 + 1)); setStep(1); }} className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 font-bold">+</button>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-amber-600 font-bold text-sm">Suku Y</span>
                 <div className="flex items-center bg-slate-100 rounded-lg p-1">
                   <button onClick={() => { setYCount1(Math.max(0, yCount1 - 1)); setStep(1); }} className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-amber-600 font-bold">-</button>
                   <span className="w-8 text-center font-mono text-sm font-bold">{yCount1}</span>
                   <button onClick={() => { setYCount1(Math.min(8, yCount1 + 1)); setStep(1); }} className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-amber-600 font-bold">+</button>
                 </div>
              </div>
           </div>

           <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
              <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Kelompok 2</label>
              <div className="flex items-center justify-between mb-2">
                 <span className="text-blue-600 font-bold text-sm">Suku X</span>
                 <div className="flex items-center bg-slate-100 rounded-lg p-1">
                   <button onClick={() => { setXCount2(Math.max(0, xCount2 - 1)); setStep(1); }} className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 font-bold">-</button>
                   <span className="w-8 text-center font-mono text-sm font-bold">{xCount2}</span>
                   <button onClick={() => { setXCount2(Math.min(8, xCount2 + 1)); setStep(1); }} className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 font-bold">+</button>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-amber-600 font-bold text-sm">Suku Y</span>
                 <div className="flex items-center bg-slate-100 rounded-lg p-1">
                   <button onClick={() => { setYCount2(Math.max(0, yCount2 - 1)); setStep(1); }} className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-amber-600 font-bold">-</button>
                   <span className="w-8 text-center font-mono text-sm font-bold">{yCount2}</span>
                   <button onClick={() => { setYCount2(Math.min(8, yCount2 + 1)); setStep(1); }} className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-amber-600 font-bold">+</button>
                 </div>
              </div>
           </div>

           <div className="bg-slate-800 rounded-xl p-4 text-center">
             <div className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">Bentuk Awal</div>
             <div className="font-mono text-white text-sm bg-slate-900 border border-slate-700 py-2 rounded">
                ({xCount1}x + {yCount1}y) + ({xCount2}x + {yCount2}y)
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}