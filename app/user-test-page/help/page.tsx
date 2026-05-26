'use client';

import React from 'react';
import { useUserTest } from '../context/UserTestContext';
import {
  HelpContainer,
  Header,
  HelpList,
  HelpSection,
  HelpTitle,
  HelpText,
  StyledInfo
} from './page.styled';


export default function EventHelpPage() {
  const { selectedEvent } = useUserTest();

  if (!selectedEvent) return null;

  return (
    <HelpContainer>
      <Header>
        <StyledInfo />
        <span>User Help Center</span>
      </Header>

      <HelpList>
        <HelpSection>
          <HelpTitle>How do I navigate offline?</HelpTitle>
          <HelpText>
            Select your destination category on the main screen, review the closest options based on distance, and tap the Go button. The arrow will point directly towards the selected POI.
          </HelpText>
        </HelpSection>

        <HelpSection>
          <HelpTitle>How do walk path guides help?</HelpTitle>
          <HelpText>
            Walk nodes represent approved police routes. The visual dotted navigator illustrates the safe walkway segment leading to your goal.
          </HelpText>
        </HelpSection>
      </HelpList>
    </HelpContainer>
  );
}
