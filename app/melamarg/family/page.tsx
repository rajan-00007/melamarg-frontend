'use client';

import React from 'react';
import { useFamily } from '@/context/FamilyContext';
import FamilyLanding from './FamilyLanding';
import FamilyDashboard from './FamilyDashboard';

export default function FamilyPage() {
  const { currentGroup } = useFamily();

  if (currentGroup) {
    return <FamilyDashboard />;
  }

  return <FamilyLanding />;
}
