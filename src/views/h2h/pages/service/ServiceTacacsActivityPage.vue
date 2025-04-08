<template>
  <p-card>
    <p-loading
      class="my-5"
      v-if="loading"
      message="Loading..."
    />
    <p-error
      v-else-if="errorStatus"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <p-initial
      v-else-if="tacacsLogs === null || tacacsLogs.length === 0"
      icon="exclamation-circle"
      header="You don't have any service tacacs logs."
      message="Please start an tacacs command from network device"
    />
    <template v-else>
      <b-table
        :fields="tacacsLogFields"
        :items="tacacsLogs"
        :responsive="responsive"
        hover
        show-empty
        :small="responsive"
      >
        <template v-slot:cell(user)="row">
          <span class="text-info">{{
            row.item.username
          }}</span>
        </template>

        <template v-slot:cell(command)="row">
          <span class="text-info">{{
            row.item.command
          }}</span>
        </template>
        
        <template v-slot:cell(params)="row">
          <span class="text-info">{{
            row.item.params
          }}</span>
        </template>

        <template v-slot:cell(remote_address)="row">
          <span class="text-info">{{ row.item.remoteAddr }}</span>
        </template>

        <template v-slot:cell(exec_time)="row">
          <span
            v-if="row.item.createdAt"
            class="text-info"
            :title="$moment(row.item.createdAt).calendar()"
            >{{
              $moment(row.item.createdAt).format("DD/MM/Y - hh:mm:s")
            }}</span
          >
        </template>
      </b-table>
    </template>
  </p-card>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: true,
      tacacsLogFields: [
        { key: "user", label: "User" },
        { key: "command", label: "Command" },
        { key: "params", label: "Params" },
        { key: "remote_address", label: "Remote Address" },
        { key: "exec_time", label: "Exec Time" },
      ],
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    getTacacsActivity() {
      this.$http
        .get("/api/v1/tacacs/acct/" + this.id)
        .then((response) => {
          this.tacacsLogs = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.getTacacsActivity();
  },
};
</script>

<style>
</style>