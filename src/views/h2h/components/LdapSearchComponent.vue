<template>
  <div>
    <div class="d-flex justify-content-between">
      <div style="width: 100%" class="form-group">
        <p-select
          :multiple="false"
          size="lg"
          v-model="tempObjectClassFilter"
          :options="objectClassObjects"
          placeholder="Select Object Class"
          tag-placeholder="Add this as new Object Class"
          track-by="key"
          label="value"
          :taggable="true"
          @tag="addObject"
          :close-on-select="false"
        />
      </div>
      <div style="width: 100%" class="input-group ml-2">
        <div class="input-group-prepend" style="width: 100%">
          <b-form-input
            class="form-control search-input"
            size="lg"
            placeholder="Search AD Credential Entry"
            type="text"
            v-model="tempFilter"
            @keydown.enter="searchFilter"
          ></b-form-input>
          <div class="input-group-append mb-3">
            <button
              @click="clearFilter"
              v-if="clearButton"
              class="btn btn-outline-info"
              type="button"
              v-b-tooltip.bottom
              title="Clear"
            >
              <em class="fa fa-trash"></em>
            </button>
            <button
              @click="searchFilter"
              class="btn btn-outline-info"
              type="button"
              v-b-tooltip.bottom
              title="Search"
            >
              <em class="fa fa-search"></em>
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div v-if="searchInfo">
      <p-initial
        header="AD Search"
        message="Please select an object class and input the AD Credential Entry"
      />
    </div>
    <div v-else-if="loading" class="my-5">
      <p-loading :message="loadingText" />
    </div>
    <div v-else-if="errorStatus">
      <p-error
        header="Search operation has error!"
        :errorResponse="errorResponse"
        @reload="searchFilter"
      />
    </div>
    <div v-else-if="items.length === 0">
      <p-empty
        header="Search Result 0"
        :message="`LDAP Server query is: objectClass=${objectClassFilter}&cn=${filter}`"
      />
    </div>
    <div v-else>
      <div class="mb-3">
        <span>Search result size: {{ items.length }}</span>
      </div>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item d-flex align-items-center"
          :key="index"
          v-for="(item, index) in items"
        >
          <b-row class="full-width">
            <b-col cols="12" md="7">
              <div class="d-flex align-items-center">
                <div class="d-flex justify-content-start align-items-center">
                  <b-form-checkbox
                    :id="'checkbox-' + index"
                    :name="'checkbox-' + index"
                    v-model="item.selected"
                  >
                  </b-form-checkbox>
                  <i
                    v-if="item.objectClass === groupClass"
                    class="fa fa-users fa-2x"
                    aria-hidden="true"
                  ></i>
                  <i
                    v-if="item.objectClass === personClass"
                    class="fa fa-user fa-2x"
                    aria-hidden="true"
                  ></i>
                  <i
                    v-if="item.objectClass === deviceClass"
                    class="fa fa-desktop fa-2x"
                    aria-hidden="true"
                  ></i>
                </div>
                <div style="margin-left: 15px">
                  <b-link>
                    <p class="mb-1">
                      <strong>{{ item.name }}</strong>
                      <b-badge variant="primary"
                        >{{ item.sessioncount }}
                      </b-badge>
                    </p>
                  </b-link>
                  <div class="d-flex align-items-center">
                    <small>{{ item.distinguishedName }}</small>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </li>
      </ul>
    </div>
    <b-row>
    <div class="ml-auto mr-3">
      <b-button
        variant="primary"
        @click="$emit('nextButton', items)"
        v-b-tooltip.bottom
        title="Save Selected Entries"
        class="h-100 w-100"
        :disabled="!checkSelectedEntry || savingEntries"
      >
        <em v-if="!savingEntries"> Next</em>
        <b-spinner v-else small />
      </b-button>
    </div>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "LdapSearchComponent",
  data() {
    return {
      items: [],
      loading: false,
      groupClass: "group",
      personClass: "person",
      deviceClass: "device",
      tempFilter: "",
      objectClassObjects: [
        { key: "group", value: "Group" },
        { key: "device", value: "Device" },
        { key: "person", value: "Person" },
      ],
      tempObjectClassFilter: "",
      filter: "",
      objectClassFilter: "",
      savingEntries: false,
      searchInfo: true,
      errorStatus: false,
      loadingText: "",
      errorResponse: "",
    };
  },
  computed: {
    checkSelectedEntry() {
      console.log("checked");
      let hasSelectedItem = false;
      this.items.forEach((item) => {
        if (item.selected) {
          hasSelectedItem = true;
          return;
        }
      });
      console.log(hasSelectedItem);
      return hasSelectedItem;
    },
    clearButton() {
      return this.tempObjectClassFilter !== "" || this.tempFilter !== "";
    },
  },
  watch: {
    tempFilter(value) {
      if (
        value.length === 3 &&
        this.tempObjectClassFilter !== null &&
        this.tempObjectClassFilter !== ""
      ) {
        this.searchFilter();
      }
    },
  },
  methods: {
    serviceNameAvatar(name) {
      let avatar = "";
      let text = name.split(/_/);
      text.forEach((f) => {
        avatar += f + " ";
      });
      return avatar;
    },
    addObject(newTag) {
      this.objectClassObjects.push({
        key: newTag.toLowerCase(),
        value: newTag,
      });
      this.tempObjectClassFilter = { key: newTag.toLowerCase(), value: newTag };
    },
    clearFilter() {
      this.filter = "";
      this.tempObjectClassFilter = "";
      this.tempFilter = "";
      this.objectClassFilter = "";
      this.items = [];
      this.searchInfo = true;
    },
    getLdapEntries() {
      this.loading = true;
      this.errorStatus = false;
      let data = new FormData();
      data.append("filter", this.filter);
      data.append("object_class", this.objectClassFilter);
      this.$http
        .post("/api/v1/ldap/entry", data)
        .then((response) => {
          this.items = response.data;
          this.loading = false;
          this.$emit("setLdapEntries", this.items);
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    searchFilter() {
      this.searchInfo = false;
      this.filter = this.tempFilter.toLowerCase();
      this.objectClassFilter = this.tempObjectClassFilter.key.toLowerCase();
      this.getLdapEntries();
    },
    saveSelectedEntries() {
      this.savingEntries = true;
      this.errorStatus = false;

      let selectedEntries = [];
      this.items.forEach((item) => {
        if (item.selected) {
          selectedEntries.push(item);
        }
      });

      this.$http
        .post("/api/v1/ldap/create", selectedEntries)
        .then(() => {
          this.$bvToast.toast(`Selected entries have been successfully saved`, {
            title: "LDAP Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.savingEntries = false;
        })
        .catch((error) => {
          console.log(error);
          this.savingEntries = false;
          this.errorStatus = true;
        });
    },
  },
  created() {
    setTimeout(() => {
      this.loadingText = "Loading...";
    }, 5000);
  },
};
</script>
