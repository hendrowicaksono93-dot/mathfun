import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { topics } from '../lib/topics';

const aljabarLatihan = [
  { p: 'Sebutkan Variabel dari 3x - 5y + 2!', j: 'Variabelnya adalah x dan y', c: 'Variabel adalah lambang pengganti suatu bilangan yang belum diketahui nilainya (biasanya huruf).' },
  { p: 'Berapakah Koefisien y dari 2x² + 4y - 1 ?', j: 'Koefisien y adalah 4', c: 'Koefisien adalah angka yang melekat atau mengalikan variabel.' },
  { p: 'Hasil pengurangan 2a + 3b - 7a adalah?', j: '-5a + 3b', c: 'Hanya suku sejenis yang bisa dijumlah/kurangkan (2a - 7a = -5a).' },
  { p: 'Apakah arti perkalian 2(x + 3) ?', j: '2x + 6', c: 'Gunakan sifat distributif: 2 dikali x, ditambah 2 dikali 3.' },
  { p: 'Tentukan suku-suku sejenis dari 3m - 2n + 5m + n', j: '3m dengan 5m, dan -2n dengan n', c: 'Suku sejenis memiliki variabel dan pangkat yang persis sama.' },
];

const bilanganBulatLatihan = [
  { p: 'Suhu ruangan 20°C. Kemudian AC dihidupkan suhunya turun 5°C. Berapa suhu sekarang?', j: '15°C', c: 'Suhu turun artinya dikurang. 20 - 5 = 15.' },
  { p: 'Hasil dari -12 + 7 adalah?', j: '-5', c: 'Kamu hutang 12, lalu bayar 7. Sisa hutangmu 5.' },
  { p: 'Hasil dari 5 - (-3) adalah?', j: '8', c: 'Tanda minus berdekatan menjadi plus. 5 + 3 = 8.' },
  { p: 'Hasil kali dari -4 × -6 adalah?', j: '24', c: 'Negatif dikali negatif hasilnya positif.' },
  { p: 'Hasil pembagian -15 ÷ 3 adalah?', j: '-5', c: 'Negatif dibagi positif hasilnya negatif.' },
];

const plsvLatihan = [
  { p: 'Manakah yang merupakan Persamaan Linear Satu Variabel: 2x + 4 = 8 atau x² + 2 = 6?', j: '2x + 4 = 8', c: 'PLSV hanya memiliki 1 variabel (x) dangan pangkat tertingginya 1. x² pangkatnya 2.' },
  { p: 'Selesaikan persamaan: 3x - 5 = 7', j: 'x = 4', c: '-5 pindah ke kanan menjadi +5. 3x = 12. x = 12 ÷ 3 = 4.' },
  { p: 'Selesaikan pertidaksamaan: 2y + 3 > 9', j: 'y > 3', c: '+3 pindah ruas jadi -3. 2y > 6. y > 3.' },
  { p: 'Perhatikan: -2x ≤ 8. Tentukan batas nilai x!', j: 'x ≥ -4', c: 'Karena dibagi dengan bilangan negatif (-2), tanda ketidaksamaan harus DIBALIK dari ≤ menjadi ≥.' },
  { p: 'Nila membeli 3 buku tulis. Ia membayar dengan uang Rp20.000 dan mendapat kembalian Rp5.000. Bentuk persamaannya?', j: '3x + 5000 = 20000', c: '3 kali harga buku (3x) ditambah uang kembalian (5000) sama dengan total uang (20000).' },
];

const aritmatikaSosialLatihan = [
  { p: 'Budi membeli sepatu harga Rp150.000, lalu ia jual Rp180.000. Apakah Budi untung atau rugi? Berapa nominalnya?', j: 'Untung Rp30.000', c: 'Untung = Harga Jual - Harga Beli = 180.000 - 150.000 = +30.000' },
  { p: 'Baju harga Rp200.000 diskon 20%. Berapa harga yang harus dibayar?', j: 'Rp160.000', c: 'Diskon = 20% x 200.000 = 40.000. Bayar = 200.000 - 40.000' },
  { p: 'Satu karung beras berat totalnya (Bruto) 50 kg. Jika Tara 1 kg, berapakah berat berasnya saja (Netto)?', j: '49 kg', c: 'Netto = Bruto - Tara = 50 kg - 1 kg = 49 kg' },
  { p: 'Pedagang beli barang Rp100.000, ingin laba 15%. Berapa ia harus menjualnya?', j: 'Rp115.000', c: 'Keuntungan = 15% x 100.000 = 15.000. Harga Jual = Modal + Untung = 115.000' },
  { p: 'Ahmad menabung Rp1.000.000 dengan bunga 12% pertahun. Berapa uang Ahmad setelah 6 bulan?', j: 'Rp1.060.000', c: 'Bunga = Modal x p x (b/12) = 1.000.000 x 12% x (6/12) = 60.000. Jadi, 1.000.000 + 60.000 = 1.060.000' }
];

