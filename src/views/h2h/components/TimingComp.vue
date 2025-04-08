<template>
  <div class="d-flex flex-column" :class="{ 'text-nowrap': nowrap }">
    <div v-if="endDate != null">
      <b-icon-clock font-scale="0.7" />
      <span v-b-tooltip.hover-bottom :title="getTitle(endDate)">
        {{ timming() }}
      </span>
    </div>
    <div v-if="startDate != null">
      <b-icon-calendar font-scale="0.7" />
      <span v-b-tooltip.hover-bottom :title="getTitle(startDate)">
        {{ $moment(startDate).fromNow() }}
      </span>
    </div>
    <div v-else>
      <b-icon-calendar font-scale="0.7" />
      <span> none </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimingComp",
  props: {
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: false },
    nowrap: { type: Boolean, default: false },
    title: { type: String, required: false },
  },
  data() {
    return {
      elapsedTime: null,
    };
  },
  methods: {
    getTitle(date) {
      if (this.title === undefined) {
        return this.$moment(date).format('lll');
      }

      return this.title + " " + this.$moment(date).format('lll');
    },
    timming() {
      if (this.elapsedTime != null) return this.elapsedTime;

      let end = new Date(this.endDate);
      let start = new Date(this.startDate);
      let elapsedTime = (end.getTime() - start.getTime()) / 1000;
      let hour = ((elapsedTime / 3600) | 0).toString();
      let minutes = (((elapsedTime % 3600) / 60) | 0).toString();
      let second = ((elapsedTime % 3600) % 60 | 0).toString();
      this.elapsedTime = `${hour.length === 1 ? "0" + hour : hour}:${
        minutes.length === 1 ? "0" + minutes : minutes
      }:${second.length === 1 ? "0" + second : second}`;
    },
  },
};
</script>
