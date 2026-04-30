import Image from "next/image";

const rows = [
  { top: "3%", offset: "clamp(56px, 6vw, 84px)" },
  { top: "16%", offset: "0px" },
  { top: "29%", offset: "clamp(56px, 6vw, 84px)" },
  { top: "42%", offset: "0px" },
  { top: "55%", offset: "clamp(56px, 6vw, 84px)" },
  { top: "68%", offset: "0px" },
  { top: "81%", offset: "clamp(56px, 6vw, 84px)" },
  { top: "94%", offset: "0px" },
  { top: "107%", offset: "clamp(56px, 6vw, 84px)" },
] as const;

const columns = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export default function HorokCoteBackgroundPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {rows.flatMap((row) =>
        columns.map((column) => (
          <Image
            key={`${row.top}-${column}`}
            src="/logo.png"
            alt=""
            width={700}
            height={700}
            className="absolute h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2 opacity-20 sm:h-[56px] sm:w-[56px]"
            style={{
              top: row.top,
              left: `calc(${row.offset} + ${column} * clamp(112px, 12vw, 176px))`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )),
      )}
    </div>
  );
}
