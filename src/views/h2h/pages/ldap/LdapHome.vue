<template>
  <div class="animated fadeIn" style="background: white; height: 100%">
    <p-card>
      <div class="d-flex justify-content-end container-nav">
        <div>
          <b-button
            variant="success"
            v-text="'New Imports'"
            to="/admin/imports/createImport"
          />
        </div>
      </div>
    </p-card>
    <p-card class="text-center">
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        header="Import Error!"
        message="Something went wrong!"
        :error-response="errorResponse"
      />
      <p-initial
        v-else-if="dummyData.length === 0"
        icon="folder-plus"
        header="You don't have any import."
        message="Please create a new credential import."
      />
      <ul v-else class="list-group list-group-flush">
        <li
          class="
            list-group-item
            d-flex
            justify-content-start
            align-items-center
          "
          :key="index"
          v-for="(data, index) in dummyData"
          style="width: 100%; text-align: start"
        >
          <div style="width: 25%">
            <em v-if="data.adType === 'group'" class="fa fa-users" />
            <em v-if="data.adType === 'person'" class="fa fa-user" />
            <em v-if="data.adType === 'device'" class="fa fa-tv" />
            <b-button variant="link">{{ data.adName }}</b-button>
          </div>
          <div style="width: 25%">
            <b-badge variant="primary" v-b-tooltip.bottom title="CN">{{
              data.adCN
            }}</b-badge>
          </div>
          <div style="width: 25%">
            <b-badge variant="primary" v-b-tooltip.bottom title="OU">{{
              data.adOU
            }}</b-badge>
          </div>
          <div style="width: 25%">
            <b-badge variant="success" v-b-tooltip.bottom title="DC">{{
              data.adDC
            }}</b-badge>
          </div>
          <b-dropdown
            id="dropdown-1"
            text="Action"
            variant="primary"
            class="user-actions"
          >
            <template slot="button-content">
              <i class="mr-1 fa fa-cogs" aria-hidden="true"></i>
            </template>
            <b-dropdown-item variant="primary"
              ><em class="mr-1 fa fa-play-circle"></em>Start
            </b-dropdown-item>
            <b-dropdown-item
              ><em class="mr-1 fa fa-stop-circle"></em>Stop
            </b-dropdown-item>
            <b-dropdown-item variant="danger" v-b-modal.modal
              ><em class="mr-1 fa fa-trash"></em>Delete
            </b-dropdown-item>
          </b-dropdown>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
export default {
  name: "LdapHome",
  data() {
    return {
      loading: false,
      errorStatus: false,
      errorResponse: null,
      dummyData: [
        {
          adType: "group",
          adName: "Enterprise Admins",
          adCN: "Enterprise Admins",
          adDC: "h2h com",
        },
        {
          adType: "device",
          adName: "asw4",
          adCN: "Enterprise",
          adDC: "h2h com",
        },
        {
          adType: "person",
          adName: "Buster Vahary",
          adCN: "Buster Vahary",
          adOU: "Product Testing",
          adDC: "h2h com",
        },
        {
          adType: "person",
          adName: "User One",
          adCN: "User One",
          adDC: "h2h com",
        },
        {
          adType: "group",
          adName: "Enterprise Admins",
          adCN: "Enterprise Admins",
          adDC: "h2h com",
        },
      ],
    };
  },
};
</script>

<style scoped>
</style>
