<template>
  <b-modal :header-bg-variant="variant"
           hide-footer
           :id="id"
           :ref="refs"
           size="md"
           :title="title">
    <b-list-group flush>
      <b-list-group-item>
        <b-col>
          <strong>{{ message }}</strong>
        </b-col>
      </b-list-group-item>
    </b-list-group>
    <div class="buttons mt-3">
      <b-button @click.stop="confirm()" :variant="variant" class="btn">{{ label }}</b-button>
      <b-button @click.stop="cancel()" :variant="cancelButtonVariant" class="btn ml-1">Cancel</b-button>
    </div>
  </b-modal>
</template>
<script>
export default {
    props: {
      variant: {
        type: String,
        default: "danger"
      },
      title: {
        type: String,
        default: "Delete"
      },
      message: {
        type: String,
        default: "Are you sure?"
      },
      label: {
        type: String,
        default: "Delete"
      },
      id: {
        type: String,
        default: "modal"
      },
      refs: {
        type: String,
        default: "modal"
      },
      cancelButtonVariant:{
        type: String,
        default: "success"
      }
    },
    methods: {
        cancel() {
            this.$refs.modal.hide();
        },
        confirm() {
            this.$refs.modal.hide();
            this.$emit("confirm");
        }
    }
};
</script>
<style scoped>
.buttons {
    float: right;
}
</style>