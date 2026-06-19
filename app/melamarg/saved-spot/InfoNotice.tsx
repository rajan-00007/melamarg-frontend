'use client';

import React from 'react';
import { Info } from 'lucide-react';
import styled from 'styled-components';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { useLanguage } from '../context/LanguageContext';

const NoticeContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background-color: #EEF2F6;
  border-radius: 1rem;
  padding: 1.25rem;
  width: 100%;
  box-sizing: border-box;
  margin-top: 1rem;
`;

const IconWrapper = styled.div`
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.15rem;
  flex-shrink: 0;
`;

export default function InfoNotice() {
  const { t } = useLanguage();

  return (
    <NoticeContainer>
      <IconWrapper>
        <Info size={18} />
      </IconWrapper>
      <Text
        variant="bodySmall"
        weight={500}
        color="#475569"
        style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.45', flex: 1 }}
      >
        {t('spotSavedLocally')}
      </Text>
    </NoticeContainer>
  );
}
