<template>
<div class="animated fadeIn">
  <p-card>
    <div class="d-flex justify-content-between container-nav">
      <div class="module-nav">
        <b-button type="button" class="btn btn-ghost-primary" :to="'/admin/users/list'" @click.stop="navclick">Users</b-button>
        &nbsp;
        <b-button type="button" class="btn btn-ghost-primary" :to="'/admin/users/blockedusers'" @click.stop="navclick">Blocked <span class="d-sm-down-none">Users</span></b-button>
        &nbsp;
        <b-button type="button" class="btn btn-ghost-primary" :to="'/admin/users/deletedusers'" @click.stop="navclick">Deleted <span class="d-sm-down-none">Users</span></b-button>
        <!--
          &nbsp;
        <b-button type="button" class="btn btn-ghost-primary" :to="'/admin/users/forgetpassword'" @click.stop="navclick">Forget <span class="d-sm-down-none">Password</span></b-button>
        -->
      </div>
      <div class="create-nav">
        <b-form-select @input="sortChange" style="margin-right: 10px; width: 190px" v-model="selected">
            <optgroup label="Sort By">
              <option value="name"><strong>Name</strong></option>
            </optgroup>
          </b-form-select>
          <b-button variant="success" to="/admin/users/createuser" class="mr-3">Create User</b-button>
          <hr class="split-nav">
      </div>
    </div>
  </p-card>
  <p-card>
    <router-view :key="$route.fullPath"></router-view>
  </p-card>
</div>
</template>
<script>
export default {
  name: 'ActivitiesPage',
  props: ['id'],
  data() {
    return {
      selected: 'name'
    }
  },
  methods: {
    navclick(){
      this.selected = "name";
    },
    sortChange() {
      let page = this.$route.fullPath;
      this.$router.push({
        path: page,
        query: {
          sort: this.selected
        }
      })
    }

  }
}
</script>
<style>
.item-table{
    padding: 10px !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
</style>
