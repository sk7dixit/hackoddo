import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'neutral', 
  children, 
  className = '', 
  ...props 
}) => {
  let badgeClass = '';
  switch (variant) {
    case 'success':
      badgeClass = 'badge-available';
      break;
    case 'warning':
      badgeClass = 'badge-reserved';
      break;
    case 'danger':
      badgeClass = 'badge-danger';
      break;
    case 'info':
      badgeClass = 'badge-allocated';
      break;
    case 'neutral':
      badgeClass = 'badge-neutral';
      break;
  }

  return (
    <span className={`badge ${badgeClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
