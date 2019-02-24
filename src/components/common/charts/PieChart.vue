<template>
  <div class="pie-chart">
    <div class="chart">
      <svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)" v-if="pathData.length">
        <path
          v-for="(path, index) in pathData"
          :key="index"
          :d="path"
          :fill="getFillColor(index)"
          @mouseenter="highlight(index, true)"
          @mouseleave="highlight(index, false)"
          class="slice"
          :class="{'slice-highlighted': highlighted === index}"
        ></path>
      </svg>
    </div>
    <div class="chart-info">
      <h3 v-if="chartInfo" v-text="chartInfo.title"></h3>
      <ul class="legend">
        <li
          v-for="(label, index) in labels"
          :key="index"
          @mouseenter="highlight(index, true)"
          @mouseleave="highlight(index, false)"
          class="legend-item"
          :class="{'legend-item-highlighted': highlighted === index}"
        >
          <span class="legend-item-label" :style="`background-color: ${getFillColor(index)} ;`"></span>
          <span v-text="label"></span>
        </li>
      </ul>
      <div v-if="false" class="slice-info">Hello world</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  chartColors,
  percentageToSVGSlice,
  ChartData,
  ChartInfo
} from "./ChartsUtil";

interface PieChartComponentData {
  highlighted: number;
}

const props = {
  chartInfo: { type: Object, default: () => {} }
};

export default Vue.extend({
  name: "PieChart",
  props,
  data(): PieChartComponentData {
    return {
      highlighted: -1
    };
  },
  computed: {
    total(): number {
      const info = <ChartInfo>this.chartInfo;

      return info.data
        ? info.data.reduce((acc: number, d: ChartData) => acc + d.value, 0)
        : 0;
    },
    labels(): string[] {
      const info = <ChartInfo>this.chartInfo;

      return this.total && info.data
        ? info.data.map(
            (d: ChartData, index: number) =>
              `${d.name} (${Math.round((d.value / this.total) * 100)}%)`
          )
        : [];
    },
    pathData(): string[] | false {
      const info = <ChartInfo>this.chartInfo;

      return this.total && info.data
        ? percentageToSVGSlice(
            info.data.map((d: ChartData) => d.value / this.total)
          )
        : [];
    }
  },
  methods: {
    getFillColor(index: number) {
      return chartColors[index];
    },
    highlight(index: number, set: boolean) {
      this.highlighted = set ? index : -1;
    }
  }
});
</script>
