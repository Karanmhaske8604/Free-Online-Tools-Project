import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import Dropzone from '../Dropzone';
import OptimizerControls from '../OptimizerControls';
import ImageCard from '../ImageCard';
import ComparisonModal from '../ComparisonModal';

export default function ImageCompressor() {
  const [images, setImages] = useState([]);
  const [options, setOptions] = useState({
    format: 'original',
    quality: 80,
    scale: 100,
  });
  const [activePreviewImage, setActivePreviewImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
        if (img.compressedPreviewUrl) URL.revokeObjectURL(img.compressedPreviewUrl);
      });
    };
  }, []);

  const handleFilesSelected = (files) => {
    const newImages = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        status: 'pending',
        compressedSize: null,
        compressedBlob: null,
        compressedPreviewUrl: null,
      };
    });
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemove = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
        if (target.compressedPreviewUrl) URL.revokeObjectURL(target.compressedPreviewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      if (img.compressedPreviewUrl) URL.revokeObjectURL(img.compressedPreviewUrl);
    });
    setImages([]);
  };

  const compressSingleImage = (imageItem, currentOptions) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageItem.previewUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scaleFactor = currentOptions.scale / 100;
        const width = img.naturalWidth * scaleFactor;
        const height = img.naturalHeight * scaleFactor;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let mimeType = imageItem.type;
        if (currentOptions.format !== 'original') {
          if (currentOptions.format === 'webp') mimeType = 'image/webp';
          else if (currentOptions.format === 'jpeg') mimeType = 'image/jpeg';
          else if (currentOptions.format === 'png') mimeType = 'image/png';
        }

        const quality = mimeType === 'image/png' ? undefined : currentOptions.quality / 100;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ ...imageItem, status: 'error' });
              return;
            }

            const compressedPreviewUrl = URL.createObjectURL(blob);
            resolve({
              ...imageItem,
              status: 'success',
              compressedSize: blob.size,
              compressedBlob: blob,
              compressedPreviewUrl,
              format: mimeType.split('/')[1],
            });
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve({ ...imageItem, status: 'error' });
      };
    });
  };

  const handleOptimizeAll = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    setImages((prev) =>
      prev.map((img) => (img.status !== 'success' ? { ...img, status: 'processing' } : img))
    );

    const updatedImages = [];
    for (const img of images) {
      if (img.status === 'success') {
        updatedImages.push(img);
        continue;
      }
      const result = await compressSingleImage(img, options);
      updatedImages.push(result);
    }

    setImages(updatedImages);
    setIsProcessing(false);
  };

  const handleDownloadSingle = (image) => {
    if (image.status !== 'success') return;
    const link = document.createElement('a');
    link.href = image.compressedPreviewUrl;
    link.download = `optimized_${image.name.substring(0, image.name.lastIndexOf('.'))}.${image.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    const successImages = images.filter((img) => img.status === 'success');
    if (successImages.length === 0) return;

    if (successImages.length === 1) {
      handleDownloadSingle(successImages[0]);
      return;
    }

    const zip = new JSZip();
    successImages.forEach((img) => {
      const ext = img.format;
      const baseName = img.name.substring(0, img.name.lastIndexOf('.'));
      zip.file(`optimized_${baseName}.${ext}`, img.compressedBlob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'optisnap_optimized_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasCompressed = images.some((img) => img.status === 'success');

  const totalOriginalSize = images.reduce((acc, img) => acc + img.size, 0);
  const totalCompressedSize = images.reduce(
    (acc, img) => acc + (img.compressedSize || img.size),
    0
  );
  const savingsPct =
    totalOriginalSize > 0
      ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
      : 0;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="grid-cols-2">
      <div className="left-column">
        <Dropzone onFilesSelected={handleFilesSelected} />

        {images.length > 0 && (
          <div className="queue-container glass-panel fade-in">
            <div className="queue-header">
              <div className="queue-info">
                <h3>Images Queue</h3>
                <span className="queue-count">{images.length} files</span>
              </div>
              {hasCompressed && savingsPct > 0 && (
                <div className="savings-badge-pill">
                  Total savings: {savingsPct}% ({formatSize(totalOriginalSize - totalCompressedSize)})
                </div>
              )}
            </div>

            <div className="image-cards-list">
              {images.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  onRemove={handleRemove}
                  onDownload={handleDownloadSingle}
                  onOpenPreview={setActivePreviewImage}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="right-column">
        <OptimizerControls
          options={options}
          setOptions={setOptions}
          onOptimizeAll={handleOptimizeAll}
          onDownloadAll={handleDownloadAll}
          onClearAll={handleClearAll}
          hasImages={images.length > 0}
          hasCompressed={hasCompressed}
          isProcessing={isProcessing}
        />
      </div>

      {activePreviewImage && (
        <ComparisonModal
          image={activePreviewImage}
          onClose={() => setActivePreviewImage(null)}
        />
      )}
    </div>
  );
}
