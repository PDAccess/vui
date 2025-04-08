<template>
  <p-card>
    <p-loading v-if="loading" message="Loading..." class="my-5" />
    <p-error v-else-if="error" header="Jobs Load Error" message="Something went wrong!" @reload="$emit('refresh')" :error-response="errorMessage" />
    <p-empty v-else-if="jobs.length === 0" message="Not found any triggered jobs!" header="Jobs Empty" />
    <template v-else>
    <b-table :items="jobs" :fields="tableFields">
      <template v-slot:cell(status)="row">
        <job-status-button-comp :item="row.item" @clickButton="jobDetail" />
      </template>
      <template v-slot:cell(id)="row">
        #{{ row.item.id }}
      </template>
      <template v-slot:cell(name)="row">
        {{ row.item.name }}
      </template>
      <template v-slot:cell(started_at)="row">
        <timing-comp :start-date="row.item.startedAt" :end-date="Date.now()" />
      </template>
      <template v-slot:cell(finished_at)="row">
        <timing-comp v-if="row.item.finishedAt" :start-date="row.item.finishedAt" :end-date="Date.now()" />
      </template>
    </b-table>
    <infinite-loading
          @infinite="handlePaging"
          force-use-infinite-wrapper
        >
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
    </template>
  </p-card>
</template>

<script>
import TimingComp from "../../../components/TimingComp";
import JobStatusButtonComp from "./JobStatusButtonComp";
import InfiniteLoading from "vue-infinite-loading";
export default {
  components: {JobStatusButtonComp, TimingComp, InfiniteLoading},
  props: ['jobs', 'loading' , 'error', 'errorMessage'],
  name: "JobsListComponent",
  data() {
    return {
      tableFields: [
        { key: 'status' },
        { key: 'id' },
        { key: 'name', label: 'Name' },
        { key: 'started_at', label: 'Started At'},
        { key: 'finished_at', label: 'Finished At'},
      ],
    };
  },
  methods: {
    jobDetail(job) {
      this.$router.push({name: "Job Detail",params: {item: job}});
    },
    handlePaging($state) {
      this.$emit('paging', $state);
    }
  },
  created() {
    this.loading = true;
    this.error = false;
  },
}
</script>
