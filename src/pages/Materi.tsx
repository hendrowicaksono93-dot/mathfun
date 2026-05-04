import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { topics } from '../lib/topics';

// Reusing lucide-react icons
import { Puzzle, PenTool, Brackets, Calculator, Variable, Scaling, ThermometerSnowflake, Waves, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Materi() {
  const { topicId } = useParams();
  const currentTopic = topics.find(t => t.id === topicId) || topics[0];

  const aljabarTabs = [
    { id: 'pengertian', label: 'Unsur Aljabar' },
    { id: 'sifat', label: 'Suku Sejenis' },
    { id: 'operasi', label: 'Operasi Hitung' },
    { id: 'penerapan', label: 'Penerapan' }
  ];

  const bilanganBulatTabs = [
    { id: 'pengertian-bb', label: 'Pengertian & Garis Bilangan' },
    { id: 'operasi-dasar-bb', label: 'Penjumlahan & Pengurangan' },
    { id: 'operasi-lanjut-bb', label: 'Perkalian & Pembagian' },
    { id: 'penerapan-bb', label: 'Penerapan' }
  ];

  const plsvTabs = [
    { id: 'kalimat-plsv', label: 'Kalimat Terbuka & Tertutup' },
    { id: 'pengertian-plsv', label: 'Persamaan Linear' },
    { id: 'pengertian-ptlsv', label: 'Pertidaksamaan Linear' },
    { id: 'penyelesaian-plsv', label: 'Penyelesaian' }
  ];

  const aritmatikaSosialTabs = [
    { id: 'untung-rugi', label: 'Untung & Rugi' },
    { id: 'diskon-pajak', label: 'Diskon & Pajak' },
    { id: 'bruto-tara-netto', label: 'Bruto, Tara & Netto' },
    { id: 'bunga-tunggal', label: 'Bunga Tunggal' }
  ];

  const perbandinganTabs = [
    { id: 'pengertian-skala', label: 'Pengertian & Skala' },
    { id: 'perbandingan-senilai', label: 'Senilai' },
    { id: 'perbandingan-berbalik', label: 'Berbalik Nilai' }
  ];

  const unsurGeometriTabs = [
    { id: 'titik-garis-bidang', label: 'Titik, Garis & Bidang' },
    { id: 'kedudukan-garis', label: 'Kedudukan Garis' },
    { id: 'sudut-jenis', label: 'Sudut & Jenisnya' },
    { id: 'hubungan-sudut', label: 'Hubungan Antarsudut' }
  ];

  const pythagorasTabs = [
    { id: 'teorema', label: 'Teorema Pythagoras' },
    { id: 'tripel', label: 'Tripel Pythagoras' },
    { id: 'aplikasi-pythagoras', label: 'Penerapan' }
  ];

  const bangunDatarTabs = [
    { id: 'segitiga', label: 'Segitiga' },
    { id: 'segiempat', label: 'Segiempat' },
    { id: 'keliling-luas', label: 'Keliling & Luas' }
  ];

  const statistikaTabs = [
    { id: 'pengumpulan', label: 'Pengumpulan Data' },
    { id: 'pemusatan', label: 'Ukuran Pemusatan' },
    { id: 'penyebaran', label: 'Ukuran Penyebaran' },
    { id: 'penyajian', label: 'Penyajian Data' }
  ];
  const menyederhanakanAljabarTabs = [
    { id: 'konsep-aljabar', label: 'Suku Sejenis' },
    { id: 'operasi-aljabar', label: 'Penyederhanaan' },
    { id: 'model-aljabar', label: 'Model Aljabar' },
    { id: 'penerapan-aljabar', label: 'Penerapan' }
  ];
  const himpunanTabs = [
    { id: 'konsep-himpunan', label: 'Konsep Dasar' },
    { id: 'penyajian-himpunan', label: 'Penyajian' },
    { id: 'operasi-himpunan', label: 'Operasi' },
    { id: 'diagram-venn', label: 'Diagram Venn' }
  ];
  const relasiFungsiTabs = [
    { id: 'konsep-relasi', label: 'Konsep Relasi' },
    { id: 'konsep-fungsi', label: 'Konsep Fungsi' },
    { id: 'penyajian-relasi', label: 'Penyajian' },
    { id: 'nilai-fungsi', label: 'Nilai Fungsi' }
  ];
  const persamaanGarisLurusTabs = [
    { id: 'bentuk-umum-pgl', label: 'Bentuk Umum' },
    { id: 'gradien-pgl', label: 'Gradien' },
    { id: 'grafik-pgl', label: 'Grafik Garis' },
    { id: 'menentukan-pgl', label: 'Menentukan PGL' }
  ];
  const bangunRuangSisiDatarTabs = [
    { id: 'kubus-balok', label: 'Kubus & Balok' },
    { id: 'prisma-limas', label: 'Prisma & Limas' },
    { id: 'rumus-brsd', label: 'Luas & Volume' }
  ];
  const barisanDeretTabs = [
    { id: 'pola-bilangan', label: 'Pola Bilangan' },
    { id: 'barisan-aritmatika', label: 'Barisan Aritmatika' },
    { id: 'deret-aritmatika', label: 'Deret Aritmatika' },
    { id: 'barisan-geometri', label: 'Barisan Geometri' },
    { id: 'deret-geometri', label: 'Deret Geometri' }
  ];
  const lingkaranTabs = [
    { id: 'unsur-lingkaran', label: 'Unsur Lingkaran' },
    { id: 'keliling-luas', label: 'Keliling & Luas' },
    { id: 'busur-juring', label: 'Busur & Juring' },
    { id: 'sudut-lingkaran', label: 'Sudut Pusat & Keliling' },
    { id: 'garis-singgung', label: 'Garis Singgung' }
  ];
  const spldvTabs = [
    { id: 'konsep-spldv', label: 'Konsep & Bentuk Umum' },
    { id: 'metode-grafik', label: 'Metode Grafik' },
    { id: 'metode-substitusi', label: 'Metode Substitusi' },
    { id: 'metode-eliminasi', label: 'Metode Eliminasi' },
    { id: 'model-matematika', label: 'Model Matematika' }
  ];
  const geometriKesebangunanTabs = [
    { id: 'konsep-dasar', label: 'Konsep Dasar' },
    { id: 'kekongruenan', label: 'Kekongruenan' },
    { id: 'kesebangunan', label: 'Kesebangunan' },
    { id: 'segitiga-khusus', label: 'Segitiga Khusus' },
    { id: 'solusi-masalah', label: 'Langkah Solusi' }
  ];
  const bangunRuangSisiLengkungTabs = [
    { id: 'tabung', label: 'Tabung' },
    { id: 'kerucut', label: 'Kerucut' },
    { id: 'bola', label: 'Bola' },
    { id: 'brsl-ringkasan', label: 'Ringkasan Rumus' }
  ];
  const transformasiGeometriTabs = [
    { id: 'translasi', label: 'Translasi' },
    { id: 'refleksi', label: 'Refleksi' },
    { id: 'rotasi', label: 'Rotasi' },
    { id: 'dilatasi', label: 'Dilatasi' }
  ];
  const peluangTabs = [
    { id: 'konsep-peluang', label: 'Konsep & Istilah' },
    { id: 'ruang-sampel', label: 'Ruang Sampel' },
    { id: 'peluang-teoritis', label: 'Peluang Teoritis' },
    { id: 'peluang-empiris', label: 'Peluang Empiris' },
    { id: 'frekuensi-harapan', label: 'Frekuensi Harapan' }
  ];

  let tabs = bilanganBulatTabs;
  let desc = "Mengenal konsep dasar matematika";

  switch(currentTopic.id) {
    case 'aljabar': tabs = aljabarTabs; desc = "Konsep dasar, unsur-unsur, susunan, dan operasi hitung"; break;
    case 'plsv-ptlsv': tabs = plsvTabs; desc = "Memahami keseimbangan persamaan dan pertidaksamaan"; break;
    case 'aritmatika-sosial': tabs = aritmatikaSosialTabs; desc = "Penerapan matematika dalam kegiatan ekonomi sehari-hari"; break;
    case 'perbandingan': tabs = perbandinganTabs; desc = "Membandingkan dua besaran dan aplikasinya"; break;
    case 'unsur-geometri': tabs = unsurGeometriTabs; desc = "Mengenal titik, garis, dan sudut"; break;
    case 'pythagoras': tabs = pythagorasTabs; desc = "Hubungan panjang sisi pada segitiga siku-siku"; break;
    case 'bangun-datar': tabs = bangunDatarTabs; desc = "Sifat, keliling, dan luas segitiga serta segiempat"; break;
    case 'statistika': tabs = statistikaTabs; desc = "Pengumpulan, pengolahan, dan penyajian data"; break;
    case 'menyederhanakan-aljabar': tabs = menyederhanakanAljabarTabs; desc = "Menyederhanakan suku-suku sejenis pada aljabar"; break;
    case 'himpunan': tabs = himpunanTabs; desc = "Konsep himpunan dan operasi antar himpunan"; break;
    case 'relasi-fungsi': tabs = relasiFungsiTabs; desc = "Hubungan dan pemetaan antar himpunan"; break;
    case 'persamaan-garis-lurus': tabs = persamaanGarisLurusTabs; desc = "Gradien dan persamaan garis lurus"; break;
    case 'bangun-ruang-sisi-datar': tabs = bangunRuangSisiDatarTabs; desc = "Kubus, balok, prisma, dan limas"; break;
    case 'barisan-deret': tabs = barisanDeretTabs; desc = "Pola bilangan, barisan, dan deret"; break;
    case 'lingkaran': tabs = lingkaranTabs; desc = "Keliling, luas, dan unsur-unsur lingkaran"; break;
    case 'spldv': tabs = spldvTabs; desc = "Sistem Persamaan Linear Dua Variabel"; break;
    case 'geometri-kesebangunan': tabs = geometriKesebangunanTabs; desc = "Kesebangunan dan kekongruenan bangun datar"; break;
    case 'bangun-ruang-sisi-lengkung': tabs = bangunRuangSisiLengkungTabs; desc = "Tabung, kerucut, dan bola"; break;
    case 'transformasi-geometri': tabs = transformasiGeometriTabs; desc = "Translasi, rotasi, refleksi, dan dilatasi"; break;
    case 'peluang': tabs = peluangTabs; desc = "Peluang kejadian saling lepas dan bebas"; break;
    default: tabs = bilanganBulatTabs; desc = "Mengenal bilangan positif, negatif, dan operasinya dalam kehidupan"; break;
  }
  
  // Need to make sure activeTab is valid for the current topic when switching topics
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // If topic changed but activeTab is from old topic, force reset
  if (!tabs.find(t => t.id === activeTab)) {
    setActiveTab(tabs[0].id);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Materi Pembelajaran {currentTopic.name}</h1>
          <p className="text-slate-500 text-sm mt-1">{desc}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          {activeTab === 'pengertian' && <PengertianContent />}
          {activeTab === 'sifat' && <SifatContent />}
          {activeTab === 'operasi' && <OperasiContent />}
          {activeTab === 'penerapan' && <PenerapanContent />}

          {activeTab === 'pengertian-bb' && <BBPengertianContent />}
          {activeTab === 'operasi-dasar-bb' && <BBOperasiDasarContent />}
          {activeTab === 'operasi-lanjut-bb' && <BBOperasiLanjutContent />}
          {activeTab === 'penerapan-bb' && <BBPenerapanContent />}

          {activeTab === 'kalimat-plsv' && <PLSVKalimatContent />}
          {activeTab === 'pengertian-plsv' && <PLSVContent />}
          {activeTab === 'pengertian-ptlsv' && <PtLSVContent />}
          {activeTab === 'penyelesaian-plsv' && <PLSVPenyelesaianContent />}

          {activeTab === 'untung-rugi' && <ASUntungRugiContent />}
          {activeTab === 'diskon-pajak' && <ASDiskonPajakContent />}
          {activeTab === 'bruto-tara-netto' && <ASBrutoTaraNettoContent />}
          {activeTab === 'bunga-tunggal' && <ASBungaTunggalContent />}

          {activeTab === 'pengertian-skala' && <PerbandinganPengertianContent />}
          {activeTab === 'perbandingan-senilai' && <PerbandinganSenilaiContent />}
          {activeTab === 'perbandingan-berbalik' && <PerbandinganBerbalikContent />}

          {activeTab === 'titik-garis-bidang' && <GeoTitikGarisContent />}
          {activeTab === 'kedudukan-garis' && <GeoKedudukanGarisContent />}
          {activeTab === 'sudut-jenis' && <GeoSudutContent />}
          {activeTab === 'hubungan-sudut' && <GeoHubunganSudutContent />}

          {activeTab === 'teorema' && <PythagorasTeoremaContent />}
          {activeTab === 'tripel' && <PythagorasTripelContent />}
          {activeTab === 'aplikasi-pythagoras' && <PythagorasAplikasiContent />}

          {activeTab === 'segitiga' && <BDSegitigaContent />}
          {activeTab === 'segiempat' && <BDSegiempatContent />}
          {activeTab === 'keliling-luas' && <BDKelilingLuasContent />}

          {/* New Topics Content */}
          {activeTab === 'pengumpulan' && <StatPengumpulanContent />}
          {activeTab === 'pemusatan' && <StatPemusatanContent />}
          {activeTab === 'penyebaran' && <StatPenyebaranContent />}
          {activeTab === 'penyajian' && <StatPenyajianContent />}
          {activeTab === 'konsep-aljabar' && <AljabarSukuSejenisContent />}
          {activeTab === 'operasi-aljabar' && <AljabarOperasiPenyederhanaanContent />}
          {activeTab === 'model-aljabar' && <AljabarModelContent />}
          {activeTab === 'penerapan-aljabar' && <AljabarPenerapanContent />}
          {activeTab === 'konsep-himpunan' && <HimpunanKonsepContent />}
          {activeTab === 'penyajian-himpunan' && <HimpunanPenyajianContent />}
          {activeTab === 'operasi-himpunan' && <HimpunanOperasiContent />}
          {activeTab === 'diagram-venn' && <HimpunanDiagramContent />}
          {activeTab === 'konsep-relasi' && <RFKonsepRelasiContent />}
          {activeTab === 'konsep-fungsi' && <RFFungsiContent />}
          {activeTab === 'penyajian-relasi' && <RFPenyajianContent />}
          {activeTab === 'nilai-fungsi' && <RFNilaiFungsiContent />}
          {activeTab === 'bentuk-umum-pgl' && <PGLBentukUmumContent />}
          {activeTab === 'gradien-pgl' && <PGLGradienContent />}
          {activeTab === 'grafik-pgl' && <PGLGrafikContent />}
          {activeTab === 'menentukan-pgl' && <PGLMenentukanContent />}
          {activeTab === 'kubus-balok' && <BRSDKubusBalokContent />}
          {activeTab === 'prisma-limas' && <BRSDPrismaLimasContent />}
          {activeTab === 'rumus-brsd' && <BRSDRumusContent />}
          {activeTab === 'pola-bilangan' && <BDPolaBilanganContent />}
          {activeTab === 'barisan-aritmatika' && <BDBarisanAritmatikaContent />}
          {activeTab === 'deret-aritmatika' && <BDDeretAritmatikaContent />}
          {activeTab === 'barisan-geometri' && <BDBarisanGeometriContent />}
          {activeTab === 'deret-geometri' && <BDDeretGeometriContent />}
          {activeTab === 'unsur-lingkaran' && <LingkaranUnsurContent />}
          {activeTab === 'keliling-luas' && <LingkaranKelilingLuasContent />}
          {activeTab === 'busur-juring' && <LingkaranBusurJuringContent />}
          {activeTab === 'sudut-lingkaran' && <LingkaranSudutContent />}
          {activeTab === 'garis-singgung' && <LingkaranGarisSinggungContent />}
          {activeTab === 'konsep-spldv' && <SPLDVKonsepContent />}
          {activeTab === 'metode-grafik' && <SPLDVGrafikContent />}
          {activeTab === 'metode-substitusi' && <SPLDVSubstitusiContent />}
          {activeTab === 'metode-eliminasi' && <SPLDVEliminasiContent />}
          {activeTab === 'model-matematika' && <SPLDVModelContent />}
          {activeTab === 'konsep-dasar' && <GKKonsepContent />}
          {activeTab === 'kekongruenan' && <GKKongruenContent />}
          {activeTab === 'kesebangunan' && <GKSebangunContent />}
          {activeTab === 'segitiga-khusus' && <GKSegitigaKhususContent />}
          {activeTab === 'solusi-masalah' && <GKSolusiContent />}
          {activeTab === 'tabung' && <BRSLTabungContent />}
          {activeTab === 'kerucut' && <BRSLKerucutContent />}
          {activeTab === 'bola' && <BRSLBolaContent />}
          {activeTab === 'brsl-ringkasan' && <BRSLRingkasanContent />}
          {activeTab === 'translasi' && <TGTranslasiContent />}
          {activeTab === 'refleksi' && <TGRefleksiContent />}
          {activeTab === 'rotasi' && <TGRotasiContent />}
          {activeTab === 'dilatasi' && <TGDilatasiContent />}
          {activeTab === 'konsep-peluang' && <PeluangKonsepContent />}
          {activeTab === 'ruang-sampel' && <PeluangSampelContent />}
          {activeTab === 'peluang-teoritis' && <PeluangTeoritisContent />}
          {activeTab === 'peluang-empiris' && <PeluangEmpirisContent />}
          {activeTab === 'frekuensi-harapan' && <PeluangHarapanContent />}
        </div>
      </div>
    </div>
  );
}

// ================= STATISTIKA COMPONENTS =================
function StatPengumpulanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Teknik Pengumpulan Data</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Sebelum data dapat diolah dan disajikan, kita harus mengumpulkannya terlebih dahulu. 
        Ada beberapa cara atau teknik yang umum digunakan untuk mengumpulkan data, khususnya dalam penelitian sederhana maupun kegiatan sehari-hari.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center rounded-lg text-lg">📝</div>
            <h3 className="font-bold text-slate-800">Kuesioner (Angket)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-2">Mengumpulkan data dengan memberikan daftar pertanyaan tertulis kepada responden.</p>
          <p className="text-xs text-slate-500 italic">Contoh: Membagikan google form untuk menanyakan hobi kepada teman sekelas.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-lg text-lg">🗣️</div>
            <h3 className="font-bold text-slate-800">Wawancara (Interview)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-2">Mengumpulkan data dengan cara tanya jawab secara langsung dengan sumber data (narasumber).</p>
          <p className="text-xs text-slate-500 italic">Contoh: Bertanya langsung kepada Ibu Kantin tentang makanan yang paling laris setiap hari.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-700 flex items-center justify-center rounded-lg text-lg">👁️</div>
            <h3 className="font-bold text-slate-800">Observasi (Pengamatan)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-2">Mengumpulkan data melalui pengamatan dan pencatatan suatu peristiwa secara langsung.</p>
          <p className="text-xs text-slate-500 italic">Contoh: Mengamati dan mencatat berapa banyak sepeda motor yang lewat di depan sekolah selama 15 menit.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center rounded-lg text-lg">📚</div>
            <h3 className="font-bold text-slate-800">Dokumen atau Studi Pustaka</h3>
          </div>
          <p className="text-sm text-slate-600 mb-2">Mengumpulkan data bersumber dari catatan masa lalu, buku, jurnal, daftar hadir, rapor, dll.</p>
          <p className="text-xs text-slate-500 italic">Contoh: Membaca buku absen untuk mencari tahu siapa saja yang lahir di bulan Agustus.</p>
        </div>
      </div>
    </div>
  );
}

function StatPemusatanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Ukuran Pemusatan Data</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Ukuran pemusatan data adalah nilai tunggal yang mewakili suatu kumpulan data dan menunjukkan karakteristik dari kumpulan data tersebut.
        Nilai ini sering disebut sebagai nilai tendensi sentral. Nilai yang paling sering digunakan adalah Mean, Median, dan Modus.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <h3 className="bg-fuchsia-50 font-bold text-fuchsia-800 text-sm p-3 border-b border-fuchsia-100 flex items-center gap-2">
             <span className="bg-fuchsia-200 text-fuchsia-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
             Mean (Rata-rata)
           </h3>
           <div className="p-4 text-sm text-slate-700 space-y-3">
             <p>Rata-rata hitung dari sekumpulan data. Didapatkan dari jumlah seluruh nilai data dibagi dengan banyaknya data.</p>
             <div className="bg-slate-50 p-2 rounded text-center border border-slate-100 font-mono text-xs">
               Mean = Σx / n
             </div>
             <p className="text-xs text-slate-500 italic">Contoh: Data 2, 4, 6 <br/> Mean = (2+4+6)/3 = 4</p>
           </div>
         </div>

         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <h3 className="bg-violet-50 font-bold text-violet-800 text-sm p-3 border-b border-violet-100 flex items-center gap-2">
             <span className="bg-violet-200 text-violet-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
             Median (Nilai Tengah)
           </h3>
           <div className="p-4 text-sm text-slate-700 space-y-3">
             <p>Nilai data yang terletak di tengah setelah data diurutkan dari yang terkecil ke yang terbesar.</p>
             <ul className="text-xs list-disc pl-4 space-y-1 text-slate-600">
               <li>Data ganjil: Ambil nilai tengah persis.</li>
               <li>Data genap: Rata-rata dua nilai di tengah.</li>
             </ul>
             <p className="text-xs text-slate-500 italic">Contoh: 1, 3, 5, 7, 9 <br/> Median = 5</p>
           </div>
         </div>

         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <h3 className="bg-pink-50 font-bold text-pink-800 text-sm p-3 border-b border-pink-100 flex items-center gap-2">
             <span className="bg-pink-200 text-pink-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span> 
             Modus (Nilai Sering)
           </h3>
           <div className="p-4 text-sm text-slate-700 space-y-3">
             <p>Nilai atau datum yang paling sering muncul dalam sekumpulan data (frekuensi tertinggi).</p>
             <p className="text-xs text-slate-600">Satu kelompok data bisa tidak memiliki modus, satu modus (unimodal), dua (bimodal), atau lebih.</p>
             <p className="text-xs text-slate-500 italic">Contoh: 2, 3, 3, 4, 5 <br/> Modus = 3</p>
           </div>
         </div>
      </div>
    </div>
  );
}

function StatPenyebaranContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Ukuran Penyebaran Data</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Ukuran penyebaran data (dispersi) menunjukkan seberapa jauh data-data menyebar dari nilai pusatnya. 
        Hal ini memberitahukan kita seberapa bervariasinya sekumpulan data.
      </p>

      <ul className="space-y-4">
        <li className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 md:items-center">
          <div className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-md font-bold text-sm whitespace-nowrap self-start mt-1">Jangkauan (Range)</div>
          <div className="text-sm text-slate-700">
            <p className="mb-1">Selisih antara nilai datum terbesar (maksimum) dengan nilai datum terkecil (minimum) dalam suatu kumpulan data.</p>
            <p className="font-mono text-xs text-slate-500">Range = X_maks - X_min</p>
          </div>
        </li>
        <li className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 md:items-center">
          <div className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-md font-bold text-sm whitespace-nowrap self-start mt-1">Kuartil</div>
          <div className="text-sm text-slate-700">
            <p className="mb-1">Nilai-nilai yang membagi sekumpulan data yang telah diurutkan menjadi empat bagian yang sama banyak.</p>
            <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1 mt-2">
              <li><strong>Kuartil Bawah (Q1):</strong> Nilai tengah antara datum terkecil dan median.</li>
              <li><strong>Kuartil Tengah (Q2):</strong> Sama dengan Median.</li>
              <li><strong>Kuartil Atas (Q3):</strong> Nilai tengah antara median dan datum terbesar.</li>
            </ul>
          </div>
        </li>
        <li className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 md:items-center">
          <div className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-md font-bold text-sm whitespace-nowrap self-start mt-1">Jangkauan Interkuartil</div>
          <div className="text-sm text-slate-700">
            <p className="mb-1">Selisih antara Kuartil Atas (Q3) dan Kuartil Bawah (Q1). Biasa juga disebut Hamparan (H).</p>
            <p className="font-mono text-xs text-slate-500">H = Q3 - Q1</p>
          </div>
        </li>
        <li className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 md:items-center">
          <div className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-md font-bold text-sm whitespace-nowrap self-start mt-1">Simpangan Kuartil</div>
          <div className="text-sm text-slate-700">
            <p className="mb-1">Setengah dari jangkauan interkuartil. Biasa disebut jangkauan semi interkuartil.</p>
            <p className="font-mono text-xs text-slate-500">Qd = ½(Q3 - Q1)</p>
          </div>
        </li>
      </ul>
    </div>
  );
}

function StatPenyajianContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Penyajian Data</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Data yang telah dikumpulkan perlu disajikan agar mudah dibaca dan dipahami informasinya. 
        Penyajian data umumnya menggunakan tabel atau diagram.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <p className="text-4xl mb-3">📊</p>
            <h3 className="font-bold text-slate-800 text-sm mb-2">Diagram Batang</h3>
            <p className="text-xs text-slate-600">Sangat cocok untuk menggambarkan perbandingan data berupa kategori atau atribut. Batang bisa vertikal atau horizontal.</p>
         </div>
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <p className="text-4xl mb-3">📈</p>
            <h3 className="font-bold text-slate-800 text-sm mb-2">Diagram Garis</h3>
            <p className="text-xs text-slate-600">Sangat cocok untuk menyajikan data terkelompok secara berkesinambungan (kontinu) atau perubahan data dari waktu ke waktu (trend).</p>
         </div>
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <p className="text-4xl mb-3">🥧</p>
            <h3 className="font-bold text-slate-800 text-sm mb-2">Diagram Lingkaran</h3>
            <p className="text-xs text-slate-600">Terbaik untuk menunjukkan perbandingan proporsi atau persentase dari suatu keseluruhan (100% atau 360°).</p>
         </div>
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="font-bold text-slate-800 text-sm mb-2">Tabel Distribusi</h3>
            <p className="text-xs text-slate-600">Menyajikan data yang dikelompokkan ke dalam kategori beserta frekuensi masing-masing angka yang muncul.</p>
         </div>
      </div>
    </div>
  );
}

// ================= ALJABAR COMPONENTS =================
function AljabarSukuSejenisContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Menganalisis Suku Sejenis</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Syarat utama untuk menyederhanakan bentuk aljabar dengan penjumlahan atau pengurangan adalah <strong>suku-sukunya harus sejenis</strong>.
      </p>

      <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
        <h3 className="font-bold text-blue-800 mb-2">Apa itu Suku Sejenis?</h3>
        <p className="text-sm text-blue-700 leading-relaxed mb-4">
          Suku sejenis adalah suku-suku yang memiliki <strong>variabel (huruf) yang sama</strong> dan <strong>pangkat variabel yang sama</strong>. Pangkat variabel sering tersembunyi jika pangkatnya adalah 1 (misalnya x ditulis x^1).
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <h4 className="font-bold text-emerald-600 text-sm mb-2 flex items-center gap-2">✅ Sejenis</h4>
            <ul className="text-sm text-slate-700 space-y-2 list-disc pl-4">
              <li><code className="text-blue-600 font-bold bg-blue-50 px-1 rounded">2x</code> dan <code className="text-blue-600 font-bold bg-blue-50 px-1 rounded">-5x</code> (Sama-sama variabel x berpgkt 1)</li>
              <li><code className="text-blue-600 font-bold bg-blue-50 px-1 rounded">3a²b</code> dan <code className="text-blue-600 font-bold bg-blue-50 px-1 rounded">7a²b</code> (Sama-sama variabel a²b)</li>
              <li><code className="text-blue-600 font-bold bg-blue-50 px-1 rounded">8</code> dan <code className="text-blue-600 font-bold bg-blue-50 px-1 rounded">-2</code> (Konstanta, tidak ada variabel - sejenis)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-rose-100">
            <h4 className="font-bold text-rose-600 text-sm mb-2 flex items-center gap-2">❌ Tidak Sejenis</h4>
            <ul className="text-sm text-slate-700 space-y-2 list-disc pl-4">
              <li><code className="text-rose-600 font-bold bg-rose-50 px-1 rounded">4x</code> dan <code className="text-rose-600 font-bold bg-rose-50 px-1 rounded">4y</code> (Berbeda variabel x dan y)</li>
              <li><code className="text-rose-600 font-bold bg-rose-50 px-1 rounded">2a²</code> dan <code className="text-rose-600 font-bold bg-rose-50 px-1 rounded">5a</code> (Pangkat variabel a berbeda)</li>
              <li><code className="text-rose-600 font-bold bg-rose-50 px-1 rounded">3xy</code> dan <code className="text-rose-600 font-bold bg-rose-50 px-1 rounded">3abc</code> (Variabel sepenuhnya berbeda)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AljabarOperasiPenyederhanaanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Menyederhanakan Bentuk Aljabar</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Jika dua suku atau lebih merupakan <strong>suku sejenis</strong>, maka kita cukup menjumlahkan atau mengurangkan <strong>koefisiennya</strong> saja, sementara variabelnya tetap.
      </p>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
            <h3 className="font-bold text-amber-800 text-sm">Contoh 1: Penjumlahan Sederhana</h3>
          </div>
          <div className="p-4 text-sm text-slate-700">
            <div className="font-mono text-lg bg-slate-50 p-3 rounded border border-slate-100 mb-3 text-center">
              3x + 5x = (3 + 5)x = <strong>8x</strong>
            </div>
            <p><strong>Penjelasan:</strong> Anggaplah "x" sebagai sebuah Apel. Jika kamu punya 3 apel dan diberi 5 apel lagi, maka totalnya 8 apel.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
            <h3 className="font-bold text-emerald-800 text-sm">Contoh 2: Pengurangan</h3>
          </div>
          <div className="p-4 text-sm text-slate-700">
            <div className="font-mono text-lg bg-slate-50 p-3 rounded border border-slate-100 mb-3 text-center">
              7y - 2y = (7 - 2)y = <strong>5y</strong>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
            <h3 className="font-bold text-purple-800 text-sm">Contoh 3: Banyak Suku Berbeda</h3>
          </div>
          <div className="p-4 text-sm text-slate-700">
            <p className="mb-2">Sederhanakan: <code className="font-bold">4a + 3b - 2a + 5b</code></p>
            <div className="bg-slate-50 p-3 rounded border border-slate-100 space-y-2 font-mono">
              <p>1. Kelompokkan suku sejenis: (4a - 2a) + (3b + 5b)</p>
              <p>2. Operasikan koefisien: 2a + 8b</p>
            </div>
            <p className="mt-2 text-rose-600 font-bold text-xs">⚠️ Ingat: 2a + 8b TIDAK BISA digabung menjadi 10ab karena bukan suku sejenis!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AljabarModelContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Mengubah Masalah Cerita Menjadi Aljabar</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Aljabar sangat berguna untuk menterjemahkan masalah sehari-hari ke dalam bahasa matematika. 
        Kita menggunakan huruf (variabel) untuk mewakili bilangan atau benda yang nilainya belum diketahui.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-3">Langkah-langkah</h3>
          <ol className="list-decimal pl-4 space-y-2 text-sm text-slate-600">
            <li>Baca masalah cerita dengan saksama.</li>
            <li>Identifikasi apa yang tidak diketahui (misal: harga mangga, umur Budi, berat kardus).</li>
            <li>Pilih huruf yang akan mewakili benda yang belum diketahui (misal: let <em>m</em> = harga satu mangga).</li>
            <li>Terjemahkan kata-kata matematika ke dalam operasi hitung (+, -, ×, /).</li>
          </ol>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-3">Kata Kunci</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li><span className="font-bold bg-green-100 text-green-700 px-1 rounded">Tambah (+):</span> "lebih banyak dari", "ditambah", "jumlah", "total"</li>
            <li><span className="font-bold bg-rose-100 text-rose-700 px-1 rounded">Kurang (-):</span> "kurang dari", "selisih", "diambil", "hilang"</li>
            <li><span className="font-bold bg-blue-100 text-blue-700 px-1 rounded">Kali (×):</span> "dua kali", "produk dari", "kali lipat"</li>
            <li><span className="font-bold bg-amber-100 text-amber-700 px-1 rounded">Bagi (÷):</span> "setengah dari", "dibagi", "rasio"</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-sky-50 border border-sky-100 p-5 rounded-xl mt-4">
         <h3 className="font-bold text-sky-800 mb-2">Contoh Pemodelan:</h3>
         <p className="text-sm text-slate-700 italic mb-2">"Umur Ayah adalah 3 kali umur Budi ditambah 2 tahun."</p>
         <div className="bg-white p-3 border border-sky-100 rounded text-sm text-slate-700">
           <p className="mb-1"><strong>Misalkan:</strong></p>
           <ul className="list-disc pl-5 mb-2">
             <li>y = Umur Ayah</li>
             <li>x = Umur Budi</li>
           </ul>
           <p><strong>Bentuk Aljabar:</strong> <code className="font-bold text-sky-700 text-lg">y = 3x + 2</code></p>
         </div>
      </div>
    </div>
  );
}

function AljabarPenerapanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Penerapan Aljabar dalam Kehidupan</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Sekarang mari kita lihat bagaimana menyederhanakan bentuk aljabar bisa membantu menyelesaikan kasus di kegiatan sehari-hari.
      </p>

      <div className="bg-white border text-left border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl">🛒</div>
          <h3 className="font-bold text-slate-800">Kasus: Belanja Alat Tulis</h3>
        </div>
        <div className="p-5 text-sm text-slate-700 space-y-4">
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-50">
             <p className="font-bold text-slate-800 mb-2">Kasus:</p>
             <p className="leading-relaxed">Andi dan Budi membeli alat tulis yang sama untuk persiapan ujian.</p>
             <ul className="list-disc pl-4 mt-2">
               <li>Andi membeli <strong>3 pensil</strong> dan <strong>2 buku</strong>.</li>
               <li>Budi membeli <strong>5 pensil</strong> dan <strong>4 buku</strong>.</li>
             </ul>
             <p className="mt-2">Berapa total belanjaan mereka jika digabungkan?</p>
          </div>

          <div>
             <h4 className="font-bold text-slate-700 mb-2">1. Membuat Pemisalan (Variabel)</h4>
             <ul className="bg-slate-50 p-3 rounded border border-slate-100">
               <li>Biarkan <code className="font-bold text-blue-600">p</code> mewakili Pensil</li>
               <li>Biarkan <code className="font-bold text-emerald-600">b</code> mewakili Buku</li>
             </ul>
          </div>
          
          <div>
             <h4 className="font-bold text-slate-700 mb-2">2. Menuliskan Bentuk Aljabar</h4>
             <ul className="space-y-1">
               <li>Belanjaan Andi = <code className="font-bold">3p + 2b</code></li>
               <li>Belanjaan Budi = <code className="font-bold">5p + 4b</code></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-slate-700 mb-2">3. Menyederhanakan (Menjumlahkan)</h4>
             <div className="bg-fuchsia-50 border border-fuchsia-100 p-4 rounded-lg font-mono text-center">
               <p className="text-slate-500 mb-1">(3p + 2b) + (5p + 4b)</p>
               <p className="text-slate-600 mb-2 text-xs">Kelompokkan suku sejenis:</p>
               <p className="text-slate-700 font-bold mb-2">(3p + 5p) + (2b + 4b)</p>
               <p className="text-fuchsia-700 text-lg font-bold">= 8p + 6b</p>
             </div>
             <p className="mt-3"><strong>Kesimpulan:</strong> Total belanjaan mereka berdua adalah 8 Pensil dan 6 Buku.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= HIMPUNAN COMPONENTS =================
function HimpunanKonsepContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Konsep Dasar Himpunan</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Himpunan adalah kumpulan benda atau objek yang dapat didefinisikan dengan jelas, sehingga kita dapat menentukan apakah suatu objek termasuk dalam kumpulan tersebut atau tidak.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
          <h3 className="font-bold text-emerald-800 mb-2">✅ Himpunan</h3>
          <p className="text-xs text-slate-600 mb-3">Syaratnya jelas, siapa saja akan setuju dengan anggotanya.</p>
          <ul className="text-sm text-slate-700 list-disc pl-4 space-y-2">
            <li>Kumpulan hewan berkaki empat (kambing, sapi, kuda).</li>
            <li>Kumpulan siswa kelas 7 yang lahir di bulan Agustus.</li>
            <li>Kumpulan huruf vokal dalam abjad (a, e, i, o, u).</li>
          </ul>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-sm">
          <h3 className="font-bold text-rose-800 mb-2">❌ Bukan Himpunan</h3>
          <p className="text-xs text-slate-600 mb-3">Sifatnya subjektif (tiap orang bisa punya pendapat berbeda).</p>
          <ul className="text-sm text-slate-700 list-disc pl-4 space-y-2">
            <li>Kumpulan makanan lezat (lezat itu relatif).</li>
            <li>Kumpulan siswa yang pintar.</li>
            <li>Kumpulan lukisan yang indah.</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl mt-4">
        <h3 className="font-bold text-blue-800 mb-2">Notasi Himpunan</h3>
        <p className="text-sm text-blue-800 mb-2">Himpunan biasanya dilambangkan dengan huruf kapital (A, B, C, dst.). Anggotanya ditulis di dalam kurung kurawal <code className="font-bold">{`{  }`}</code>.</p>
        <ul className="text-sm text-blue-900 list-disc pl-4">
          <li><strong>Simbol Elemen ($\in$):</strong> Menyatakan "anggota dari" himpunan. <br/><span className="text-xs text-blue-700 italic">Contoh: M adalah himpunan hari, maka Senin $\in$ M.</span></li>
          <li><strong>Simbol Bukan Elemen ($\notin$):</strong> Menyatakan "bukan anggota dari". <br/><span className="text-xs text-blue-700 italic">Contoh: Januari $\notin$ M.</span></li>
        </ul>
      </div>
    </div>
  );
}

function HimpunanPenyajianContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Menyajikan Himpunan</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Ada 3 cara utama untuk menyajikan atau menuliskan suatu himpunan:
      </p>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="bg-sky-50 px-4 py-8 border-b md:border-b-0 md:border-r border-slate-200 text-center w-full md:w-32 flex flex-col justify-center items-center shrink-0">
             <span className="text-2xl mb-1">📝</span>
             <span className="text-xs font-bold text-sky-800 uppercase text-center">Kata-kata</span>
          </div>
          <div className="p-5 text-sm text-slate-700">
            <h3 className="font-bold text-slate-800 mb-1">Dengan Menyebutkan Sifat Keanggotaan</h3>
            <p className="mb-2">Menuliskan syarat atau sifat yang harus dipenuhi oleh anggota-anggotanya di dalam kurung kurawal.</p>
            <div className="bg-slate-50 p-2 rounded border border-slate-100 font-mono text-center">A = {`{ bilangan prima kurang dari 10 }`}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
           <div className="bg-fuchsia-50 px-4 py-8 border-b md:border-b-0 md:border-r border-slate-200 text-center w-full md:w-32 flex flex-col justify-center items-center shrink-0">
             <span className="text-2xl mb-1">🔢</span>
             <span className="text-xs font-bold text-fuchsia-800 uppercase text-center">Mendaftar</span>
          </div>
          <div className="p-5 text-sm text-slate-700">
            <h3 className="font-bold text-slate-800 mb-1">Metode Tabulasi (Roster)</h3>
            <p className="mb-2">Menyebutkan semua anggotanya satu per satu yang dipisahkan oleh tanda koma.</p>
            <div className="bg-slate-50 p-2 rounded border border-slate-100 font-mono text-center">A = {`{ 2, 3, 5, 7 }`}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
           <div className="bg-amber-50 px-4 py-8 border-b md:border-b-0 md:border-r border-slate-200 text-center w-full md:w-32 flex flex-col justify-center items-center shrink-0">
             <span className="text-2xl mb-1">⚙️</span>
             <span className="text-xs font-bold text-amber-800 uppercase text-center">Notasi</span>
          </div>
          <div className="p-5 text-sm text-slate-700">
            <h3 className="font-bold text-slate-800 mb-1">Notasi Pembentuk Himpunan</h3>
            <p className="mb-2">Menyatakan himpunan dengan syarat keanggotaan menggunakan variabel (misal x).</p>
            <div className="bg-slate-50 p-2 rounded border border-slate-100 font-mono text-center">A = {`{ x | x < 10, x $\in$ Bilangan Prima }`}</div>
            <p className="text-xs text-slate-500 mt-2 text-center">Dibaca: "x sedemikian sehingga x kurang dari 10, dimana x elemen bilangan prima"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HimpunanOperasiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Operasi Himpunan</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Sama seperti bilangan yang bisa ditambahkan atau dikurangkan, himpunan juga memiliki operasi dasar.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-4xl text-indigo-100 opacity-50 pointer-events-none">∩</div>
          <h3 className="font-bold text-indigo-800 text-md mb-2 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono text-sm">A ∩ B</span> 
            Irisan (Intersection)
          </h3>
          <p className="text-sm text-slate-700 mb-3">Anggota yang <strong>sama-sama ada</strong> di himpunan A sekaligus di himpunan B.</p>
          <div className="bg-slate-50 p-3 text-xs border border-slate-100 rounded text-slate-600">
            <p>A = {`{ 1, 2, 3, 4 }`}</p>
            <p>B = {`{ 3, 4, 5, 6 }`}</p>
            <p className="font-bold text-indigo-600 mt-1 border-t border-slate-200 pt-1">A ∩ B = {`{ 3, 4 }`}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-pink-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-4xl text-pink-100 opacity-50 pointer-events-none">∪</div>
          <h3 className="font-bold text-pink-800 text-md mb-2 flex items-center gap-2">
             <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded font-mono text-sm">A ∪ B</span> 
             Gabungan (Union)
          </h3>
          <p className="text-sm text-slate-700 mb-3">Gabungan <strong>semua anggota</strong> A dan B. Anggota yang sama cukup ditulis satu kali saja.</p>
           <div className="bg-slate-50 p-3 text-xs border border-slate-100 rounded text-slate-600">
            <p>A = {`{ 1, 2, 3, 4 }`}</p>
            <p>B = {`{ 3, 4, 5, 6 }`}</p>
            <p className="font-bold text-pink-600 mt-1 border-t border-slate-200 pt-1">A ∪ B = {`{ 1, 2, 3, 4, 5, 6 }`}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-4xl text-emerald-100 opacity-50 pointer-events-none">-</div>
          <h3 className="font-bold text-emerald-800 text-md mb-2 flex items-center gap-2">
             <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono text-sm">A - B</span> 
             Pelengkap/Selisih (Difference)
          </h3>
          <p className="text-sm text-slate-700 mb-3">Anggota himpunan A yang <strong>tidak ada</strong> di himpunan B.</p>
           <div className="bg-slate-50 p-3 text-xs border border-slate-100 rounded text-slate-600">
            <p>A = {`{ 1, 2, 3, 4 }`}</p>
            <p>B = {`{ 3, 4, 5, 6 }`}</p>
            <p className="font-bold text-emerald-600 mt-1 border-t border-slate-200 pt-1">A - B = {`{ 1, 2 }`}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-3 text-4xl text-slate-100 opacity-50 pointer-events-none">A'</div>
          <h3 className="font-bold text-slate-800 text-md mb-2 flex items-center gap-2">
             <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono text-sm">A'</span> 
             Komplemen
          </h3>
          <p className="text-sm text-slate-700 mb-3">Semua  anggota himpunan semesta (S) yang <strong>bukan</strong> anggota himpunan A.</p>
           <div className="bg-slate-50 p-3 text-xs border border-slate-100 rounded text-slate-600">
            <p>S = {`{ 1, 2, 3, 4, 5 }`}</p>
            <p>A = {`{ 1, 2 }`}</p>
            <p className="font-bold text-slate-800 mt-1 border-t border-slate-200 pt-1">A' atau A^c = {`{ 3, 4, 5 }`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HimpunanDiagramContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Diagram Venn</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Diagram Venn adalah cara visual atau gambar untuk menyajikan himpunan, sehingga hubungan antar himpunan menjadi lebih mudah dipahami.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-center border-b pb-2">Bagian-bagian Diagram Venn</h3>
        <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
            
            {/* Visual Illustration */}
            <div className="relative w-[200px] h-[150px] bg-slate-50 border-2 border-slate-300 rounded shrink-0 shrink-0">
               <div className="absolute top-1 left-2 font-bold text-slate-500 font-mono">S</div>
               
               {/* Circle A */}
               <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-[90px] h-[90px] bg-blue-400/30 border-2 border-blue-500 rounded-full flex items-center justify-start pl-2">
                 <span className="text-blue-800 font-bold text-xs">A</span>
               </div>
               
               {/* Circle B */}
               <div className="absolute top-1/2 -translate-y-1/2 right-[20%] w-[90px] h-[90px] bg-amber-400/30 border-2 border-amber-500 rounded-full flex items-center justify-end pr-2">
                 <span className="text-amber-800 font-bold text-xs">B</span>
               </div>
               
               {/* Irisan */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold font-mono">∩</div>
            </div>

            <ul className="text-sm text-slate-700 space-y-3">
               <li><strong className="text-slate-800 font-mono tracking-wider">Kotak:</strong> Melambangkan Himpunan Semesta (S), yakni seluruh objek yang sedang dibicarakan.</li>
               <li><strong className="text-blue-600">Lingkaran A:</strong> Himpunan A. Lingkaran yang bertumpang tindih menandakan ada anggota yang sama (irisan).</li>
               <li><strong className="text-slate-500">Ruang di luar:</strong> Anggota Semesta yang bukan bagian dari himpunan A maupun B.</li>
            </ul>
        </div>
      </div>
    </div>
  );
}

