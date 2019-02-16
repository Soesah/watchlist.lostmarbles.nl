<template>
  <section class="settings">
    <h2>Settings & Statistics</h2>

    <p>See incomplete items (movies with N/A for runttime, series without seasons, etc.). See a pie chart for item types, and a bar chart for watched items.</p>
    <pie-chart :data="chartData" :legend="legend"></pie-chart>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { WatchlistItems } from "@/services/WatchItemFactory";
import { WatchlistType } from "@/core/models/BaseModel";
import PieChart from "@/components/common/charts/PieChart.vue";

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
  data() {
    return {
      legend: {
        title: "Watchlist Items",
        labels: l.map(
          (label: string) => `${label[0].toUpperCase()}${label.substring(1)}`
        )
      }
    };
  },
  computed: {
    items(): WatchlistItems[] {
      return this.$store.state.items;
    },
    chartData(): number[] {
      const data: WatchlistStatistics = this.items.reduce(
        (acc, item: WatchlistItems) => {
          switch (item.type) {
            case WatchlistType.Movie:
              acc.movies++;
              break;
            case WatchlistType.Series:
              acc.series++;
              break;
            case WatchlistType.Documentary:
              acc.documentaries++;
              break;
            case WatchlistType.Game:
              acc.games++;
              break;
            case WatchlistType.Franchise:
              acc.franchises++;
              break;
          }

          return acc;
        },
        {
          movies: 0,
          series: 0,
          documentaries: 0,
          games: 0,
          franchises: 0
        }
      );

      const totalItems = this.items.length;

      return [
        data.movies,
        data.series,
        data.documentaries,
        data.games,
        data.franchises
      ]
        .filter((total: number) => total)
        .map((total: number) => total / totalItems);
    }
  },
  created() {
    this.$store.dispatch("getWatchList");
  },
  components: {
    PieChart
  }
});
</script>
