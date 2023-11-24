type Props = {
  url: string;
  lable: string;
};
export default function ProfileName(props: Props) {
  const { lable, url } = props;

  return (
    <div className="flex w-32 lg:flex-row items-center gap-1 sm:gap-3">
      <img src={url} />
      <div className="text-sm whitespace-nowrap font-medium ">{lable}</div>
    </div>
  );
}
