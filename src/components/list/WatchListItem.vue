<script lang="ts">
import Vue, { VNode } from "vue";
import {
  WatchItemFactory,
  WatchlistItemsPure
} from "@/services/WatchItemFactory";

export default Vue.extend({
  name: "WatchListItem",
  functional: true,
  render: (h, context: any): VNode => {
    const item: WatchlistItemsPure = context.props.item;

    return h(
      "li",
      {
        class: ["item movie", { "movie-watched": item.watched }]
      },
      [
        h(
          "router-link",
          {
            props: {
              to: "/view/" + item.path
            }
          },
          [
            h("h6", item.title),
            h("span", {
              class: "bracketed",
              domProps: {
                innerHTML: item.year
              }
            }),
            h("i", {
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
