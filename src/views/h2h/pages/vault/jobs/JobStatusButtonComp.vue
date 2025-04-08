<template>
  <b-button size="sm" :variant="getStatusVariant(item.success, item.finishedAt)" @click="$emit('clickButton', item)">
    <div style="font-size: 0.75rem">
      <b-icon :icon="getStatusIcon(item.success, item.finishedAt)" />
      {{ item.status }}
    </div>
  </b-button>
</template>

<script>
export default {
  name: "JobStatusButtonComp",
  props: {
    item: {
      type: Object,
      required: true,
    },
    isDetail: {
      type: Boolean,
      default: false,
      required: false,
    }
  },
  methods: {
    getStatusVariant(isSuccess, isFinished) {
      if (isFinished == null) return 'outline-primary';
      else if (isSuccess) return 'outline-success';
      else return 'outline-danger';
    },
    getStatusIcon(isSuccess, isFinished) {
      if (isFinished == null) return 'play';
      else if (isSuccess) return 'check-circle';
      else return 'x-circle';
    },
  },
}
</script>
