import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

const UserAvatar = forwardRef<
  HTMLDivElement,
  {
    user: {
      firstName?: string | null;
      lastName?: string | null;
      avatarImg?: string | null;
      email: string;
    } | null;
    className?: string;
  }
>((props, ref) => {
  const { className, user, ...otherProps } = props;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const avatarClass = cn(
    "rounded-full w-8 h-8 aspect-square rounded-full bg-primary-200 outline-none",
    className
  );

  if (user?.avatarImg && !imageError) {
    return (
      <div className={avatarClass} ref={ref} {...otherProps}>
        <img
          src={user.avatarImg}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full"
          onError={handleImageError}
        />
      </div>
    );
  } else {
    const initials = user?.firstName
      ? user.lastName
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        : `${user?.firstName.charAt(0)}${user?.firstName.charAt(1)}`.toUpperCase()
      : `${user?.email.charAt(0)}${user?.email.charAt(1)}`.toUpperCase();
    return (
      <div className={avatarClass} ref={ref} {...otherProps}>
        <span className="text-primary-800 text-sm font-bold flex justify-center items-center w-full h-full">
          {initials}
        </span>
      </div>
    );
  }
});

export default UserAvatar;
