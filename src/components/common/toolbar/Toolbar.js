import Version from 'components/common/version/Version';

let Toolbar = Vue.component('toolbar', {
  template: `<nav class="toolbar">
                <slot></slot>
                <ul>
                  <li><router-link to="/add" active-class="active">Add</router-link></li>
                  <li><router-link to="/franchises" exact active-class="active">Franchises</router-link></li>
                  <li v-for="nav in navigation">
                    <router-link :to="nav.to" exact active-class="active" v-text="nav.name"></router-link>
                  </li>
                </ul>
                <version></version>
              </nav>`,
  computed: {
    navigation () {
      return this.$store.state.navigation;
    }
  },
  components: {
    Version
  }
});

