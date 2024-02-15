import Select, { Props } from 'react-select';
import { cn } from '@/lib/utils';

function InputSelect<T>({ className, ...otherProps }: Props<T>) {
  return (
    <Select
      className={cn(
        'rounded-md z-20 border border-gray-100 mt-2 w-full h-[46px] focus:outline-[#943B0C] [&>div]:min-h-full [&>div]:border-none [&>div]:rounded-md', // [&>div:first-of-type]:bg-transparent
        className,
      )}
      {...otherProps}
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
}

export default InputSelect;
