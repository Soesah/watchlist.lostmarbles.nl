<template>
  <div class="form-item">
    <label v-text="label"></label>
    <ul class="list-input-items">
      <li v-for="(item, index) in items" :key="index">
        <input type="text" :placeholder="placeholder" v-model="items[index]" @input="update" />
        <button
          class="option add-button"
          type="button"
          @click="addItem"
          v-show="index === items.length - 1"
        >
          <i class="icon icon-plus"></i>
        </button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

interface ListInputData {
  items: string[];
}

const props = {
  label: {
    type: String,
    default: "Label"
  },
  placeholder: {
    type: String
  },
  value: {
    type: Array,
    default: []
  }
};

export default Vue.extend({
  name: "ListInput",
  props,
  data(): ListInputData {
    return {
      items: []
    };
  },
  created() {
    this.items = this.getList();
    this.update();
  },
  watch: {
    value: {
      // handle parent component updates to value
      handler() {
        this.items = this.getList();
      }
    }
  },
  methods: {
    getList(): string[] {
      let list = this.value as string[];

      if (!list.length) {
        list = [""];
      }

      return list;
    },
    // update parent component item
    update() {
      let list = this.items;
      if (list.join() === "") {
        list = [];
      }
      this.$emit("input", list);
    },
    addItem() {
      this.items.push("");
      this.update();
    }
  }
});
</script>
