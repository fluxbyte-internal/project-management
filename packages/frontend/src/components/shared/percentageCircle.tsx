import { useEffect, useState } from "react";

type props = {
  percentage: string | number;
};
function PercentageCircle(props: props) {
  const { percentage } = props;
  const [color, setColor] = useState("#ff06068f");
  const [per, setPer] = useState(0);
  useEffect(() => {
    setPer(parseInt(`${percentage}`));
    if (!percentage) {
      setPer(0);
      setColor("#ff06068f");
    }

    if (percentage) {
      if (per > 0 && per < 25) {
        setColor("#ff06068f");
      }
      if (per > 25 && per < 50) {
        setColor("#ffa2068f");
      }
      if (per > 50 && per < 75) {
        setColor("#060fff8f");
      }
      if (per > 75 && per < 100) {
        setColor("#15A687");
      }
    }
  }, [per, percentage]);

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
          <div className="m-1">{per}%</div>
        </div>
      </div>
    </>
  );
}

export default PercentageCircle;
