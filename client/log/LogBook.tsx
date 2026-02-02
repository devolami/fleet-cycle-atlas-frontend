"use client";

import { useEffect, useRef } from "react";

import { useRoute } from "../contexts";

const LogBook: React.FC = () => {
  const gridSize = 40; // Each box is 40x40 pixels

  const { logData } = useRoute();

  return (
    <div className="w-full flex flex-col gap-8 p-5 bg-background">
      <div className="flex flex-col justify-center items-center my-6 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground">
          Driver's Daily Logbook
        </h1>
        <p className="my-3 md:my-4 text-muted-foreground">
          Review your hours of service records and duty status changes
        </p>
      </div>
      {logData &&
        logData.length > 0 &&
        logData.map((logbook, index) => (
          <SingleLogbook
            timeSpentInOffDuty={logbook.timeSpentInOffDuty}
            timeSpentInOnDuty={logbook.timeSpentInOnDuty}
            timeSpentInDriving={logbook.timeSpentInDriving}
            timeSpentInSleeperBerth={logbook.timeSpentInSleeperBerth}
            key={index}
            logbook={logbook.logbook}
            gridSize={gridSize}
            day={index + 1}
          />
        ))}
    </div>
  );
};

type LogEntry = {
  hour: number;
  row: "off-duty" | "sleeper" | "driving" | "on-duty";
  action?: string;
};

type LogbookProps = {
  logbook: LogEntry[];
  gridSize: number;
  day: number;
  timeSpentInOffDuty: number;
  timeSpentInOnDuty: number;
  timeSpentInDriving: number;
  timeSpentInSleeperBerth: number;
};

