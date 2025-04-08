<template>
  <div>
    <b-row>
      <b-col>
        <p-card class="tenant-body">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <em class="fa fa-search"></em>
              </span>
            </div>
            <b-form-input
              class="form-control search-input"
              size="sm"
              placeholder="Entry Realm info"
              type="text"
              v-model="filterInput"
            ></b-form-input>
            <div class="input-group-append">
              <b-button
                @click="filterInput = ''"
                variant="outline-primary"
                type="button"
                >Clear</b-button
              >
            </div>
            <div class="d-flex justify-content-end ml-4">
              <b-button variant="success" to="/admin/realms/create-realm"
                >Create Realm</b-button
              >
            </div>
          </div>

          <p-modal @confirm="deleteRealm()" :message="modalMessage"></p-modal>
          <p-error
            v-if="errorStatusList"
            header="List operation has error!"
            :errorResponse="errorResponse"
            @reload="$router.go()"
          />
          <p-error
            v-else-if="errorStatusDelete"
            header="Delete operation has error!"
            :errorResponse="errorResponse"
            @reload="deleteRealm"
          />
          <p-loading v-else-if="loading" class="my-5" message="Loading..." />
          <div v-else-if="items.length === 0" style="margin: auto">
            <p-initial
              icon="folder-plus"
              header="You don't have any tenant."
              message="Please create a tenant."
            />
          </div>
          <b-table
            v-else
            :current-page="currentPage"
            :fields="fields"
            :filter="filterInput"
            :filter-function="filter"
            :items="items"
            :per-page="perPage"
            :responsive="responsive"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            @filtered="onFiltered"
            hover
            show-empty
            small
            fixed
          >
            <template v-slot:cell(realm)="row">
              <b-button disabled variant="link">
                <avatar
                  :rounded="false"
                  :size="30"
                  :username="row.item.name"
                  color="#fff"
                ></avatar>
              </b-button>
              {{ row.item.name }}
            </template>
            <template v-slot:cell(description)="row">
              <span class="text-primary">{{ row.item.descriptionText }}</span>
            </template>
            <template v-slot:cell(createdAt)="row">
              {{ row.item.createdAt | moment('calendar') }}
            </template>
            <template v-slot:cell(whoCreate)="row">
              <p-user :id="row.item.whoCreate" />
            </template>
            <template v-slot:cell(actions)="row">
              <b-dropdown
                id="dropdown-1"
                text="Action"
                variant="primary"
                class="user-actions"
              >
                <template slot="button-content">
                  <i class="mr-1 fa fa-cogs" aria-hidden="true"></i>
                </template>
                <b-dropdown-item
                  @click.stop="details(row.item)"
                  variant="primary"
                  ><em class="mr-1 fa fa-pencil"></em>Edit
                </b-dropdown-item>
                <b-dropdown-item
                  @click.stop="deleteButton(row.item)"
                  variant="danger"
                  v-b-modal.modal
                  ><em class="mr-1 fa fa-trash"></em>Delete
                </b-dropdown-item>
              </b-dropdown>
            </template>
          </b-table>
          <b-row
            v-if="items.length > perPage"
            class="d-flex justify-content-center mt-4"
          >
            <b-col sm="6" class="d-flex justify-content-center">
              <b-pagination
                :per-page="perPage"
                :total-rows="items.length"
                v-model="currentPage"
              />
            </b-col>
          </b-row>
        </p-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
//internet explorer için polyfill gerekli yoksa hata veriyor
import "babel-polyfill";

import Avatar from "vue-avatar";

import { RealmApi } from '@/generated/authws';

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      loading: true,
      errorStatusDelete: false,
      errorStatusList: false,
      errorResponse: "",
      items: [],
      fields: [
        { key: "realm", sortable: true, label: "Realm" },
        { key: "description", sortable: true, label: "Description" },
        { key: "createdAt", sortable: true, label: "Created At" },
        { key: "whoCreate", sortable: true, label: "Who Create" },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 0,
      filterInput: null,
      currentPage: 1,
      perPage: 10,
      sortBy: null,
      sortDesc: false,
      lname: "",
      Id: "",
      modalid: "",
      modalname: "",
      modalMessage: "",
      limit: 5,
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  watch: {
    totalRows: function () {
      return this.items.length;
    },
  },
  methods: {
    showMore() {
      this.limit += 5;
    },
    filter(data) {
      if (this.filterInput == null) {
        return false;
      } else {
        // TODO : convert lower or upper case this strings
        if (
          data.companyName
            .toLowerCase()
            .includes(this.filterInput.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    },
    details(item) {
      this.$router.push({ name: "Edit Realm", params: { id: item.id } });
    },
    deleteButton(item) {
      this.modalid = item.id;
      this.modalname = item.name;
      this.modalMessage =
        "Are you sure you want to delete the realm with the name " +
        this.modalname +
        " ?";
    },
    deleteRealm() {
      new RealmApi(this.$authHttpConfig, undefined, this.$http).deleteRealm(this.modalid)
        .then((response) => {
          for (let i = 0 ; i < this.items.length ; i++) {
            if (this.items[i].id == this.modalid) {
              this.items.splice(i, 1)
              break;
            }
          }
          this.$bvToast.toast(`Realm is Deleted!`, {
            title: "Realm Status",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusDelete = true;
          this.errorResponse = error;
        });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },

  created() {
    new RealmApi(this.$authHttpConfig, undefined, this.$http).listRealms()
      .then((response) => {
        this.items = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatusList = true;
        this.errorResponse = error;
      });
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.tenant-body .card-body {
  padding: 0 !important;
}
</style>
