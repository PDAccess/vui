<template>
  <b-button
    variant="link"
    v-clipboard:copy="copyItem"
    @mouseenter="mouseOver = true"
    @mouseleave="mouseOver = false"
    @click="onClick"
    v-b-tooltip.hover="'Copy'"
    id="my-trigger-button-id"
  >
    <b-icon
      icon="Back"
      :font-scale="mouseOver ? 0.9 : 0.8"
      :flip-h="mouseOver"
    ></b-icon>
  </b-button>
</template>
<script>
export default {
  components: {},
  props: ["copyItem"],
  data() {
    return {
      mouseOver: false,
    };
  },
  methods: {
    onClick() {
      this.$root.$emit('bv::hide::tooltip', 'my-trigger-button-id');
      this.$emit('click')
    }
  }
};
</script>
                
