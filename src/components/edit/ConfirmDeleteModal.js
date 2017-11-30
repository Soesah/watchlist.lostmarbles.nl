
let ConfirmDeleteModal = Vue.component('confirm-delete-modal', {
  template:`<section class="modal-content">
              <h2>Delete</h2>
              <p>Are you sure you want to delete <span v-text="data.name"></p>
              <div class="buttons">
                <button type="button" class="action" @click="confirm">Ok</button>
                <button type="button" class="option" @click="cancel">Cancel</button>
              </div>
            </section>`,
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    confirm (evt) {
      this.$emit('confirm');
    },
    cancel (evt) {
      this.$emit('cancel');
    }
  }
});