// components/ui/TooltipProvider.js
'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const TooltipProvider = ({ children }) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      {children}
    </Tooltip.Provider>
  );
};

export default TooltipProvider;