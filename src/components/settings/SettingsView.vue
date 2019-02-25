<template>
  <section class="settings">
    <h2>Settings & Statistics</h2>

    <p>See incomplete items (movies with N/A for runttime, series without seasons, etc.). See a pie chart for item types, and a bar chart for watched items.</p>
    <pie-chart :chartInfo="itemsInfo"></pie-chart>
    <bar-chart :chartInfo="watchedItemsInfo"></bar-chart>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchlistItems } from "@/services/WatchItemFactory";
import { WatchlistType } from "@/core/models/BaseModel";
import PieChart from "@/components/common/charts/PieChart.vue";
import BarChart from "@/components/common/charts/BarChart.vue";
import { ChartInfo, ChartData } from "@/components/common/charts/ChartsUtil";

interface WatchlistStatistics {
  movies: number;
  series: number;
  documentaries: number;
  games: number;
  franchises: number;
}

const l: string[] = [
  "movies",
  "series",
  "documentaries",
  "games",
  "franchises"
];

export default Vue.extend({
  name: "SettingsView",
  computed: {
    items(): WatchlistItems[] {
      return this.$store.state.items;
    },
    itemsInfo(): ChartInfo {
      const totalItems = this.items.length;

      return {
        title: "Watchlist Items",
        data: [
          WatchlistType.Movie,
          WatchlistType.Series,
          WatchlistType.Documentary,
          WatchlistType.Game
        ].reduce(
          (acc: ChartData[], type: WatchlistType) => [
            ...acc,
            {
              name: WatchlistType[type],
              value: this.items.filter(
                (item: WatchlistItems) => item.type === type
              ).length
            }
          ],
          []
        )
      };
    },
    watchedItemsInfo(): ChartInfo {
      const totalItems = this.items.length;

      return {
        title: "Watchlist Items",
        data: [
          WatchlistType.Movie,
          WatchlistType.Series,
          WatchlistType.Documentary,
          WatchlistType.Game
        ].reduce(
          (acc: ChartData[], type: WatchlistType) => [
            ...acc,
            {
              name: WatchlistType[type],
              value: this.items.filter(
                (item: WatchlistItems) => item.type === type
              ).length
            },
            {
              name: `${WatchlistType[type]} watched`,
              value: this.items.filter(
                (item: WatchlistItems) => item.type === type && item.watched
              ).length
            }
          ],
          []
        )
      };
    }
  },
  created() {
    this.$store.dispatch("getWatchList");
  },
  components: {
    BarChart,
    PieChart
  }
});
</script>
