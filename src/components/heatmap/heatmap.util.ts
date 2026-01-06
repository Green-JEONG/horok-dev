export function getHeatmapLevel(count: number) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export const HEATMAP_COLORS = [
  "bg-neutral-200", // level 0
  "bg-green-200", // level 1
  "bg-green-300", // level 2
  "bg-green-400", // level 3
  "bg-green-500", // level 4
];