const SingleLogbook: React.FC<LogbookProps> = ({
  logbook,
  gridSize,
  day,
  timeSpentInOffDuty,
  timeSpentInOnDuty,
  timeSpentInDriving,
  timeSpentInSleeperBerth,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const cols = 24;
    const rows = 4;
    canvas.width = cols * gridSize;
    canvas.height = rows * gridSize;

    // Theme-matched ELD colors (from CSS variables)
    const rowColors: string[] = [
      "hsl(215, 20%, 35%)", // off-duty (muted gray)
      "hsl(262, 60%, 50%)", // sleeper (purple)
      "hsl(160, 84%, 45%)", // driving (emerald green)
      "hsl(38, 92%, 50%)", // on-duty (amber)
    ];
    const rowPositions: Record<string, number> = {
      "off-duty": 20,
      sleeper: 60,
      driving: 100,
      "on-duty": 140,
    };

    const colorRows = () => {
      for (let i = 0; i < rows; i++) {
        ctx.fillStyle = rowColors[i];
        ctx.fillRect(0, i * gridSize, canvas.width, gridSize);
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = "hsl(217, 33%, 25%)"; // border color
      ctx.lineWidth = 1;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        const interval = gridSize / 4;

        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x + interval, y);
          ctx.lineTo(x + interval, y + 10);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + 2 * interval, y);
          ctx.lineTo(x + 2 * interval, y + 20);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + 3 * interval, y);
          ctx.lineTo(x + 3 * interval, y + 10);
          ctx.stroke();
        }
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawLogbook = () => {
      ctx.strokeStyle = "hsl(210, 40%, 98%)"; // foreground (white line)
      ctx.lineWidth = 3;
      ctx.beginPath();

      logbook.forEach((entry, index) => {
        const x = entry.hour * gridSize;
        const y = rowPositions[entry.row];

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevEntry = logbook[index - 1];
          const prevX = prevEntry.hour * gridSize;
          const prevY = rowPositions[prevEntry.row];

          if (prevY !== y) {
            ctx.lineTo(prevX, y);
          }
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    };

    colorRows();
    drawGrid();
    drawLogbook();
  }, [logbook, gridSize]);

  return (
    <div className="h-112.5 flex flex-col items-center gap-1 border-solid border-2 border-border pl-10">
      <h3 className="text-lg font-bold text-foreground">Day {day}</h3>
      <div className="w-full h-full overflow-x-auto flex flex-row gap-2 whitespace-nowrap">
        <div className="text-xs font-bold flex flex-col items-end gap-6 whitespace-nowrap pt-12 text-muted-foreground">
          <p>Off Duty</p>
          <p>Sleeper Berth</p>
          <p>Driving</p>
          <div className="flex flex-col justify-center items-center">
            <p>On Duty</p>
            <p className="text-xs">(Not Driving)</p>
          </div>
        </div>

        <div className="relative flex flex-col min-h-0 pt-12">
          <canvas ref={canvasRef}></canvas>
          <div className="flex flex-row gap-6 absolute -top-0.5 -left-7.5 text-xs font-bold bg-primary text-primary-foreground p-2 justify-center items-end">
            <p className="-mr-2.5">
              Mid-
              <br />
              Night
            </p>
            <p>1</p>
            <p className="mr-2">2</p>
            <p className="mr-3">3</p>
            <p className="mr-4">4</p>
            <p className="mr-2">5</p>
            <p className="mr-3">6</p>
            <p className="mr-2">7</p>
            <p className="mr-2">8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>Noon</p>
            <p>1</p>
            <p className="mr-2">2</p>
            <p className="mr-3">3</p>
            <p className="mr-4">4</p>
            <p className="mr-2">5</p>
            <p className="mr-3">6</p>
            <p className="mr-2">7</p>
            <p className="mr-2">8</p>
            <p>9</p>
            <p>10</p>
            <p className="mr-1">11</p>
            <p className="-mr-2">
              Mid-
              <br />
              Night
            </p>
            <p>
              Total <br /> Hours
            </p>
          </div>

          {logbook.map((entry, index, arr) => {
            if (
              entry.row === "on-duty" &&
              index > 0 &&
              arr[index - 1].row === "on-duty"
            ) {
              const x = entry.hour * gridSize;

              return (
                <div
                  key={index}
                  className="absolute w-auto text-xs font-bold text-foreground rotate-45 pt-12 tracking-wider"
                  style={{
                    left: `${x - 2}px`,
                    top: "280px",
                  }}
                >
                  <p className="border-b-2 border-foreground">{entry.action}</p>
                </div>
              );
            }
          })}
          {logbook.map((entry, index, arr) => {
            if (
              entry.row === "off-duty" &&
              index > 0 &&
              arr[index - 1].row === "off-duty"
            ) {
              const x = entry.hour * gridSize;

              return (
                <div
                  key={index}
                  className="absolute w-auto text-xs font-bold text-foreground rotate-45 pt-12 tracking-wider"
                  style={{
                    left: `${x - 2}px`,
                    top: "230px",
                  }}
                >
                  <p className="border-b-2 border-foreground">{entry.action}</p>
                </div>
              );
            }
          })}
        </div>

        <div className="flex flex-col font-bold pt-12">
          <div className="w-11.25 h-10 bg-eld-off-duty border-b border-border flex flex-row justify-center items-center text-foreground">
            {!Number.isInteger(timeSpentInOffDuty)
              ? `${Math.trunc(timeSpentInOffDuty)}:30`
              : `${timeSpentInOffDuty}:00`}
          </div>
          <div className="w-11.25 h-10 bg-eld-sleeper border-b border-border flex flex-row justify-center items-center text-foreground">
            {!Number.isInteger(timeSpentInSleeperBerth)
              ? `${Math.trunc(timeSpentInSleeperBerth)}:30`
              : `${timeSpentInSleeperBerth}:00`}
          </div>
          <div className="w-11.25 h-10 bg-eld-driving border-b border-border flex flex-row justify-center items-center text-primary-foreground">
            {!Number.isInteger(timeSpentInDriving)
              ? `${Math.trunc(timeSpentInDriving)}:30`
              : `${timeSpentInDriving}:00`}
          </div>
          <div className="w-11.25 h-10 bg-eld-on-duty flex flex-row justify-center items-center text-warning-foreground">
            {!Number.isInteger(timeSpentInOnDuty)
              ? `${Math.trunc(timeSpentInOnDuty)}:30`
              : `${timeSpentInOnDuty}:00`}
          </div>

          <p className="border-solid border-b-2 border-primary-foreground text-primary-foreground font-bold h-10 w-11.25 px-6 -ml-1.25 mt-6 bg-primary flex flex-col justify-center items-center">
            {timeSpentInOffDuty +
              timeSpentInSleeperBerth +
              timeSpentInDriving +
              timeSpentInOnDuty}
            :00
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogBook;
