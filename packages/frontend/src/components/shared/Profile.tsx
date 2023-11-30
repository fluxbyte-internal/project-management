import { CreatedByUser } from "@/api/query/useProjectQuery";

type Props = {
  user: CreatedByUser;
};
export default function ProfileName(props: Props) {
  const { user } = props;

  return (
    <div className="flex w-32 lg:flex-row items-center gap-1 sm:gap-3">
      {user.avatarImg ? (
        <img src={user.avatarImg} className="w-11 h-11" />
      ) : (
        <div className="w-11 h-11 aspect-square rounded-full bg-primary-200 outline-none cursor-pointer">
          <span className="text-primary-800 text-lg font-bold flex justify-center items-center w-full h-full">
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "A"}
            {user?.lastName
              ? user?.lastName.charAt(0).toUpperCase()
              : user?.firstName
                ? user.firstName.charAt(1).toUpperCase()
                : "B"}
          </span>
        </div>
      )}
      <div className="text-sm whitespace-nowrap font-medium ">
        {user.firstName} {user.lastName}
      </div>
    </div>
  );
}
