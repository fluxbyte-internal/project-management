import React from 'react';
import { cn } from '@/lib/utils';

function InputEmail({
  children,
  className,
  ...otherProps
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <input
      type="email"
      className={cn(
        'py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full h-[46px] focus:outline-[#943B0C]',
        className,
      )}
      {...otherProps}
    >
      {children}
    </input>
  );
}

export default InputEmail;
