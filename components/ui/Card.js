// components/ui/Card.js
import React from 'react';
import classNames from 'classnames';

const Card = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'rounded-lg border border-border bg-card p-6 shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;