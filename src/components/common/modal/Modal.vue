<template>
  <div class="modal-container" v-if="data">
    <section class="modal" :class="{show: show}">
      <component :is="data.modal" @close="close" :data="data"></component>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Modal",
  data() {
    return {
      data: null
    };
  },
  computed: {
    show(): boolean {
      return !!this.data;
    }
  },
  created() {
    this.$store.state.event.$on("openModal", this.open);
    this.$store.state.event.$on("closeModal", this.close);
  },
  methods: {
    open(data: any) {
      this.data = data;
    },
    close() {
      this.data = null;
    }
  }
});
</script>
