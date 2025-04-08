<template>
  <b-card class="aminated fadeIn" :no-body="cardBody">
    <slot></slot>
  </b-card>
</template>

<script>
export default {
  props: {
    cardBody: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>

<style scoped>
.card {
  border: none;
  border-left: 0px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  border-radius: 0px;
  padding-top: 10px;
  padding-right: 0px;
  padding-bottom: 10px;
  padding-left: 0px;
}
</style>