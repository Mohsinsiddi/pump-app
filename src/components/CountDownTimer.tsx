"use client";

import React, { useEffect, useState } from "react";
import { FaInfinity } from "react-icons/fa";

interface CountdownTimerProps {
  deadline: Date;
}

interface CountdownTimeLeft {
  days?: number;
  hrs?: number;
  mins?: number;
  secs?: number;
}

const INITIAL_TIME_LEFT = { days: 0, hr: 0, mins: 0, secs: 0 };

function CountdownTimer({ deadline }: CountdownTimerProps) {
  if (deadline.getTime() === 0) {
    return (
      <div
        key={""}
        className="flex border-[1px] border-slate-500 rounded-md p-1 bg-slate-700 text-white font-mono font-extrabold"
      >
        <div className="flex flex-row">
          <p className="">
            <FaInfinity size={24} />
          </p>
          <p>{`:`}</p>
          <p className="">
            <FaInfinity size={24} />
          </p>
        </div>
      </div>
    );
  }
  const [timeLeft, setTimeLeft] =
    useState<CountdownTimeLeft>(INITIAL_TIME_LEFT);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft(): CountdownTimeLeft {
    let timeLeft: CountdownTimeLeft = {};
    let currentDate = new Date();
    let difference = deadline.getTime() - currentDate.getTime();

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  return (
    <div
      className={
        "flex border-[1px] border-slate-500 rounded-md p-1 bg-slate-700 text-white font-mono font-extrabold"
      }
    >
      <div className={"flex"}>
        {Object.entries(timeLeft).map(([unit, value], index, array) => {
          return (
            <div key={unit} className="">
              <div className="flex flex-row">
                <p className="">{Math.floor(value / 10)}</p>
                <p className="">{value % 10}</p>
                {index !== array.length - 1 && <span>:</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CountdownTimer;