// ================= RELASI DAN FUNGSI COMPONENTS =================
function RFKonsepRelasiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Konsep Relasi</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Dalam matematika, <strong>Relasi</strong> artinya "hubungan". Relasi menghubungkan anggota-anggota di suatu himpunan (daerah asal) dengan anggota-anggota di himpunan lain (daerah kawan).
      </p>

      <div className="bg-sky-50 p-5 rounded-xl border border-sky-100 shadow-sm">
        <h3 className="font-bold text-sky-800 mb-2 border-b border-sky-200 pb-2">Aturan Relasi</h3>
        <p className="text-sm text-sky-700 leading-relaxed">
          Relasi tidak memiliki aturan khusus. Satu anggota daerah asal boleh memiliki:
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm text-sky-800 space-y-1">
          <li>Tidak punya pasangan.</li>
          <li>Punya tepat satu pasangan.</li>
          <li>Punya lebih dari satu pasangan.</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <h4 className="font-bold text-slate-700 mb-2">Contoh Relasi Kehidupan Sehari-hari</h4>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
            <li>Relasi "Menyukai makanan": Budi menyukai Bakso dan Nasi Goreng (1 orang suka banyak makanan).</li>
            <li>Relasi "Mempunyai hobi": Susi hobi membaca, Andi hobi berenang.</li>
            <li>Relasi "Saudara kandungan": Ali saudara dari Budi.</li>
          </ul>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <h4 className="font-bold text-slate-700 mb-2">Contoh Relasi Angka</h4>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
            <li>Relasi "Faktor dari": 2 adalah faktor dari 4 dan 6.</li>
            <li>Relasi "Kurang dari": 3 kurang dari 5 dan 8.</li>
            <li>Relasi "Kuadrat dari": 9 adalah kuadrat dari 3.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function RFFungsiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Konsep Fungsi (Pemetaan)</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Fungsi</strong> atau pemetaan adalah relasi <strong>khusus</strong> yang memenuhi syarat yang ketat. Setiap fungsi pasti relasi, tapi relasi belum tentu fungsi.
      </p>

      <div className="bg-emerald-50 text-emerald-800 p-5 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 text-7xl opacity-10">🛡️</div>
        <h3 className="font-bold mb-2">Syarat Wajib Fungsi:</h3>
        <p className="text-sm mb-2">Setiap anggota daerah asal (Domain) <strong>HARUS</strong> dipasangkan dengan <strong>TEPAT SATU</strong> anggota daerah kawan (Kodomain).</p>
        <ul className="text-sm list-disc pl-4 space-y-1">
          <li>Tidak boleh ada anggota asal yang "jomblo" (tidak punya pasangan).</li>
          <li>Tidak boleh ada anggota asal yang "selingkuh" (punya pasangan lebih dari satu).</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
          <h4 className="font-bold text-rose-600 text-sm mb-2 flex items-center gap-2">❌ Bukan Fungsi (Hanya Relasi)</h4>
          <p className="text-sm text-slate-600 mb-2 italic">Himpunan A = {"{1, 2, 3}"}</p>
          <ul className="text-xs text-rose-800 space-y-1 font-mono bg-rose-50 p-2 rounded">
            <li>(1, a), (1, b) --&gt; 1 selingkuh</li>
            <li>(2, c), (3, c)</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
          <h4 className="font-bold text-emerald-600 text-sm mb-2 flex items-center gap-2">✅ Fungsi</h4>
          <p className="text-sm text-slate-600 mb-2 italic">Himpunan A = {"{1, 2, 3}"}</p>
          <ul className="text-xs text-emerald-800 space-y-1 font-mono bg-emerald-50 p-2 rounded">
            <li>(1, a)</li>
            <li>(2, a) --&gt; Tidak masalah kodomain punya banyak pasangan</li>
            <li>(3, b)</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Tiga Istilah Penting</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-[100px_1fr] gap-4">
            <div className="font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded text-center text-sm self-start">Domain</div>
            <div className="text-sm text-slate-700">Daerah asal (Himpunan di sebelah kiri). Semua anggotanya harus punya pasangan.</div>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4">
            <div className="font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded text-center text-sm self-start">Kodomain</div>
            <div className="text-sm text-slate-700">Daerah kawan (Himpunan di sebelah kanan). Boleh ada anggota yang tidak punya pasangan atau pasangannya lebih dari satu.</div>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4">
            <div className="font-bold text-pink-700 bg-pink-50 px-2 py-1 rounded text-center text-sm self-start">Range</div>
            <div className="text-sm text-slate-700">Daerah hasil. Anggota kodomain yang <strong>benar-benar</strong> memiliki pasangan dari domain. Range adalah himpunan bagian dari Kodomain.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RFPenyajianContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Penyajian Relasi dan Fungsi</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Relasi dan fungsi dapat disajikan ke dalam 3 bentuk utama agar mudah dipahami:
      </p>

      <div className="space-y-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 bg-slate-50 border-2 border-slate-300 rounded p-4 flex justify-center shrink-0">
             {/* Simple sketch of diagram panah */}
             <div className="flex gap-8 items-center text-xs font-mono font-bold">
                <div className="flex flex-col gap-2 border-2 border-blue-400 p-2 rounded-full w-12 items-center">
                  <div>1</div><div>2</div><div>3</div>
                </div>
                <div className="flex flex-col gap-2 text-slate-400">
                  <div>→</div><div>→</div><div>→</div>
                </div>
                <div className="flex flex-col gap-2 border-2 border-amber-400 p-2 rounded-full w-12 items-center">
                  <div>a</div><div>b</div><div>c</div>
                </div>
             </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2">1. Diagram Panah</h3>
            <p className="text-sm text-slate-600">Bentuk penyajian yang paling mudah dipahami secara visual. Menggunakan dua elips (kiri dan kanan) yang dihubungkan dengan anak panah dari domain ke kodomain.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 bg-slate-50 border-2 border-slate-300 rounded p-4 flex justify-center shrink-0">
             <div className="font-mono font-bold text-sm text-rose-600 text-center">
                {"{(1, a), (2, b), (3, c)}"}
             </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2">2. Himpunan Pasangan Berurutan</h3>
            <p className="text-sm text-slate-600">Menyajikan pasangan domain dan range dalam bentuk (x, y) dan dikumpulkan di dalam kurung kurawal. Syarat fungsi: angka yang di depan (x) tidak boleh berulang!</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 bg-slate-50 border-2 border-slate-300 rounded p-4 shrink-0 h-[100px] relative">
             <div className="absolute left-4 bottom-2 top-2 border-l-2 border-slate-400"></div>
             <div className="absolute left-2 right-2 bottom-4 border-b-2 border-slate-400"></div>
             <div className="absolute left-8 bottom-8 w-2 h-2 bg-blue-500 rounded-full"></div>
             <div className="absolute left-16 bottom-12 w-2 h-2 bg-blue-500 rounded-full"></div>
             <div className="absolute text-[8px] right-2 bottom-1 font-bold">X</div>
             <div className="absolute text-[8px] left-1 top-2 font-bold">Y</div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2">3. Diagram Kartesius</h3>
            <p className="text-sm text-slate-600">Menyajikan pasangan pada sumbu kordinat mendatar (sumbu x untuk Domain) dan tegak (sumbu y untuk Kodomain). Pasangan ditandai dengan titik (noktah).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RFNilaiFungsiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Menghitung Nilai Fungsi</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Jika suatu fungsi dirumuskan dalam bentuk matematika, kita bisa menghitung nilai fungsinya dengan mensubstitusi (mengganti) nilai x (domain) ke dalam rumus tersebut.
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 border-b border-blue-200 pb-2">Notasi dan Rumus</h3>
        <p className="text-sm text-slate-700 mb-3">Fungsi umumnya dinotasikan sebagai <strong>f(x)</strong> yang dibaca "f fungsi dari x".</p>
        
        <div className="bg-white p-4 rounded shadow-sm border border-slate-100 font-mono text-center text-lg text-indigo-700 font-bold mb-4">
          f(x) = 2x + 3
        </div>
        
        <p className="text-sm text-slate-700 mb-2">Mari kita hitung nilai fungsi secara berurutan:</p>
        <ul className="text-sm font-mono space-y-2 bg-white p-3 rounded border border-slate-100 text-slate-600">
          <li><strong className="text-blue-600">Untuk x = 1:</strong> f(1) = 2(1) + 3 = 2 + 3 = <strong className="text-indigo-600">5</strong></li>
          <li><strong className="text-blue-600">Untuk x = 2:</strong> f(2) = 2(2) + 3 = 4 + 3 = <strong className="text-indigo-600">7</strong></li>
          <li><strong className="text-blue-600">Untuk x = 3:</strong> f(3) = 2(3) + 3 = 6 + 3 = <strong className="text-indigo-600">9</strong></li>
        </ul>
        <p className="text-xs text-slate-500 mt-4 italic">
          Jadi, Range-nya adalah {'{5, 7, 9}'} jika Domain-nya {'{1, 2, 3}'}.
        </p>
      </div>
    </div>
  );
}
// ================= PERSAMAAN GARIS LURUS COMPONENTS =================
function PGLBentukUmumContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Bentuk Umum Persamaan Garis Lurus</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Persamaan Garis Lurus (PGL) adalah suatu persamaan matematika yang jika digambarkan pada bidang koordinat Cartesius akan membentuk sebuah <strong>garis lurus</strong>. Persamaan ini memiliki dua variabel yang masing-masing berpangkat satu.
      </p>

      <div className="bg-sky-50 p-6 border border-sky-100 rounded-xl shadow-sm text-center">
         <h3 className="text-sm font-bold text-sky-800 uppercase tracking-wide mb-3">Bentuk Umum 1 (Bentuk Eksplisit)</h3>
         <div className="font-mono text-3xl font-bold text-sky-700 bg-white inline-block px-6 py-2 rounded-lg border-2 border-sky-200">
           y = mx + c
         </div>
         <div className="mt-4 text-sm text-sky-800 text-left md:text-center space-y-2">
            <p><strong>y</strong> dan <strong>x</strong> = Variabel (titik pada bidang kartesius)</p>
            <p><strong>m</strong> = Gradien (Kemiringan garis)</p>
            <p><strong>c</strong> = Konstanta (Titik potong garis pada sumbu y)</p>
         </div>
         <div className="bg-white p-3 rounded mt-4 text-sm text-sky-800 text-left border border-sky-100 italic font-mono">
           Contoh: y = 2x + 4 (Gradien m=2, memotong sumbu-y di y=4)
         </div>
      </div>

      <div className="bg-fuchsia-50 p-6 border border-fuchsia-100 rounded-xl shadow-sm text-center mt-6">
         <h3 className="text-sm font-bold text-fuchsia-800 uppercase tracking-wide mb-3">Bentuk Umum 2 (Bentuk Implisit)</h3>
         <div className="font-mono text-3xl font-bold text-fuchsia-700 bg-white inline-block px-6 py-2 rounded-lg border-2 border-fuchsia-200">
           ax + by + c = 0
         </div>
         <div className="mt-4 text-sm text-fuchsia-800 text-left md:text-center space-y-2">
            <p><strong>a</strong> dan <strong>b</strong> = Koefisien (tidak boleh keduanya nol)</p>
            <p><strong>c</strong> = Konstanta</p>
         </div>
         <div className="bg-white p-3 rounded mt-4 text-sm text-fuchsia-800 text-left border border-fuchsia-100 italic font-mono">
           Contoh: 2x - 3y + 6 = 0
         </div>
      </div>
    </div>
  );
}

function PGLGradienContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Gradien (Kemiringan Garis)</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Gradien</strong> yang dilambangkan dengan huruf <strong><code className="bg-slate-100 px-1 rounded">m</code></strong>, adalah nilai yang menunjukkan <strong>seberapa miring</strong> suatu garis dan ke arah mana miringnya.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border text-center border-slate-200 p-5 rounded-xl shadow-sm">
           <div className="text-4xl mb-2">📈</div>
           <h3 className="font-bold text-emerald-600 mb-2">Gradien Positif (m &gt; 0)</h3>
           <p className="text-sm text-slate-600">Garis miring/condong ke <strong>Kanan Atas</strong>. Semakin besar nilainya, semakin curam garisnya.</p>
        </div>
        <div className="bg-white border text-center border-slate-200 p-5 rounded-xl shadow-sm">
           <div className="text-4xl mb-2">📉</div>
           <h3 className="font-bold text-rose-600 mb-2">Gradien Negatif (m &lt; 0)</h3>
           <p className="text-sm text-slate-600">Garis miring/condong ke <strong>Bawah Kanan</strong> (seperti turunan).</p>
        </div>
        <div className="bg-white border text-center border-slate-200 p-5 rounded-xl shadow-sm">
           <div className="text-4xl mb-2">➖</div>
           <h3 className="font-bold text-blue-600 mb-2">Gradien Nol (m = 0)</h3>
           <p className="text-sm text-slate-600">Garis <strong>Mendatar</strong> (horizontal) sejajar sumbu-x.</p>
        </div>
        <div className="bg-white border text-center border-slate-200 p-5 rounded-xl shadow-sm">
           <div className="text-4xl mb-2">|</div>
           <h3 className="font-bold text-amber-600 mb-2">Gradien Tak Terdefinisi</h3>
           <p className="text-sm text-slate-600">Garis <strong>Tegak lurus</strong> (vertikal) sejajar sumbu-y.</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl mt-6">
        <h3 className="font-bold text-purple-800 mb-3 border-b border-purple-200 pb-2">Cara Mencari Gradien</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-purple-700 text-sm">1. Jika diketahui Persamaan Garis y = mx + c</h4>
            <div className="bg-white border border-purple-100 p-3 rounded mt-2 text-sm text-slate-700">
               Langsung lihat angka di depan x. <br/>
               <span className="font-mono bg-slate-100 px-1 rounded">y = <strong>-3</strong>x + 5</span> → Gradien (m) = -3.
            </div>
          </div>
          <div>
            <h4 className="font-bold text-purple-700 text-sm">2. Jika diketahui Persamaan Garis ax + by + c = 0</h4>
            <div className="bg-white border border-purple-100 p-3 rounded mt-2 text-sm text-slate-700">
               Gunakan rumus: <strong>m = -a / b</strong><br/>
               <span className="font-mono bg-slate-100 px-1 rounded">2x + 4y - 8 = 0</span> → m = -2 / 4 = -½.
            </div>
          </div>
          <div>
            <h4 className="font-bold text-purple-700 text-sm">3. Jika diketahui Melalui Dua Titik (x₁, y₁) dan (x₂, y₂)</h4>
            <div className="bg-white border border-purple-100 p-3 rounded mt-2 text-sm text-slate-700">
               Gunakan rumus: <strong>m = (y₂ - y₁) / (x₂ - x₁)</strong><br/>
               Titik A(1, 2) dan B(3, 8) → m = (8 - 2) / (3 - 1) = 6 / 2 = 3.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PGLGrafikContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Menggambar Grafik Garis Lurus</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Untuk menggambar grafik persamaan garis lurus, kita memerlukan setidaknya <strong>dua titik potong</strong>, lalu menarik garis lurus yang melewati kedua titik tersebut.
      </p>

      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Langkah-langkah Mudah:</h3>
        
        <div className="space-y-6 relative">
           <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200"></div>

           <div className="relative pl-10">
             <div className="absolute left-[-2px] top-0 w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-500 text-blue-700 font-bold flex items-center justify-center text-sm z-10">1</div>
             <h4 className="font-bold text-slate-700">Cari Titik Potong dengan Sumbu-Y</h4>
             <p className="text-sm text-slate-600 mt-1">Caranya, ganti nilai <strong className="text-blue-600">x menjadi 0</strong> pada persamaan, lalu hitung nilai y. Titiknya adalah (0, y).</p>
           </div>
           
           <div className="relative pl-10">
             <div className="absolute left-[-2px] top-0 w-8 h-8 rounded-full bg-rose-100 border-2 border-rose-500 text-rose-700 font-bold flex items-center justify-center text-sm z-10">2</div>
             <h4 className="font-bold text-slate-700">Cari Titik Potong dengan Sumbu-X</h4>
             <p className="text-sm text-slate-600 mt-1">Caranya, ganti nilai <strong className="text-rose-600">y menjadi 0</strong> pada persamaan, lalu hitung nilai x. Titiknya adalah (x, 0).</p>
           </div>
           
           <div className="relative pl-10">
             <div className="absolute left-[-2px] top-0 w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 font-bold flex items-center justify-center text-sm z-10">3</div>
             <h4 className="font-bold text-slate-700">Tarik Garis</h4>
             <p className="text-sm text-slate-600 mt-1">Gambarkan kedua titik tersebut pada bidang Kartesius, lalu tarik garis lurus yang melewati keduanya.</p>
           </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
        <h4 className="font-bold text-slate-700 mb-2">Contoh Praktis</h4>
        <p className="text-sm text-slate-600 mb-2">Gambarkan grafik <code className="font-mono bg-slate-200 px-1 font-bold rounded">y = 2x + 4</code></p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li><strong>Untuk x = 0:</strong> y = 2(0) + 4 = 4. Titik potong y = <strong className="text-blue-600">(0, 4)</strong></li>
          <li><strong>Untuk y = 0:</strong> 0 = 2x + 4 → -4 = 2x → x = -2. Titik potong x = <strong className="text-rose-600">(-2, 0)</strong></li>
        </ul>
        <p className="text-sm text-slate-600 mt-2 italic">Tarik garis dari titik (-2, 0) melewati (0, 4).</p>
      </div>
    </div>
  );
}

function PGLMenentukanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Menentukan Persamaan Garis Lurus</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Jika sebuah garis digambar pada koordinat kartesius atau diberikan kondisinya, kita bisa merumuskan persamaan garis lurusnya menggunakan beberapa rumus berikut.
      </p>

      <div className="grid gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
           <h3 className="font-bold text-slate-800 mb-2">1. Jika diketahui Gradien (m) dan Satu Titik (x₁, y₁)</h3>
           <div className="font-mono text-lg font-bold text-sky-700 bg-sky-50 px-3 py-2 rounded text-center my-3 border border-sky-200">
              y - y₁ = m(x - x₁)
           </div>
           <p className="text-sm text-slate-600"><strong>Contoh:</strong> Persamaan garis yang melalui titik (2, 5) dengan gradien 3.<br/>
              <span className="font-mono bg-slate-100 px-1 rounded block mt-1 py-1">y - 5 = 3(x - 2) <br/>y - 5 = 3x - 6 <br/>y = 3x - 1</span>
           </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
           <h3 className="font-bold text-slate-800 mb-2">2. Jika diketahui Melalui Dua Titik (x₁, y₁) dan (x₂, y₂)</h3>
           <div className="font-mono text-lg font-bold text-fuchsia-700 bg-fuchsia-50 px-3 py-2 rounded text-center my-3 border border-fuchsia-200">
               (y - y₁) / (y₂ - y₁) = (x - x₁) / (x₂ - x₁)
           </div>
           <p className="text-sm text-slate-600"><strong>Cara alternatif:</strong> Cari Gradien (m) terlebih dahulu menggunakan rumus nomor 3 di bagian Gradien, lalu pakai rumus ke-1 di atas.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
         <h3 className="font-bold text-amber-800 mb-2">Sifat Hubungan Dua Garis</h3>
         <ul className="text-sm text-amber-900 space-y-3">
            <li>
               <strong>Garis Sejajar (//):</strong> Memiliki kemiringan yang sama persis.<br/>
               <code className="bg-amber-100 font-bold px-2 rounded">m₁ = m₂</code>
            </li>
            <li>
               <strong>Garis Tegak Lurus (⊥):</strong> Berkebalikan dan berlawanan tanda.<br/>
               <code className="bg-amber-100 font-bold px-2 rounded">m₁ × m₂ = -1</code> (atau <code className="bg-amber-100 font-bold px-2 rounded">m₁ = -1/m₂</code>)
            </li>
         </ul>
      </div>
    </div>
  );
}
// ================= BANGUN RUANG SISI DATAR COMPONENTS =================
function BRSDKubusBalokContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Kubus dan Balok</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Bangun Ruang Sisi Datar adalah bangun ruang yang semua sisinya berbentuk bangun datar (tidak ada sisi lengkung). Dua bangun ruang sisi datar yang paling umum adalah Kubus dan Balok.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-5 border border-sky-100 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-3">
             <h3 className="font-bold text-sky-800">1. Kubus</h3>
             <div className="w-12 h-12 bg-sky-100 border-2 border-sky-400 font-mono text-xs flex justify-center items-center font-bold text-sky-700">s=s=s</div>
          </div>
          <p className="text-sm text-slate-600 mb-2">Bangun ruang yang dibatasi oleh 6 buah persegi yang ukuran dan bentuknya sama persis (kongruen).</p>
          <h4 className="font-bold text-slate-700 text-xs mt-3 mb-1">Ciri-ciri:</h4>
          <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
             <li>Memiliki 6 sisi (semuanya persegi).</li>
             <li>Memiliki 12 rusuk yang <strong>sama panjang</strong>.</li>
             <li>Memiliki 8 titik sudut.</li>
             <li>Memiliki 12 diagonal bidang (s√2) dan 4 diagonal ruang (s√3).</li>
          </ul>
        </div>
        
        <div className="bg-white p-5 border border-amber-100 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-3">
             <h3 className="font-bold text-amber-800">2. Balok</h3>
             <div className="w-16 h-10 bg-amber-100 border-2 border-amber-400 font-mono text-xs flex justify-center items-center font-bold text-amber-700">p×l×t</div>
          </div>
          <p className="text-sm text-slate-600 mb-2">Bangun ruang yang dibatasi oleh 6 buah persegi panjang, di mana sisi-sisi yang berhadapan sama besar.</p>
          <h4 className="font-bold text-slate-700 text-xs mt-3 mb-1">Ciri-ciri:</h4>
          <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
             <li>Memiliki 6 sisi (bisa persegi atau persegi panjang).</li>
             <li>Memiliki 12 rusuk (terdiri dari 4 panjang, 4 lebar, 4 tinggi).</li>
             <li>Memiliki 8 titik sudut.</li>
             <li>Diagonal ruangnya dihitung dengan √(p²+l²+t²).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BRSDPrismaLimasContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Prisma dan Limas</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Prisma dan Limas penamaannya disesuaikan dengan <strong>bentuk alasnya</strong>. Jika alasnya segitiga, maka disebut Prisma Segitiga atau Limas Segitiga.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-5 border border-emerald-100 rounded-xl shadow-sm">
          <h3 className="font-bold text-emerald-800 mb-2 text-base">Prisma</h3>
          <p className="text-sm text-emerald-700 mb-3">
            Bangun ruang yang memiliki alas dan tutup yang kongruen (sama persis) dan sejajar, serta sisi-sisi tegak berbentuk persegi/persegi panjang.
          </p>
          <div className="space-y-2 mt-4 text-sm text-emerald-800">
             <h4 className="font-bold">Contoh Prisma:</h4>
             <ul className="list-disc pl-4 space-y-1">
                <li><strong>Prisma Segitiga:</strong> Alas dan tutup berupa segitiga, memiliki 5 sisi.</li>
                <li><strong>Prisma Segi Empat:</strong> Kubus dan Balok pada dasarnya adalah prisma segi empat!</li>
                <li><strong>Prisma Segi-n:</strong> Rumus banyak rusuk (3n), banyak sisi (n+2), banyak titik sudut (2n).</li>
             </ul>
          </div>
        </div>

        <div className="bg-rose-50 p-5 border border-rose-100 rounded-xl shadow-sm">
          <h3 className="font-bold text-rose-800 mb-2 text-base">Limas</h3>
          <p className="text-sm text-rose-700 mb-3">
            Bangun ruang yang memiliki sisi alas berupa sebuah bangun datar segi-n, dan sisi-sisi tegak berbentuk segitiga yang puncaknya bertemu di satu titik.
          </p>
          <div className="space-y-2 mt-4 text-sm text-rose-800">
             <h4 className="font-bold">Contoh Limas:</h4>
             <ul className="list-disc pl-4 space-y-1">
                <li><strong>Limas Segitiga:</strong> Alasnya segitiga (sering disebut juga bidang empat/tetrahedron).</li>
                <li><strong>Limas Segi Empat:</strong> Bentuknya seperti piramida di Mesir.</li>
                <li><strong>Limas Segi-n:</strong> Rumus banyak rusuk (2n), banyak sisi (n+1), banyak titik sudut (n+1).</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function BRSDRumusContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Rumus Luas Permukaan dan Volume</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Luas Permukaan</strong> ibarat menjumlahkan semua luas kertas kado yang digunakan untuk membungkus bangun tersebut tanpa celah. <strong>Volume</strong> adalah ukuran kapasitas isi ruang di dalamnya.
      </p>

      <div className="grid gap-4 mt-6">
         {/* Kubus */}
         <div className="bg-white border-l-4 border-sky-400 p-4 rounded shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-32 text-center md:text-left font-bold text-slate-700 uppercase">Kubus</div>
            <div className="flex-1 grid sm:grid-cols-2 gap-2 text-sm">
               <div className="bg-sky-50 p-2 rounded"><strong>Luas (L):</strong> 6 × s²</div>
               <div className="bg-sky-100 p-2 rounded"><strong>Volume (V):</strong> s × s × s (s³)</div>
            </div>
         </div>

         {/* Balok */}
         <div className="bg-white border-l-4 border-amber-400 p-4 rounded shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-32 text-center md:text-left font-bold text-slate-700 uppercase">Balok</div>
            <div className="flex-1 grid sm:grid-cols-2 gap-2 text-sm">
               <div className="bg-amber-50 p-2 rounded"><strong>L:</strong> 2(p×l + p×t + l×t)</div>
               <div className="bg-amber-100 p-2 rounded"><strong>V:</strong> p × l × t</div>
            </div>
         </div>

         {/* Prisma */}
         <div className="bg-white border-l-4 border-emerald-400 p-4 rounded shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-32 text-center md:text-left font-bold text-slate-700 uppercase">Prisma</div>
            <div className="flex-1 grid sm:grid-cols-2 gap-2 text-sm">
               <div className="bg-emerald-50 p-2 rounded"><strong>L:</strong> (2×Luas Alas) + (Keliling Alas×Tinggi)</div>
               <div className="bg-emerald-100 p-2 rounded"><strong>V:</strong> Luas Alas × Tinggi</div>
            </div>
         </div>

         {/* Limas */}
         <div className="bg-white border-l-4 border-rose-400 p-4 rounded shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="md:w-32 text-center md:text-left font-bold text-slate-700 uppercase">Limas</div>
            <div className="flex-1 grid sm:grid-cols-2 gap-2 text-sm">
               <div className="bg-rose-50 p-2 rounded"><strong>L:</strong> Luas Alas + Jumlah Luas Sisi Tegak (Segitiga)</div>
               <div className="bg-rose-100 p-2 rounded"><strong>V:</strong> ⅓ × Luas Alas × Tinggi Limas</div>
            </div>
         </div>
      </div>
    </div>
  );
}
// ================= BARISAN DAN DERET COMPONENTS =================
function BDPolaBilanganContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Pola Bilangan</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Pola Bilangan</strong> adalah susunan angka-angka yang membentuk barisan dengan aturan atau pola tertentu. Beberapa pola memiliki bentuk khusus, seperti persegi, persegi panjang, dan segitiga.
      </p>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Persegi */}
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-sky-800 mb-2">1. Pola Persegi</h3>
          <p className="text-sm text-sky-700 mb-3">Pola yang berbentuk persegi. Nilai sukunya adalah kuadrat dari urutannya.</p>
          <div className="bg-white p-3 rounded text-sm text-sky-800 border border-sky-200 font-mono mb-3 text-center">
            1, 4, 9, 16, 25, ...
          </div>
          <div className="font-bold text-sky-900 text-sm bg-sky-100 px-3 py-2 rounded text-center">
            Un = n²
          </div>
        </div>

        {/* Persegi Panjang */}
        <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-fuchsia-800 mb-2">2. Pola Persegi Panjang</h3>
          <p className="text-sm text-fuchsia-700 mb-3">Pola yang mirip luasan persegi panjang (n × (n+1)).</p>
          <div className="bg-white p-3 rounded text-sm text-fuchsia-800 border border-fuchsia-200 font-mono mb-3 text-center">
            2, 6, 12, 20, 30, ...
          </div>
          <div className="font-bold text-fuchsia-900 text-sm bg-fuchsia-100 px-3 py-2 rounded text-center">
            Un = n(n + 1)
          </div>
        </div>

        {/* Segitiga */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-emerald-800 mb-2">3. Pola Segitiga</h3>
          <p className="text-sm text-emerald-700 mb-3">Sama dengan setengah dari pola persegi panjang.</p>
          <div className="bg-white p-3 rounded text-sm text-emerald-800 border border-emerald-200 font-mono mb-3 text-center">
            1, 3, 6, 10, 15, ...
          </div>
          <div className="font-bold text-emerald-900 text-sm bg-emerald-100 px-3 py-2 rounded text-center">
            Un = ½n(n + 1)
          </div>
        </div>
      </div>

      <div className="bg-white border text-sm text-slate-700 border-slate-200 rounded-xl p-5 shadow-sm mt-4">
        <h4 className="font-bold text-slate-800 mb-2 border-b pb-2">Istilah Penting</h4>
        <ul className="list-disc pl-4 space-y-2">
          <li><strong>U₁ (atau a)</strong>: Suku pertama (angka paling depan).</li>
          <li><strong>Un</strong>: Suku ke-n (suku ke-10 berarti n=10).</li>
          <li><strong>n</strong>: Urutan suku (1, 2, 3, dst).</li>
        </ul>
      </div>
    </div>
  );
}

function BDBarisanAritmatikaContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Barisan Aritmatika</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Barisan Aritmatika</strong> adalah suatu barisan bilangan yang memiliki <strong>selisih (beda)</strong> yang sama antara dua suku yang berurutan. Cirinya adalah selalu <strong>ditambah</strong> atau <strong>dikurang</strong> dengan angka yang tetap.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white flex-1 border border-indigo-200 p-5 rounded-xl shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 text-4xl opacity-10 pointer-events-none">➕</div>
           <h3 className="font-bold text-indigo-800 mb-3">Rumus Suku ke-n (Un)</h3>
           <div className="mb-4 bg-indigo-50 border-2 border-indigo-200 p-3 rounded font-mono text-center text-xl font-bold text-indigo-700">
             Un = a + (n - 1)b
           </div>
           <ul className="text-sm text-indigo-900 space-y-1">
             <li><strong>a</strong> = suku pertama (U₁)</li>
             <li><strong>b</strong> = beda (Un - Un-1)</li>
             <li><strong>n</strong> = urutan suku</li>
           </ul>
        </div>
        
        <div className="bg-slate-50 flex-1 border border-slate-200 p-5 rounded-xl shadow-sm">
           <h4 className="font-bold text-slate-700 mb-2">Contoh Barisan:</h4>
           <div className="font-mono bg-white p-2 border rounded mb-2 text-center text-indigo-600 font-bold">2, 5, 8, 11, ...</div>
           <p className="text-sm text-slate-600 mb-3">
             Selisih (b) = 5 - 2 = <strong>3</strong>.<br/>
             Suku pertama (a) = <strong>2</strong>.
           </p>
           <h4 className="font-bold text-slate-700 text-sm mt-3">Mencari U₁₀:</h4>
           <div className="text-sm text-slate-600 bg-white p-3 rounded font-mono border">
             U₁₀ = 2 + (10 - 1)3 <br/>
             U₁₀ = 2 + (9 × 3) <br/>
             U₁₀ = 2 + 27 = <strong>29</strong>
           </div>
        </div>
      </div>
    </div>
  );
}

function BDDeretAritmatikaContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Deret Aritmatika</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Jika 'Barisan' itu menyebutkan daftar bilangannya, maka <strong>Deret Aritmatika</strong> adalah <strong>Jumlah n suku pertama</strong> dari barisan aritmatika tersebut. Lambangnya adalah <strong>Sn</strong>.
      </p>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl shadow-sm mb-6">
         <h3 className="font-bold text-amber-800 mb-3 text-center text-lg">Rumus Jumlah n Suku Pertama (Sn)</h3>
         <div className="grid md:grid-cols-2 gap-4">
           <div className="bg-white border-2 border-amber-300 p-4 rounded-lg text-center">
              <span className="text-xs text-amber-700 font-bold block mb-2 uppercase">Jika suku ke-n (Un) diketahui</span>
              <div className="font-mono text-xl font-bold text-amber-800">
                Sn = ½n(a + Un)
              </div>
           </div>
           <div className="bg-white border-2 border-amber-300 p-4 rounded-lg text-center">
              <span className="text-xs text-amber-700 font-bold block mb-2 uppercase">Jika hanya a dan b yang diketahui</span>
              <div className="font-mono text-xl font-bold text-amber-800">
                Sn = ½n(2a + (n-1)b)
              </div>
           </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
         <h4 className="font-bold text-slate-700 mb-2">Contoh Soal:</h4>
         <p className="text-sm text-slate-600 mb-2">Berapa jumlah 10 suku pertama dari deret: 2 + 5 + 8 + 11 + ... ?</p>
         <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded font-mono border">
            a = 2, b = 3, n = 10 <br/>
            S₁₀ = ½(10) [2(2) + (10-1)3] <br/>
            S₁₀ = 5 [4 + (9 × 3)] <br/>
            S₁₀ = 5 [4 + 27] <br/>
            S₁₀ = 5 × 31 = <strong>155</strong>
         </div>
      </div>
    </div>
  );
}

function BDBarisanGeometriContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Barisan Geometri</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Barisan Geometri</strong> adalah barisan bilangan dimana rasio (perbandingan) antara dua suku yang berurutan selalu <strong>konstan/tetap</strong>. Cirinya adalah selalu <strong>dikali</strong> atau <strong>dibagi</strong> dengan angka yang tetap.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white flex-1 border border-pink-200 p-5 rounded-xl shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 text-4xl opacity-10 pointer-events-none">✖️</div>
           <h3 className="font-bold text-pink-800 mb-3">Rumus Suku ke-n (Un)</h3>
           <div className="mb-4 bg-pink-50 border-2 border-pink-200 p-3 rounded font-mono text-center text-xl font-bold text-pink-700">
             Un = a × rⁿ⁻¹
           </div>
           <ul className="text-sm text-pink-900 space-y-1">
             <li><strong>a</strong> = suku pertama (U₁)</li>
             <li><strong>r</strong> = rasio (U₂ / U₁)</li>
             <li><strong>n</strong> = urutan suku</li>
           </ul>
        </div>
        
        <div className="bg-slate-50 flex-1 border border-slate-200 p-5 rounded-xl shadow-sm">
           <h4 className="font-bold text-slate-700 mb-2">Contoh Barisan:</h4>
           <div className="font-mono bg-white p-2 border rounded mb-2 text-center text-pink-600 font-bold">2, 6, 18, 54, ...</div>
           <p className="text-sm text-slate-600 mb-3">
             Rasio (r) = 6 ÷ 2 = <strong>3</strong>. <br/>
             Suku pertama (a) = <strong>2</strong>.
           </p>
           <h4 className="font-bold text-slate-700 text-sm mt-3">Mencari U₅:</h4>
           <div className="text-sm text-slate-600 bg-white p-3 rounded font-mono border">
             U₅ = 2 × 3⁵⁻¹ <br/>
             U₅ = 2 × 3⁴ <br/>
             U₅ = 2 × 81 = <strong>162</strong>
           </div>
        </div>
      </div>
    </div>
  );
}

function BDDeretGeometriContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Deret Geometri</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Deret Geometri</strong> adalah jumlah dari suku-suku pada barisan geometri. Rumusnya bergantung pada nilai dari rasio (r) tersebut.
      </p>

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl shadow-sm mb-6">
         <h3 className="font-bold text-emerald-800 mb-3 text-center text-lg">Rumus Jumlah n Suku Pertama (Sn)</h3>
         <div className="grid md:grid-cols-2 gap-4">
           <div className="bg-white border-2 border-emerald-300 p-4 rounded-lg text-center">
              <span className="text-xs text-emerald-700 font-bold block mb-2 uppercase">Jika rasio r &gt; 1 (Membesar)</span>
              <div className="font-mono text-lg font-bold text-emerald-800 bg-emerald-50 py-2 rounded">
                Sn = a(rⁿ - 1) / (r - 1)
              </div>
           </div>
           <div className="bg-white border-2 border-emerald-300 p-4 rounded-lg text-center">
              <span className="text-xs text-emerald-700 font-bold block mb-2 uppercase">Jika rasio r &lt; 1 (Mengecil / Pecahan)</span>
              <div className="font-mono text-lg font-bold text-emerald-800 bg-emerald-50 py-2 rounded">
                Sn = a(1 - rⁿ) / (1 - r)
              </div>
           </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
         <h4 className="font-bold text-slate-700 mb-2">Deret Geometri Tak Hingga</h4>
         <p className="text-sm text-slate-600 mb-2">Bila sukunya berlanjut terus sampai tak terhingga (khusus rasio antara -1 dan 1), jumlah totalnya adalah memusat bertahap pada <code className="bg-slate-100 px-1 font-bold">S∞ = a / (1 - r)</code>.</p>
      </div>
    </div>
  );
}
function MateriBarisanContent() { return <SimpleTopicContent title="Barisan dan Deret" desc="Barisan adalah urutan susunan angka, huruf, atau objek lainnya berdasarkan suatu pola. Deret adalah jumlah dari suku-suku pada barisan tersebut." /> }
// ================= LINGKARAN COMPONENTS =================
function LingkaranUnsurContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Unsur-unsur Lingkaran</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Lingkaran</strong> adalah kumpulan titik-titik pada garis lengkung yang mempunyai jarak yang sama terhadap pusat lingkaran.
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="bg-white border text-center border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-center items-center">
          <svg viewBox="0 0 200 200" className="w-[80%] max-w-[250px] drop-shadow-md">
            {/* Lingkaran Luar */}
            <circle cx="100" cy="100" r="90" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
            
            {/* Juring (Tebal) */}
            <path d="M 100 100 L 100 10 A 90 90 0 0 1 183 66 Z" fill="#bbf7d0" stroke="#22c55e" strokeWidth="2" />
            
            {/* Tembereng (Tebal) */}
            <path d="M 15 66 A 90 90 0 0 0 47 172 L 15 66" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
            {/* Tali Busur untuk Tembereng */}
            <line x1="15" y1="66" x2="47" y2="172" stroke="#dc2626" strokeWidth="3" />

            {/* Jari-jari 1 */}
            <line x1="100" y1="100" x2="100" y2="10" stroke="#3b82f6" strokeWidth="3" />
            {/* Jari-jari 2 */}
            <line x1="100" y1="100" x2="183" y2="66" stroke="#3b82f6" strokeWidth="3" />
            
            {/* Diameter */}
            <line x1="28" y1="154" x2="172" y2="46" stroke="#8b5cf6" strokeWidth="3" />
            
            {/* Apotema */}
            <line x1="100" y1="100" x2="31" y2="119" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4" />

            {/* Titik Pusat */}
            <circle cx="100" cy="100" r="4" fill="#0f172a" />
          </svg>
          <p className="text-xs text-slate-500 italic mt-3">Ilustrasi Unsur Lingkaran</p>
        </div>

        <div className="space-y-3">
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 text-sm">
             <div className="w-4 h-4 rounded-full bg-slate-800 shrink-0 mt-0.5"></div>
             <div><strong>Titik Pusat (O):</strong> Titik tengah lingkaran.</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 text-sm">
             <div className="w-4 h-4 rounded border-2 border-blue-500 shrink-0 mt-0.5"></div>
             <div><strong>Jari-jari (r):</strong> Jarak dari titik pusat ke lengkung lingkaran.</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 text-sm">
             <div className="w-4 h-4 rounded border-2 border-purple-500 shrink-0 mt-0.5"></div>
             <div><strong>Diameter (d):</strong> Garis lurus yang melalui titik pusat dan membagi lingkaran jadi dua. <br/><span className="text-xs text-purple-700 font-bold">d = 2r</span></div>
           </div>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 text-sm">
             <div className="w-4 h-4 rounded border-2 border-slate-600 bg-slate-200 shrink-0 mt-0.5"></div>
             <div><strong>Busur:</strong> Garis lengkung pada tepi/keliling lingkaran.</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 text-sm">
             <div className="w-4 h-4 rounded border-2 border-red-600 shrink-0 mt-0.5"></div>
             <div><strong>Tali Busur:</strong> Garis lurus yang menghubungkan dua titik pada lingkaran, <em>tanpa</em> melalui pusat.</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 text-sm">
             <div className="w-4 h-4 rounded border-2 border-amber-500 shrink-0 mt-0.5 border-dashed"></div>
             <div><strong>Apotema:</strong> Jarak terpendek tegak lurus dari titik pusat ke tali busur.</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 text-sm">
             <div className="w-4 h-4 rounded bg-green-200 border border-green-500 shrink-0 mt-0.5"></div>
             <div><strong>Juring:</strong> Daerah yang dibatasi dua jari-jari dan satu busur (mirip potongan pizza).</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 text-sm">
             <div className="w-4 h-4 rounded bg-red-200 border border-red-500 shrink-0 mt-0.5"></div>
             <div><strong>Tembereng:</strong> Daerah yang dibatasi oleh tali busur dan busur.</div>
           </div>
        </div>
      </div>
    </div>
  );
}

function LingkaranKelilingLuasContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Keliling dan Luas Lingkaran</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Keliling adalah panjang seluruh garis lengkung yang mengelilingi lingkaran, sedangkan Luas adalah besaran daerah di dalam lingkaran tersebut. Perhitungan ini menggunakan konstanta <strong>π (Pi)</strong> bernilai <code className="bg-slate-100 px-1 font-bold text-slate-700">22/7</code> atau <code className="bg-slate-100 px-1 font-bold text-slate-700">3,14</code>.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-sky-50 border border-sky-200 p-6 rounded-xl shadow-sm text-center">
           <h3 className="font-bold text-sky-800 mb-3 text-lg uppercase tracking-wider">Keliling (K)</h3>
           <div className="font-mono text-2xl font-bold text-sky-900 bg-white border border-sky-300 py-3 rounded-lg">
             K = 2 × π × r
           </div>
           <div className="text-sm font-bold text-sky-700 mt-2">atau</div>
           <div className="font-mono text-xl font-bold text-sky-800 mt-2">
             K = π × d
           </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl shadow-sm text-center">
           <h3 className="font-bold text-emerald-800 mb-3 text-lg uppercase tracking-wider">Luas (L)</h3>
           <div className="font-mono text-2xl font-bold text-emerald-900 bg-white border border-emerald-300 py-3 rounded-lg">
             L = π × r²
           </div>
           <div className="text-sm font-bold text-emerald-700 mt-2">atau</div>
           <div className="font-mono text-xl font-bold text-emerald-800 mt-2">
             L = ¼ × π × d²
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6 mt-4">
        <div className="flex-1">
          <h4 className="font-bold text-slate-700 mb-2">Tips Penggunaan π:</h4>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
            <li>Gunakan <strong>22/7</strong> jika jari-jari (r) atau diameter (d) merupakan kelipatan 7 (misal: 7, 14, 21, 28, 35).</li>
            <li>Gunakan <strong>3,14</strong> jika jari-jari (r) atau diameter (d) bukan kelipatan 7 (misal: 5, 10, 20).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LingkaranBusurJuringContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Panjang Busur dan Luas Juring</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Busur adalah sebagian kecil dari Keliling Lingkaran, sedangkan Juring adalah sebagian kecil dari Luas Lingkaran. Berapa bagiannya? Tergantung pada besarnya <strong>Sudut Pusat (α)</strong>.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl shadow-sm">
           <h3 className="font-bold text-indigo-800 mb-3 text-center">Panjang Busur</h3>
           <div className="bg-white p-3 border border-indigo-100 rounded text-center text-sm font-bold text-indigo-700 mb-3">
              Panjang Busur = (α / 360°) × Keliling Lingkaran
           </div>
           <div className="bg-white p-3 border border-indigo-100 rounded text-center text-sm text-indigo-900 font-mono">
              = (α / 360°) × 2πr
           </div>
        </div>
        
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl shadow-sm">
           <h3 className="font-bold text-rose-800 mb-3 text-center">Luas Juring</h3>
           <div className="bg-white p-3 border border-rose-100 rounded text-center text-sm font-bold text-rose-700 mb-3">
              Luas Juring = (α / 360°) × Luas Lingkaran
           </div>
           <div className="bg-white p-3 border border-rose-100 rounded text-center text-sm text-rose-900 font-mono">
              = (α / 360°) × πr²
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl mt-4">
         <h4 className="font-bold text-slate-700 mb-2 text-sm italic border-b pb-2">Contoh Praktis:</h4>
         <p className="text-sm text-slate-600 mb-3">Sebuah juring berpotongan dengan sudut pusat 90° dan jari-jari 14cm.</p>
         <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
           <li>Sudut pusat = 90°. Bagian lingkaran = 90° / 360° = <strong>¼ bagian</strong>.</li>
           <li>Keliling utuh = 2 × 22/7 × 14 = 88 cm.</li>
           <li><strong>Panjang busur</strong> = ¼ × 88 cm = <strong>22 cm</strong>.</li>
           <li>Luas utuh = 22/7 × 14 × 14 = 616 cm².</li>
           <li><strong>Luas Juring</strong> = ¼ × 616 cm² = <strong>154 cm²</strong>.</li>
         </ul>
      </div>
    </div>
  );
}

function LingkaranSudutContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Sudut Pusat dan Sudut Keliling</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Ada dua tipe sudut yang menatap atau menghadap busur yang sama pada sebuah lingkaran: <strong>Sudut Pusat</strong> dan <strong>Sudut Keliling</strong>.
      </p>

      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl mb-6">
         <ul className="text-sm text-slate-700 space-y-4">
            <li className="flex gap-4 items-start">
               <div className="w-10 h-10 shrink-0 bg-blue-100 text-blue-700 font-bold rounded flex items-center justify-center">1</div>
               <div>
                 <strong>Sudut Pusat:</strong> Sudut yang titik sudutnya tepat berada di pusat lingkaran O. Menghadap langsung ke sebuah busur.
               </div>
            </li>
            <li className="flex gap-4 items-start">
               <div className="w-10 h-10 shrink-0 bg-rose-100 text-rose-700 font-bold rounded flex items-center justify-center">2</div>
               <div>
                 <strong>Sudut Keliling:</strong> Sudut yang titik sudutnya berada mendarat tepat pada ruas keliling/garis lengkung lingkaran, dan kakinya juga menghadap busur.
               </div>
            </li>
         </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl shadow-sm text-center">
         <h3 className="font-bold text-amber-800 mb-4 uppercase tracking-wider text-sm">Rumus Penting (Syarat: Menghadap busur yang sama)</h3>
         <div className="grid md:grid-cols-2 gap-4">
           <div className="bg-white border-2 border-amber-300 py-3 rounded-lg px-4 flex flex-col items-center justify-center">
             <div className="text-xs text-amber-600 font-bold mb-1 uppercase">Mencari Sudut Pusat</div>
             <div className="font-mono font-bold text-xl text-amber-900">
               Sudut Pusat = 2 × Sudut Keliling
             </div>
           </div>
           <div className="bg-white border-2 border-amber-300 py-3 rounded-lg px-4 flex flex-col items-center justify-center">
             <div className="text-xs text-amber-600 font-bold mb-1 uppercase">Mencari Sudut Keliling</div>
             <div className="font-mono font-bold text-xl text-amber-900">
               Sudut Keliling = ½ × Sudut Pusat
             </div>
           </div>
         </div>
         <p className="text-sm text-amber-800 mt-4 font-bold italic">
            *Semua sudut keliling yang menghadap busur yang bernilai sama, maka nilai sudut kelilingnya semuanya pasti sama!
         </p>
      </div>
    </div>
  );
}

function LingkaranGarisSinggungContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Garis Singgung Lingkaran</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        <strong>Garis singgung lingkaran</strong> adalah sebuah garis yang menyentuh lingkaran <em>tepat di satu titik</em> di sisi luarnya. Sifat utamanya adalah: garis singgung <strong>selalu tegak lurus (membentuk sudut 90°)</strong> terhadap jari-jari yang tepat jatuh di titik singgung tersebut.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-sm space-y-4 text-slate-700">
         <h3 className="font-bold text-slate-800 text-base mb-3 border-b pb-2">Garis Singgung Persekutuan Dua Lingkaran</h3>
         <p className="mb-4">Bila terdapat dua lingkaran yang terpisah (Lingkaran besar berpusat P dan jari-jari R, serta Lingkaran kecil berpusat Q dan jari-jari r, di mana jarak pusat P ke pusat Q kita sebut d), terdapat dua jenis garis singgung persekutuannya:</p>

         <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
           <h4 className="font-bold text-blue-700 mb-2">1. Garis Singgung Persekutuan Luar (l)</h4>
           <p className="mb-2">Garis lurus yang menempel pada sisi "atas-atas" atau "bawah-bawah" kedua lingkaran.</p>
           <div className="font-mono bg-white p-2 border rounded font-bold text-center text-blue-900">
             l = √(d² - (R - r)²)
           </div>
         </div>

         <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
           <h4 className="font-bold text-rose-700 mb-2">2. Garis Singgung Persekutuan Dalam (d_dalam)</h4>
           <p className="mb-2">Garis bersilang (menyilang) di ruang antara kedua lingkaran.</p>
           <div className="font-mono bg-white p-2 border rounded font-bold text-center text-rose-900">
             d_dalam = √(d² - (R + r)²)
           </div>
         </div>
      </div>
    </div>
  );
}
// ================= SPLDV COMPONENTS =================
function SPLDVKonsepContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Konsep SPLDV</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong>Sistem Persamaan Linear Dua Variabel (SPLDV)</strong> adalah kumpulan dua atau lebih persamaan linear dua variabel yang saling terkait dan memiliki satu penyelesaian.
      </p>
      <div className="bg-indigo-50 p-6 border border-indigo-100 rounded-xl shadow-sm text-center">
         <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-3">Bentuk Umum</h3>
         <div className="font-mono text-xl font-bold text-indigo-700 bg-white inline-block px-6 py-4 rounded-lg border-2 border-indigo-200">
           ax + by = c <br/>
           px + qy = r
         </div>
         <p className="mt-4 text-xs text-indigo-800 italic">x dan y adalah variabel, sedangkan a, b, p, q, c, r adalah konstanta/koefisien.</p>
      </div>
    </div>
  );
}

function SPLDVGrafikContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-800">Metode Grafik</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Penyelesaian SPLDV dengan metode grafik adalah mencari <strong>titik potong</strong> antara dua garis. Koordinat (x, y) pada titik temu itulah yang menjadi jawabannya.
          </p>
          
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg">
              <h4 className="font-bold text-amber-800 text-sm mb-2 uppercase tracking-wide">Langkah Penyelesaian:</h4>
              <ul className="text-sm text-amber-900 space-y-3">
                <li className="flex gap-3">
                  <span className="bg-amber-200 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                  <span><strong>Gambar Garis 1:</strong> Tentukan titik potong sumbu-x (y=0) dan sumbu-y (x=0).</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-amber-200 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                  <span><strong>Gambar Garis 2:</strong> Lakukan hal yang sama untuk persamaan kedua.</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-amber-200 text-amber-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                  <span><strong>Cari Titik Temu:</strong> Perhatikan di mana kedua garis bersilangan. Titik itulah Himpunan Penyelesaiannya (HP).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 shrink-0 bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
          <div className="text-xs font-bold text-slate-400 mb-2">ILUSTRASI GRAFIK</div>
          <svg viewBox="0 0 100 100" className="w-full h-auto bg-slate-50 rounded border border-slate-100">
            {/* Grid */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#cbd5e1" strokeWidth="1" />
            {/* Lines */}
            <line x1="10" y1="90" x2="90" y2="10" stroke="#4f46e5" strokeWidth="2" />
            <line x1="10" y1="60" x2="90" y2="60" stroke="#f59e0b" strokeWidth="2" />
            {/* Point */}
            <circle cx="60" cy="40" r="4" fill="#f43f5e" />
            <text x="65" y="35" fontSize="8" fill="#f43f5e" fontWeight="bold">(x,y)</text>
          </svg>
          <p className="text-[10px] text-slate-400 mt-2">Garis saling berpotongan di satu titik</p>
        </div>
      </div>
    </div>
  );
}

function SPLDVSubstitusiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Metode Substitusi (Mengganti)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Metode ini dilakukan dengan cara <strong>menyatakan satu variabel</strong> ke dalam variabel lain dari satu persamaan, kemudian <strong>memasukkannya</strong> ke persamaan lainnya.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
          <h4 className="font-bold text-emerald-800 text-sm mb-3 underline">CONTOH SOAL:</h4>
           <div className="space-y-2 text-sm font-mono text-emerald-900">
              <p>1) x + y = 5</p>
              <p>2) 2x + y = 8</p>
           </div>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-xl shadow-sm">
           <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
             ALUR PENYELESAIAN
           </h4>
           <div className="space-y-4 relative pl-6 border-l-2 border-emerald-100 italic text-sm">
              <div>
                <p className="font-bold text-emerald-700">Langkah 1: Ubah Persamaan</p>
                <p className="text-slate-500 text-xs mt-1">Ubah (1) menjadi: <strong className="text-emerald-600">x = 5 - y</strong></p>
              </div>
              <div>
                <p className="font-bold text-emerald-700">Langkah 2: Substitusi (Masukan)</p>
                <p className="text-slate-500 text-xs mt-1">Ganti x di (2) dengan (5-y):<br/> 2(<strong className="text-emerald-600">5 - y</strong>) + y = 8</p>
              </div>
              <div>
                <p className="font-bold text-emerald-700">Langkah 3: Hitung Variabel</p>
                <p className="text-slate-500 text-xs mt-1">10 - 2y + y = 8 <br/> -y = -2 &rArr; <strong className="text-emerald-600">y = 2</strong></p>
              </div>
              <div>
                <p className="font-bold text-emerald-700">Langkah 4: Cari Variabel Lain</p>
                <p className="text-slate-500 text-xs mt-1">Masukan y=2 ke x = 5-2 = <strong className="text-emerald-600">3</strong></p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function SPLDVEliminasiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Metode Eliminasi (Menghilangkan)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Metode ini dilakukan dengan cara <strong>menyamakan koefisien</strong> salah satu variabel agar variabel tersebut "hilang" (habis) saat kedua persamaan dijumlahkan atau dikurangkan.
      </p>

      <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl">
        <h4 className="font-bold text-rose-800 text-sm mb-4">Langkah Menghilangkan Variabel:</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
             <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-rose-200 text-rose-800 rounded flex items-center justify-center font-bold text-xs">1</div>
                <p className="text-sm text-slate-700"><strong>Pilih sasaran:</strong> Misal kita ingin menghilangkan <strong className="text-rose-600">y</strong>.</p>
             </div>
             <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-rose-200 text-rose-800 rounded flex items-center justify-center font-bold text-xs">2</div>
                <p className="text-sm text-slate-700"><strong>Samakan:</strong> Jika angka depan y berbeda, kalikan kedua persamaan agar angkanya sama.</p>
             </div>
          </div>
          <div className="space-y-3">
             <div className="flex gap-3">
                <div className="w-6 h-6 shrink-0 bg-rose-200 text-rose-800 rounded flex items-center justify-center font-bold text-xs">3</div>
                <div className="text-sm text-slate-700">
                   <strong>Jumlah atau Kurang:</strong>
                   <ul className="list-disc pl-4 text-xs mt-1 space-y-1">
                      <li>Tanda <strong>sama</strong> (+ dengan +) &rarr; <strong>KURANGKAN</strong></li>
                      <li>Tanda <strong>beda</strong> (+ dengan -) &rarr; <strong>JUMLAHKAN</strong></li>
                   </ul>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm text-center">
         <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase">Contoh Visual Ekseskusi:</h4>
         <div className="inline-block text-left font-mono text-sm space-y-1 bg-slate-900 text-emerald-400 p-4 rounded-lg shadow-lg">
            <p>2x + y = 8</p>
            <p className="border-b border-white/20 pb-1">x + y = 5 <span className="text-rose-400 ml-4 font-bold">(-) Kurangi y</span></p>
            <p className="pt-1 text-white font-bold">x = 3</p>
         </div>
         <p className="text-[10px] text-slate-400 mt-2 italic">Karena y memiliki angka yang sama (1) dan tanda sama-sama (+), maka dikurangi.</p>
      </div>
    </div>
  );
}

function SPLDVModelContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Membuat Model Matematika</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Mengubah soal cerita menjadi bentuk SPLDV sangat penting untuk penyelesaian masalah nyata.
      </p>
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <h4 className="font-bold text-slate-700 mb-3 text-sm">Tips Pemodelan:</h4>
        <ul className="text-sm text-slate-600 space-y-3">
          <li className="flex gap-2">
            <span className="font-bold text-indigo-500">1.</span>
            Tentukan apa yang ditanya dan misalkan sebagai <strong>x</strong> dan <strong>y</strong>.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-indigo-500">2.</span>
            Susun kalimat matematika berdasarkan informasi di soal.
          </li>
        </ul>
        <div className="mt-4 bg-slate-50 p-3 rounded text-xs italic">
          Contoh: "Harga 2 buku dan 3 pensil adalah Rp 12.000." <br/>
          Model: 2x + 3y = 12.000
        </div>
      </div>
    </div>
  );
}

function MateriSPLDVContent() { return <SimpleTopicContent title="Sistem Persamaan Linear Dua Variabel (SPLDV)" desc="Cara menyelesaikan SPLDV ada beberapa metode: Substitusi (mengganti), Eliminasi (menghilangkan), dan Campuran, serta menggunakan Grafik Miring." /> }
// ================= KESEBANGUNAN & KEKONGRUENAN COMPONENTS =================
function GKKonsepContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Konsep Dasar Geometri</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Dalam geometri, kita membedakan hubungan antara dua bangun datar menjadi dua kategori utama: <strong>Kongruen</strong> (Sama dan Sebangun) serta <strong>Sebangun</strong>.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-5 border border-indigo-100 rounded-xl">
          <h3 className="font-bold text-indigo-800 mb-2">Kongruen (≅)</h3>
          <p className="text-xs text-indigo-700 leading-relaxed italic">
            "Sama persis secara bentuk dan ukuran."
          </p>
          <ul className="mt-3 text-xs text-slate-600 space-y-1 list-disc pl-4">
            <li>Sisi-sisi yang bersesuaian sama panjang.</li>
            <li>Sudut-sudut yang bersesuaian sama besar.</li>
          </ul>
        </div>
        <div className="bg-emerald-50 p-5 border border-emerald-100 rounded-xl">
          <h3 className="font-bold text-emerald-800 mb-2">Sebangun (∼)</h3>
          <p className="text-xs text-emerald-700 leading-relaxed italic">
            "Bentuk sama, namun ukuran berbeda (skala)."
          </p>
          <ul className="mt-3 text-xs text-slate-600 space-y-1 list-disc pl-4">
            <li>Sisi-sisi yang bersesuaian memiliki perbandingan yang senilai.</li>
            <li>Sudut-sudut yang bersesuaian tetap sama besar.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function GKKongruenContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Kekongruenan Bangun Datar</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Dua bangun datar dikatakan kongruen jika memenuhi syarat:
      </p>
      <div className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-sm text-sm text-slate-700 space-y-2">
        <p>1. Sudut-sudut yang bersesuaian <strong>sama besar</strong>.</p>
        <p>2. Sisi-sisi yang bersesuaian <strong>sama panjang</strong>.</p>
      </div>
      
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 text-sm">Contoh: Dua Segitiga Kongruen</h3>
        <div className="flex justify-center gap-12 items-center">
          <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-sm">
             <polygon points="20,80 80,80 50,20" fill="#818cf8" stroke="#4338ca" strokeWidth="2" />
             <text x="10" y="85" fontSize="10" fontWeight="bold">A</text>
             <text x="85" y="85" fontSize="10" fontWeight="bold">B</text>
             <text x="45" y="15" fontSize="10" fontWeight="bold">C</text>
          </svg>
          <div className="text-2xl font-bold text-indigo-400">≅</div>
          <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-sm">
             <polygon points="20,80 80,80 50,20" fill="#818cf8" stroke="#4338ca" strokeWidth="2" />
             <text x="10" y="85" fontSize="10" fontWeight="bold">D</text>
             <text x="85" y="85" fontSize="10" fontWeight="bold">E</text>
             <text x="45" y="15" fontSize="10" fontWeight="bold">F</text>
          </svg>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4 italic">
          Δ ABC ≅ Δ DEF jika AB=DE, BC=EF, AC=DF dan ∠A=∠D, ∠B=∠E, ∠C=∠F.
        </p>
      </div>
    </div>
  );
}

function GKSebangunContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Kesebangunan Bangun Datar</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Syarat dua bangun datar sebangun:
      </p>
      <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">1</div>
          <p className="text-sm text-emerald-900">Perbandingan panjang sisi yang bersesuaian adalah <strong>sama (senilai)</strong>.</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">2</div>
          <p className="text-sm text-emerald-900">Sudut-sudut yang bersesuaian <strong>sama besar</strong>.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-xl text-center">
        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Visualisasi Skala</h3>
        <div className="flex justify-center gap-12 items-baseline">
           <div className="flex flex-col items-center">
             <div className="w-12 h-8 bg-emerald-100 border-2 border-emerald-500 rounded flex items-center justify-center text-[10px] font-bold">2×3</div>
             <span className="text-[10px] mt-1">Bangun A</span>
           </div>
           <div className="text-xl font-bold text-emerald-300">∼</div>
           <div className="flex flex-col items-center">
             <div className="w-24 h-16 bg-emerald-100 border-2 border-emerald-500 rounded flex items-center justify-center text-[10px] font-bold">4×6</div>
             <span className="text-[10px] mt-1 text-emerald-700 font-bold">Bangun B (Skala 1:2)</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function GKSegitigaKhususContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Kesebangunan pada Segitiga</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Pada segitiga, ada beberapa kondisi khusus yang sering muncul dalam soal ujian, seperti garis sejajar di dalam segitiga.
      </p>
      
      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
           <svg width="150" height="120" viewBox="0 0 150 120" className="shrink-0 bg-white p-2 rounded border border-amber-100">
              <polygon points="75,10 140,110 10,110" fill="none" stroke="#b45309" strokeWidth="2" />
              <line x1="42.5" y1="60" x2="107.5" y2="60" stroke="#b45309" strokeWidth="2" strokeDasharray="4" />
              <text x="70" y="5" fontSize="10">A</text>
              <text x="35" y="65" fontSize="10">D</text>
              <text x="110" y="65" fontSize="10">E</text>
              <text x="2" y="115" fontSize="10">B</text>
              <text x="142" y="115" fontSize="10">C</text>
           </svg>
           <div className="flex-1">
             <h4 className="font-bold text-amber-900 text-sm mb-2 uppercase italic tracking-tighter">Perbandingan pada Garis Sejajar</h4>
             <p className="text-sm text-amber-800 mb-3 leading-relaxed">Jika DE sejajar dengan BC (DE // BC), maka Δ ADE sebangun dengan Δ ABC.</p>
             <div className="bg-white p-3 rounded border-2 border-amber-200 font-mono text-sm inline-block font-bold">
                AD/AB = AE/AC = DE/BC
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function GKSolusiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Langkah Penyelesaian Soal Kesebangunan</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Berikut adalah panduan praktis untuk mengerjakan soal yang melibatkan dua bangun yang sebangun:
      </p>

      <div className="space-y-4">
        <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shrink-0">1</div>
           <div>
             <h4 className="font-bold text-indigo-700 text-sm">Identifikasi Bangun</h4>
             <p className="text-xs text-slate-500 mt-1">Pastikan dua bangun tersebut terbukti sebangun (cek sudut-sudutnya).</p>
           </div>
        </div>
        <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shrink-0">2</div>
           <div>
             <h4 className="font-bold text-indigo-700 text-sm">Pasangkan Sisi Bersesuaian</h4>
             <p className="text-xs text-slate-500 mt-1">Cari sisi-sisi yang posisinya mirip (misal: alas dengan alas, tinggi dengan tinggi).</p>
           </div>
        </div>
        <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shrink-0">3</div>
           <div>
              <h4 className="font-bold text-indigo-700 text-sm">Gunakan Perkalian Silang</h4>
              <p className="text-xs text-slate-500 mt-1">Buat persamaan perbandingan: <br/><code className="bg-slate-100 px-1 rounded">x/a = y/b</code>, lalu kalikan silang.</p>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 text-emerald-400 p-5 rounded-xl font-mono text-xs overflow-x-auto">
         <p className="text-white mb-2 font-bold">// CONTOH APLIKASI PERHITUNGAN</p>
         <p>Tinggi pohon (tp) = x m, tinggi tongkat (tt) = 2 m</p>
         <p>Bayangan pohon (bp) = 15 m, bayangan tongkat (bt) = 3 m</p>
         <p className="mt-2">// Rumus: tp/tt = bp/bt</p>
         <p>x / 2 = 15 / 3</p>
         <p>x / 2 = 5</p>
         <p>x = 5 * 2 &rarr; <span className="text-emerald-300 font-bold">x = 10 meter</span></p>
      </div>
    </div>
  );
}

