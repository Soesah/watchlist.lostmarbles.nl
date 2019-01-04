<template>
  <section class="modal-content">
    <h2>Delete</h2>
    <p>
      Are you sure you want to delete
      <span v-text="data.name"></span>
    </p>
    <div class="buttons">
      <button type="button" class="danger" @click="confirm">Ok</button>
      <button type="button" class="option" @click="cancel">Cancel</button>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ConfirmDeleteModal",
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
  }
});
</script>;
