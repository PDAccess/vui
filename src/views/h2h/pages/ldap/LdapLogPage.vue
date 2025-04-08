<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="logs.length == 0">
        <p-empty message="You don't have any LDAP log." />
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <div class="form-group">
              <p-select
                :multiple="true"
                :options="users"
                :taggable="true"
                label="uid"
                placeholder="Select User"
                track-by="uid"
                v-model="selectedUsers"
              ></p-select>
            </div>
          </b-col>
          <b-col>
            <div class="form-group">
              <p-select
                :multiple="true"
                :options="servers"
                :taggable="true"
                label="name"
                placeholder="Select Server"
                track-by="name"
                v-model="selectedServers"
              ></p-select>
            </div>
          </b-col>
          <b-col>
            <div class="form-group">
              <p-date-picker
                @val="dateRangeData = $event"
                :select-date="dateRangeData"
                :isRange="true"
                :clearBtn="true"
                mode="range"
              />
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="item-table">
            <b-table
              fixed
              striped
              hover
              :items="logs"
              :fields="fields"
              :response="responsive"
            >
              <template v-slot:cell(host)="row">
                <span> {{ row.item.host }}</span>
              </template>
              <template v-slot:cell(user)="row">
                <span>{{ row.item.user }}</span>
              </template>
              <template v-slot:cell(command)="row">
                <span>{{ row.item.command + " " + row.item.params }}</span>
              </template>
              <template v-slot:cell(time)="row">
                <span>{{ (row.item.time * 1000) | moment("calendar") }}</span>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["id", "ip"],
  components: {},
  data() {
    const hSpacing = "20px";
    return {
      themeStyles: {
        wrapper: {
          background: "",
          color: "#fafafa",
          border: "0",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)",
          borderRadius: "5px",
        },
        header: {
          padding: `20px ${hSpacing}`,
        },
        headerHorizontalDivider: {
          borderTop: "solid rgba(255, 255, 255, 0.2) 1px",
          width: "80%",
        },
        weekdays: {
          color: "#000000", // New color
          fontWeight: "100", // And bolder font weight
          padding: `20px ${hSpacing} 5px ${hSpacing}`,
          fontSize: "0.8rem",
        },
        weeks: {
          padding: `0 ${hSpacing} ${hSpacing} ${hSpacing}`,
        },
        dayContent: {
          fontSize: "0.8rem",
        },
      },
      loading: true,
      logs: [],
      fields: [
        { key: "host", label: "Host" },
        { key: "user", label: "User" },
        { key: "command", label: "Command" },
        { key: "time", label: "Time" },
      ],
      dateRangeData: null,
      selectedUsers: [],
      selectedServers: [],
      servers: [],
      users: [],
      dataObject: "",
    };
  },
  computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: "is-danger",
          message: "Date required.",
        };
      }
      return {
        type: "is-primary",
        message: "",
      };
    },
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    clearDate() {
      this.dateRangeData = null;
    },
  },
  created() {
    this.loading = true;
    this.$http
      .post("/api/v1/action/list/" + this.ip)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          this.logs = response.data;
          this.loading = false;
        }
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.dataObject = {
      name: this.id,
    };
    this.$http
      .post("/api/ldap/v1/user", this.dataObject)
      .then((response) => {
        if (response.status == 200) {
          this.users = response.data;
        }
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .post("/api/ldap/v1/server", this.dataObject)
      .then((response) => {
        if (response.status == 200) {
          this.servers = response.data;
        }
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.col-lg-6 {
  padding-right: 0px;
  padding-left: 0px;
}
</style>
