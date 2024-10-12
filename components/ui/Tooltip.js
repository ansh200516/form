// components/ui/Tooltip.js
import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import classNames from 'classnames';

const Tooltip = ({ content, children }) => {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        className={classNames(
          'bg-black text-white text-xs rounded px-2 py-1 shadow-lg',
          'animate-slide-up-fade'
        )}
        side="top"
        align="center"
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-black" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
};

export default Tooltip;