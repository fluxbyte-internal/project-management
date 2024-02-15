import React from 'react';
import { cn } from '@/lib/utils';

function FormLabel({
  children,
  className,
  ...otherProps
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('font-medium text-base text-gray-8', className)}
      {...otherProps}
    >
      {children}
    </label>
  );
}
export default FormLabel;
