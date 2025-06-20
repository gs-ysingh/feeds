import React, { useRef } from 'react';

export interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For demo: use a local preview URL. In production, upload to a server or cloud storage.
    const url = URL.createObjectURL(file);
    onImageUpload(url);
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <label>
        Image:
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ marginLeft: 8 }}
        />
      </label>
    </div>
  );
};
