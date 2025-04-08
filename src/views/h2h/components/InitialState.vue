<template>
  <div class="d-flex flex-column justify-content-center text-center mt-2">
    <div class="p-2">
      <b-icon class="h1" :icon="icon" />
    </div>
    <div class="p-2">
      <h3 class="text-center">
        {{ header }}
      </h3>
    </div>
    <div class="p-2">
      <h5 class="text-center">
        {{ message }}
      </h5>
    </div>
    <div v-if="help" class="p-2">
      <b-button variant="link" to="/help/helpIndex">Help</b-button>
    </div>
    <div class="p-2">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    header: {
      type: String,
      required: false,
    },
    help: {
      type: Boolean,
      required: false,
      default: true,
    },
    icon: {
      type: String,
      default: 'search',
      required: false,
    }
  },
};
</script>