const perbandinganLatihan = [
  { p: 'Bentuk sederhana dari perbandingan 40 cm : 2 m adalah?', j: '1 : 5', c: 'Samakan satuan ke cm. 40 cm : 200 cm = 1 : 5.' },
  { p: 'Jika skala peta 1 : 100.000, jarak peta 5 cm. Jarak sebenarnya?', j: '5 km', c: 'Js = Jp * Skala = 5 * 100.000 cm = 500.000 cm = 5 km.' },
  { p: '1 liter bensin untuk 12 km. Untuk 60 km butuh berapa liter?', j: '5 Liter', c: 'Senilai. (60 / 12) * 1 = 5 liter.' },
  { p: 'Pembangunan selesai 10 hari oleh 12 pekerja. Jika pekerja ada 15 orang, waktunya berpa hari?', j: '8 Hari', c: 'Berbalik. 10 * 12 = X * 15. X = 120 / 15 = 8 hari.' },
];

const unsurGeometriLatihan = [
  { p: 'Dua garis tidak pernah berpotongan meski diperpanjang disebut?', j: 'Sejajar', c: 'Kedudukan garis sejajar jaraknya sama dan tak pernah potong.' },
  { p: 'Sudut yang besarnya 120 derajat disebut sudut apa?', j: 'Tumpul', c: 'Sudut ditengah 90 - 180 derajat disebut sudut tumpul.' },
  { p: 'Jika ∠A dan ∠B berpelurus dan ∠A = 100°, berapa besar ∠B?', j: '80°', c: 'Sudut berpelurus jumlahnya 180°. 180° - 100° = 80°.' },
  { p: 'Dua sudut sehadap besarnya adalah ___', j: 'Sama', c: 'Sudut sehadap, berseberangan, bertolak belakang memiliki besar sama.' },
];

const pythagorasLatihan = [
  { p: 'Berapakah panjang sisi miring segitiga siku-siku dengan alas 3 cm dan tinggi 4 cm?', j: '5 cm', c: 'Ini adalah Tripel Pythagoras Tipe 1 (3, 4, 5).' },
  { p: 'Sisi miring sebuah bangun adalah 13 cm. Salah satu penyikunya adalah 5 cm. Penyiku lainnya?', j: '12 cm', c: 'Ini adalah Tripel Pythagoras Tipe 2 (5, 12, 13).' },
  { p: 'Apakah segitiga dengan sisi 5 cm, 7 cm, dan 9 cm merupakan segitiga siku-siku?', j: 'Bukan (Segitiga Tumpul)', c: '9² = 81. 5² + 7² = 25 + 49 = 74. Karena 81 > 74, maka ini adalah segitiga tumpul.' },
  { p: 'Jarak orang ke tiang 6 m. Tinggi tiang 8 m. Jarak orang ke ujung atas tiang?', j: '10 m', c: 'Gunakan Pythagoras: 6² + 8² = 36 + 64 = 100. Akar 100 adalah 10.' },
];

const bangunDatarLatihan = [
  { p: 'Berapa jumlah seluruh sudut dalam pada sebuah segitiga?', j: '180°', c: 'Segitiga jenis apapaun (sama sisi, sama kaki, sembarang) jumlah sudutnya selalu 180°.' },
  { p: 'Apa nama segiempat yang keempat sisinya sama panjang, namun belum tentu keempat sudutnya 90°?', j: 'Belah Ketupat', c: 'Belah ketupat memiliki 4 sisi sama panjang, tetapi sudutnya hanya yang berhadapan saja yang sama besar.' },
  { p: 'Sebuah persegi memiliki sisi 7 cm. Kelilingnya adalah?', j: '28 cm', c: 'Keliling persegi = 4 * sisi = 4 * 7 = 28 cm.' },
  { p: 'Luas jajargenjang dengan alas 10 cm dan tinggi 4 cm adalah?', j: '40 cm²', c: 'Luas jajargenjang = alas * tinggi = 10 * 4 = 40 cm².' },
];

