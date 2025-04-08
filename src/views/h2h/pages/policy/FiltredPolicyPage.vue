<template>
  <p-card v-if="errorStatus">
    <p-error
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
  </p-card>
  <div v-else class="animated fadeIn">
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text"><em class="fa fa-search"></em></span>
      </div>
      <input
        type="text"
        class="form-control"
        v-model="filterinput"
        placeholder="Search"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-info"
          type="button"
          @click="filterinput = ''"
        >
          Clear
        </button>
      </div>
    </div>
    <b-table
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :filter="filterinput"
      :per-page="perPage"
      :busy.sync="isBusy"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template slot="inventoryid" scope="row">
        {{ row.item.serviceEntity.name }}
      </template>
      <template slot="status" scope="row">
        <div v-if="filter == 'all'">
          <b-badge pill variant="primary">{{ row.item.status }}</b-badge>
        </div>
        <div v-else>
          <label class="switch switch-3d switch-primary">
            <input
              @input="changeStatus(row.item)"
              type="checkbox"
              class="switch-input"
              v-model="row.item.status"
              checked
            />
            <span class="switch-slider"></span>
          </label>
        </div>
      </template>
    </b-table>

    <b-modal
      v-model="modalShow"
      id="createpolicy"
      ref="createpolicy"
      size="lg"
      title="Add Policy"
    >
      <b-form-fieldset label="Service" :label-cols="3" :horizontal="true">
        <p-select
          v-model="selectedService"
          :options="services"
          track-by="inventory_id"
          placeholder="Select Services"
          :custom-label="customLabel"
          :multiple="false"
          :show-labels="false"
          :taggable="true"
          @tag="addTag"
          @input="multiselectEvent"
        >
          <template slot="singleLabel" slot-scope="props"
            ><span class="option__title">{{
              props.option.name
            }}</span></template
          >
          <template slot="option" slot-scope="props">
            <div class="option__desc">
              <span class="option__title">
                {{ props.option.name }}
                <span>
                  <b-badge
                    pill
                    :variant="badgeVariant(props.option.service_type_id)"
                    >{{ props.option.serviceTypeLogo }}</b-badge
                  >
                </span>
              </span>
            </div>
          </template>
        </p-select>
      </b-form-fieldset>

      <b-form-fieldset label="Regex" :label-cols="3" :horizontal="true">
        <b-form-input
          type="text"
          v-model="formdata.regex"
          placeholder="Enter regex"
        ></b-form-input>
      </b-form-fieldset>

      <b-form-fieldset label="Status" :label-cols="3" :horizontal="true">
        <label class="switch switch-3d switch-primary">
          <input
            type="checkbox"
            class="switch-input"
            v-model="formdata.status"
            checked
          />
          <span class="switch-slider"></span>
        </label>
      </b-form-fieldset>

      <div slot="modal-footer">
        <b-button
          type="button"
          class="float-right"
          size="sm"
          variant="primary"
          @click="savePolicy"
        >
          Save
        </b-button>
        <b-button
          size="sm"
          class="float-right buttonMR"
          variant="danger"
          @click="modalShow = false"
        >
          Close
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["id"],
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      filter: this.$route.params.filter,
      services: [],
      selectedService: "",
      isBusy: false,
      formdata: {
        regex: "",
        status: false,
        inventoryid: "",
        who_create: "",
      },
      options: [
        {
          value: false,
          text: "BLOCK",
        },
        {
          value: true,
          text: "ALLOW",
        },
      ],
      modalShow: false,
      currentPage: 1,
      perPage: 5,
      items: [],
      sortBy: null,
      sortDesc: false,
      filterinput: null,
      fields: {
        inventoryid: {
          label: "Service",
          sortable: true,
          class: "text-center",
        },
        regex: {
          label: "Regular Expression",
          sortable: true,
          class: "text-center",
        },
        status: {
          label: "Status",
          class: "text-center",
        },
      },
    };
  },
  methods: {
    changeStatus(item) {
      this.$http
        .post("/api/policystatus/" + item.id)
        .then((response) => {
          this.updateTable();
          this.resetForm();
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Change operation has error!";
        });
    },
    savePolicy() {
      this.formdata.who_create = localStorage.getItem("user-id");
      this.$http
        .put("/api/v1/policy", this.formdata)
        .then((response) => {
          this.updateTable();
          this.resetForm();
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
      this.modalShow = false;
    },
    resetForm() {
      this.formdata.regex = "";
      this.formdata.status = false;
      this.selectedService = "";
    },
    multiselectEvent() {
      this.formdata.inventoryid = this.selectedService.inventory_id;
    },
    customLabel({ name, serviceTypeLogo }) {
      return `${name} (${serviceTypeLogo})`;
    },
    badgeVariant(id) {
      let variant;
      switch (id) {
        case 1:
          variant = "primary";
          break;
        case 2:
          variant = "secondary";
          break;
        case 3:
          variant = "success";
          break;
        case 4:
          variant = "danger";
          break;
        case 5:
          variant = "warning";
          break;
        case 6:
          variant = "info";
          break;
        case 7:
          variant = "light";
          break;
        default:
          variant = "dark";
      }
      return variant;
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    updateTable() {
      let that = this;
      this.$http
        .get("/api/service", {})
        .then((response) => {
          this.services = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });

      this.$http
        .get("/api/v1/policy", {})
        .then((response) => {
          if (this.filter == "all") {
            this.items = response.data;
          } else if (this.filter == "active") {
            this.items = [];
            response.data.forEach((f) => {
              if (f.status == true) {
                that.items.push(f);
              }
            });
          } else {
            this.items = [];
            response.data.forEach((f) => {
              if (f.status == false) {
                that.items.push(f);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
    },
  },
  created() {
    this.updateTable();
  },
};
</script>
<style>
.buttonMR {
  margin-right: 5px;
}
</style>
