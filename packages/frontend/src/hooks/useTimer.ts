import { useEffect, useState } from 'react';

const useTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (timer) clearInterval(timer);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [time]);

  const resetTimer = (newTime = initialTime) => {
    setTime(newTime);
  };

  return { resetTimer, time };
};

export default useTimer;
