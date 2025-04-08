<template>
  <p-card v-if="errorStatus">
    <p-error
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
  </p-card>
  <div v-else class="animated fadeIn">
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
          ><span class="option__title">{{ props.option.name }}</span></template
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

    <b-button variant="success" @click="savePolicy()">Save policy</b-button>
    <b-button style="margin-left: 10px" variant="danger" to="/policy/all-filter"
      >Cancel</b-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      allCount: 0,
      activeCount: 0,
      passiveCount: 0,
      services: [],
      selectedService: "",
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
      items: [],
      filter: null,
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
          this.errorHeader = "Create operation has error!";
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
      this.$http
        .get("/api/v1/policy", {})
        .then((response) => {
          this.allCount = 0;
          this.activeCount = 0;
          this.passiveCount = 0;

          response.data.forEach((f) => {
            this.allCount++;
            if (f.status == true) {
              this.activeCount++;
            }
            if (f.status == false) {
              this.passiveCount++;
            }
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.$http
      .get("/api/service", {})
      .then((response) => {
        this.services = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/policy", {})
      .then((response) => {
        this.items = response.data;
        response.data.forEach((f) => {
          this.allCount++;
          if (f.status == true) {
            this.activeCount++;
          }
          if (f.status == false) {
            this.passiveCount++;
          }
        });
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>
<style>
.navbar {
  padding: 0.5rem 0rem;
}
.buttonMR {
  margin-right: 5px;
}
</style>
