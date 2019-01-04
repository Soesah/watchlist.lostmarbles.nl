<template>
  <div :class="['choice-input ', {'choice-input-open': open}]">
    <input
      class="visible"
      type="text"
      readonly
      :value="getName(item)"
      @keydown.prevent.esc="close"
      @keydown.prevent.enter="choose"
      @keydown.prevent.up="previous"
      @keydown.prevent.down="next"
    >
    <input
      class="invisible"
      type="text"
      tabindex="-1"
      readonly
      :value="item"
      @click="toggleList"
      @blur.prevent="blur"
      @keydown.prevent.esc="close"
      @keydown.prevent.space="choose"
      @keydown.prevent.enter="choose"
      @keydown.prevent.up="previous"
      @keydown.prevent.down="next"
    >
    <ul class="choice-list" v-if="open">
      <li
        v-for="(item, index) in items"
        :key="item.name"
        :class="focusClass(index)"
        :value="item.type"
        v-text="item.name"
        @click.stop.prevent="chooseItem(index)"
      ></li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Type } from "@/services/WatchItemFactory";

interface ChoiceState {
  item: number | null;
  open: boolean;
  focussed: number;
}
interface ChoiceProps {
  value: any;
  items: boolean;
}

const props = {
  value: {
    type: Object
  },
  items: {
    type: Array as () => Type[]
  }
};

export default Vue.extend({
  name: "Choice",
  props,
  data(): ChoiceState {
    return {
      item: null,
      open: false,
      focussed: 0
    };
  },
  watch: {
    value() {
      this.item = this.value;
    }
  },
  methods: {
    update() {
      this.$emit("input", this.item);
    },
    toggleList() {
      this.open = !this.open;
      this.focussed = this.open ? 0 : -1;
    },
    close() {
      this.open = false;
    },
    blur() {
      // prevent the blur from closing before a choose function has had time to work
      setTimeout(() => this.close(), 250);
    },
    choose() {
      if (this.open) {
        this.chooseItem(this.focussed);
      }
    },
    chooseItem(index: number) {
      const item = this.items[index];
      this.item = item ? item.type : null;
      this.update();
      this.close();
    },
    getName(item: Type): string {
      const it = this.items.find((item: Type) => item.type === this.value);
      return it ? it.name : "";
    },
    focusClass(index: number) {
      return index === this.focussed ? "choice-focus" : "";
    },
    next() {
      if (!this.open) {
        this.toggleList();
        return;
      }
      this.focussed++;
      if (this.focussed > this.items.length - 1) {
        this.focussed = 0;
      }
    },
    previous() {
      this.focussed--;
      if (this.focussed < 0) {
        this.focussed = this.items.length - 1;
      }
    }
  }
});
</script>
