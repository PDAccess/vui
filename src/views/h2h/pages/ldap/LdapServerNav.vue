<template>
<div class="animated fadeIn">
  <p-card>
    <div class="d-flex justify-content-between">
      <div>
        <b-button type="button" class="btn btn-ghost-primary" :to="'/ldap/servers/' + this.id + '/list/server/?sort=name'" @click.stop="navclick">Servers</b-button>
        &nbsp;
        <b-button type="button" class="btn btn-ghost-primary" :to="'/ldap/servers/' + this.id + '/list/role?sort=name'" @click.stop="navclick">Roles</b-button>
        &nbsp;
        <b-button type="button" class="btn btn-ghost-primary" :to="'/ldap/servers/' + this.id + '/list/user?sort=name'" @click.stop="navclick">Users</b-button>
        &nbsp;
        <b-button type="button" class="btn btn-ghost-primary" :to="'/ldap/servers/' + this.id + '/list/log/185.69.145.99?sort=name'" @click.stop="navclick">Logs</b-button>      </div>
      <div>
        <b-form-select @input="sortChange" style="margin-right: 10px; width: 190px" v-model="selected">
            <optgroup label="Sort By">
              <option value="name"><strong>Name</strong></option>
            </optgroup>
          </b-form-select>
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
