import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
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

export default Card;
