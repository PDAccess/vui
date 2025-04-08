<template>
  <div>
    <jobs-list-component :jobs="failedJobs" :loading="loading" :error="error" :errorMessage="errorMessage" @refresh="getFailedJobs" @paging="loadPage" />
  </div>
</template>

<script>
import JobsListComponent from "./JobsListComponent";
export default {
  name: "FailedJobsPage",
  components: {JobsListComponent},
  data() {
    return {
      failedJobs: [],
      loading: true,
      error: false,
      errorMessage: "",
      perPage: 15,
      currentPage: 0,
    }
  },
  methods: {
    getFailedJobs() {
      this.currentPage = 0;
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage
      };
      this.$http
        .post("/api/v1/jobs/history/failed", page)
        .then((response) => {
          this.loading = false;
          this.failedJobs = response.data;
          this.currentPage += 1;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.error = true;
          this.errorMessage = error;
        });
    },
    loadPage($state) {
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage
      };
      this.$http
        .post("/api/v1/jobs/history/failed", page)
        .then((response) => {
          if (response.data.length) {
            this.currentPage += 1;
            response.data.forEach((element) => {
              this.failedJobs.push(element);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.error = true;
          this.errorMessage = error;
        });
    }
  },
  created() {
    this.getFailedJobs();
  }
}
</script>
