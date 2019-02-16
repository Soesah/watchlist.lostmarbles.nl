<template>
  <div class="pie-chart">
    <h3 v-if="legend" v-text="legend.title"></h3>
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
  width: 200px;
}
h3 {
  margin-bottom: 10px;
  position: absolute;
  left: 210px;
  width: 200px;
}
.legend {
  padding: 0;
  list-style-type: none;
  position: absolute;
  top: 34px;
  left: 210px;
  width: 200px;
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

.slice {
  cursor: default;
}
.slice-highlighted {
  fill: #b54eb5;
}

.legend-item {
  cursor: default;
}

.legend-item.legend-highlighted .label-color {
  background-color: #b54eb5 !important;
}

.legend-highlighted {
  opacity: 0.8;
}
</style>
