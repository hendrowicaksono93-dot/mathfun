import React from 'react';
import { 
  Divide, CheckCircle2, ArrowRight, ArrowLeftRight, Sparkles, 
  HelpCircle, BookOpen, Layers, Lightbulb, Check, AlertCircle, Percent
} from 'lucide-react';

export function BRKonsepContent() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Divide className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">Mengenal Bilangan Rasional</h2>
        </div>
        <p className="text-emerald-50 text-sm leading-relaxed">
          Bilangan rasional adalah fondasi utama matematika dalam mengukur bagian dari suatu kesatuan. Kata &ldquo;rasional&rdquo; berasal dari kata &ldquo;rasio&rdquo; yang berarti perbandingan.
        </p>
      </div>

      {/* Definisi Matematis */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          Definisi Bilangan Rasional
        </h3>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-slate-700">
          <p className="text-sm font-medium leading-relaxed">
            <strong>Bilangan Rasional</strong> adalah bilangan yang <strong>dapat dinyatakan</strong> dalam bentuk pecahan:
          </p>
          <div className="my-3 text-center">
            <span className="inline-block bg-white px-6 py-2 rounded-lg border border-emerald-300 font-mono text-lg font-bold text-emerald-700 shadow-sm">
              a / b &nbsp;&nbsp;(atau &nbsp;<sup>a</sup>/<sub>b</sub>)
            </span>
          </div>
          <p className="text-xs text-slate-600 text-center">
            Dengan syarat: <strong>a</strong> dan <strong>b</strong> adalah bilangan bulat, serta <strong>b ≠ 0</strong> (penyebut tidak boleh nol).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">Unsur Pecahan:</h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li><strong>a (Pembilang / Numerator)</strong>: Menunjukkan berapa bagian yang diambil/dimiliki.</li>
              <li><strong>b (Penyebut / Denominator)</strong>: Menunjukkan jumlah seluruh bagian yang sama besar dalam satu kesatuan utuh.</li>
            </ul>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Mengapa b ≠ 0?
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              Karena pembagian dengan angka nol <strong>tidak terdefinisi</strong> dalam matematika. Kamu tidak bisa membagi kue menjadi 0 bagian yang nyata.
            </p>
          </div>
        </div>
      </div>

      {/* Bentuk-Bentuk Bilangan Rasional */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          Bentuk-Bentuk Bilangan Rasional
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-emerald-300 transition-all">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded uppercase">Bentuk 1</span>
            <h4 className="font-bold text-slate-800 text-sm mt-2">Pecahan Biasa</h4>
            <p className="text-xs text-slate-500 mt-1">Pembilang & penyebut berupa bilangan bulat.</p>
            <div className="mt-3 bg-white p-2 rounded text-center font-mono font-bold text-blue-600 text-sm border border-slate-200">
              1/2, 3/4, 7/5, -2/3
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-emerald-300 transition-all">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded uppercase">Bentuk 2</span>
            <h4 className="font-bold text-slate-800 text-sm mt-2">Pecahan Campuran</h4>
            <p className="text-xs text-slate-500 mt-1">Gabungan bilangan bulat utuh dan pecahan murni.</p>
            <div className="mt-3 bg-white p-2 rounded text-center font-mono font-bold text-indigo-600 text-sm border border-slate-200">
              1 1/2, 2 3/4, -3 1/5
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-emerald-300 transition-all">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded uppercase">Bentuk 3</span>
            <h4 className="font-bold text-slate-800 text-sm mt-2">Pecahan Desimal</h4>
            <p className="text-xs text-slate-500 mt-1">Desimal berhingga atau desimal berulang teratur.</p>
            <div className="mt-3 bg-white p-2 rounded text-center font-mono font-bold text-emerald-600 text-sm border border-slate-200">
              0,5; 0,75; 0,333...
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-emerald-300 transition-all">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 font-bold text-[10px] rounded uppercase">Bentuk 4</span>
            <h4 className="font-bold text-slate-800 text-sm mt-2">Bentuk Persen (%)</h4>
            <p className="text-xs text-slate-500 mt-1">Pecahan dengan penyebut seratus (perseratus).</p>
            <div className="mt-3 bg-white p-2 rounded text-center font-mono font-bold text-purple-600 text-sm border border-slate-200">
              25%, 50%, 75%, 100%
            </div>
          </div>
        </div>
      </div>

      {/* Menyederhanakan Pecahan */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Kunci Sukses: Menyederhanakan Pecahan
        </h3>
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Pecahan senilai disederhanakan dengan membagi pembilang dan penyebut dengan <strong>FPB (Faktor Persekutuan Terbesar)</strong> hingga tidak bisa dibagi lagi.
        </p>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 flex items-center justify-center gap-3">
          <span>12 / 18</span>
          <span className="text-slate-400">➔ (Bagi FPB yaitu 6) ➔</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded border border-emerald-200">2 / 3</span>
        </div>
      </div>
    </div>
  );
}

export function BRKonversiContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
            Mengubah Pecahan, Desimal, dan Persen
          </h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Panduan Lengkap 2-Arah
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Setiap bilangan rasional dapat dinyatakan dalam 3 bentuk representasi yang saling ekuivalen: <strong>Pecahan Biasa</strong>, <strong>Desimal</strong>, dan <strong>Persen</strong>. Berikut cara mudah mengubahnya bolak-balik:
        </p>
      </div>

      {/* Modul 1: Pecahan <-> Desimal */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-700">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <h3 className="font-bold text-sm">1. Pecahan ⇄ Desimal</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Pecahan -> Desimal */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <h4 className="font-bold text-xs text-indigo-900 mb-2 flex items-center justify-between">
              <span>A. Pecahan ➔ Desimal</span>
              <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">Bagi / Ubah Penyebut</span>
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              <strong>Cara 1 (Penyebut 10, 100, 1000):</strong> Kalikan pembilang & penyebut agar penyebut menjadi 10, 100, atau 1000.
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-indigo-200 font-mono text-xs text-slate-800 space-y-1 mb-3">
              <div>3/4 = (3 × 25) / (4 × 25) = 75/100 = <strong>0,75</strong></div>
              <div>3/5 = (3 × 2) / (5 × 2) = 6/10 = <strong>0,6</strong></div>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              <strong>Cara 2 (Porogapit / Pembagian Bersusun):</strong> Bagi pembilang dengan penyebut.
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-indigo-200 font-mono text-xs text-slate-800">
              1/8 = 1 ÷ 8 = <strong>0,125</strong>
            </div>
          </div>

          {/* Desimal -> Pecahan */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <h4 className="font-bold text-xs text-indigo-900 mb-2 flex items-center justify-between">
              <span>B. Desimal ➔ Pecahan</span>
              <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">Hitung Angka Koma</span>
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              Hitung jumlah angka di belakang tanda koma:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 mb-3 list-disc list-inside">
              <li>1 angka belakang koma = per <strong>10</strong></li>
              <li>2 angka belakang koma = per <strong>100</strong></li>
              <li>3 angka belakang koma = per <strong>1000</strong></li>
            </ul>
            <p className="text-xs text-slate-600 mb-2">Lalu sederhanakan dengan membagi FPB:</p>
            <div className="bg-white p-2.5 rounded-lg border border-indigo-200 font-mono text-xs text-slate-800 space-y-1">
              <div>0,65 = 65/100 = (65÷5) / (100÷5) = <strong>13/20</strong></div>
              <div>0,375 = 375/1000 = (375÷125) / (1000÷125) = <strong>3/8</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modul 2: Pecahan <-> Persen */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-700">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <h3 className="font-bold text-sm">2. Pecahan ⇄ Persen (%)</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Pecahan -> Persen */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
            <h4 className="font-bold text-xs text-emerald-900 mb-2 flex items-center justify-between">
              <span>A. Pecahan ➔ Persen</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">× 100%</span>
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              Kalikan pecahan dengan <strong>100%</strong>:
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200 font-mono text-xs text-slate-800 space-y-1.5">
              <div>3/5 × 100% = (3 × 100) / 5 % = 300/5 % = <strong>60%</strong></div>
              <div>7/20 × 100% = 7 × 5 % = <strong>35%</strong></div>
              <div>1 1/4 × 100% = 5/4 × 100% = <strong>125%</strong></div>
            </div>
          </div>

          {/* Persen -> Pecahan */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
            <h4 className="font-bold text-xs text-emerald-900 mb-2 flex items-center justify-between">
              <span>B. Persen ➔ Pecahan</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">Tulis / 100</span>
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              Tulis bilangan persen sebagai <strong>per 100</strong>, lalu sederhanakan:
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200 font-mono text-xs text-slate-800 space-y-1.5">
              <div>45% = 45/100 = (45÷5) / (100÷5) = <strong>9/20</strong></div>
              <div>80% = 80/100 = (80÷20) / (100÷20) = <strong>4/5</strong></div>
              <div>12,5% = 12,5/100 = 125/1000 = <strong>1/8</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modul 3: Desimal <-> Persen */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-purple-700">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          <h3 className="font-bold text-sm">3. Desimal ⇄ Persen (%)</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
            <h4 className="font-bold text-xs text-purple-900 mb-2">Desimal ➔ Persen</h4>
            <p className="text-xs text-slate-600 mb-2">
              <strong>Trik Cepat:</strong> Geser tanda koma <strong>2 langkah ke KANAN</strong> (atau dikali 100%).
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-purple-200 font-mono text-xs text-slate-800 space-y-1">
              <div>0,45 ➔ <strong>45%</strong></div>
              <div>0,085 ➔ <strong>8,5%</strong></div>
              <div>1,75 ➔ <strong>175%</strong></div>
            </div>
          </div>

          <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
            <h4 className="font-bold text-xs text-purple-900 mb-2">Persen ➔ Desimal</h4>
            <p className="text-xs text-slate-600 mb-2">
              <strong>Trik Cepat:</strong> Geser tanda koma <strong>2 langkah ke KIRI</strong> (atau dibagi 100).
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-purple-200 font-mono text-xs text-slate-800 space-y-1">
              <div>65% ➔ <strong>0,65</strong></div>
              <div>7% ➔ <strong>0,07</strong></div>
              <div>120% ➔ <strong>1,2</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Konversi Populer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Tabel Bilangan Rasional Istimewa (Wajib Diingat!)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left bg-white rounded-lg border border-slate-200 overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-2.5 border-b">Pecahan Biasa</th>
                <th className="p-2.5 border-b">Desimal</th>
                <th className="p-2.5 border-b">Persen</th>
                <th className="p-2.5 border-b">Pecahan Biasa</th>
                <th className="p-2.5 border-b">Desimal</th>
                <th className="p-2.5 border-b">Persen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              <tr>
                <td className="p-2.5 font-bold text-emerald-700">1/2</td>
                <td className="p-2.5">0,5</td>
                <td className="p-2.5">50%</td>
                <td className="p-2.5 font-bold text-emerald-700">1/5</td>
                <td className="p-2.5">0,2</td>
                <td className="p-2.5">20%</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-2.5 font-bold text-emerald-700">1/4</td>
                <td className="p-2.5">0,25</td>
                <td className="p-2.5">25%</td>
                <td className="p-2.5 font-bold text-emerald-700">2/5</td>
                <td className="p-2.5">0,4</td>
                <td className="p-2.5">40%</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-emerald-700">3/4</td>
                <td className="p-2.5">0,75</td>
                <td className="p-2.5">75%</td>
                <td className="p-2.5 font-bold text-emerald-700">3/5</td>
                <td className="p-2.5">0,6</td>
                <td className="p-2.5">60%</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-2.5 font-bold text-emerald-700">1/8</td>
                <td className="p-2.5">0,125</td>
                <td className="p-2.5">12,5%</td>
                <td className="p-2.5 font-bold text-emerald-700">4/5</td>
                <td className="p-2.5">0,8</td>
                <td className="p-2.5">80%</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-emerald-700">3/8</td>
                <td className="p-2.5">0,375</td>
                <td className="p-2.5">37,5%</td>
                <td className="p-2.5 font-bold text-emerald-700">1/3</td>
                <td className="p-2.5">0,333...</td>
                <td className="p-2.5">33,33%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function BROperasiContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Operasi Hitung Pecahan &amp; Contoh Soal Lengkap</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Berikut adalah 4 operasi dasar pada bilangan pecahan rasional, lengkap dengan rumus, trik pengerjaan, dan contoh soal bertahap beserta cara penyelesaiannya.
        </p>
      </div>

      {/* 1. PENJUMLAHAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-blue-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">+</span>
            1. Operasi Penjumlahan Pecahan
          </h3>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            KPK Penyebut
          </span>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-2">
          <p><strong>Aturan Dasar:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Jika <strong>penyebut sudah sama</strong>: Langsung jumlahkan pembilangnya: <code className="bg-white px-1.5 py-0.5 rounded border">a/c + b/c = (a+b)/c</code></li>
            <li>Jika <strong>penyebut berbeda</strong>: Samakan penyebut terlebih dahulu menggunakan <strong>KPK</strong> dari kedua penyebut!</li>
          </ul>
        </div>

        {/* Contoh Soal Penjumlahan */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-slate-700">Contoh Soal Penjumlahan:</span>
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">Soal 1</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800">
            Tentukan hasil dari penjumlahan: <span className="font-mono text-blue-700 text-sm">2/3 + 1/4 = ...</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 space-y-1.5">
            <p className="font-bold text-emerald-900">Cara Mengerjakan (Langkah demi Langkah):</p>
            <p><strong>Langkah 1 (Cari KPK):</strong> Penyebut adalah 3 dan 4. KPK dari 3 dan 4 adalah <strong>12</strong>.</p>
            <p><strong>Langkah 2 (Samakan Pecahan):</strong></p>
            <div className="font-mono pl-4 space-y-0.5">
              <div>• 2/3 = (2 × 4) / (3 × 4) = <strong>8/12</strong></div>
              <div>• 1/4 = (1 × 3) / (4 × 3) = <strong>3/12</strong></div>
            </div>
            <p><strong>Langkah 3 (Jumlahkan Pembilang):</strong></p>
            <div className="font-mono pl-4 font-bold text-emerald-800">
              8/12 + 3/12 = (8 + 3) / 12 = <strong>11/12</strong>
            </div>
            <p className="pt-1 text-[11px] text-emerald-800 font-medium">✓ Jadi, hasil dari 2/3 + 1/4 adalah <strong>11/12</strong>.</p>
          </div>
        </div>
      </div>

      {/* 2. PENGURANGAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-rose-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">-</span>
            2. Operasi Pengurangan Pecahan
          </h3>
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            KPK Penyebut
          </span>
        </div>

        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 text-xs text-slate-700 space-y-2">
          <p><strong>Aturan Dasar:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Sama seperti penjumlahan, jika penyebut berbeda, cari <strong>KPK</strong> penyebutnya lebih dulu, baru kurangkan pembilangnya: <code className="bg-white px-1.5 py-0.5 rounded border">a/c - b/c = (a-b)/c</code></li>
          </ul>
        </div>

        {/* Contoh Soal Pengurangan */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-slate-700">Contoh Soal Pengurangan:</span>
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">Soal 2</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800">
            Hitunglah nilai dari: <span className="font-mono text-rose-700 text-sm">5/6 - 3/8 = ...</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 space-y-1.5">
            <p className="font-bold text-emerald-900">Cara Mengerjakan (Langkah demi Langkah):</p>
            <p><strong>Langkah 1 (Cari KPK):</strong> Penyebut adalah 6 dan 8. KPK dari 6 dan 8 adalah <strong>24</strong>.</p>
            <p><strong>Langkah 2 (Ubah Pecahan):</strong></p>
            <div className="font-mono pl-4 space-y-0.5">
              <div>• 5/6 = (5 × 4) / (6 × 4) = <strong>20/24</strong></div>
              <div>• 3/8 = (3 × 3) / (8 × 3) = <strong>9/24</strong></div>
            </div>
            <p><strong>Langkah 3 (Kurangkan Pembilang):</strong></p>
            <div className="font-mono pl-4 font-bold text-emerald-800">
              20/24 - 9/24 = (20 - 9) / 24 = <strong>11/24</strong>
            </div>
            <p className="pt-1 text-[11px] text-emerald-800 font-medium">✓ Jadi, hasil dari 5/6 - 3/8 adalah <strong>11/24</strong>.</p>
          </div>
        </div>
      </div>

      {/* 3. PERKALIAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-amber-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">×</span>
            3. Operasi Perkalian Pecahan
          </h3>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Atas × Atas, Bawah × Bawah
          </span>
        </div>

        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-xs text-slate-700 space-y-2">
          <p><strong>Aturan Emas:</strong></p>
          <p className="font-mono font-bold text-amber-900 bg-white p-2 rounded border border-amber-200 text-center">
            (a / b) × (c / d) = (a × c) / (b × d)
          </p>
          <p className="text-slate-600">
            <strong>Tidak perlu menyamakan penyebut!</strong> Langsung kalikan pembilang dengan pembilang, dan penyebut dengan penyebut. Sederhanakan angka terlebih dahulu jika ada yang bisa dibagi (sistem coret silang).
          </p>
        </div>

        {/* Contoh Soal Perkalian */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-slate-700">Contoh Soal Perkalian:</span>
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">Soal 3</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800">
            Tentukan hasil perkalian dari: <span className="font-mono text-amber-700 text-sm">3/4 × 8/9 = ...</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 space-y-1.5">
            <p className="font-bold text-emerald-900">Cara Mengerjakan:</p>
            <p><strong>Metode 1 (Sederhanakan / Coret Silang):</strong></p>
            <div className="font-mono pl-4 space-y-0.5">
              <div>• Angka 3 dan 9 sama-sama dibagi 3 (menjadi <strong>1</strong> dan <strong>3</strong>).</div>
              <div>• Angka 8 dan 4 sama-sama dibagi 4 (menjadi <strong>2</strong> dan <strong>1</strong>).</div>
              <div>• Hasil = (1 × 2) / (1 × 3) = <strong>2/3</strong></div>
            </div>
            <p className="mt-2"><strong>Metode 2 (Kalikan Langsung lalu Sederhanakan):</strong></p>
            <div className="font-mono pl-4">
              (3 × 8) / (4 × 9) = 24/36 = (24÷12) / (36÷12) = <strong>2/3</strong>
            </div>
            <p className="pt-1 text-[11px] text-emerald-800 font-medium">✓ Hasil paling sederhananya adalah <strong>2/3</strong>.</p>
          </div>
        </div>
      </div>

      {/* 4. PEMBAGIAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-purple-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">÷</span>
            4. Operasi Pembagian Pecahan
          </h3>
          <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            Balik &amp; Kalikan
          </span>
        </div>

        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 text-xs text-slate-700 space-y-2">
          <p><strong>Prinsip Perkalian dengan Kebalikan (Resiprokal):</strong></p>
          <p className="font-mono font-bold text-purple-900 bg-white p-2 rounded border border-purple-200 text-center">
            (a / b) ÷ (c / d) = (a / b) × (d / c) = (a × d) / (b × c)
          </p>
          <p className="text-slate-600">
            Membagi dengan suatu pecahan sama artinya dengan <strong>mengalikan dengan kebalikan</strong> dari pecahan pembaginya!
          </p>
        </div>

        {/* Contoh Soal Pembagian */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-slate-700">Contoh Soal Pembagian:</span>
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">Soal 4</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800">
            Berapakah hasil dari: <span className="font-mono text-purple-700 text-sm">4/7 ÷ 8/21 = ...</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 space-y-1.5">
            <p className="font-bold text-emerald-900">Cara Mengerjakan:</p>
            <p><strong>Langkah 1 (Balikkan Pecahan Kedua &amp; Ubah ke Perkalian):</strong></p>
            <div className="font-mono pl-4 font-bold text-purple-800">
              4/7 ÷ 8/21 = 4/7 × 21/8
            </div>
            <p><strong>Langkah 2 (Sederhanakan dengan Coret Silang):</strong></p>
            <div className="font-mono pl-4 space-y-0.5">
              <div>• Angka 4 dan 8 sama-sama dibagi 4 (menjadi <strong>1</strong> dan <strong>2</strong>).</div>
              <div>• Angka 21 dan 7 sama-sama dibagi 7 (menjadi <strong>3</strong> dan <strong>1</strong>).</div>
            </div>
            <p><strong>Langkah 3 (Hitung Hasil Akhir):</strong></p>
            <div className="font-mono pl-4 font-bold text-emerald-800">
              (1 × 3) / (1 × 2) = 3/2 = 1 1/2
            </div>
            <p className="pt-1 text-[11px] text-emerald-800 font-medium">✓ Jadi, hasil dari 4/7 ÷ 8/21 adalah <strong>3/2</strong> atau <strong>1 1/2</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BRPenerapanContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Penerapan Bilangan Rasional dalam Kehidupan Nyata</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Dalam kehidupan sehari-hari, kita sering menggunakan pecahan, desimal, dan persen saat memasak, mengukur, membagi benda, atau berbelanja.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Kasus 1: Resep Masakan */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="p-1.5 bg-emerald-100 rounded-lg font-bold text-xs">🥘 Kasus 1</span>
            <h3 className="font-bold text-sm text-slate-800">Takaran Resep Masakan</h3>
          </div>
          <p className="text-xs text-slate-600">
            Ibu membutuhkan <strong>3/4 kg</strong> gula pasir untuk membuat 1 loyang kue. Jika Ibu ingin membuat <strong>4 loyang kue</strong>, berapa kg gula pasir yang dibutuhkan?
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
            <p className="font-bold text-emerald-700">Penyelesaian:</p>
            <p>Total Gula = 4 × 3/4 kg</p>
            <p>Total Gula = (4 × 3) / 4 = 12/4 = <strong>3 kg</strong></p>
          </div>
        </div>

        {/* Kasus 2: Potongan Pita */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <span className="p-1.5 bg-blue-100 rounded-lg font-bold text-xs">✂️ Kasus 2</span>
            <h3 className="font-bold text-sm text-slate-800">Pembagian Panjang Pita</h3>
          </div>
          <p className="text-xs text-slate-600">
            Dina memiliki pita sepanjang <strong>3 1/2 meter</strong>. Pita tersebut dipotong-potong menjadi bagian sama panjang, masing-masing <strong>1/4 meter</strong> untuk hiasan kado. Berapa banyak potongan pita yang diperoleh?
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
            <p className="font-bold text-blue-700">Penyelesaian:</p>
            <p>Banyak Potongan = 3 1/2 ÷ 1/4</p>
            <p>= 7/2 ÷ 1/4 = 7/2 × 4/1 = 28/2 = <strong>14 buah pita</strong></p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-xs text-emerald-900">
        <h4 className="font-bold text-sm text-emerald-800 mb-2 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Tips Menyelesaikan Soal Cerita Pecahan:
        </h4>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
          <li><strong>Identifikasi kata kunci:</strong> &ldquo;ditambah/membeli lagi&rdquo; (Penjumlahan), &ldquo;digunakan/sisa/selisih&rdquo; (Pengurangan), &ldquo;kelipatan/tiap bagian&rdquo; (Perkalian), &ldquo;dipotong sama rata/dibagi ke sejumlah orang&rdquo; (Pembagian).</li>
          <li><strong>Ubah semua bilangan ke bentuk yang sama</strong> (misal sama-sama pecahan biasa) sebelum melakukan operasi hitung.</li>
          <li><strong>Sederhanakan hasil akhir</strong> ke bentuk pecahan paling sederhana atau pecahan campuran jika pembilang lebih besar dari penyebut.</li>
        </ol>
      </div>
    </div>
  );
}