const statistikaLatihan = [
  { p: 'Apa itu mean?', j: 'Rata-rata', c: 'Mean adalah rata-rata dari suatu kelompok data.' },
  { p: 'Berapakah mean dari 2, 4, 6?', j: '4', c: 'Jumlahkan semua data dibagi 3 = 12 / 3 = 4.' },
  { p: 'Apa yang dimaksud dengan range (jangkauan)?', j: 'Selisih Maksimum & Minimum', c: 'Nilai data terbesar dikurangi nilai data terkecil.' },
  { p: 'Jika data diurutkan: 2, 5, 7, 10, 15. Berapakah mediannya?', j: '7', c: '7 berada persis di tengah dari 5 data tersebut.' },
  { p: 'Dalam statistika, Q1 disebut juga?', j: 'Kuartil Bawah', c: 'Q1 membatasi 25% data terbawah.' }
];
const menyederhanakanAljabarLatihan = [
  { p: 'Berapakah 2x + 5x?', j: '7x', c: 'Suku sejenis x dijumlahkan koefisiennya: 2 + 5 = 7.' },
  { p: 'Sederhanakan 4y - y', j: '3y', c: 'Ingat bahwa y artinya 1y. Maka 4 - 1 = 3.' },
  { p: 'Apakah 2a dan 3b sejenis?', j: 'Bukan', c: 'Suku sejenis harus memiliki variabel (huruf) yang sama persis.' },
  { p: 'Berapakah 3a + 2b + a?', j: '4a + 2b', c: 'Gabungkan yang sejenis (3a + 1a), suku 2b dibiarkan karena berbeda.' },
  { p: 'Ubah kalimat "Beli 2 apel dan 3 jeruk, lalu beli 1 apel lagi" ke Aljabar (a=apel, j=jeruk) dan sederhanakan.', j: '3a + 3j', c: 'Awalnya 2a + 3j. Tambah 1a menjadi 3a + 3j.' }
];
const himpunanLatihan = [
  { p: 'Apakah "Kumpulan makanan enak" merupakan himpunan?', j: 'Bukan Himpunan', c: 'Syaratnya tidak jelas. Enak bagi seseorang belum tentu enak bagi orang lain.' },
  { p: 'Sebutkan anggota dari himpunan A = {bilangan genap kurang dari 10}.', j: '{2, 4, 6, 8}', c: 'Bilangan genap positif kurang dari 10.' },
  { p: 'Jika A = {1, 2, 3} dan B = {3, 4, 5}, berapakah A ∩ B?', j: '{3}', c: 'Irisan (∩) adalah anggota yang ada di A dan B sekaligus.' },
  { p: 'Berapakah A ∪ B untuk A = {1, 2} dan B = {2, 3}?', j: '{1, 2, 3}', c: 'Gabungan (∪) menyatukan semua anggota. Anggota "2" cukup ditulis sekali.' },
  { p: 'Apa itu Himpunan Semesta?', j: 'Himpunan seluruh objek', c: 'Himpunan yang memuat seluruh objek yang sedang dibicarakan, biasa dilambangkan S.' }
];
const relasiFungsiLatihan = [
  { p: 'Apa yang membedakan relasi dan fungsi?', j: 'Syarat pemetaan', c: 'Fungsi mensyaratkan setiap domain harus memiliki TEPAT SATU pasangan.' },
  { p: 'Apakah {(1,a), (1,b)} termasuk fungsi?', j: 'Bukan Fungsi', c: 'Domain 1 memiliki 2 pasangan (a dan b), tidak memenuhi syarat fungsi.' },
  { p: 'Apa itu Range dalam fungsi?', j: 'Daerah hasil', c: 'Anggota kodomain yang benar-benar memiliki pasangan dari domain.' },
  { p: 'Hitung nilai f(x) = 3x - 1 untuk x=2', j: '5', c: 'f(2) = 3(2) - 1 = 6 - 1 = 5.' },
  { p: 'Jika f(x) = x + 4, berapakah x agar f(x) = 10?', j: '6', c: 'x + 4 = 10, maka x = 6.' }
];
const persamaanGarisLurusLatihan = [
  { p: 'Berapakah gradien dari persamaan y = -5x + 3?', j: '-5', c: 'Dalam bentuk y = mx + c, gradiennya adalah m (angka di depan x).' },
  { p: 'Jika gradien garis adalah 2 dan melalui (0,0), tulis persamaannya.', j: 'y = 2x', c: 'Bentuk y = mx. y = 2x, c nya 0.' },
  { p: 'Apa rumus gradien antara titik (x1, y1) dan (x2, y2)?', j: 'm = (y2 - y1) / (x2 - x1)', c: 'Perbandingan selisih komponen y dengan selisih komponen x.' },
  { p: 'Di titik manakah garis y = x - 4 memotong sumbu-y?', j: '(0, -4)', c: 'Memotong sumbu-y saat x = 0. Jadi y = 0 - 4 = -4.' },
  { p: 'Apakah gradien dari garis yang sejajar dengan y = 3x?', j: '3', c: 'Garis yang saling sejajar memiliki kemiringan atau gradien yang sama (m1 = m2).' }
];
const bangunRuangSisiDatarLatihan = [
  { p: 'Berapakah luas permukaan kubus jika panjang sisinya 4 cm?', j: '96 cm²', c: 'L = 6 × s² = 6 × 4² = 6 × 16 = 96.' },
  { p: 'Berapa volume balok dengan p=5, l=4, t=2?', j: '40', c: 'V = p × l × t = 5 × 4 × 2 = 40.' },
  { p: 'Sebuah limas memiliki alas bentuk persegi dengan sisi 10cm. Tingginya 12cm. Berapa volumenya?', j: '400 cm³', c: 'V = 1/3 × Luas Alas × tinggi = 1/3 × (10×10) × 12 = 400.' },
  { p: 'Berapa jumlah titik sudut pada Prisma segitiga?', j: '6', c: 'Titik sudut prisma segi-n adalah 2n. Karena prisma segitiga n=3, 2(3) = 6.' },
  { p: 'Balok 2x3x4 punya berapa rusuk?', j: '12', c: 'Semua balok selalu memiliki 12 rusuk, tidak peduli ukurannya.' }
];
const barisanDeretLatihan = [
  { p: 'Barisan 1, 3, 5, 7 disebut barisan apa?', j: 'Aritmatika', c: 'Memiliki beda yang konstan yaitu +2.' },
  { p: 'Berapakah suku ke-5 dari 2, 4, 8, ...?', j: '32', c: 'Ini barisan geometri. Rasio=2. U5 = 2 × 2^4 = 32.' },
  { p: 'Suku ke-n pola persegi adalah?', j: 'n²', c: 'Pola: 1, 4, 9, 16... sesuai dengan luas persegi.' },
  { p: 'Apa beda barisan 10, 7, 4, 1...?', j: '-3', c: 'Pola berkurang 3 setiap sukunya. Jadi beda = -3.' },
  { p: 'Rasio barisan 5, 25, 125 adalah?', j: '5', c: 'Setiap suku dikalikan dengan 5.' }
];
const lingkaranLatihan = [
  { p: 'Berapakah luas juring jika sudut pusat 90° dan jari-jari 7?', j: '38.5', c: 'Luas juring = 90/360 * 22/7 * 7 * 7 = 1/4 * 154 = 38.5' },
  { p: 'Jika sudut pusat 80°, berapa besar sudut kelilingnya?', j: '40°', c: 'Sudut keliling = 1/2 × Sudut pusat' },
  { p: 'Sebutkan jarak antara titik pusat ke tali busur', j: 'Apotema', c: 'Apotema adalah garis tegak lurus dari pusat ke tali busur' },
  { p: 'Keliling lingkaran dengan d=14?', j: '44', c: 'K = πd = 22/7 × 14 = 44' },
  { p: 'Garis lengkung pada tepi lingkaran disebut apa?', j: 'Busur', c: 'Busur adalah bagian dari keliling lingkaran.' }
];
const spldvLatihan = [
  { p: 'Berapakah nilai y jika x=2 pada persamaan x + y = 10?', j: '8', c: '2 + y = 10 -> y = 10 - 2 = 8.' },
  { p: 'Metode apa yang menggunakan grafik untuk mencari HP?', j: 'Grafik', c: 'Metode grafik dilakukan dengan menggambar kedua persamaan.' },
  { p: 'Dua angka jumlahnya 10, selisihnya 2. Angka terbesarnya?', j: '6', c: 'x+y=10, x-y=2. Eliminasi y: 2x=12 -> x=6.' },
  { p: 'Apa model matematika dari: "3 apel dan 2 jeruk seharga 5000"?', j: '3x + 2y = 5000', c: 'x=apel, y=jeruk.' },
  { p: 'Jika 2x = 4, berapakah nilai x?', j: '2', c: 'x = 4 / 2 = 2.' }
];
const geometriKesebangunanLatihan = [
  { p: 'Jika ΔABC ≅ ΔPQR, apa artinya?', j: 'Kongruen', c: 'Kedua segitiga sama persis ukuran dan bentuknya.' },
  { p: 'Persegi A (sisi 2cm) dan B (sisi 4cm). Apakah mereka sebangun?', j: 'Ya', c: 'Semua persegi pasti sebangun karena semua sudutnya 90° dan rasio sisinya tetap.' },
  { p: 'Apa syarat agar dua bangun dikatakan sebangun?', j: 'Sisi sebanding & sudut sama', c: 'Perbandingan sisi bersesuaian senilai dan sudut bersesuaian sama besar.' },
  { p: 'Jika skala peta 1:100, jarak 5cm di peta berapa meter aslinya?', j: '5 meter', c: '5 * 100 = 500 cm = 5 meter.' },
  { p: 'Tinggi pohon 10m bayangan 4m. Tinggi anak bayangan 1m?', j: '2.5 m', c: '10/x = 4/1 -> 4x = 10 -> x = 2.5.' }
];
const bangunRuangSisiLengkungLatihan = [
  { p: 'Apa rumus volume tabung?', j: 'πr²t', c: 'Luas alas (lingkaran) dikali tinggi.' },
  { p: 'Sebuah bola jari-jari 7cm. Luas permukaannya?', j: '616 cm²', c: '4 * 22/7 * 7 * 7 = 616.' },
  { p: 'Berapa perbandingan volume Kerucut : Tabung jika r dan t sama?', j: '1 : 3', c: 'Volume kerucut adalah sepertiga dari volume tabung dengan dimensi sama.' },
  { p: 'Sisi lengkung kerucut disebut?', j: 'Selimut', c: 'Luas selimut kerucut rumusnya πrs.' },
  { p: 'Jika d=10cm, t=12cm. Volume tabung?', j: '300π atau 942 cm³', c: 'r=5. V = π * 5 * 5 * 12 = 300π.' }
];
const transformasiGeometriLatihan = [
  { p: 'Apa bayangan titik (1, 2) oleh translasi T(3, 4)?', j: '(4, 6)', c: 'Tinggal menjumlahkan: (1+3, 2+4) = (4,6).' },
  { p: 'Refleksi titik (x, y) terhadap sumbu X menghasilkan?', j: '(x, -y)', c: 'Nilai x tetap, nilai y berubah tanda.' },
  { p: 'Dilatasi pusat (0,0) faktor k=2 untuk titik (3, 5)?', j: '(6, 10)', c: 'Kalikan setiap koordinat dengan k: (3*2, 5*2).' },
  { p: 'Rotasi 180° titik (2, -3) terhadap pusat O(0,0)?', j: '(-2, 3)', c: 'Rumusnya (-x, -y), sehingga tanda keduanya berubah.' },
  { p: 'Pencerminan terhadap garis y = x memetakan (a, b) ke?', j: '(b, a)', c: 'Posisi x dan y ditukar tempat.' }
];
const peluangLatihan = [
  { p: 'Berapakah peluang muncul angka pada lemparan satu koin?', j: '1/2', c: 'Titik sampel koin ada 2 (A dan G). Angka cuma 1. Jadi 1/2.' },
  { p: 'Berapa jumlah titik sampel pada pelemparan dua dadu?', j: '36', c: 'Setiap dadu 6 sisi, jadi 6 * 6 = 36.' },
  { p: 'Apa bedanya peluang teoritis dan empiris?', j: 'Matematis vs Hasil Percobaan', c: 'Teoritis berdasarkan perhitungan rumus, Empiris berdasarkan data nyata percobaan.' },
  { p: 'Peluang muncul angka 7 pada satu dadu?', j: '0', c: 'Mustahil, karena dadu cuma sampai angka 6.' },
  { p: 'Jika dilakukan 50 lemparan dadu, muncul angka 1 sebanyak 10 kali. Peluang empirisnya?', j: '1/5', c: '10/50 disederhanakan jadi 1/5.' },
  { p: 'Fh muncul Gambar dari 100 lemparan koin?', j: '50 kali', c: 'P(G) = 1/2. Fh = 1/2 * 100 = 50.' }
];