// ================= BANGUN RUANG SISI LENGKUNG COMPONENTS =================
function BRSLTabungContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">1. Tabung (Silinder)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Tabung adalah bangun ruang yang dibatasi oleh dua buah lingkaran yang sejajar dan kongruen (alas & tutup) serta sebuah selimut yang berbentuk persegi panjang jika dibentangkan.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
           <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Bentuk 3D</p>
                <svg width="80" height="100" viewBox="0 0 80 100">
                  <ellipse cx="40" cy="15" rx="35" ry="10" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                  <path d="M5,15 L5,85 A35,10 0 0,0 75,85 L75,15" fill="none" stroke="#0284c7" strokeWidth="2" />
                  <ellipse cx="40" cy="85" rx="35" ry="10" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
                  <line x1="40" y1="15" x2="73" y2="15" stroke="#0284c7" strokeWidth="1" strokeDasharray="2" />
                  <text x="50" y="12" fontSize="8" fill="#0369a1">r</text>
                  <line x1="78" y1="15" x2="78" y2="85" stroke="#0284c7" strokeWidth="1" strokeDasharray="2" />
                  <text x="80" y="55" fontSize="8" fill="#0369a1">t</text>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Jaring-jaring</p>
                <svg width="120" height="120" viewBox="0 0 120 120">
                   <circle cx="60" cy="15" r="15" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" />
                   <rect x="15" y="32" width="90" height="55" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                   <circle cx="60" cy="102" r="15" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" />
                </svg>
              </div>
           </div>
        </div>

        <div className="space-y-4">
           <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
              <h4 className="font-bold text-sky-800 text-sm mb-2">Rumus Tabung:</h4>
              <div className="space-y-2 font-mono text-sm">
                 <div className="bg-white p-2 rounded border border-sky-100 italic">
                    <span className="font-bold text-sky-600">Volume (V):</span> π × r² × t
                 </div>
                 <div className="bg-white p-2 rounded border border-sky-100 italic">
                    <span className="font-bold text-sky-600">Luas Selimut:</span> 2 × π × r × t
                 </div>
                 <div className="bg-white p-2 rounded border border-sky-100 italic">
                    <span className="font-bold text-sky-600">Luas Permukaan:</span> 2πr(r + t)
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function BRSLKerucutContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">2. Kerucut (Cone)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Kerucut adalah bangun ruang yang dibatasi oleh sebuah sisi alas berbentuk lingkaran dan sebuah sisi lengkung (selimut) yang mengerucut ke satu titik puncak.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
           <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Bentuk 3D</p>
                <svg width="80" height="100" viewBox="0 0 80 100">
                  <path d="M40,10 L5,85 A35,10 0 0,0 75,85 Z" fill="#fff1f2" stroke="#e11d48" strokeWidth="2" />
                  <ellipse cx="40" cy="85" rx="35" ry="10" fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="2" />
                  <line x1="40" y1="10" x2="40" y2="85" stroke="#e11d48" strokeWidth="1" strokeDasharray="3" />
                  <text x="32" y="55" fontSize="8" fill="#be123c">t</text>
                  <line x1="40" y1="85" x2="73" y2="85" stroke="#e11d48" strokeWidth="1" strokeDasharray="2" />
                  <text x="55" y="82" fontSize="8" fill="#be123c">r</text>
                  <text x="65" y="45" fontSize="8" fill="#be123c" transform="rotate(65 65,45)">s (apotema)</text>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Jaring-jaring</p>
                <svg width="120" height="120" viewBox="0 0 120 120">
                   <path d="M60,60 L20,30 A50,50 0 0,1 100,30 Z" fill="#fff1f2" stroke="#e11d48" strokeWidth="1.5" />
                   <circle cx="60" cy="90" r="15" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.5" />
                </svg>
              </div>
           </div>
        </div>

        <div className="space-y-4">
           <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <h4 className="font-bold text-rose-800 text-sm mb-2">Rumus Kerucut:</h4>
              <div className="space-y-2 font-mono text-sm">
                 <div className="bg-white p-2 rounded border border-rose-100 italic">
                    <span className="font-bold text-rose-600">Garis Pelukis (s):</span> √(r² + t²)
                 </div>
                 <div className="bg-white p-2 rounded border border-rose-100 italic">
                    <span className="font-bold text-rose-600">Volume (V):</span> ⅓ × π × r² × t
                 </div>
                 <div className="bg-white p-2 rounded border border-rose-100 italic">
                    <span className="font-bold text-rose-600">Luas Selimut:</span> π × r × s
                 </div>
                 <div className="bg-white p-2 rounded border border-rose-100 italic">
                    <span className="font-bold text-rose-600">Luas Permukaan:</span> πr(r + s)
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function BRSLBolaContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">3. Bola (Sphere)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Bola adalah bangun ruang yang dibatasi oleh sebuah sisi lengkung dimana setiap titik pada permukaannya memiliki jarak yang sama terhadap titik pusat.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
           <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
              <defs>
                <radialGradient id="ballGrad" cx="35%" cy="35%" r="50%">
                  <stop offset="0%" stopColor="#f5f3ff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </radialGradient>
              </defs>
              <circle cx="60" cy="60" r="55" fill="url(#ballGrad)" />
              <ellipse cx="60" cy="60" rx="55" ry="15" fill="none" stroke="#4c1d95" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
              <line x1="60" y1="60" x2="115" y2="60" stroke="#4c1d95" strokeWidth="2" />
              <circle cx="60" cy="60" r="3" fill="#2e1065" />
              <text x="85" y="55" fontSize="10" fontWeight="bold" fill="#2e1065">r</text>
           </svg>
           <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold italic">Bola tidak memiliki jaring-jaring datar yang sempurna.</p>
        </div>

        <div className="space-y-4">
           <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
              <h4 className="font-bold text-violet-800 text-sm mb-2">Rumus Bola:</h4>
              <div className="space-y-2 font-mono text-sm">
                 <div className="bg-white p-2 rounded border border-violet-100 italic">
                    <span className="font-bold text-violet-600">Volume (V):</span> ⁴/₃ × π × r³
                 </div>
                 <div className="bg-white p-2 rounded border border-violet-100 italic">
                    <span className="font-bold text-violet-600">Luas Permukaan:</span> 4 × π × r²
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function BRSLRingkasanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Ringkasan Materi BRSL</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white text-sm">
          <thead>
            <tr className="bg-slate-100">
               <th className="border p-3 text-left">Bangun Ruang</th>
               <th className="border p-3 text-left">Volume</th>
               <th className="border p-3 text-left">Luas Permukaan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
               <td className="border p-3 font-bold">Tabung</td>
               <td className="border p-3 font-mono text-xs">π · r² · t</td>
               <td className="border p-3 font-mono text-xs">2πr(r + t)</td>
            </tr>
            <tr>
               <td className="border p-3 font-bold">Kerucut</td>
               <td className="border p-3 font-mono text-xs">⅓ · π · r² · t</td>
               <td className="border p-3 font-mono text-xs">πr(r + s)</td>
            </tr>
            <tr>
               <td className="border p-3 font-bold">Bola</td>
               <td className="border p-3 font-mono text-xs">⁴/₃ · π · r³</td>
               <td className="border p-3 font-mono text-xs">4 · π · r²</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Fakta Menarik:</strong> Jika sebuah Tabung, Kerucut, dan Bola memiliki tinggi dan jari-jari yang sama (t = 2r), maka perbandingan volumenya adalah <strong>Kerucut : Bola : Tabung = 1 : 2 : 3</strong>.
        </p>
      </div>
    </div>
  );
}

// ================= TRANSFORMASI GEOMETRI COMPONENTS =================
function TGTranslasiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">1. Translasi (Pergeseran)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Translasi adalah pergeseran suatu titik atau bangun datar sepanjang garis lurus dengan arah dan jarak tertentu.
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center">
           <svg viewBox="0 0 100 80" className="w-full max-w-[200px] mx-auto drop-shadow-sm">
             <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                </marker>
             </defs>
             <path d="M10,60 L30,60 L20,40 Z" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" />
             <line x1="20" y1="40" x2="60" y2="20" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrowhead)" />
             <path d="M50,40 L70,40 L60,20 Z" fill="#6366f1" fillOpacity="0.4" stroke="#4338ca" strokeWidth="1" />
             <text x="5" y="70" fontSize="6" fill="#4338ca">A(x,y)</text>
             <text x="55" y="15" fontSize="6" fill="#4338ca" fontWeight="bold">A'(x+a, y+b)</text>
           </svg>
           <p className="text-[10px] text-slate-400 mt-2">Setiap titik bergeser sejauh vektor T(a, b)</p>
        </div>
        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
           <h4 className="font-bold text-indigo-800 text-sm mb-3 uppercase">Rumus Translasi</h4>
           <p className="text-sm text-slate-700 mb-4">Jika titik <strong>A(x, y)</strong> ditranslasikan oleh <strong>T(a, b)</strong>, maka bayangannya adalah:</p>
           <div className="bg-white p-4 rounded-lg border-2 border-indigo-300 font-mono text-center font-bold text-indigo-800 text-xl shadow-sm">
             A' (x + a, y + b)
           </div>
        </div>
      </div>
    </div>
  );
}

function TGRefleksiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">2. Refleksi (Pencerminan)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Refleksi adalah transformasi yang memindahkan setiap titik pada bidang dengan menggunakan sifat bayangan cermin dari titik-titik yang dipindahkan.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-rose-50 text-rose-800">
               <th className="p-3 border-b border-rose-100">Sumbu Cermin</th>
               <th className="p-3 border-b border-rose-100">Bayangan (x', y')</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 font-mono text-xs">
            <tr><td className="p-3 border-b border-slate-100 font-sans">Sumbu X</td><td className="p-3 border-b border-slate-100 font-bold">(x, -y)</td></tr>
            <tr><td className="p-3 border-b border-slate-100 font-sans">Sumbu Y</td><td className="p-3 border-b border-slate-100 font-bold">(-x, y)</td></tr>
            <tr><td className="p-3 border-b border-slate-100 font-sans">Garis y = x</td><td className="p-3 border-b border-slate-100 font-bold">(y, x)</td></tr>
            <tr><td className="p-3 border-b border-slate-100 font-sans">Garis y = -x</td><td className="p-3 border-b border-slate-100 font-bold">(-y, -x)</td></tr>
            <tr><td className="p-3 border-b border-slate-100 font-sans">Titik Asal O(0,0)</td><td className="p-3 border-b border-slate-100 font-bold">(-x, -y)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TGRotasiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">3. Rotasi (Perputaran)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Rotasi adalah transformasi yang memutar setiap titik pada bidang dengan sudut tertentu terhadap suatu titik pusat.
      </p>

      <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
         <h4 className="font-bold text-amber-800 text-sm mb-3">Rotasi Pusat O(0,0):</h4>
         <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-3 rounded-lg border border-amber-200">
               <p className="text-[10px] font-bold text-slate-400 mb-1">90° (Positif)</p>
               <p className="font-mono text-amber-700 font-bold">(-y, x)</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
               <p className="text-[10px] font-bold text-slate-400 mb-1">180°</p>
               <p className="font-mono text-amber-700 font-bold">(-x, -y)</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
               <p className="text-[10px] font-bold text-slate-400 mb-1">270° / -90°</p>
               <p className="font-mono text-amber-700 font-bold">(y, -x)</p>
            </div>
         </div>
         <p className="mt-3 text-[10px] text-amber-700 italic">Catatan: Sudut positif berarti berlawanan arah jarum jam, sudut negatif searah jarum jam.</p>
      </div>
    </div>
  );
}

function TGDilatasiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">4. Dilatasi (Perkalian/Penskalaan)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Dilatasi adalah transformasi yang mengubah ukuran suatu bangun datar tetapi tidak mengubah bentuknya. Perubahan ukuran ini ditentukan oleh <strong>Faktor Skala (k)</strong>.
      </p>

      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center">
           <svg viewBox="0 0 100 100" className="w-full max-w-[200px] mx-auto drop-shadow-sm">
              <rect x="20" y="20" width="20" height="20" fill="#a7f3d0" stroke="#059669" strokeWidth="1" />
              <line x1="0" y1="0" x2="100" y2="100" stroke="#059669" strokeWidth="0.5" strokeDasharray="2" />
              <rect x="40" y="40" width="40" height="40" fill="#10b981" fillOpacity="0.4" stroke="#047857" strokeWidth="1" />
              <text x="18" y="15" fontSize="6" fill="#047857">Asli</text>
              <text x="60" y="38" fontSize="6" fill="#047857" fontWeight="bold">Dilatasi (k=2)</text>
           </svg>
        </div>
        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200">
           <h4 className="font-bold text-emerald-800 text-sm mb-3 uppercase">Rumus Dilatasi Pusat (0,0)</h4>
           <p className="text-sm text-slate-700 mb-4">Jika titik <strong>A(x, y)</strong> didilatasikan dengan faktor skala <strong>k</strong>:</p>
           <div className="bg-white p-4 rounded-lg border-2 border-emerald-300 font-mono text-center font-bold text-emerald-800 text-xl shadow-sm">
             A' (kx, ky)
           </div>
           <ul className="mt-4 text-xs text-emerald-700 space-y-1">
              <li>• k &gt; 1 &rarr; Perbesaran</li>
              <li>• 0 &lt; k &lt; 1 &rarr; Pengecilan</li>
              <li>• k negatif &rarr; Berlawanan arah titik pusat</li>
           </ul>
        </div>
      </div>
    </div>
  );
}
// ================= PELUANG COMPONENTS =================
function PeluangKonsepContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Konsep Dasar Peluang</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Peluang adalah nilai matematika yang menunjukkan seberapa besar kemungkinan suatu kejadian akan terjadi. Nilai peluang selalu berkisar antara <strong>0 sampai 1</strong>.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">
           <div className="text-xl font-bold text-slate-800">0</div>
           <p className="text-[10px] text-slate-500 uppercase font-black">Mustahil</p>
           <p className="text-[9px] mt-1 text-slate-400">Kejadian yang tidak mungkin terjadi (Contoh: Matahari terbit dari Barat).</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 text-center">
           <div className="text-xl font-bold text-indigo-600">0,5 (½)</div>
           <p className="text-[10px] text-indigo-500 uppercase font-black">Mungkin Saja</p>
           <p className="text-[9px] mt-1 text-indigo-400">Kemungkinan seimbang antara terjadi atau tidak.</p>
        </div>
        <div className="bg-emerald-100 p-4 rounded-xl border border-emerald-200 text-center">
           <div className="text-xl font-bold text-emerald-800">1</div>
           <p className="text-[10px] text-emerald-500 uppercase font-black">Pasti</p>
           <p className="text-[9px] mt-1 text-emerald-600">Kejadian yang pasti terjadi (Contoh: Makhluk hidup akan mati).</p>
        </div>
      </div>
    </div>
  );
}

function PeluangSampelContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Ruang Sampel & Titik Sampel</h2>
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
         <div className="flex gap-4">
            <div className="w-10 h-10 rounded bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">S</div>
            <div>
               <h4 className="font-bold text-sm">Ruang Sampel (S)</h4>
               <p className="text-xs text-slate-500">Himpunan dari semua hasil yang mungkin muncul pada suatu percobaan.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="w-10 h-10 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">n(S)</div>
            <div>
               <h4 className="font-bold text-sm">Banyak Anggota Ruang Sampel</h4>
               <p className="text-xs text-slate-500">Jumlah total hasil yang bisa terjadi.</p>
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
           <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider">Contoh 1 Koin:</h4>
           <div className="text-sm font-mono text-slate-600">
              S = &#123;A, G&#125; <br/>
              n(S) = 2
           </div>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
           <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider">Contoh 1 Dadu:</h4>
           <div className="text-sm font-mono text-slate-600">
              S = &#123;1, 2, 3, 4, 5, 6&#125; <br/>
              n(S) = 6
           </div>
        </div>
      </div>
    </div>
  );
}

function PeluangTeoritisContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Peluang Teoritis</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Peluang yang dihitung berdasarkan teori matematika tanpa perlu melakukan percobaan secara langsung.
      </p>

      <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg text-center">
         <h4 className="text-xs font-bold opacity-70 uppercase mb-2">Rumus Peluang Kejadian A</h4>
         <div className="text-2xl font-mono font-bold">
            P(A) = n(A) / n(S)
         </div>
         <div className="mt-4 flex justify-center gap-6 text-[10px] italic opacity-80">
            <span>n(A) = Banyaknya kejadian A</span>
            <span>n(S) = Banyaknya seluruh ruang sampel</span>
         </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl">
         <h4 className="font-bold text-slate-800 text-sm mb-3 underline">Contoh Soal:</h4>
         <p className="text-sm text-slate-600">Pada pelemparan satu buah dadu, berapakah peluang munculnya mata dadu genap?</p>
         <div className="mt-3 text-xs bg-slate-50 p-3 rounded space-y-1 font-mono">
            <p>1. Ruang Sampel S = &#123;1, 2, 3, 4, 5, 6&#125; &rarr; n(S) = 6</p>
            <p>2. Kejadian A (Genap) = &#123;2, 4, 6&#125; &rarr; n(A) = 3</p>
            <p>3. P(A) = 3/6 = <strong className="text-indigo-600">½</strong></p>
         </div>
      </div>
    </div>
  );
}

function PeluangEmpirisContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Peluang Empiris</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Peluang yang dihitung berdasarkan <strong>hasil nyata</strong> dari sebuah percobaan yang dilakukan berulang-ulang. Disebut juga dengan Frekuensi Relatif.
      </p>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center">
         <h4 className="text-xs font-bold text-amber-800 uppercase mb-2">Rumus Peluang Empiris</h4>
         <div className="text-2xl font-mono font-bold text-amber-900 bg-white inline-block px-6 py-2 rounded-lg border border-amber-200">
            f(r) = f / n
         </div>
         <div className="mt-4 flex justify-center gap-6 text-[10px] italic text-amber-700">
            <span>f = Frekuensi (banyak munculnya kejadian A)</span>
            <span>n = Banyak percobaan yang dilakukan</span>
         </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl">
         <h3 className="text-sm font-bold text-slate-700 mb-2">Tips Penting:</h3>
         <p className="text-xs text-slate-500 leading-relaxed italic">
            Semakin banyak percobaan (n) yang dilakukan, maka nilai Peluang Empiris akan semakin mendekati nilai Peluang Teoritis.
         </p>
      </div>
    </div>
  );
}

function PeluangHarapanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Frekuensi Harapan</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Frekuensi Harapan adalah banyaknya kejadian yang diharapkan dapat terjadi pada suatu percobaan yang dilakukan sebanyak <strong>n kali</strong>.
      </p>

      <div className="bg-rose-600 p-6 rounded-2xl text-white shadow-lg text-center">
         <h4 className="text-xs font-bold opacity-70 uppercase mb-2">Rumus Frekuensi Harapan Kejadian A</h4>
         <div className="text-2xl font-mono font-bold">
            Fh(A) = P(A) × n
         </div>
         <div className="mt-4 flex justify-center gap-6 text-[10px] italic opacity-80">
            <span>P(A) = Peluang kejadian A</span>
            <span>n = Banyaknya percobaan</span>
         </div>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl">
         <h4 className="font-bold text-slate-800 text-sm mb-3 underline">Contoh Soal:</h4>
         <p className="text-sm text-slate-600">Sebuah dadu dilempar sebanyak 60 kali. Berapakah frekuensi harapan munculnya mata dadu 6?</p>
         <div className="mt-3 text-xs bg-slate-50 p-3 rounded space-y-1 font-mono">
            <p>1. Peluang mata dadu 6 &rarr; P(6) = 1/6</p>
            <p>2. Banyak percobaan &rarr; n = 60</p>
            <p>3. Fh(6) = P(6) × n</p>
            <p className="pl-4">= 1/6 × 60</p>
            <p className="pl-4">= <strong className="text-rose-600 font-bold text-sm">10 kali</strong></p>
         </div>
         <p className="mt-4 text-[10px] text-slate-400 italic">
           Artinya, jika kita melempar dadu 60 kali, secara teori kita mengharapkan mata dadu 6 muncul sebanyak 10 kali.
         </p>
      </div>
    </div>
  );
}
function MateriPeluangContent() { return <SimpleTopicContent title="Peluang" desc="Peluang dari suatu kejadian adalah rasio jumlah kejadian yang diharapkan dengan total seluruh kemungkinan hasil (Ruang Sampel). Nilai Peluang selalu berada di antara 0 (Kemustahilan) - 1 (Pasti)." /> }

function SimpleTopicContent({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        {desc}
      </p>
    </div>
  );
}

// ================= ALJABAR COMPONENTS =================
function PengertianContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Unsur-Unsur Bentuk Aljabar</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Bentuk aljabar adalah suatu bentuk matematika yang dalam penyajiannya memuat huruf-huruf untuk mewakili bilangan yang belum diketahui nilainya. Perhatikan bentuk matematika berikut:
      </p>
      
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl text-center">
        <h3 className="text-3xl font-extrabold font-mono text-indigo-800 tracking-wider">3x² - 5y + 8</h3>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <Variable className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Variabel</h3>
          <p className="text-slate-500 text-xs">Lambang pengganti bilangan, biasanya huruf seperti <strong>x</strong> atau <strong>y</strong>.</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <Scaling className="w-8 h-8 text-orange-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Koefisien</h3>
          <p className="text-slate-500 text-xs">Angka yang menempel pada variabel. Pada contoh, <strong>3</strong> dan <strong>-5</strong>.</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <Puzzle className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Konstanta</h3>
          <p className="text-slate-500 text-xs">Angka yang berdiri sendiri tanpa variabel. Pada contoh, <strong>8</strong>.</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <Brackets className="w-8 h-8 text-purple-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Suku</h3>
          <p className="text-slate-500 text-xs">Bagian aljabar yang dipisahkan oleh tanda + atau -. Ada 3 suku: <strong>3x²</strong>, <strong>-5y</strong>, <strong>8</strong>.</p>
        </div>
      </div>
    </div>
  );
}

function SifatContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Menganalisa Suku Sejenis</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Suku sejenis adalah suku-suku yang memiliki <strong>variabel yang sama</strong> dan <strong>pangkat variabel yang sama</strong>. Ingat: <strong>HANYA</strong> suku sejenis yang dapat dijumlahkan atau dikurangkan!
      </p>
      
      <div className="grid md:grid-cols-2 gap-4 mt-4">
         <div className="bg-white p-5 border border-emerald-200 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-400"></div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Suku Sejenis</h3>
            <ul className="space-y-2 font-mono text-sm text-slate-700">
               <li className="bg-emerald-50 px-3 py-2 rounded">3x dan -2x <span className="text-emerald-600 text-xs">(sama-sama punya x)</span></li>
               <li className="bg-emerald-50 px-3 py-2 rounded">5y² dan y² <span className="text-emerald-600 text-xs">(sama-sama y²)</span></li>
               <li className="bg-emerald-50 px-3 py-2 rounded">10 dan 4 <span className="text-emerald-600 text-xs">(sama-sama konstanta)</span></li>
            </ul>
         </div>
         <div className="bg-white p-5 border border-rose-200 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-rose-400"></div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div> BUKAN Suku Sejenis</h3>
            <ul className="space-y-2 font-mono text-sm text-slate-700">
               <li className="bg-rose-50 px-3 py-2 rounded">3x dan 3y <span className="text-rose-600 text-xs">(variabel beda)</span></li>
               <li className="bg-rose-50 px-3 py-2 rounded">2x² dan 2x <span className="text-rose-600 text-xs">(pangkat x beda)</span></li>
               <li className="bg-rose-50 px-3 py-2 rounded">5x dan 5 <span className="text-rose-600 text-xs">(satu x, satu konstanta)</span></li>
            </ul>
         </div>
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex gap-3 text-sm mt-6">
        <span className="font-bold text-indigo-600 uppercase tracking-wider text-[10px] mt-1 shrink-0">Tip Penting</span>
        <p className="text-slate-700">
          Ibaratkan variabel sebagai benda. 3 Apel (3a) + 2 Apel (2a) = 5 Apel (5a). Tapi 3 Apel (3a) + 2 Jeruk (2j) tidak bisa digabung!
        </p>
      </div>
    </div>
  );
}

