import React, { useState } from 'react';
import { getQuestionImageCandidates, extractGoogleDriveFileId } from '../lib/bankSoalService';
import { ImageOff, ExternalLink, RefreshCw, ZoomIn } from 'lucide-react';

interface QuestionImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export default function QuestionImage({ src, alt, className }: QuestionImageProps) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!src || !src.trim()) return null;

  const rawUrl = src.trim();
  const candidates = getQuestionImageCandidates(rawUrl);
  const currentUrl = candidates[candidateIndex] || rawUrl;
  const isGoogleDrive = Boolean(extractGoogleDriveFileId(rawUrl));

  const handleImageError = () => {
    if (candidateIndex + 1 < candidates.length) {
      // Try next CDN endpoint
      setCandidateIndex(prev => prev + 1);
      setIsLoading(true);
    } else {
      // All endpoints failed
      setHasFailedAll(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasFailedAll(false);
  };

  if (hasFailedAll) {
    return (
      <div className="my-3 p-4 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-900 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0 text-amber-700">
            <ImageOff className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-bold text-slate-800 text-xs">
              ⚠️ Gambar Soal Belum Dapat Dimuat Langsung
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isGoogleDrive ? (
                <>
                  Tautan Google Drive ini kemungkinan masih berstatus <strong>"Dibatasi" (Restricted)</strong> atau diblokir izin aksesnya oleh browser.
                  <br />
                  <span className="text-indigo-700 font-semibold">Tips Guru:</span> Ubah Akses Umum di Google Drive menjadi <strong>"Siapa saja yang memiliki link"</strong> (Anyone with the link).
                </>
              ) : (
                'Tautan gambar tidak dapat diakses atau diblokir oleh penyedia hosting.'
              )}
            </p>
            <div className="pt-1.5 flex flex-wrap items-center gap-2">
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Gambar di Tab Baru</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setCandidateIndex(0);
                  setHasFailedAll(false);
                  setIsLoading(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-800 text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Coba Lagi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 flex flex-col items-center relative group">
      {isLoading && (
        <div className="w-full h-44 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
          <span>Memuat gambar diagram...</span>
        </div>
      )}

      <img
        key={currentUrl}
        src={currentUrl}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={handleImageLoad}
        onError={handleImageError}
        onClick={() => setIsZoomed(!isZoomed)}
        className={`${className || ''} ${isLoading ? 'hidden' : 'block'} ${
          isZoomed ? 'max-h-[500px]' : 'max-h-64 md:max-h-72'
        } w-auto max-w-full object-contain rounded-lg shadow-xs cursor-zoom-in transition-all duration-300`}
      />

      {!isLoading && !hasFailedAll && (
        <div className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
          <ZoomIn className="w-3 h-3" />
          <span>Klik gambar untuk memperbesar / memperkecil</span>
        </div>
      )}
    </div>
  );
}
