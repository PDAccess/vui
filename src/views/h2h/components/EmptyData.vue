<template>
  <div class="d-flex flex-column justify-content-center mt-2">
    <div class="p-2">
      <img height="200" alt="Empty page" src="@/assets/img/emptypage.svg" />
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
  },
};
</script>
