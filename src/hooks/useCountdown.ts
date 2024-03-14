import { useState, useEffect } from 'react';

interface UseCountdownOptions {
  initialCount: number;
}

const useCountdown = ({ initialCount }: UseCountdownOptions) => {
  const [countdown, setCountdown] = useState<number>(initialCount);

  useEffect(() => {
    let countdownInterval: any;

    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown]);

  const resetCountdown = (value: number) => {
    setCountdown(value);
  };

  return { countdown, resetCountdown };
};

export default useCountdown;
