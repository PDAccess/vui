<template>
  <div>
    <jobs-list-component :jobs="allJobs" :loading="loading" :error="error" :errorMessage="errorMessage" @refresh="getAllJobs" @paging="loadPage" />
  </div>
</template>

<script>
import JobsListComponent from "./JobsListComponent";
export default {
  name: "AllJobsPage",
  components: {JobsListComponent},
  data() {
    return {
      allJobs: [],
      loading: true,
      error: false,
      errorMessage: "",
      perPage: 15,
      currentPage: 1,
    }
  },
  methods: {
    getAllJobs() {
      this.currentPage = 0;
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage
      };
      this.$http
        .post("/api/v1/jobs/history", page)
        .then((response) => {
          this.loading = false;
          this.allJobs = response.data;
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
        .post("/api/v1/jobs/history", page)
        .then((response) => {
          if (response.data.length) {
            this.currentPage += 1;
            response.data.forEach((element) => {
              this.allJobs.push(element);
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
    this.getAllJobs();
  }
}
</script>
