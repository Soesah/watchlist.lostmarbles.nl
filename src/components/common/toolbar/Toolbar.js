
let Toolbar = Vue.component('toolbar', {
  template: `<nav class="toolbar">
                <slot></slot>
                <ul>
                  <li><router-link to="/" exact active-class="active">Home</router-link></li>
                  <li><router-link to="/add" active-class="active">Add an item</router-link></li>
                  <li v-for="nav in navigation">
                    <router-link :to="nav.to" active-class="active" v-text="nav.name"></router-link>
                  </li>
                </ul>
              </nav>`,
  computed: {
    navigation () {
      return this.$store.state.navigation;
    }
  }
});