function OperasiContent() {
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-bold text-slate-800">Operasi Hitung Aljabar</h2>
      
      {/* Penjumlahan & Pengurangan */}
      <div>
        <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-3 border-b border-indigo-100 pb-2">1. Penjumlahan & Pengurangan</h3>
        <p className="text-slate-600 text-sm mb-4">Syarat mutlak: Hanya bisa mengoperasikan koefisien dari <strong>suku-suku yang sejenis</strong>.</p>
        
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
           <h4 className="font-bold text-slate-700 text-xs uppercase tracking-widest mb-3">Contoh Penyelesaian:</h4>
           <div className="space-y-4 font-mono text-sm">
             <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
               <div className="flex gap-2 text-slate-500 mb-1 font-sans text-xs">Sederhanakan: 3x + 2y - x + 5y</div>
               <div>= (3x - x) + (2y + 5y)</div>
               <div className="text-indigo-600 font-bold">= 2x + 7y</div>
             </div>
             <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
               <div className="flex gap-2 text-slate-500 mb-1 font-sans text-xs">Sederhanakan: (5a + 3) - (2a - 4)</div>
               <div>= 5a + 3 - 2a + 4  <span className="text-xs text-rose-500 font-sans ml-2">(Awas tanda minus untuk -4 berubah jadi +)</span></div>
               <div className="text-indigo-600 font-bold">= 3a + 7</div>
             </div>
           </div>
        </div>
      </div>

       {/* Perkalian */}
      <div>
        <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-3 border-b border-indigo-100 pb-2">2. Perkalian (Sifat Distributif)</h3>
        <p className="text-slate-600 text-sm mb-4">Perkalian tidak memandang suku sejenis! Semua dikalikan.</p>
        
        <div className="grid sm:grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
             <div className="absolute -top-3 -right-3 text-3xl">🔥</div>
             <h4 className="font-bold text-slate-800 text-sm mb-1">Perkalian dengan Konstanta</h4>
             <p className="text-xs text-slate-500 mb-3">Kalikan angka ke setiap suku di dalam kurung.</p>
             <div className="bg-slate-50 p-3 rounded text-center font-mono text-sm border border-slate-100">
               3(2x + 4) = 6x + 12
             </div>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
             <div className="absolute -top-3 -right-3 text-3xl">⚔️</div>
             <h4 className="font-bold text-slate-800 text-sm mb-1">Perkalian Aljabar (FOIL)</h4>
             <p className="text-xs text-slate-500 mb-3">Depan-Depan, Depan-Belakang, Belakang-Depan, Belakang-Belakang.</p>
             <div className="bg-slate-50 p-3 rounded font-mono text-xs border border-slate-100 text-center">
               (x + 2)(x + 3) = x² + 3x + 2x + 6<br/>
               = <strong className="text-indigo-600 text-sm">x² + 5x + 6</strong>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function PenerapanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Penerapan Aljabar dalam Kehidupan Nyata</h2>
      <p className="text-sm text-slate-600 leading-relaxed">Pernahkah kamu pergi ke toko dan membeli paket barang tanpa tahu harga per pc-ya? Aljabar bisa membantumu memecahkannya!</p>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mt-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          Menganalisa Belanjaan
        </h3>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
           <div className="w-full md:w-1/2 space-y-4 text-sm text-slate-700">
             <p>Asumsikan kamu membeli <strong>3 Bungkus Permen</strong> dan <strong>2 Botol Minuman</strong>.</p>
             <p>Kamu tidak tahu harganya, maka:</p>
             <ul className="list-disc pl-5 space-y-1">
               <li>Anggap Harga 1 Permen = <strong>x</strong></li>
               <li>Anggap Harga 1 Minuman = <strong>y</strong></li>
             </ul>
             <p className="font-bold">Maka Persamaan Aljabarnya adalah:</p>
             <div className="bg-indigo-50 text-indigo-800 font-bold font-mono text-xl p-3 text-center rounded border border-indigo-200">
               3x + 2y
             </div>
           </div>
           
           <div className="w-full md:w-1/2 bg-slate-50 p-4 rounded-xl border border-slate-200">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Simulasi Keadaan</p>
             <p className="text-xs text-slate-600 mb-3">Jika keesokannya harga diketahui: Permen (x) = Rp2.000, Minuman (y) = Rp5.000.</p>
             <div className="font-mono text-sm text-slate-700 bg-white p-3 border rounded shadow-sm">
               = 3(2000) + 2(5000)<br/>
               = 6000 + 10000<br/>
               = <strong className="text-emerald-600">Rp 16.000</strong> (Total belanja)
             </div>
             <p className="text-xs text-slate-500 mt-2 italic">Proses ini dinamakan Subtitusi Aljabar.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// ================= BILANGAN BULAT COMPONENTS =================
function BBPengertianContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Apa Itu Bilangan Bulat?</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Bilangan bulat terdiri dari bilangan <strong>positif</strong>, titik <strong>0 (nol)</strong>, dan bilangan <strong>negatif</strong>. Pecahan atau desimal bukan termasuk bilangan bulat.
      </p>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex justify-center items-center gap-4 text-sm font-mono text-indigo-800">
        <span className="opacity-50">...</span>
        <span>-3</span>
        <span>-2</span>
        <span>-1</span>
        <span className="font-bold bg-white text-indigo-900 border border-indigo-200 px-3 py-1 rounded">0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span className="opacity-50">...</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <ArrowRight className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Bilangan Positif</h3>
          <p className="text-slate-500 text-xs">Semakin ke kanan, nilainya semakin <strong className="text-emerald-600">Besar</strong>.</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <ArrowLeft className="w-8 h-8 text-rose-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Bilangan Negatif</h3>
          <p className="text-slate-500 text-xs">Semakin ke kiri, nilainya semakin <strong className="text-rose-600">Kecil</strong>.</p>
        </div>
      </div>
    </div>
  );
}

function BBOperasiDasarContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Penjumlahan dan Pengurangan</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Trik mudah membayangkan penjumlahan dan pengurangan bilangan bulat: bayangkan utang dan bayar, atau suhu yang naik dan turun.
      </p>

      <div className="space-y-4">
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
          <strong className="text-indigo-600 text-sm mb-1 block">Trik Plus Minus berdekatan</strong>
          <p className="text-xs text-slate-600">Jika tanda <strong>+</strong> dan <strong>-</strong> berdekatan (contoh: 5 + (-2)), maka berubah jadi <strong>-</strong> (5 - 2).</p>
          <p className="text-xs text-slate-600 mt-1">Jika tanda <strong>-</strong> dan <strong>-</strong> berdekatan (contoh: 5 - (-2)), maka berubah jadi <strong>+</strong> (5 + 2).</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex justify-between items-center">
            <span>5 + (-3)</span> <span>= <strong className="text-emerald-700">2</strong></span>
          </div>
          <div className="bg-rose-50 p-3 rounded-lg border border-rose-100 flex justify-between items-center">
            <span>-4 - 3</span> <span>= <strong className="text-rose-700">-7</strong></span>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
            <span>-2 + 6</span> <span>= <strong className="text-blue-700">4</strong></span>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex justify-between items-center">
            <span>5 - (-2)</span> <span>= <strong className="text-amber-700">7</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BBOperasiLanjutContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Perkalian dan Pembagian</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Aturan tanda untuk perkalian dan pembagian bilangan bulat sangat sederhana. Ingat saja aturan ini:
      </p>
      
      <div className="bg-slate-50 p-5 border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <ul className="space-y-3 font-mono text-sm text-slate-700">
           <li className="flex items-center gap-3">
             <span className="w-20 font-bold">(+) × (+)</span> <ArrowRight className="w-4 h-4 text-slate-400" /> <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded">Positif (+)</span>
           </li>
           <li className="flex items-center gap-3">
             <span className="w-20 font-bold">(-) × (-)</span> <ArrowRight className="w-4 h-4 text-slate-400" /> <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded">Positif (+)</span>
           </li>
           <li className="flex items-center gap-3 border-t border-slate-200 pt-3">
             <span className="w-20 font-bold">(+) × (-)</span> <ArrowRight className="w-4 h-4 text-slate-400" /> <span className="text-rose-600 font-bold bg-rose-100 px-2 py-1 rounded">Negatif (-)</span>
           </li>
           <li className="flex items-center gap-3">
             <span className="w-20 font-bold">(-) × (+)</span> <ArrowRight className="w-4 h-4 text-slate-400" /> <span className="text-rose-600 font-bold bg-rose-100 px-2 py-1 rounded">Negatif (-)</span>
           </li>
        </ul>
        <p className="text-xs text-slate-500 mt-4 italic font-sans">*Catatan: Aturan ini berlaku persis sama untuk PEMBAGIAN (÷).</p>
      </div>

       <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div className="bg-white p-3 shadow-sm rounded-lg border border-slate-200 flex justify-between items-center">
            <span>2 × 3</span> <span>= <strong>6</strong></span>
          </div>
          <div className="bg-white p-3 shadow-sm rounded-lg border border-slate-200 flex justify-between items-center">
            <span>-4 × -3</span> <span>= <strong>12</strong></span>
          </div>
          <div className="bg-white p-3 shadow-sm rounded-lg border border-slate-200 flex justify-between items-center">
            <span>10 ÷ -2</span> <span>= <strong className="text-rose-600">-5</strong></span>
          </div>
          <div className="bg-white p-3 shadow-sm rounded-lg border border-slate-200 flex justify-between items-center">
            <span>-15 ÷ 3</span> <span>= <strong className="text-rose-600">-5</strong></span>
          </div>
        </div>
    </div>
  );
}

function BBPenerapanContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Menyelesaikan Masalah Sehari-hari</h2>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
           <div className="bg-rose-50 w-10 h-10 rounded-lg flex items-center justify-center text-rose-500 mb-3">
             <ThermometerSnowflake className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-sm text-slate-800 mb-2">Suhu Cuaca</h3>
           <p className="text-xs text-slate-600 mb-3">Suhu di Gunung Fuji saat malam hari adalah -5°C. Menjelang siang, suhu naik 8°C. Berapa suhunya sekarang?</p>
           <div className="bg-slate-50 font-mono text-xs p-3 rounded border border-slate-100">
             -5 + 8 = <strong className="text-emerald-600 text-sm">3°C</strong>
           </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
           <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center text-blue-500 mb-3">
             <Waves className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-sm text-slate-800 mb-2">Kedalaman Laut</h3>
           <p className="text-xs text-slate-600 mb-3">Kapal selam berada pada kedalaman 150m di bawah laut (-150m). Kapal itu naik 40m. Posisi kapal sekarang?</p>
           <div className="bg-slate-50 font-mono text-xs p-3 rounded border border-slate-100">
             -150 + 40 = <strong className="text-rose-600 text-sm">-110m</strong>
           </div>
        </div>
      </div>
    </div>
  );
}

// ================= PLSV & PtLSV COMPONENTS =================
function PLSVKalimatContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Kalimat Terbuka dan Kalimat Tertutup</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Sebelum memahami persamaan dan pertidaksamaan, kita harus bisa membedakan mana kalimat yang nilai kebenarannya sudah pasti, dan mana yang belum.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-400"></div>
          <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Kalimat Tertutup (Pernyataan)
          </h3>
          <p className="text-slate-500 text-xs mb-3">Kalimat yang sudah BISA DITENTUKAN benar atau salahnya.</p>
          <ul className="space-y-2 font-mono text-sm text-slate-700">
             <li className="bg-blue-50 px-3 py-2 rounded">Ibukota Indonesia adalah Jakarta <span className="text-emerald-600 text-xs">(Benar)</span></li>
             <li className="bg-blue-50 px-3 py-2 rounded">5 + 2 = 10 <span className="text-rose-600 text-xs">(Salah)</span></li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-400"></div>
          <h3 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div> Kalimat Terbuka
          </h3>
          <p className="text-slate-500 text-xs mb-3">Kalimat yang BELUM BISA DITENTUKAN kebenarannya karena memuat variabel (peubah).</p>
          <ul className="space-y-2 font-mono text-sm text-slate-700">
             <li className="bg-orange-50 px-3 py-2 rounded">x + 5 = 12 <span className="text-orange-600 text-xs">(Bisa benar/salah tergantung nilai x)</span></li>
             <li className="bg-orange-50 px-3 py-2 rounded">y &gt; 3 <span className="text-orange-600 text-xs">(Tergantung nilai y)</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function PLSVContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Persamaan Linear Satu Variabel (PLSV)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong>PLSV</strong> adalah kalimat terbuka yang dihubungkan oleh tanda sama dengan (<span className="font-mono bg-slate-100 px-1 rounded">=</span>) dan hanya memiliki satu variabel berpangkat satu.
      </p>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex items-center justify-center">
        <h3 className="text-2xl md:text-3xl font-extrabold font-mono text-indigo-800 tracking-wider">
          2x + 5 = 11
        </h3>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm text-center">
          <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Persamaan (=)</h4>
          <p className="text-slate-500 text-xs">Harus ada lambang sama dengan untuk menyeimbangkan ruas kiri dan kanan.</p>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm text-center">
          <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Linear</h4>
          <p className="text-slate-500 text-xs">Pangkat tertinggi variabelnya adalah 1. (x pangkat 1)</p>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm text-center">
          <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Satu Variabel</h4>
          <p className="text-slate-500 text-xs">Hanya menggunakan 1 jenis huruf saja (misal hanya x, atau hanya y).</p>
        </div>
      </div>
    </div>
  );
}

function PtLSVContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Pertidaksamaan Linear Satu Variabel (PtLSV)</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Mirip dengan PLSV, namun menggunakan tanda ketidaksamaan. Tanda ketidaksamaan yang digunakan adalah:
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6">
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center">
          <span className="text-3xl font-mono text-purple-600 font-bold mb-2">&lt;</span>
          <span className="text-xs font-bold text-slate-600 uppercase">Kurang dari</span>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center">
          <span className="text-3xl font-mono text-purple-600 font-bold mb-2">&gt;</span>
          <span className="text-xs font-bold text-slate-600 uppercase">Lebih dari</span>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center">
          <span className="text-3xl font-mono text-purple-600 font-bold mb-2">≤</span>
          <span className="text-xs font-bold text-slate-600 uppercase text-center">Kurang dari / sama dengan</span>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center">
          <span className="text-3xl font-mono text-purple-600 font-bold mb-2">≥</span>
          <span className="text-xs font-bold text-slate-600 uppercase text-center">Lebih dari / sama dengan</span>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 py-1 px-3 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-lg">Catatan Penting</div>
        <h3 className="font-bold text-slate-800 text-sm mb-2 mt-2 flex items-center gap-2">
          Aturan Perkalian/Pembagian Negatif
        </h3>
        <p className="text-slate-700 text-sm">
          Pada pertidaksamaan, jika kedua ruas dikali atau dibagi dengan bilangan <strong>negatif</strong>, maka <strong>tanda ketidaksamaan harus DIBALIK</strong>.
        </p>
        <div className="mt-3 bg-white p-3 rounded font-mono text-sm border border-purple-100 flex gap-4">
          <div className="text-slate-500 line-through">-2x &lt; 6 <br/> x &lt; -3</div>
          <div><span className="text-rose-500 text-base font-bold">X</span></div>
          <div className="text-emerald-600">-2x &lt; 6 <br/> x <strong className="text-rose-600">&gt;</strong> -3</div>
        </div>
      </div>
    </div>
  );
}

function PLSVPenyelesaianContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Cara Penyelesaian PLSV & PtLSV</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Tugas kita adalah mencari nilai variabel (misal <span className="font-mono">x</span>) sehingga kalimat terbuka tersebut menjadi kalimat tertutup yang bernilai benar.
      </p>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 mb-4">
        <h3 className="font-bold text-sm text-slate-800 mb-3 border-b pb-2">Langkah Penyelesaian (Pahamilah sebagai Timbangan)</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
          <li>Kumpulkan semua suku yang memiliki variabel ke satu ruas (kiri), dan semua angka bulat ke ruas lainnya (kanan).</li>
          <li>Apabila suku berpindah ruas dari kiri ke kanan atau sebaliknya, maka <strong>tanda berubah (Positif jadi Negatif, Negatif jadi Positif)</strong>.</li>
          <li>Sederhanakan dan temukan nilai 1 variabel tersebut.</li>
        </ol>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-inner">
           <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-widest text-center">Contoh PLSV</h4>
           <div className="bg-white font-mono text-sm p-4 rounded-lg border border-slate-100 shadow-sm">
             <div className="flex justify-between"><span>3x - 5</span><span>= 4</span></div>
             <div className="flex justify-between text-indigo-600"><span>3x</span><span>= 4 + 5</span></div>
             <div className="flex justify-between"><span>3x</span><span>= 9</span></div>
             <div className="flex justify-between text-indigo-600"><span>x</span><span>= 9 ÷ 3</span></div>
             <div className="flex justify-between"><span>x</span><span>= <strong className="text-emerald-600">3</strong></span></div>
           </div>
        </div>
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl shadow-inner">
           <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-widest text-center">Contoh PtLSV</h4>
           <div className="bg-white font-mono text-sm p-4 rounded-lg border border-slate-100 shadow-sm">
             <div className="flex justify-between"><span>2x + 4</span><span>&ge; 10</span></div>
             <div className="flex justify-between text-indigo-600"><span>2x</span><span>&ge; 10 - 4</span></div>
             <div className="flex justify-between"><span>2x</span><span>&ge; 6</span></div>
             <div className="flex justify-between text-indigo-600"><span>x</span><span>&ge; 6 ÷ 2</span></div>
             <div className="flex justify-between"><span>x</span><span>&ge; <strong className="text-emerald-600">3</strong></span></div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ================= ARITMATIKA SOSIAL COMPONENTS =================
function ASUntungRugiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Keuntungan dan Kerugian</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Dalam kegiatan jual beli, kita mengenal istilah Harga Beli (HB) dan Harga Jual (HJ).
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 py-1 px-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-lg">Untung</div>
          <p className="text-slate-700 text-sm mb-3 mt-4">Terjadi jika Harga Jual LEBIH BESAR dari Harga Beli.</p>
          <div className="bg-white p-3 rounded font-mono text-sm border border-emerald-100 flex justify-center text-emerald-700 font-bold mb-2">
            HJ &gt; HB
          </div>
          <ul className="space-y-1 font-mono text-xs text-emerald-600">
             <li>• Untung = HJ - HB</li>
             <li>• %Untung = (Untung / HB) × 100%</li>
          </ul>
        </div>
        <div className="bg-rose-50 rounded-xl p-5 border border-rose-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 py-1 px-3 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-lg">Rugi</div>
          <p className="text-slate-700 text-sm mb-3 mt-4">Terjadi jika Harga Jual LEBIH KECIL dari Harga Beli.</p>
          <div className="bg-white p-3 rounded font-mono text-sm border border-rose-100 flex justify-center text-rose-700 font-bold mb-2">
            HJ &lt; HB
          </div>
          <ul className="space-y-1 font-mono text-xs text-rose-600">
             <li>• Rugi = HB - HJ</li>
             <li>• %Rugi = (Rugi / HB) × 100%</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm text-sm text-slate-700">
        <strong>Penting:</strong> Persentase Untung maupun Rugi <u>selalu</u> dihitung dari <strong>Harga Beli (Modal)</strong>, bukan Harga Jual.
      </div>
    </div>
  );
}

function ASDiskonPajakContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Diskon (Rabat) dan Pajak</h2>
      
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-6">
        <h3 className="font-bold text-indigo-700 text-sm mb-2 uppercase tracking-wider">Diskon (Potongan Harga)</h3>
        <p className="text-slate-600 text-sm mb-3">Diskon menguntungkan pembeli karena mengurangi harga yang harus dibayar.</p>
        <div className="bg-slate-50 p-3 rounded-lg font-mono text-sm border border-slate-200 space-y-2">
           <div><span className="text-slate-500">Nilai Diskon =</span> %Diskon × Harga Awal</div>
           <div><span className="text-slate-500">Harga Bayar =</span> Harga Awal - Nilai Diskon</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-orange-700 text-sm mb-2 uppercase tracking-wider">Pajak (PPN & UMKM)</h3>
        <p className="text-slate-600 text-sm mb-3">Pajak adalah kewajiban yang ditambahkan sehingga menambah harga beli yang harus dibayar, atau mengurangi pendapatan penjual.</p>
        <div className="bg-slate-50 p-3 rounded-lg font-mono text-sm border border-slate-200 space-y-2">
           <div><span className="text-slate-500">PPN (Pajak Pertambahan Nilai)</span> = Umumnya 11% (atau sesuai soal)</div>
           <div><span className="text-slate-500">Harga Setelah Pajak =</span> Harga Awal + Nominal Pajak</div>
           <hr className="border-slate-200"/>
           <div><span className="text-slate-500">Pajak UMKM</span> = 0.5% (memotong omzet penghasilan)</div>
        </div>
      </div>
    </div>
  );
}

function ASBrutoTaraNettoContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Bruto, Tara, dan Netto</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Istilah berat (massa) dalam perdagangan sering ditemui pada kemasan barang (contoh: beras, gula, snack).
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-6">
        <div className="bg-slate-800 text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black mb-1">BRUTO</span>
          <span className="text-xs text-slate-300">Berat Keseluruhan<br/>(Isi + Kemasan)</span>
        </div>
        <div className="bg-slate-600 text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black mb-1">TARA</span>
          <span className="text-xs text-slate-300">Berat Kemasan<br/>(Bungkus saja)</span>
        </div>
        <div className="bg-slate-500 text-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black mb-1">NETTO</span>
          <span className="text-xs text-slate-300">Berat Bersih<br/>(Isi saja)</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl shadow-sm">
        <h3 className="font-bold text-amber-800 text-sm mb-3">Rumus & Hubungan Logis</h3>
        <div className="space-y-2 font-mono text-sm text-slate-700 bg-white p-4 rounded border border-amber-100">
           <div className="flex items-center gap-2">Bruto <span className="text-amber-500 font-bold">=</span> Netto + Tara</div>
           <div className="flex items-center gap-2">Netto <span className="text-amber-500 font-bold">=</span> Bruto - Tara</div>
           <div className="flex items-center gap-2">Tara <span className="text-amber-500 font-bold">=</span> Bruto - Netto</div>
           <hr className="my-2 border-amber-100" />
           <div className="text-xs text-amber-600">%Tara dihitung terhadap Bruto: <strong className="text-slate-700 block mt-1">%Tara = (Tara / Bruto) × 100%</strong></div>
        </div>
      </div>
    </div>
  );
}

function ASBungaTunggalContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Perbankan: Bunga Tunggal</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Di tingkat SMP kita hanya mempelajari Bunga Tunggal, yaitu bunga yang dihitung berdasarkan Modal Awal (Tabungan Awal). Besarnya bunga per periode selalu sama.
      </p>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-emerald-800 text-sm mb-3">Rumus Bunga Tunggal</h3>
        <div className="bg-white p-4 rounded-lg font-mono text-sm border border-emerald-100 mb-3 shadow-inner text-center">
           <span className="text-emerald-600 font-bold text-lg">B = M × p × t</span>
        </div>
        <p className="text-xs text-slate-600 mb-3 ml-2">Keterangan:</p>
        <ul className="space-y-2 text-sm text-slate-700 ml-4">
          <li><strong className="text-emerald-700">B</strong> = Nominal Bunga (Rupiah)</li>
          <li><strong className="text-emerald-700">M</strong> = Modal / Tabungan Awal</li>
          <li><strong className="text-emerald-700">p</strong> = Suku Bunga per Tahun (%)</li>
          <li><strong className="text-emerald-700">t</strong> = Waktu menabung</li>
        </ul>
        
        <div className="mt-4 pt-4 border-t border-emerald-200/50 text-xs text-slate-600 space-y-1">
          <p>Jika bunga (p) dalam bentuk tahunan, maka pembagi waktu (t) menyesuaikan:</p>
          <ul className="list-disc pl-5">
            <li>Menabung <strong className="text-slate-800">b</strong> bulan: <span className="font-mono">t = b / 12</span></li>
            <li>Menabung <strong className="text-slate-800">h</strong> hari: <span className="font-mono">t = h / 365</span></li>
            <li>Menabung <strong className="text-slate-800">t</strong> tahun: <span className="font-mono">t = t</span></li>
          </ul>
        </div>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
         <p className="text-sm text-slate-700"><strong>Tabungan Akhir</strong> = Tabungan Awal + Bunga</p>
      </div>
    </div>
  );
}

