interface PieChartData {
  start: number;
  data: string[];
}

export interface BarChartData {
  start: number;
  data: Rect[];
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChartInfo {
  title: string;
  data: ChartData[];
}

export interface ChartData {
  name: string;
  value: number;
  description?: string;
}

export const chartColors: string[] = [
  '#47ACB1',
  '#ADD5D7',
  '#7c7fbb',
  '#b6b7f1',
  '#F26522',
  '#F9AA7B',
  '#8bc34a',
  '#cddc39',
  '#FFCD34',
  '#FFE8AF'
];

export const coordsForPercentage = (percentage: number): number[] => {
  const x = Math.cos(2 * Math.PI * percentage);
  const y = Math.sin(2 * Math.PI * percentage);

  return [x, y];
};

export const percentageToSVGSlice = (percentages: number[]): string[] =>
  percentages.reduce(
    (acc: PieChartData, percentage: number) => {
      const [startX, startY] = coordsForPercentage(acc.start);

      // each slice starts where the last slice ended, so keep a cumulative percent
      acc.start += percentage;

      const [endX, endY] = coordsForPercentage(acc.start);

      // if the slice is more than 50%, take the large arc (the long way around)
      const largeArcFlag = percentage > 0.5 ? 1 : 0;

      acc.data = [
        ...acc.data,
        // create an array and join it just for code readability
        [
          `M ${startX} ${startY}`, // Move
          `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
          `L 0 0` // Line
        ].join(' ')
      ];

      return acc;
    },
    {
      start: 0,
      data: []
    }
  ).data;

export interface Point {
  x: number;
  y: number;
}

export const getCentroid = (points: Point[]) => {
  const centroid = { x: 0, y: 0 };
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    centroid.x += point.x;
    centroid.y += point.y;
  }
  centroid.x /= points.length;
  centroid.y /= points.length;
  return centroid;
};

const isEven = (value: number): boolean => {
  return !(value & 1);
};

const isOdd = (value: number): boolean => {
  return !isEven(value);
};

export const getMaxValue = (value: number): number => {
  const size = `${value}`.length;
  let max = Math.pow(10, size - 1);
  const step = Math.max(max / 10, 100);

  max -= max;
  max += step;

  while (max < value) {
    max += step;
  }

  if (isOdd(max / step) && max !== 100) {
    max += step;
  }

  return max;
};
