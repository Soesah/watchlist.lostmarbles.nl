<template>
  <div class="pie-chart">
    <h3 v-if="legend" v-text="legend.title"></h3>
    <svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)" v-if="pathData">
      <path v-for="(path, index) in pathData" :key="index" :d="path" :fill="getFillColor(index)"></path>
    </svg>
    <ul class="legend" v-if="legend">
      <li v-for="(label, index) in legend.labels" :key="index">
        <span class="label-color" :style="`background-color: ${getFillColor(index)} ;`"></span>
        <span v-text="label"></span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { chartColors, percentageToSVGPaths } from "./ChartsUtil";

export default Vue.extend({
  name: "PieChart",
  props: {
    data: { type: Array, default: () => [] },
    legend: { type: Object, default: () => null }
  },
  computed: {
    pathData() {
      return (<number[]>this.data).length
        ? percentageToSVGPaths(<number[]>this.data)
        : false;
    }
  },
  methods: {
    getFillColor(index: number) {
      return chartColors[index];
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
  top: 30px;
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
}
</style>
