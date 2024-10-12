// components/ui/Textarea.js
import React from 'react';
import classNames from 'classnames';

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => (
  <div className="flex flex-col">
    <textarea
      className={classNames(
        'border rounded px-3 py-2 focus:outline-none focus:ring',
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
        className
      )}
      ref={ref}
      {...props}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error.message}</span>}
  </div>
));

Textarea.displayName = 'Textarea';

export default Textarea;