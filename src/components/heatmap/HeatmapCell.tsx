type Props = {
  date: string;
  count: number;
  level: number;
};

export default function HeatmapCell({ date, count, level }: Props) {
  return (
    <div
      className={`h-3 w-3 rounded-sm ${getColor(level)}`}
      title={`${date} : ${count} posts`}
    />
  );
}

function getColor(level: number) {
  switch (level) {
    case 1:
      return "bg-green-200";
    case 2:
      return "bg-green-300";
    case 3:
      return "bg-green-400";
    case 4:
      return "bg-green-500";
    default:
      return "bg-neutral-200";
  }
}
