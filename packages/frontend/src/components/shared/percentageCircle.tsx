type props = {
  percentage: string | number |null;
};
function PercentageCircle(props: props) {
  let { percentage } = props;
  if (!percentage) {
    percentage = 0;
  }
  return (
    <>
      <div className="w-9">
        <svg viewBox="0 0 36 36" >
          <path
            className="fill-none stroke-slate-300 stroke-2"
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="fill-none stroke-2 stroke-orange-500"
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" style={{textAnchor:'middle'}} className="fill-slate-600 text-xs">
            {percentage}%
          </text>
        </svg>
      </div>
    </>
  );
}

export default PercentageCircle;
