<template>
  <div class="animated fadeIn">
    <p-card>
      <p-loading v-if="isLoading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <b-tabs v-else no-body pills content-class="mt-2">
        <b-tab :title="tag" :key="tag" v-for="tag in logTags">
          <b-row>
            <b-col>
              <div v-if="getLogs(tag).length === 0">
                <p-initial
                  icon="plus-circle"
                  header="You don't have any agent file policy."
                  message="Please create an agent file policy."
                />
              </div>
              <b-table
                v-else
                :items="getLogs(tag)"
                :fields="logFields"
                show-empty
              >
                <template v-slot:cell(log_file)="row">
                  <span class="text-info">{{ row.item.fileName }}</span>
                </template>
                <template v-slot:cell(log_container)="row">
                  <span class="text-info">{{ row.item.parentName }}</span>
                </template>
                <template v-slot:cell(log_lastmodified)="row">
                  <span class="text-info">{{
                    $moment(row.item.lastModified).fromNow()
                  }}</span>
                </template>
                <template v-slot:cell(log_length)="row">
                  <span class="text-info">{{
                    row.item.length | bytes("MB")
                  }}</span>
                </template>
                <template v-slot:cell(log_detail)="row">
                  <span class="text-info">
                    <b-button
                      :to="
                        '/admin/logs/detail/' +
                        row.item.parentName +
                        '/' +
                        row.item.fileName +
                        '/' +
                        row.item.lastModified
                      "
                      variant="outline-primary"
                    >
                      <i class="fa fa-info"></i>
                    </b-button>
                  </span>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </p-card>
  </div>
</template>

<script>
export default {
  props: ["id"],
  components: {},
  filters: {
    bytes: function (data, to) {
      const const_term = 1024;

      if (to === "KB") {
        return (data / const_term).toFixed(3) + "KB";
      } else if (to === "MB") {
        return (data / const_term ** 2).toFixed(3) + "MB";
      } else if (to === "GB") {
        return (data / const_term ** 3).toFixed(3) + "GB";
      } else if (to === "TB") {
        return (data / const_term ** 4).toFixed(3) + "TB";
      } else {
        return "Please pass valid option";
      }
    },
  },
  data() {
    return {
      logs: [],
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      logFields: [
        { key: "log_file", label: "File" },
        { key: "log_container", label: "Container" },
        { key: "log_lastmodified", label: "LastModified" },
        { key: "log_length", label: "File Size" },
        { key: "log_detail", label: "" },
      ],
      isLoading: true,
      downloadStatus: false,
    };
  },
  methods: {
    getLogs(tag) {
      return this.logs.filter((log) => log.parentName === tag);
    },
  },
  computed: {
    logTags: function () {
      let tags = [];
      this.logs.forEach((log) => {
        if (!tags.includes(log.parentName)) {
          tags.push(log.parentName);
        }
      });
      return tags;
    },
  },
  created() {
    this.$http
      .get("/api/v1/system/log/list")
      .then((response) => {
        this.logs = response.data;
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.isLoading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>

<style scoped>
.inventory-logo {
  width: 50px;
  height: 40px;
}

.navbar {
  padding: 0.5rem 0rem;
}

.buttonMR {
  margin-right: 5px;
}
</style>

<style>
.policy-create-field .dropdown-menu.show {
  width: 100% !important;
}
</style>
