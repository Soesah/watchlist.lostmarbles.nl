<template>
  <div class="pie-chart">
    <div class="chart">
      <svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)" v-if="pathData">
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
      <h3 v-if="legend" v-text="legend.title"></h3>
      <ul class="legend" v-if="legend">
        <li
          v-for="(label, index) in labels"
          :key="index"
          @mouseenter="highlight(index, true)"
          @mouseleave="highlight(index, false)"
          class="legend-item"
          :class="{'legend-highlighted': highlighted === index}"
        >
          <span class="label-color" :style="`background-color: ${getFillColor(index)} ;`"></span>
          <span v-text="label"></span>
        </li>
      </ul>
      <div v-if="false" class="slice-info">Hello world</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { chartColors, percentageToSVGPaths } from "./ChartsUtil";

interface PieChartData {
  highlighted: number;
}

const props = {
  data: { type: Array, default: () => [] },
  legend: { type: Object, default: () => null }
};

export default Vue.extend({
  name: "PieChart",
  props,
  data(): PieChartData {
    return {
      highlighted: -1
    };
  },
  computed: {
    pathData(): string[] | false {
      return (<number[]>this.data).length
        ? percentageToSVGPaths(<number[]>this.data)
        : false;
    },
    labels(): string[] {
      return this.legend.labels.map(
        (label: string, index: number) =>
          `${label} (${Math.round(<number>this.data[index] * 100)}%)`
      );
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
<style scoped>
.pie-chart {
  position: relative;
  display: flex;
}
.chart {
  width: 200px;
}
.slice {
  cursor: default;
}
.slice-highlighted {
  fill: #b54eb5;
}
.slice-info {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
}
.chart-info {
  padding-left: 16px;
}
h3 {
  margin-bottom: 10px;
}
.legend {
  padding: 0;
  list-style-type: none;
}
.label-color {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  position: relative;
  top: 2px;
  border-radius: 1px;
}
.legend-item {
  cursor: default;
  font-weight: 500;
}

.legend-item.legend-highlighted .label-color {
  background-color: #b54eb5 !important;
}

/* .legend-highlighted {
} */
</style>
