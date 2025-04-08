<template>
  <div class="animated fadeIn">
    <p-card v-if="group.ownMembership == 'ADMIN'">
      <div class="container-nav">
        <div class="create-nav d-flex justify-content-end">
          <b-form inline>
            <b-button
              @click="onClickPermissions"
              variant="success"
              class="mr-2"
              ><i class="fa fa-shield mr-2" aria-hidden="true"></i
              >Permissions</b-button
            >
            <b-button
              variant="success"
              :to="'/groups/credentials/createcredential/' + $route.params.id"
            >
              <span class="text-nowrap">
                <i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>New
                Credential
              </span>
            </b-button>
          </b-form>
          <hr class="split-nav" />
        </div>
      </div>
    </p-card>
    <router-view :permissionChanged="permissionChanged"></router-view>
  </div>
</template>
<script>
export default {
  props:['id'],
  data() {
    return {
      group: {},
      permissionChanged: false
    };
  },
  methods: {
    onClickPermissions() {
      this.permissionChanged = !this.permissionChanged
    },
    getGroupInfo() {
      this.$http
      .get(`/api/v1/group/info/${this.id}`)
      .then((response) => {
        this.group = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
  created() {
    this.getGroupInfo();
  }
}
</script>