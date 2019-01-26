<script lang="ts">
import Vue, { VNode } from "vue";
import {
  WatchItemFactory,
  WatchlistItemsPure
} from "@/services/WatchItemFactory";

export default Vue.extend({
  name: "WatchListItem",
  functional: true,
  render: (createElement, context: any): VNode => {
    const item: WatchlistItemsPure = context.props.item;

    return createElement(
      "li",
      {
        class: ["item movie", { "movie-watched": item.watched }]
      },
      [
        createElement(
          "router-link",
          {
            props: {
              to: "/view/" + item.path
            }
          },
          [
            createElement("h6", item.title),
            createElement("span", {
              class: "bracketed",
              domProps: {
                innerHTML: item.year
              }
            }),
            createElement("i", {
              class:
                "icon icon-" + WatchItemFactory.getTypeName(item).toLowerCase(),
              on: {
                click: (evt: Event) => {
                  context.parent.$store.dispatch("toggleWatched", item);
                  evt.preventDefault();
                  evt.stopPropagation();
                }
              }
            })
          ]
        )
      ]
    );
  }
});
</script>
