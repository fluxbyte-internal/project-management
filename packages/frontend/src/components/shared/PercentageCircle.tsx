type Props = {
  percentage: string | number | null;
};
function PercentageCircle(props: Props) {
  const { percentage } = props;
  let color = '#ff06068f';
  const per = Number(percentage);
  if (percentage) {
    if (per > 0 && per < 25) {
      color = '#ff06068f';
    }
    if (per > 25 && per < 50) {
      color = '#ffa2068f';
    }
    if (per > 50 && per < 75) {
      color = '#060fff8f';
    }
    if (per > 75 && per <= 100) {
      color = '#15A687';
    }
  }

  return (
    <>
      <div className="w-full">
        <div
          className="h-[48px] w-[48px] rounded-full flex justify-center items-center"
          role="progressbar"
          aria-valuenow={75}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{
            background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(${color} ${per}%, #cecece 0)`,
          }}
        >
          <div className="m-1">{per.toFixed()}%</div>
        </div>
      </div>
    </>
  );
}

export default PercentageCircle;
