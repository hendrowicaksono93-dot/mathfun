import React, { useState } from 'react';
import { 
  Divide, Sparkles, RefreshCw, Layers, ArrowRight, Check, 
  HelpCircle, ArrowLeftRight, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function SimulasiBilanganRasional() {
  const [activeMode, setActiveMode] = useState<'operasi' | 'konversi'>('operasi');

  // State untuk Operasi Pecahan
  const [num1, setNum1] = useState<number>(2);
  const [den1, setDen1] = useState<number>(3);
  const [num2, setNum2] = useState<number>(3);
  const [den2, setDen2] = useState<number>(4);
  const [operator, setOperator] = useState<'+' | '-' | '×' | '÷'>('+');

  // State untuk Simulator Konversi Grid 100 Persegi
  const [percentVal, setPercentVal] = useState<number>(60);

  // Perhitungan Operasi
  const commonDen = den1 * den2;
  const scaledNum1 = num1 * den2;
  const scaledNum2 = num2 * den1;

  let resultNumRaw = 0;
  let resultDenRaw = 1;

  if (operator === '+') {
    resultNumRaw = scaledNum1 + scaledNum2;
    resultDenRaw = commonDen;
  } else if (operator === '-') {
    resultNumRaw = scaledNum1 - scaledNum2;
    resultDenRaw = commonDen;
  } else if (operator === '×') {
    resultNumRaw = num1 * num2;
    resultDenRaw = den1 * den2;
  } else if (operator === '÷') {
    resultNumRaw = num1 * den2;
    resultDenRaw = den1 * num2;
  }

  const factor = gcd(resultNumRaw, resultDenRaw);
  const simpleNum = resultNumRaw / factor;
  const simpleDen = resultDenRaw / factor;

  // Format pecahan campuran jika > 1
  const isImproper = Math.abs(simpleNum) >= simpleDen && simpleDen > 1;
  const wholePart = Math.floor(Math.abs(simpleNum) / simpleDen) * (simpleNum < 0 ? -1 : 1);
  const remainderNum = Math.abs(simpleNum) % simpleDen;

  // Presets
  const applyPreset = (n1: number, d1: number, op: '+' | '-' | '×' | '÷', n2: number, d2: number) => {
    setNum1(n1);
    setDen1(d1);
    setOperator(op);
    setNum2(n2);
    setDen2(d2);
  };

  return (
    <div className="space-y-6">
      {/* Mode Navigation Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit max-w-full">
        <button
          onClick={() => setActiveMode('operasi')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeMode === 'operasi'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-emerald-600'
          }`}
        >
          <Layers className="w-4 h-4" />
          Simulasi Operasi Hitung Persegi
        </button>
        <button
          onClick={() => setActiveMode('konversi')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeMode === 'konversi'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-emerald-600'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          Simulator Konversi (Grid 100 Persegi)
        </button>
      </div>

      {activeMode === 'operasi' ? (
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Pengatur Pecahan &amp; Operasi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur pembilang dan penyebut pada kedua pecahan untuk melihat perubahan petak persegi secara visual.
                </p>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Contoh Cepat:</span>
                <button 
                  onClick={() => applyPreset(1, 2, '+', 1, 3)} 
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-mono rounded-lg border border-slate-200"
                >
                  ½ + ⅓
                </button>
                <button 
                  onClick={() => applyPreset(3, 4, '-', 1, 2)} 
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-mono rounded-lg border border-slate-200"
                >
                  ¾ - ½
                </button>
                <button 
                  onClick={() => applyPreset(2, 3, '×', 3, 4)} 
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-mono rounded-lg border border-slate-200"
                >
                  ⅔ × ¾
                </button>
                <button 
                  onClick={() => applyPreset(3, 4, '÷', 1, 4)} 
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-mono rounded-lg border border-slate-200"
                >
                  ¾ ÷ ¼
                </button>
              </div>
            </div>

            {/* Selector Grid */}
            <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
              {/* Pecahan 1 */}
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Pecahan 1 (Biru)</span>
                  <span className="text-xs font-mono font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                    {num1}/{den1}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Pembilang (a): <strong>{num1}</strong></label>
                    <input 
                      type="range" min="1" max={den1} value={num1}
                      onChange={(e) => setNum1(parseInt(e.target.value))}
                      className="w-full accent-sky-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Penyebut (b): <strong>{den1}</strong></label>
                    <input 
                      type="range" min="2" max="6" value={den1}
                      onChange={(e) => {
                        const newDen = parseInt(e.target.value);
                        setDen1(newDen);
                        if (num1 > newDen) setNum1(newDen);
                      }}
                      className="w-full accent-sky-600"
                    />
                  </div>
                </div>
              </div>

              {/* Operator Choice */}
              <div className="flex md:flex-col justify-center items-center gap-2">
                {(['+', '-', '×', '÷'] as const).map(op => (
                  <button
                    key={op}
                    onClick={() => {
                      setOperator(op);
                      // jika pengurangan dan pecahan 1 < pecahan 2, atur agar positif untuk visualisasi
                      if (op === '-' && (num1 / den1 < num2 / den2)) {
                        setNum1(den1);
                      }
                    }}
                    className={`w-10 h-10 rounded-xl font-bold text-base flex items-center justify-center transition-all ${
                      operator === op
                        ? 'bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>

              {/* Pecahan 2 */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pecahan 2 (Kuning)</span>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                    {num2}/{den2}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Pembilang (c): <strong>{num2}</strong></label>
                    <input 
                      type="range" min="1" max={den2} value={num2}
                      onChange={(e) => setNum2(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Penyebut (d): <strong>{den2}</strong></label>
                    <input 
                      type="range" min="2" max="6" value={den2}
                      onChange={(e) => {
                        const newDen = parseInt(e.target.value);
                        setDen2(newDen);
                        if (num2 > newDen) setNum2(newDen);
                      }}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Square Visualizers Container */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Visual Persegi 1 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 mb-3">
                Persegi 1: {num1}/{den1} bagian
              </span>

              {/* Grid Persegi 1 (Strip Vertikal) */}
              <div 
                className="w-48 h-48 border-2 border-slate-800 rounded-lg overflow-hidden grid bg-slate-50 shadow-inner"
                style={{ gridTemplateColumns: `repeat(${den1}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: den1 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`border-r border-slate-400 last:border-r-0 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                      idx < num1 ? 'bg-sky-400 text-sky-950' : 'bg-white text-slate-300'
                    }`}
                  >
                    {idx < num1 ? '1/' + den1 : ''}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-3">
                1 Persegi utuh dibagi <strong>{den1} kolom</strong>, diarsir <strong>{num1} kolom</strong>.
              </p>
            </div>

            {/* Visual Persegi 2 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-3">
                Persegi 2: {num2}/{den2} bagian
              </span>

              {/* Grid Persegi 2 (Strip Horizontal) */}
              <div 
                className="w-48 h-48 border-2 border-slate-800 rounded-lg overflow-hidden grid bg-slate-50 shadow-inner"
                style={{ gridTemplateRows: `repeat(${den2}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: den2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`border-b border-slate-400 last:border-b-0 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                      idx < num2 ? 'bg-amber-400 text-amber-950' : 'bg-white text-slate-300'
                    }`}
                  >
                    {idx < num2 ? '1/' + den2 : ''}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-3">
                1 Persegi utuh dibagi <strong>{den2} baris</strong>, diarsir <strong>{num2} baris</strong>.
              </p>
            </div>

            {/* Visual Persegi Hasil Operasi */}
            <div className="bg-white rounded-xl p-5 border-2 border-emerald-300 shadow-sm flex flex-col items-center bg-emerald-50/10">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  Hasil Operasi: ({num1}/{den1}) {operator} ({num2}/{den2})
                </span>
              </div>

              {/* Visual Berdasarkan Operasi */}
              {operator === '×' ? (
                // Model Luas Persegi (Square Area Model Grid)
                <div 
                  className="w-48 h-48 border-2 border-slate-800 rounded-lg overflow-hidden grid bg-slate-50 shadow-md"
                  style={{
                    gridTemplateColumns: `repeat(${den1}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${den2}, minmax(0, 1fr))`
                  }}
                >
                  {Array.from({ length: den2 }).map((_, row) =>
                    Array.from({ length: den1 }).map((_, col) => {
                      const isColActive = col < num1;
                      const isRowActive = row < num2;
                      const isOverlap = isColActive && isRowActive;

                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`border border-slate-300 flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${
                            isOverlap
                              ? 'bg-purple-600 text-white ring-1 ring-purple-300'
                              : isColActive
                              ? 'bg-sky-200 text-sky-800 opacity-60'
                              : isRowActive
                              ? 'bg-amber-200 text-amber-800 opacity-60'
                              : 'bg-white'
                          }`}
                        >
                          {isOverlap ? '★' : ''}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : operator === '+' ? (
                // Model Gabungan Grid Penjumlahan
                <div 
                  className="w-48 h-48 border-2 border-slate-800 rounded-lg overflow-hidden grid bg-slate-50 shadow-md"
                  style={{
                    gridTemplateColumns: `repeat(${den1}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${den2}, minmax(0, 1fr))`
                  }}
                >
                  {Array.from({ length: commonDen }).map((_, idx) => {
                    const isFromFirst = idx < scaledNum1;
                    const isFromSecond = idx >= scaledNum1 && idx < (scaledNum1 + scaledNum2);

                    return (
                      <div
                        key={idx}
                        className={`border border-slate-300 flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-300 ${
                          isFromFirst
                            ? 'bg-sky-400 text-sky-950'
                            : isFromSecond
                            ? 'bg-amber-400 text-amber-950'
                            : 'bg-white'
                        }`}
                      >
                        {isFromFirst ? '1' : isFromSecond ? '2' : ''}
                      </div>
                    );
                  })}
                </div>
              ) : operator === '-' ? (
                // Model Pengurangan Grid
                <div 
                  className="w-48 h-48 border-2 border-slate-800 rounded-lg overflow-hidden grid bg-slate-50 shadow-md"
                  style={{
                    gridTemplateColumns: `repeat(${den1}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${den2}, minmax(0, 1fr))`
                  }}
                >
                  {Array.from({ length: commonDen }).map((_, idx) => {
                    const isRemaining = idx < (scaledNum1 - scaledNum2);
                    const isSubtracted = idx >= (scaledNum1 - scaledNum2) && idx < scaledNum1;

                    return (
                      <div
                        key={idx}
                        className={`border border-slate-300 flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-300 ${
                          isRemaining
                            ? 'bg-emerald-500 text-white'
                            : isSubtracted
                            ? 'bg-rose-100 text-rose-500 line-through'
                            : 'bg-white'
                        }`}
                      >
                        {isRemaining ? '✓' : isSubtracted ? '✕' : ''}
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Model Pembagian
                <div className="w-48 h-48 border-2 border-slate-800 rounded-lg p-3 bg-purple-50/50 flex flex-col justify-center items-center text-center">
                  <div className="text-xs text-slate-600 mb-1">Perbandingan Petak:</div>
                  <div className="text-sm font-mono font-bold text-purple-800">
                    {scaledNum1} petak ÷ {scaledNum2} petak
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    = {num1}/{den1} × {den2}/{num2}
                  </div>
                </div>
              )}

              {/* Keterangan Interaktif */}
              <div className="text-center mt-3">
                <p className="text-xs font-semibold text-emerald-800">
                  {operator === '×' && (
                    <span>
                      Luas Irisan Persegi (Ungu): <strong>{resultNumRaw}</strong> dari total <strong>{resultDenRaw}</strong> petak
                    </span>
                  )}
                  {operator === '+' && (
                    <span>
                      Total Petak Terarsir: <strong>{scaledNum1}</strong> + <strong>{scaledNum2}</strong> = <strong>{resultNumRaw}</strong> / <strong>{commonDen}</strong>
                    </span>
                  )}
                  {operator === '-' && (
                    <span>
                      Sisa Petak Terarsir: <strong>{scaledNum1}</strong> - <strong>{scaledNum2}</strong> = <strong>{resultNumRaw}</strong> / <strong>{commonDen}</strong>
                    </span>
                  )}
                  {operator === '÷' && (
                    <span>
                      Hasil Pembagian = <strong>{resultNumRaw} / {resultDenRaw}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Detail Langkah Perhitungan Matematis */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Langkah Penyelesaian Matematis
            </h4>

            <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold mb-1">Langkah 1: Soal Awal</span>
                <div className="text-sm font-bold text-slate-800">
                  {num1}/{den1} {operator} {num2}/{den2}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 font-sans block text-[10px] uppercase font-bold mb-1">
                  {operator === '+' || operator === '-' ? 'Langkah 2: Samakan Penyebut (KPK)' : operator === '×' ? 'Langkah 2: Kalikan Langsung' : 'Langkah 2: Balik & Kalikan'}
                </span>
                <div className="text-sm font-bold text-indigo-700">
                  {operator === '+' && `${scaledNum1}/${commonDen} + ${scaledNum2}/${commonDen}`}
                  {operator === '-' && `${scaledNum1}/${commonDen} - ${scaledNum2}/${commonDen}`}
                  {operator === '×' && `(${num1} × ${num2}) / (${den1} × ${den2})`}
                  {operator === '÷' && `(${num1}/${den1}) × (${den2}/${num2})`}
                </div>
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
                <span className="text-emerald-600 font-sans block text-[10px] uppercase font-bold mb-1">Langkah 3: Bentuk Sederhana</span>
                <div className="text-sm font-bold text-emerald-800">
                  {simpleNum}/{simpleDen}
                  {isImproper && (
                    <span className="text-xs text-emerald-700 ml-1.5 font-sans">
                      (atau {wholePart > 0 ? wholePart : ''} {remainderNum}/{simpleDen})
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-600 ml-2 font-normal font-sans">
                    = {(resultNumRaw / resultDenRaw).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode Simulator Konversi Grid 100 Persegi */
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
                  Simulator Konversi Pecahan, Desimal &amp; Persen
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Geser slider persen untuk melihat langsung representasi 100 petak persegi (Grid 10x10) beserta perubahan bentuknya.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-bold">Pilihan Cepat:</span>
                {[25, 50, 75, 20, 40, 80, 100].map(val => (
                  <button
                    key={val}
                    onClick={() => setPercentVal(val)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all ${
                      percentVal === val
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Slider */}
            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nilai Persentase: <span className="text-emerald-700 text-sm font-mono">{percentVal}%</span>
                </label>
                <span className="text-xs font-mono text-slate-500">{percentVal} petak dari 100 petak</span>
              </div>
              <input 
                type="range" min="0" max="100" value={percentVal}
                onChange={(e) => setPercentVal(parseInt(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Grid 100 Persegi & Kartu Konversi */}
            <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-center">
              {/* 10x10 Grid Persegi */}
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 border-2 border-slate-800 rounded-xl p-1 bg-slate-50 grid grid-cols-10 grid-rows-10 gap-0.5 shadow-md">
                  {Array.from({ length: 100 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-[2px] transition-all duration-150 ${
                        idx < percentVal
                          ? 'bg-emerald-500 shadow-sm'
                          : 'bg-white border border-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-500 mt-2">
                  Model 100 Petak Persegi Satuan
                </span>
              </div>

              {/* 3 Kartu Representasi Ekuivalen */}
              <div className="grid sm:grid-cols-3 gap-4">
                {/* 1. Bentuk Pecahan */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    1. Pecahan Biasa
                  </span>
                  <div className="my-3 text-2xl font-bold font-mono text-emerald-700">
                    {percentVal === 0 ? '0' : `${percentVal / gcd(percentVal, 100)} / ${100 / gcd(percentVal, 100)}`}
                  </div>
                  <div className="text-[11px] text-slate-600 border-t border-emerald-200 pt-2 font-mono">
                    {percentVal}/100 ➔ disederhanakan
                  </div>
                </div>

                {/* 2. Bentuk Desimal */}
                <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                    2. Pecahan Desimal
                  </span>
                  <div className="my-3 text-2xl font-bold font-mono text-sky-700">
                    {(percentVal / 100).toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-[11px] text-slate-600 border-t border-sky-200 pt-2 font-mono">
                    {percentVal} ÷ 100
                  </div>
                </div>

                {/* 3. Bentuk Persen */}
                <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    3. Bentuk Persen (%)
                  </span>
                  <div className="my-3 text-2xl font-bold font-mono text-purple-700">
                    {percentVal}%
                  </div>
                  <div className="text-[11px] text-slate-600 border-t border-purple-200 pt-2 font-mono">
                    {percentVal} perseratus
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
