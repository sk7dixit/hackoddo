import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  hoverable = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`glass-card ${hoverable ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
