export const chartColors: string[] = [
  '#683D54',
  '#505E7D',
  '#1A7F82',
  '#499763',
  '#9FA241'
];

export const coordsForPercentage = (percentage: number): number[] => {
  const x = Math.cos(2 * Math.PI * percentage);
  const y = Math.sin(2 * Math.PI * percentage);

  return [x, y];
};

interface PieChartData {
  start: number;
  data: string[];
}

export const percentageToSVGPaths = (percentages: number[]): string[] =>
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
