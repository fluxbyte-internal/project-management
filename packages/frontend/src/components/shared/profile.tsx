type Props = {
  url: string;
  lable: string;
};
export default function ProfileName(props: Props) {
  const { lable, url } = props;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center w-fit gap-3">
      <img src={url} />
      <div className="text-sm font-medium w">{lable}</div>
    </div>
  );
}
