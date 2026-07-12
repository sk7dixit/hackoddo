import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  let btnClass = '';
  switch (variant) {
    case 'primary':
      btnClass = 'btn-primary';
      break;
    case 'secondary':
      btnClass = 'btn-secondary';
      break;
    case 'danger':
      btnClass = 'btn-danger';
      break;
    case 'success':
      btnClass = 'btn-success';
      break;
  }

  return (
    <button className={`${btnClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
