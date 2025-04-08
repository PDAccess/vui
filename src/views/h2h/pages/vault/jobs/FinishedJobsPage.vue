<template>
  <div>
    <jobs-list-component :jobs="finishedJobs" :loading="loading" :error="error" :errorMessage="errorMessage" @refresh="getFinishedJobs" @paging="loadPage" />
  </div>
</template>

<script>
import JobsListComponent from "./JobsListComponent";
export default {
  name: "FinishedJobsPage",
  components: {JobsListComponent},
  data() {
    return {
      finishedJobs: [],
      loading: true,
      error: false,
      errorMessage: "",
      perPage: 15,
      currentPage: 0,
    }
  },
  methods: {
    getFinishedJobs() {
      this.currentPage = 0;
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage
      };
      this.$http
        .post("/api/v1/jobs/history/finished", page)
        .then((response) => {
          this.loading = false;
          this.finishedJobs = response.data;
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
        .post("/api/v1/jobs/history/finished", page)
        .then((response) => {
          if (response.data.length) {
            this.currentPage += 1;
            response.data.forEach((element) => {
              this.finishedJobs.push(element);
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
    this.getFinishedJobs();
  }
}
</script>
