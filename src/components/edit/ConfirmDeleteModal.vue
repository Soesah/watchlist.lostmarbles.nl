<script lang="ts">
import Vue, { VNode } from "vue";

export default Vue.extend({
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    confirm() {
      this.data.confirm();
      this.$emit("close");
    },
    cancel() {
      if (this.data.cancel) {
        this.data.cancel();
      }
      this.$emit("close");
    }
  },
  render: function(h: Function): VNode {
    return h(
      "section",
      {
        class: "modal-content"
      },
      [
        h("h2", "Delete"),
        h("p", ["Are you sure you want to delete ", h("span", this.data.name)]),
        h(
          "div",
          {
            class: "buttons"
          },
          [
            h(
              "button",
              {
                class: "danger",
                attrs: {
                  type: "button"
                },
                on: {
                  click: this.confirm
                }
              },
              [h("span", "Confirm")]
            ),
            h(
              "button",
              {
                class: "option",
                attrs: {
                  type: "button"
                },
                on: {
                  click: this.cancel
                }
              },
              [h("span", "Cancel")]
            )
          ]
        )
      ]
    );
  }
});
</script>