// ================= PERBANDINGAN COMPONENTS =================
function PerbandinganPengertianContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Pengertian, Menyederhanakan, dan Skala</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong>Perbandingan</strong> adalah membandingkan dua besaran yang sejenis. Penulisannya bisa bentuk rasio <span className="font-mono bg-slate-100 px-1">a : b</span> atau pecahan <span className="font-mono bg-slate-100 px-1">a / b</span>.
      </p>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mt-4">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Syarat Menyederhanakan Perbandingan:</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
           <li><strong>Satuannya harus sama.</strong> (Misal: Kg dengan Kg, cm dengan cm).</li>
           <li>Dibagi dengan FPB (Faktor Persekutuan Terbesar) hingga bentuk paling sederhana (tidak bisa dibagi lagi).</li>
        </ol>
        <div className="bg-blue-50 mt-4 p-3 rounded border border-blue-100 font-mono text-xs">
          Contoh: 50 cm : 2 m = 50 cm : 200 cm = 1 : 4
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mt-6">
        <h3 className="font-bold text-teal-700 text-sm mb-2 uppercase tracking-wider">Skala (Pada Peta)</h3>
        <p className="text-sm text-slate-600 mb-3">Skala adalah perbandingan antara jarak pada gambar/peta dengan jarak sebenarnya.</p>
        
        <div className="flex flex-col md:flex-row gap-4 text-sm text-slate-700">
          <div className="bg-slate-50 p-4 rounded flex-1 border border-slate-200 text-center flex flex-col justify-center">
            <span className="font-bold block mb-2">Rumus Utama:</span>
            <span className="font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded">Skala = Jarak Peta : Jarak Sebenarnya</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <span className="text-slate-500 font-mono text-xs block">Jarak Sebenarnya</span> = Jarak Peta / Skala
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <span className="text-slate-500 font-mono text-xs block">Jarak Peta</span> = Skala × Jarak Sebenarnya
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-rose-600 bg-rose-50 p-3 rounded">
          <strong>Perhatian:</strong> Karena skala biasanya menggunakan satuan <strong>cm</strong>, ubahlah jarak sebenarnya dari km/m ke cm sebelum dimasukkan ke rumus.
        </div>
      </div>
    </div>
  );
}

function PerbandinganSenilaiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Perbandingan Senilai</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong>Perbandingan Senilai</strong> terjadi jika suatu besaran <strong>bertambah</strong>, maka besaran lainnya juga <strong>ikut bertambah</strong> (searah).
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl shadow-sm">
          <h3 className="font-bold text-indigo-800 text-sm mb-2 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> Logika Sehari-hari
          </h3>
          <ul className="list-disc pl-5 text-sm text-indigo-900 space-y-2">
            <li>Beli 1 buku Rp5.000, maka 2 buku Rp10.000 (Makin banyak barang, makin mahal biaya).</li>
            <li>Bensin 1 liter bisa 10 km, maka 2 liter bisa 20 km (Makin banyak bensin, makin jauh jarak tempuh).</li>
            <li>Resep kue: 1 butir telur untuk 5 kue, 2 butir telur untuk 10 kue.</li>
          </ul>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-slate-800 text-sm mb-3 text-center uppercase tracking-wider border-b pb-2">Bentuk Rumus</h3>
          <div className="flex items-center justify-center gap-4 text-xl font-mono text-indigo-700">
            <div className="flex flex-col items-center">
              <span className="border-b-2 border-indigo-700 px-2">A1</span>
              <span className="px-2">A2</span>
            </div>
            <span>=</span>
            <div className="flex flex-col items-center">
              <span className="border-b-2 border-indigo-700 px-2">B1</span>
              <span className="px-2">B2</span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">(Atau cukup gunakan perkalian silang)</p>
        </div>
      </div>
    </div>
  );
}

function PerbandinganBerbalikContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Perbandingan Berbalik Nilai</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong>Perbandingan Berbalik Nilai</strong> terjadi jika suatu besaran <strong>bertambah</strong>, maka besaran lainnya justru <strong>berkurang</strong> (berlawanan arah).
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl shadow-sm">
          <h3 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Logika Sehari-hari
          </h3>
          <ul className="list-disc pl-5 text-sm text-orange-900 space-y-2">
            <li>Pekerja & Waktu: 5 tukang selesai 10 hari. Jika tukang jadi 10, selesainya <strong>lebih cepat</strong> (5 hari). (Makin banyak tukang, makin sedikit waktu).</li>
            <li>Hewan & Pakan: Pakan cukup untuk 10 sapi selama 5 hari. Jika sapi bertambah jadi 20, pakan akan habis <strong>lebih cepat</strong>.</li>
            <li>Kecepatan & Waktu: Makin cepat ngebut, makin singkat waktu tempuh untuk sampai.</li>
          </ul>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-slate-800 text-sm mb-3 text-center uppercase tracking-wider border-b pb-2">Bentuk Rumus</h3>
          <div className="flex items-center justify-center gap-4 text-xl font-mono text-orange-700">
            <div className="flex flex-col items-center">
              <span className="border-b-2 border-orange-700 px-2">A1</span>
              <span className="px-2">A2</span>
            </div>
            <span>=</span>
            <div className="flex flex-col items-center">
              <span className="border-b-2 border-orange-700 px-2"><strong className="text-rose-600">B2</strong></span>
              <span className="px-2"><strong className="text-rose-600">B1</strong></span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">(Perhatikan bahwa B2 dan B1 dibalik posisinya)</p>
          <p className="text-center text-xs font-bold text-rose-500 mt-1">Atau: A1 × B1 = A2 × B2</p>
        </div>
      </div>
    </div>
  );
}

// ================= UNSUR GEOMETRI COMPONENTS =================
function GeoTitikGarisContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Titik, Garis, dan Bidang</h2>
      
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 flex flex-col justify-center items-center mb-2">
             <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
             <span className="text-[10px] font-bold mt-1 text-slate-500">A</span>
          </div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Titik</h3>
          <p className="text-xs text-slate-500 mt-2">Tidak memiliki ukuran (panjang, lebar, atau tinggi). Digambarkan dengan tanda noktah dan diberi nama dengan huruf kapital (Misal: Titik A).</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 flex items-center justify-center mb-2 w-full relative px-2">
             <div className="w-full h-1 bg-slate-800"></div>
             <div className="absolute left-2 w-2 h-2 bg-white border-2 border-slate-800 rounded-full"></div>
             <div className="absolute right-2 w-2 h-2 bg-white border-2 border-slate-800 rounded-full"></div>
          </div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Garis</h3>
          <p className="text-xs text-slate-500 mt-2">Kumpulan titik-titik yang memanjang ke dua arah tanpa batas. Hanya memiliki ukuran panjang.</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-10 bg-slate-200 border-2 border-slate-800 mb-4 transform -skew-x-12"></div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Bidang</h3>
          <p className="text-xs text-slate-500 mt-2">Permukaan datar dua dimensi yang meluas ke segala arah tanpa batas. Memiliki panjang dan lebar.</p>
        </div>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-xl mt-4">
         <h4 className="font-bold text-cyan-800 text-sm mb-2">Variasi Garis:</h4>
         <ul className="text-sm text-cyan-900 space-y-1 list-disc pl-5">
           <li><strong>Segmen Garis / Ruas Garis:</strong> Garis yang dibatasi dua titik ujung (panjangnya terbatas).</li>
           <li><strong>Sinar Garis:</strong> Garis yang berawal dari satu titik dan ujung lainnya memanjang tanpa batas.</li>
         </ul>
      </div>
    </div>
  );
}

function GeoKedudukanGarisContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Kedudukan Dua Garis</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Dua garis (atau lebih) di suatu bidang bisa memiliki beberapa posisi satu sama lain:
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
           <div className="h-20 flex flex-col justify-center mb-2 px-2 relative">
              <div className="w-full h-1 bg-blue-500 -mt-2 transform translate-y-1"></div>
              <div className="w-full h-1 bg-red-500 mt-2 transform translate-y-1"></div>
           </div>
           <h3 className="font-bold text-sm text-slate-800">Sejajar (//)</h3>
           <p className="text-[10px] text-slate-500 mt-1 pb-1">Dua garis yang jaraknya selalu sama dan tidak akan pernah berpotongan meski diperpanjang.</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
           <div className="h-20 flex justify-center items-center mb-2 relative">
              <div className="w-16 h-1 bg-blue-500 transform rotate-45 absolute"></div>
              <div className="w-16 h-1 bg-red-500 transform -rotate-45 absolute"></div>
           </div>
           <h3 className="font-bold text-sm text-slate-800">Berpotongan</h3>
           <p className="text-[10px] text-slate-500 mt-1 pb-1">Dua garis yang bertemu di titik potong.</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
           <div className="h-20 flex justify-center items-center mb-2 relative">
              <div className="w-1 h-16 bg-blue-500 absolute"></div>
              <div className="w-16 h-1 bg-red-500 absolute"></div>
              {/* symbol tegak lurus */}
              <div className="absolute w-3 h-3 border-b-2 border-r-2 border-slate-800 bottom-1/2 left-1/2 transform translate-x-0.5 translate-y-0.5"></div>
           </div>
           <h3 className="font-bold text-sm text-slate-800">Tegak Lurus (&#8869;)</h3>
           <p className="text-[10px] text-slate-500 mt-1 pb-1">Dua garis berpotongan yang membentuk sudut siku-siku (90 derajat).</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
           <div className="h-20 flex justify-center items-center mb-2 relative px-2">
              <div className="w-full h-1 bg-blue-500 absolute"></div>
              <div className="w-2/3 h-1 bg-red-500 absolute left-4 border-t border-b border-white z-10"></div>
           </div>
           <h3 className="font-bold text-sm text-slate-800">Berimpit</h3>
           <p className="text-[10px] text-slate-500 mt-1 pb-1">Dua garis yang menempel sehingga tampak seperti satu garis.</p>
        </div>

      </div>
    </div>
  );
}

function GeoSudutContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Sudut & Jenis-jenis Sudut</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Sudut dibentuk oleh dua sinar garis yang memiliki titik pangkal yang sama (titik sudut). Alat ukurnya derajat (°) menggunakan busur derajat.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-center col-span-2 md:col-span-1">
          <h3 className="text-base font-bold text-blue-600 mt-2">Lancip</h3>
          <p className="text-xs text-slate-500 mt-1 font-mono hover:bg-slate-100">&lt; 90°</p>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-center col-span-2 md:col-span-1">
          <h3 className="text-base font-bold text-rose-600 mt-2">Siku-siku</h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">= 90°</p>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-center col-span-2 md:col-span-1">
          <h3 className="text-base font-bold text-amber-600 mt-2">Tumpul</h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">90° - 180°</p>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-center col-span-2 md:col-span-1">
          <h3 className="text-base font-bold text-emerald-600 mt-2">Lurus</h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">= 180°</p>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm text-center col-span-2 md:col-span-1 md:col-start-5 col-start-1">
          <h3 className="text-base font-bold text-purple-600 mt-2">Refleks</h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">180° - 360°</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1">
           <h4 className="font-bold text-slate-800 text-sm mb-2 text-center border-b pb-2">Sudut Berpelurus (Suplemen)</h4>
           <div className="text-center font-mono font-bold text-indigo-700 text-lg my-3">∠A + ∠B = 180°</div>
           <p className="text-xs text-slate-500 text-center">Dua sudut yang jika digabung membentuk garis lurus.</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1">
           <h4 className="font-bold text-slate-800 text-sm mb-2 text-center border-b pb-2">Sudut Berpenyiku (Komplemen)</h4>
           <div className="text-center font-mono font-bold text-rose-700 text-lg my-3">∠A + ∠B = 90°</div>
           <p className="text-xs text-slate-500 text-center">Dua sudut yang jika digabung membentuk sudut siku-siku.</p>
        </div>
      </div>
    </div>
  );
}

function GeoHubunganSudutContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Hubungan Sudut pada Dua Garis Sejajar</h2>
      <p className="text-sm text-slate-600 mb-4">
        Jika dua garis sejajar dipotong oleh sebuah garis melintang (transversal), maka akan terbentuk 8 sudut dengan pasangan hubungan khusus.
      </p>

      <div className="bg-teal-50 border border-teal-200 p-5 rounded-xl shadow-sm">
        <ul className="space-y-4 text-sm">
           <li className="flex flex-col">
             <span className="font-bold text-teal-800 mb-1">1. Sudut Sehadap (Besarnya SAMA)</span>
             <span className="text-slate-600 text-xs">Sudut yang menghadap ke arah yang sama.</span>
           </li>
           <li className="flex flex-col">
             <span className="font-bold text-teal-800 mb-1">2. Sudut Dalam / Luar Berseberangan (Besarnya SAMA)</span>
             <span className="text-slate-600 text-xs">Menyeberang garis transversal. Z-pattern.</span>
           </li>
           <li className="flex flex-col">
             <span className="font-bold text-purple-800 mb-1">3. Sudut Dalam / Luar Sepihak (Dijumlah = 180°)</span>
             <span className="text-slate-600 text-xs">Berada di pihak yang sama (kiri semua atau kanan semua dari transversal). C-pattern.</span>
           </li>
           <li className="flex flex-col">
             <span className="font-bold text-teal-800 mb-1">4. Sudut Bertolak Belakang (Besarnya SAMA)</span>
             <span className="text-slate-600 text-xs">Saling membelakangi pada persimpangan garis bentuk X.</span>
           </li>
        </ul>
      </div>
      
      <div className="text-xs text-slate-500 text-center uppercase tracking-widest mt-6">Coba Simulasi untuk visualisasinya →</div>
    </div>
  );
}

// ================= PYTHAGORAS COMPONENTS =================
function PythagorasTeoremaContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Teorema Pythagoras</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong>Teorema Pythagoras</strong> menyatakan bahwa pada sebuah segitiga siku-siku, kuadrat panjang sisi miring (hipotenusa) sama dengan jumlah kuadrat panjang sisi-sisi penyikunya.
      </p>

      <div className="bg-sky-50 p-6 rounded-xl border border-sky-200">
         <h3 className="font-bold text-sky-800 text-sm mb-3 uppercase tracking-wider text-center">Rumus Pythagoras</h3>
         <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-mono font-bold text-sky-900 bg-white px-6 py-3 rounded-lg shadow-sm border border-sky-100">
               c² = a² + b²
            </div>
            <p className="text-xs text-slate-500 mt-2">Dengan <strong>c</strong> sebagai sisi miring (sisi penterpanjang), <strong>a</strong> dan <strong>b</strong> sisi penyiku.</p>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
           <strong className="text-slate-800 block mb-2 text-sm">Mencari Sisi Penyiku</strong>
           <div className="font-mono text-indigo-700 bg-indigo-50 p-2 rounded">
             a² = c² - b²<br/>
             b² = c² - a²
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center text-sm text-slate-600">
           Sisi miring <strong>selalu</strong> menjadi sisi terpanjang dan letaknya <strong>selalu</strong> berhadapan dengan sudut siku-siku (90°).
        </div>
      </div>
    </div>
  );
}

function PythagorasTripelContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Tripel Pythagoras</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        <strong>Tripel Pythagoras</strong> adalah kelompok tiga bilangan bulat positif yang memenuhi kuadrat bilangan terbesar sama dengan jumlah kuadrat dua bilangan lainnya. Menghafal angka ini akan sangat mempercepat perhitungan!
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
         <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm">
           <h3 className="font-bold text-slate-800 text-sm mb-2 border-b border-emerald-200 pb-1">Tipe 1</h3>
           <div className="font-mono text-lg font-black text-emerald-700">3, 4, <span className="text-rose-500">5</span></div>
           <div className="text-xs text-slate-500 mt-1 italic">kelipatannya:<br/>6, 8, 10<br/>9, 12, 15</div>
         </div>
         <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm">
           <h3 className="font-bold text-slate-800 text-sm mb-2 border-b border-emerald-200 pb-1">Tipe 2</h3>
           <div className="font-mono text-lg font-black text-emerald-700">5, 12, <span className="text-rose-500">13</span></div>
           <div className="text-xs text-slate-500 mt-1 italic">kelipatannya:<br/>10, 24, 26</div>
         </div>
         <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm">
           <h3 className="font-bold text-slate-800 text-sm mb-2 border-b border-emerald-200 pb-1">Tipe 3</h3>
           <div className="font-mono text-lg font-black text-emerald-700">7, 24, <span className="text-rose-500">25</span></div>
         </div>
         <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm">
           <h3 className="font-bold text-slate-800 text-sm mb-2 border-b border-emerald-200 pb-1">Tipe 4</h3>
           <div className="font-mono text-lg font-black text-emerald-700">8, 15, <span className="text-rose-500">17</span></div>
         </div>
      </div>
      <p className="text-center text-xs text-rose-500">*Angka yang berwarna merah merupakan sisi miring (selalu yang terbesar)*</p>
    </div>
  );
}

function PythagorasAplikasiContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Penerapan Teorema Pythagoras</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Pythagoras sangat sering digunakan dalam kehidupan sehari-hari, terutama untuk mengukur jarak terpendek dan mengukur sesuatu yang sulit dijangkau.
      </p>

      <ul className="grid md:grid-cols-2 gap-4 mt-6 text-sm text-slate-700">
         <li className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <strong className="block mb-2 text-indigo-700">1. Tangga Bersandar</strong>
           Panjang tangga bertindak sebagai sisi miring. Jarak ujung bawah tangga ke tembok dan tinggi tembok adalah sisi penyikunya.
         </li>
         <li className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <strong className="block mb-2 text-indigo-700">2. Rute Terpendek Pesawat/Kapal</strong>
           Jika kapal berlayar ke Utara (vertikal) lalu ke Timur (horizontal), jarak kapal dari titik awal ke titik akhir adalah sisi miringnya.
         </li>
         <li className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
           <strong className="block mb-2 text-indigo-700">3. Menentukan Jenis Segitiga</strong>
           Dengan c sisi terpanjang: 
           <div className="flex flex-col gap-1 font-mono mt-2 text-xs">
             <span>Jika c² = a² + b² ➔ Segitiga Siku-siku</span>
             <span>Jika c² &lt; a² + b² ➔ Segitiga Lancip</span>
             <span>Jika c² &gt; a² + b² ➔ Segitiga Tumpul</span>
           </div>
         </li>
      </ul>
    </div>
  );
}

// ================= BANGUN DATAR COMPONENTS =================
function BDSegitigaContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Segitiga</h2>
      <p className="text-sm text-slate-600 leading-relaxed">
        Segitiga adalah bangun datar yang dibatasi oleh tiga buah sisi dan memiliki tiga buah titik sudut. Jumlah ketiga sudut dalam segitiga selalu <strong>180°</strong>.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <h3 className="bg-blue-50 font-bold text-blue-800 text-sm p-3 border-b border-blue-100">Berdasarkan Panjang Sisi</h3>
           <ul className="p-4 space-y-3 text-sm text-slate-700">
              <li><strong>Sama Sisi:</strong> Ketiga sisinya sama panjang, ketiga sudutnya 60°.</li>
              <li><strong>Sama Kaki:</strong> Dua sisinya sama panjang, dua sudut alasnya sama besar.</li>
              <li><strong>Sembarang:</strong> Semua sisinya berbeda panjang, semua sudutnya berbeda.</li>
           </ul>
         </div>

         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <h3 className="bg-teal-50 font-bold text-teal-800 text-sm p-3 border-b border-teal-100">Berdasarkan Besar Sudut</h3>
           <ul className="p-4 space-y-3 text-sm text-slate-700">
              <li><strong>Siku-siku:</strong> Salah satu sudutnya persis 90°.</li>
              <li><strong>Lancip:</strong> Ketiga sudutnya kurang dari 90°.</li>
              <li><strong>Tumpul:</strong> Salah satu sudutnya lebih dari 90° (antara 90°-180°).</li>
           </ul>
         </div>
      </div>
    </div>
  );
}

function BDSegiempatContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Segiempat</h2>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        Segiempat adalah poligon yang memiliki empat sisi dan empat sudut. Jumlah semua sudut dalamnya selalu <strong>360°</strong>.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
         <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <h3 className="font-bold text-sm text-slate-800">Persegi</h3>
            <p className="text-[10px] text-slate-500 mt-1">4 sisi sama panjang, 4 sudut sikusiku, diagonal saling membagi dua tegak lurus.</p>
         </div>
         <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <h3 className="font-bold text-sm text-slate-800">Persegi Panjang</h3>
            <p className="text-[10px] text-slate-500 mt-1">Sisi berhadapan sama panjang, 4 sudut sikusiku.</p>
         </div>
         <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <h3 className="font-bold text-sm text-slate-800">Jajargenjang</h3>
            <p className="text-[10px] text-slate-500 mt-1">Sisi berhadapan sejajar dan sama panjang. Sudut berhadapan sama besar.</p>
         </div>
         <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <h3 className="font-bold text-sm text-slate-800">Belah Ketupat</h3>
            <p className="text-[10px] text-slate-500 mt-1">Sisi sama panjang, diagonal berpotongan tegak lurus membagi dua.</p>
         </div>
         <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <h3 className="font-bold text-sm text-slate-800">Layang-layang</h3>
            <p className="text-[10px] text-slate-500 mt-1">Dua pasang sisi berdekatan sama panjang. Salah satu diagonal membagi 2 diagonal lainnya tegak lurus.</p>
         </div>
         <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <h3 className="font-bold text-sm text-slate-800">Trapesium</h3>
            <p className="text-[10px] text-slate-500 mt-1">Memiliki tepat sepasang sisi berhadapan yang sejajar.</p>
         </div>
      </div>
    </div>
  );
}

function BDKelilingLuasContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">Keliling & Luas Bangun Datar</h2>
      
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-indigo-700 text-sm mb-4 border-b border-slate-100 pb-2">Konsep Dasar</h3>
        <p className="text-sm text-slate-600 mb-2"><strong>Keliling:</strong> Jumlah panjang seluruh sisi terluar bangun datar. (Bagaikan memagari bangun tersebut).</p>
        <p className="text-sm text-slate-600"><strong>Luas:</strong> Besaran area di dalam bangun datar. </p>
      </div>

      <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
         <table className="w-full text-sm text-left">
           <thead className="bg-slate-200 text-slate-700">
             <tr>
               <th className="px-4 py-3 font-bold">Bangun Datar</th>
               <th className="px-4 py-3 font-bold text-center">Luas</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-200">
             <tr className="bg-white">
               <td className="px-4 py-3 font-medium">Segitiga</td>
               <td className="px-4 py-3 font-mono text-center">½ × a × t</td>
             </tr>
             <tr className="bg-white">
               <td className="px-4 py-3 font-medium">Persegi</td>
               <td className="px-4 py-3 font-mono text-center">s × s</td>
             </tr>
             <tr className="bg-white">
               <td className="px-4 py-3 font-medium">Persegi Panjang</td>
               <td className="px-4 py-3 font-mono text-center">p × l</td>
             </tr>
             <tr className="bg-white">
               <td className="px-4 py-3 font-medium">Jajargenjang</td>
               <td className="px-4 py-3 font-mono text-center">a × t</td>
             </tr>
             <tr className="bg-white">
               <td className="px-4 py-3 font-medium">Belah Ketupat / Layang</td>
               <td className="px-4 py-3 font-mono text-center">½ × d1 × d2</td>
             </tr>
             <tr className="bg-white">
               <td className="px-4 py-3 font-medium">Trapesium</td>
               <td className="px-4 py-3 font-mono text-center">½ × (a+b) × t</td>
             </tr>
           </tbody>
         </table>
      </div>
    </div>
  );
}
