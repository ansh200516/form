// components/ui/Select.js
import React from 'react';
import classNames from 'classnames';

const Select = React.forwardRef(({ className, error, children, ...props }, ref) => {
  return (
    <div className="flex flex-col">
      <select
        ref={ref}
        className={classNames(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
          {
            'border-red-500 focus:ring-red-500': error,
          },
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-red-500 text-xs mt-1">{error.message}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;