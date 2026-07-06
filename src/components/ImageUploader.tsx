import React, { useRef, useState } from 'react';
import { Upload, Link, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [localUrl, setLocalUrl] = useState(value);
  const [uploading, setUploading] = useState(false);

  // Compress and resize the image client-side to save localStorage quota
  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল আপলোড করুন।');
      return;
    }

    setUploading(true);
    try {
      const base64 = await compressAndResizeImage(file);
      onChange(base64);
      setLocalUrl(base64);
    } catch (error) {
      console.error('Image compression failed:', error);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে। দয়া করে অন্য ছবি চেষ্টা করুন।');
    } finally {
      setUploading(false);
    }
  };

  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600; // Optimal size for high-fidelity web widgets
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Draw image with smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Output as tiny compressed JPEG (typically 20KB - 50KB)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = () => {
          resolve(event.target?.result as string);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleUrlSubmit = () => {
    onChange(localUrl);
    setShowUrlInput(false);
  };

  const isBase64 = value && value.startsWith('data:');

  return (
    <div className="space-y-2 border border-slate-800/80 rounded-xl bg-slate-950 p-4 transition-all hover:border-slate-700/80" id={`uploader-${label.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{label}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
        >
          {showUrlInput ? <Upload className="h-3 w-3" /> : <Link className="h-3 w-3" />}
          <span>{showUrlInput ? 'ফাইল আপলোড করুন' : 'ওয়েব লিঙ্ক বসান'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={localUrl}
            onChange={(e) => setLocalUrl(e.target.value)}
            placeholder="ইমেজ URL লিঙ্ক লিখুন বা পেস্ট করুন (যেমন https://...)"
            className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs focus:border-violet-500 focus:outline-none font-mono"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold p-2 text-xs transition-colors shrink-0"
            title="লিঙ্ক সেভ করুন"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Visual Current Image Preview Circle/Square */}
          <div className="relative h-14 w-14 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shrink-0 group">
            {value ? (
              <img
                src={value}
                alt={label}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-600">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                <RefreshCw className="h-4 w-4 animate-spin text-violet-400" />
              </div>
            )}
          </div>

          {/* Interactive Drag Drop Field */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-3 px-4 cursor-pointer text-center transition-all ${
              isDragging
                ? 'border-violet-500 bg-violet-900/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Upload className="h-4 w-4 text-slate-400 mb-1" />
            <p className="text-[10px] font-semibold text-slate-300">
              {uploading ? 'প্রসেসিং হচ্ছে...' : 'ক্লিক করে বা ড্র্যাগ করে ছবি আপলোড করুন'}
            </p>
            <p className="text-[8px] text-slate-500 mt-0.5">
              {isBase64 ? 'কাস্টম ইমেজ আপলোড করা আছে' : 'ডিফল্ট ছবি সক্রিয়'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