export default function Latihan() {
  const { topicId } = useParams();
  const currentTopic = topics.find(t => t.id === topicId) || topics[0];
  const isAljabar = currentTopic.id === 'aljabar';
  const isPLSV = currentTopic.id === 'plsv-ptlsv';
  const isAritmatikaSosial = currentTopic.id === 'aritmatika-sosial';
  const isPerbandingan = currentTopic.id === 'perbandingan';
  const isUnsurGeometri = currentTopic.id === 'unsur-geometri';
  const isPythagoras = currentTopic.id === 'pythagoras';
  const isBangunDatar = currentTopic.id === 'bangun-datar';
  
  let latihanData = bilanganBulatLatihan;
  switch (currentTopic.id) {
    case 'aljabar': latihanData = aljabarLatihan; break;
    case 'plsv-ptlsv': latihanData = plsvLatihan; break;
    case 'aritmatika-sosial': latihanData = aritmatikaSosialLatihan; break;
    case 'perbandingan': latihanData = perbandinganLatihan; break;
    case 'unsur-geometri': latihanData = unsurGeometriLatihan; break;
    case 'pythagoras': latihanData = pythagorasLatihan; break;
    case 'bangun-datar': latihanData = bangunDatarLatihan; break;
    case 'statistika': latihanData = statistikaLatihan; break;
    case 'menyederhanakan-aljabar': latihanData = menyederhanakanAljabarLatihan; break;
    case 'himpunan': latihanData = himpunanLatihan; break;
    case 'relasi-fungsi': latihanData = relasiFungsiLatihan; break;
    case 'persamaan-garis-lurus': latihanData = persamaanGarisLurusLatihan; break;
    case 'bangun-ruang-sisi-datar': latihanData = bangunRuangSisiDatarLatihan; break;
    case 'barisan-deret': latihanData = barisanDeretLatihan; break;
    case 'lingkaran': latihanData = lingkaranLatihan; break;
    case 'spldv': latihanData = spldvLatihan; break;
    case 'geometri-kesebangunan': latihanData = geometriKesebangunanLatihan; break;
    case 'bangun-ruang-sisi-lengkung': latihanData = bangunRuangSisiLengkungLatihan; break;
    case 'transformasi-geometri': latihanData = transformasiGeometriLatihan; break;
    case 'peluang': latihanData = peluangLatihan; break;
    default: latihanData = bilanganBulatLatihan;
  }

  const [flipped, setFlipped] = useState<number[]>([]);

  const toggleFlip = (index: number) => {
    setFlipped(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Kuis Mandiri - {currentTopic.name}</h1>
          <p className="text-slate-500 text-sm mt-1">Pikirkan jawabannya lebih dulu, lalu klik kartu untuk melihat jawaban yang benar!</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {latihanData.map((item, index) => {
          const isFlipped = flipped.includes(index);
          return (
            <div 
              key={index}
              onClick={() => toggleFlip(index)}
              className="cursor-pointer group perspective-1000 h-[240px]"
            >
              <div className={`relative w-full h-full text-center transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center hover:border-indigo-400 hover:shadow-md transition-all">
                   <div className="text-[10px] font-bold text-indigo-500 mb-3 tracking-widest uppercase">Soal Praktik {index + 1}</div>
                   <h3 className="text-base md:text-lg font-bold text-slate-800 px-4">{item.p}</h3>
                   <div className="absolute bottom-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded">Buka Kartu</div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-600 border border-indigo-700 text-white rounded-xl p-6 shadow-md flex flex-col justify-center items-center">
                   <h3 className="text-xl md:text-2xl font-extrabold font-mono mb-4">{item.j}</h3>
                   <div className="bg-indigo-700/50 p-4 rounded-lg border border-indigo-500/50 text-indigo-100 text-xs text-left w-full">
                      <strong className="block text-white mb-1 uppercase tracking-wider text-[10px]">Penjelasan Singkat:</strong>
                      {item.c}
                   </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-green-800 uppercase tracking-widest mb-1">Materi Dikuasai?</h3>
          <p className="text-green-700 text-xs">Jika sudah yakin dengan penguasaan materi ini, uji kemampuanmu secara nyata di Ulangan Harian.</p>
        </div>
      </div>

    </div>
  );
}
