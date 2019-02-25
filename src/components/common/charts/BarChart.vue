<template>
  <div class="bar-chart">
    <div class="chart">
      <svg :viewBox="viewBox" v-if="true">
        <g v-for="(line, index) in horizontalGridlines" :key="`${line}-grid`">
          <line class="grid-line" x1="0" :y1="line" x2="4" :y2="line"></line>
          <text class="grid-legend" :x="4 - 0.25" :y="line + 0.09">{{ getGridNumber(index)}}</text>
        </g>
        <rect
          v-for="(data, index) in pathData.data"
          :key="index"
          :x="data.x"
          :y="data.y"
          :width="data.width"
          :height="data.height"
          :style="`fill:${getFillColor(index)};`"
          class="bar"
          :class="{'bar-highlighted': highlighted === index}"
          @mouseenter="highlight(index, true)"
          @mouseleave="highlight(index, false)"
        ></rect>
        <g>
          <rect
            v-for="(data, index) in pathData.data"
            :key="`${index}-trans`"
            :x="data.x"
            :y="0"
            :width="data.width"
            :height="svgInternalHeight - data.height"
            :style="`fill:transparent;`"
            class="bar"
            @mouseenter="highlight(index, true)"
            @mouseleave="highlight(index, false)"
          ></rect>
        </g>
        <line class="axis" x1="0" y1="0" x2="0" y2="2"></line>
        <line class="axis" x1="0" y1="2" x2="4" y2="2"></line>
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  chartColors,
  BarChartData,
  Rect,
  ChartData,
  ChartInfo,
  getMaxValue
} from "./ChartsUtil";

interface BarChartComponentData {
  highlighted: number;
}

const props = {
  chartInfo: { type: Object, default: () => {} },
  svgInternalWidth: { type: Number, default: 4 },
  svgInternalHeight: { type: Number, default: 2 },
  barWidthPercentage: { type: Number, default: 90 },
  horizontalGrid: { type: Number, default: 6 }
};

export default Vue.extend({
  name: "BarChart",
  props,
  data(): BarChartComponentData {
    return {
      highlighted: -1
    };
  },
  computed: {
    viewBox(): string {
      return `0 0 ${this.svgInternalWidth} ${this.svgInternalHeight}`;
    },
    info(): ChartInfo {
      return <ChartInfo>this.chartInfo;
    },
    total(): number {
      return this.info.data
        ? this.info.data.reduce((acc: number, d: ChartData) => acc + d.value, 0)
        : 0;
    },
    labels(): string[] {
      return this.total && this.info.data
        ? this.info.data.map(
            (d: ChartData, index: number) => `${d.name} (${d.value})`
          )
        : [];
    },
    horizontalGridlines(): number[] {
      const lineOffset = this.svgInternalHeight / this.horizontalGrid;
      return Array.from(Array(this.horizontalGrid).keys())
        .map((i: number) => i * lineOffset)
        .reverse();
    },
    pathData(): BarChartData {
      return this.total && this.info.data
        ? this.info.data.reduce(
            (acc: BarChartData, d: ChartData, index: number) => {
              const rect: Rect = {
                x: this.xOffset(index),
                y: this.yOffset(d.value),
                width: this.width(),
                height: this.height(d.value)
              };

              return {
                start: acc.start,
                data: [...acc.data, rect]
              };
            },
            {
              start: 0,
              data: []
            }
          )
        : {
            start: 0,
            data: []
          };
    }
  },
  methods: {
    getFillColor(index: number) {
      return chartColors[index];
    },
    getGridNumber(index: number) {
      return Math.round((this.maxValue() / this.horizontalGrid) * (index + 1));
    },
    highlight(index: number, set: boolean) {
      this.highlighted = set ? index : -1;
    },
    maxValue(): number {
      return getMaxValue(
        Math.max.apply(this, this.info.data.map((d: ChartData) => d.value))
      );
    },
    width(): number {
      return (
        (this.svgInternalWidth / this.info.data.length) *
        (this.barWidthPercentage / 100)
      );
    },
    height(value: number): number {
      return (this.svgInternalHeight * value) / this.maxValue();
    },
    xOffset(index: number): number {
      return (
        this.width() * index +
        (this.width() * (index + 1) * (100 - this.barWidthPercentage)) / 100
      );
    },
    yOffset(value: number) {
      return this.svgInternalHeight - this.height(value);
    }
  }
});
</script>
