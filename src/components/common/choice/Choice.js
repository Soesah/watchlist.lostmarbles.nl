import StringUtil from 'core/services/StringUtil';

let Choice = Vue.component('choice', {
  template: `<div :class="['choice-input ', {'choice-input-open', open}]">
              <input class="visible" type="text" readonly :value="capitalize(item)" @keydown.prevent.esc="close" @keydown.prevent.enter="choose" @keydown.prevent.up="previous" @keydown.prevent.down="next"/>
              <input class="invisible" type="text" tabindex="-1" readonly :value="item" @click="toggleList" @blur.prevent="blur" @keydown.prevent.esc="close" @keydown.prevent.space="choose" @keydown.prevent.enter="choose" @keydown.prevent.up="previous" @keydown.prevent.down="next"/>
              <ul class="choice-list" v-if="open">
                <li v-for="(item, index) in items" :class="focusClass(index)" :value="item" v-text="capitalize(item)" @click.stop.prevent="chooseItem(index)"></li>
              </ul>
            </div>`,
  props: {
    value: {
      type:String
    },
    items: {
      type: Array
    }
  },
  data() {
    return {
      item: null,
      open: false,
      focussed: 0
    }
  },
  watch: {
    value() {
      this.item = this.value;
    }
  },
  methods: {
    update() {
      this.$emit('input', this.item);
    },
    toggleList() {
      this.open = !this.open;
      this.focussed = this.open ? 0 : -1;
    },
    close() {
      this.open = false;
    },
    blur(evt) {
      // prevent the blur from closing before a choose function has had time to work
      setTimeout(() => this.close(), 250);
    },
    choose() {
      if (this.open) {
        this.chooseItem(this.focussed);
      }
    },
    chooseItem(index) {
      let item = this.items[index];
      this.item = item;
      this.update();
      this.close();
    },
    focusClass(index) {
      return (index === this.focussed) ? 'choice-focus' : '';
    },
    next(evt) {
      if (!this.open) {
        this.toggleList();
        return;
      }
      this.focussed++;
      if (this.focussed > this.items.length - 1) {
        this.focussed = 0;
      }
    },
    previous(evt) {
      this.focussed--;
      if (this.focussed < 0) {
        this.focussed = this.items.length - 1;
      }
    },
    capitalize(str) {
      if (!str) {
        return '';
      }
      return StringUtil.capitalize(str);
    },
  }
});