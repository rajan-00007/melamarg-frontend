'use client';

import React, { useRef } from 'react';
import { Camera, Plus, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { useLanguage } from '@/context/LanguageContext';

const UploadCard = styled.div`
  width: 100%;
  height: 150px;
  border: 1px dashed #dfc9c2;
  border-radius: 1rem;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.brand.primary};
    background-color: #fbf8f6;
  }
`;

const IconContainer = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
  color: ${colors.brand.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlusBadge = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: ${colors.brand.primary};
  color: #ffffff;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #ffffff;

  svg {
    width: 8px;
    height: 8px;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteOverlay = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(239, 68, 68, 0.9);
  }
`;

interface PhotoUploadProps {
  photo: string | null;
  onChange: (base64: string | null) => void;
}

const compressImage = (base64Str: string, maxWidth = 600, maxHeight = 600): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Export to standard JPEG at 0.6 quality for lightweight storage
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

export default function PhotoUpload({ photo, onChange }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleCardClick = () => {
    if (!photo) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        try {
          const compressed = await compressImage(rawBase64);
          onChange(compressed);
        } catch (err) {
          console.warn('Image compression failed, falling back to raw data', err);
          onChange(rawBase64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <UploadCard onClick={handleCardClick}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
      />
      {photo ? (
        <>
          <ImagePreview src={photo} alt="Preview" />
          <DeleteOverlay onClick={handleDelete} type="button">
            <Trash2 size={16} />
          </DeleteOverlay>
        </>
      ) : (
        <>
          <IconContainer>
            <Camera size={32} strokeWidth={1.5} />
            <PlusBadge>
              <Plus size={8} strokeWidth={3} />
            </PlusBadge>
          </IconContainer>
          <Text
            variant="bodySmall"
            weight={600}
            color="#475569"
            style={{ margin: 0, fontSize: '13px' }}
          >
            {t('tapToTakePhoto')}
          </Text>
        </>
      )}
    </UploadCard>
  );
}
