<template>
  <div class="animated fadeIn pb-3" style="background: white; height: 100%">
    <p-loading v-if="loading" message="Loading..." class="my-5"/>
    <p-error v-else-if="errorStatus" header="Job Detail Error" message="Something went wrong!"
             :error-response="errorResponse" class="my-5"/>
    <template v-else>
      <p-card class="d-flex flex-row justify-content-between">
        <div class="d-flex justify-content-start align-items-center">
          <job-status-button-comp :item="item"/>
          <div class="ml-2">
            <strong>Job </strong>#{{ item.id }} triggered {{ $moment(item.startTime).fromNow() }} by
          </div>
          <p-profile-avatar :profile-username="item.user" class="ml-2" :size="30" image-width="30px"/>
        </div>
        <div>
          <b-button variant="success">
            <b-icon size="sm" icon="play" class="mr-1"/>
            Run
          </b-button>
        </div>
      </p-card>
      <p-card>
        <h3>{{ item.name }}</h3>
      </p-card>
      <ul class="list-group-item list-group-flush mt-3">
        <li class="list-group-item">
          <em class="fa fa-clock-o"/>
          <span class="ml-3">Job for <a href="">master</a> in {{
              (item.runningTime / 3600 | 0) + ' hours'
            }} {{
              (item.runningTime % 3600 / 60 | 0) + ' minutes'
            }} and {{ (item.runningTime % 3600 % 60 | 0) + 'seconds' }}</span>
        </li>
        <li class="list-group-item">
          <em class="fa fa-flag-o"/>
          <b-badge variant="success" class="ml-3">latest</b-badge>
        </li>
        <li class="list-group-item">
          <b-icon-three-dots size="sm"/>
          <span class="ml-3"><a href="">#{{ item.id }}</a></span>
        </li>
        <li class="list-group-item">
          <b-icon-arrow-repeat size="sm"/>
          <span class="ml-3">No related merge requests found.</span>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import JobStatusButtonComp from "./JobStatusButtonComp";

export default {
  name: "JobDetailPage",
  components: {JobStatusButtonComp},
  data() {
    return {
      loading: false,
      errorStatus: false,
      errorResponse: null,
      item: null,
    };
  },
  created() {
    this.item = this.$route.params.item;
  }
}
</script>
