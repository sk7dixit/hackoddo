import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<any>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  icon: Icon, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        ref={ref}
        className={`glass-input w-full ${Icon ? 'pl-11' : 'pl-4'} ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
