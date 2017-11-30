
let ListInput = Vue.component('list-input', {
  template:`<div class="form-item">
              <label v-text="label"></label>
              <ul class="list-input-items">
                <li v-for="item, index in items">
                  <input type="text" :placeholder="placeholder" v-model="items[index]" @input="update"/>
                  <button class="option add-button" type="button" @click="addItem" v-show="index === items.length - 1">
                    <i class="icon icon-plus"></i>
                  </button>
                </li>
              </ul>
            </div>`,
  props: {
    label: {
      type: String,
      default: 'Label'
    },
    placeholder: {
      type: String
    },
    value: {}
  },
  data () {
    return {
      items: []
    };
  },
  created () {
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
    getList () {
      let list = this.value;

      if (!list.length) {
        list = [''];
      }

      return list;
    },
    // update parent component item
    update () {
      let list = this.items;
      if (list.join() === '') {
        list = [];
      }
      this.$emit('input', list);
    },
    addItem () {
      this.items.push('');
      this.update();
    }
  }
});