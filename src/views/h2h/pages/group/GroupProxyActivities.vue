<template>
  <p-card>
    <b-tabs content-class="mt-2" pills>
      <b-tab active title="Live Sessions">
        <LiveSessionPage :groupid="id"></LiveSessionPage>
      </b-tab>
    </b-tabs>
  </p-card>
</template>

<script>
import LiveSessionPage from "../activity/LiveSessionsPage";
import InfiniteLoading from "vue-infinite-loading";

export default {
  props: ["id"],
  components: {
    InfiniteLoading,
    LiveSessionPage,
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
};
</script>

<style>
</style>