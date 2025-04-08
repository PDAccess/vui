<template>
  <div class="d-flex flex-column justify-content-center text-center">
    <div>
      <img
        src="@/assets/img/loading.gif"
        alt="Loading gif"
        :height="gifHeight"
      />
    </div>
    <div class="mt-2">
      <h5>{{ message }}</h5>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: false,
    },
    header: {
      type: String,
      required: false,
    },
    gifHeight: {
      type: Number,
      default: 100,
      required: false,
    },
  },
};
</script>
