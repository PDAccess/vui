<template>
  <div class="animated fadeIn" style="background: white; height: 100%">
    <p-card>
      <div class="d-flex justify-content-between container-nav" v-if="!$route.fullPath.includes('jobDetail') && !$route.fullPath.includes('jobRun')">
        <div class="module-nav">
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            to="/admin/jobs/allJobs"
            :active="$route.fullPath.includes('/admin/jobs/allJobs')"
          >
            All Jobs
          </b-button>
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            to="/admin/jobs/runningJobs"
            :active="$route.fullPath.includes('/admin/jobs/runningJobs')"
          >
            Running
          </b-button>
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            to="/admin/jobs/passedJobs"
            :active="$route.fullPath.includes('/admin/jobs/passedJobs')"
          >
            Passed
          </b-button>
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            to="/admin/jobs/failedJobs"
            :active="$route.fullPath.includes('/admin/jobs/failedJobs')"
          >
            Failed
          </b-button>
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            to="/admin/jobs/finishedJobs"
            :active="$route.fullPath.includes('/admin/jobs/finishedJobs')"
          >
            Finished
          </b-button>
        </div>
        <div>
          <b-button variant="success" @click="$router.push({name: 'Job Run'})">
            <b-icon icon="play" size="sm" /><span class="ml-2">Run</span>
          </b-button>
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import JobsListComponent from "./JobsListComponent";
export default {
  name: "JobsNav",
  components: {JobsListComponent},
}
</script>
