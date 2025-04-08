<template>
  <div class="animated fadeIn">
    <p-card>
      <b-nav class="mb-2 mt-1" justified pills>
        <b-nav-item :active="active == 1" class="font-weight-bold"
          >Application Definition</b-nav-item
        >
        <b-nav-item :active="active == 2" class="font-weight-bold"
          >Save Application</b-nav-item
        >
      </b-nav>
      <ul v-if="active == 1" class="list-group list-group-flush">
        <li class="list-group-item">
          <b-form-radio-group
            class="mt-4"
            id="radio-group-1"
            v-model="$v.formdata.app.$model"
            name
          >
            <b-row style="margin-left: 60px">
              <b-col :key="app.value" v-for="app in options">
                <img :src="app.icon" alt="appIcon" height="80" width="80" />
                <br /><br />
                <b-form-radio name="radio-size" size="sm" :value="app.value">{{
                  app.label
                }}</b-form-radio>
              </b-col>
            </b-row>
          </b-form-radio-group>
          <b-row class="my-4">
            <b-col cols="4"></b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button variant="primary" class="mr-2 mt-2" @click="active = 2"
                >Next
                <i class="fa fa-chevron-right fa-sm" aria-hidden="true"></i
              ></b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
      <ul v-else-if="active == 2" class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1 mt-3">
            <b-col sm="4">
              <h3>Create a Service App</h3>
              <p>
                Specify Custom app configurations for RDP and Windows machines.
              </p>
            </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group description="Add the app name" horizontal>
                    <label for="inputLive">App Name</label>
                    <b-form-input
                      :state="
                        !$v.formdata.name.$dirty
                          ? null
                          : !$v.formdata.name.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formdata.name.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.name.required">
                        App Name is required.
                      </div>
                      <div v-if="!$v.formdata.name.minLength">
                        App Name must have at least
                        {{
                          $v.formdata.name.$params.minLength.min -
                          formdata.name.length
                        }}
                        more letters.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group description="Add the app" horizontal>
                    <label for="inputLive">App</label>
                    <b-form-input
                      :state="
                        !$v.formdata.app.$dirty
                          ? null
                          : !$v.formdata.app.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formdata.app.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.app.required">
                        App is required.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group
                description="Add working directory for the app"
                horizontal
              >
                <label for="inputLive">App Directory</label>
                <b-form-input
                  placeholder
                  type="text"
                  v-model.trim="formdata.directory"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group
                description="Add arguments to be added for the app"
                horizontal
              >
                <label for="inputLive">App Args</label>
                <b-form-input
                  placeholder
                  type="text"
                  v-model.trim="formdata.args"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4">
              <b-button variant="danger" @click="active = 1">
                <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
              </b-button>
            </b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid"
                variant="success"
                class="mr-2"
                @click="createApp"
                >Create Application</b-button
              >
              <b-button variant="primary" @click="clearForm">Clear</b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
//internet explorer için polyfill gerekli yoksa hata veriyor
import "babel-polyfill";

import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  props: ["id"],
  components: {},
  data() {
    return {
      formdata: {
        name: "",
        app: "",
        directory: "",
        args: "",
      },
      active: 1,
      options: [
        {
          label: "Powershell",
          value: "powershell",
          icon: "@/assets/img/powershell.png",
        },
        {
          label: "Notepad",
          value: "notepad",
          icon: "@/assets/img/notepad.png",
        },
        {
          label: "Internet Explorer",
          value: "iexplore",
          icon: "@/assets/img/iexplorer.jpg",
        },
        {
          label: "Calculator",
          value: "calc",
          icon: "@/assets/img/calc.jpg",
        },
      ],
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      name: {
        required,
        minLength: minLength(3),
      },
      app: {
        required,
      },
    },
  },
  methods: {
    clearForm() {
      this.formdata.args = "";
      this.formdata.name = "";
      this.formdata.directory = "";
      this.formdata.app = "";
    },
    createApp() {
      let data = new FormData();
      data.append("name", this.formdata.name);
      data.append("app", "||" + this.formdata.app);
      data.append("directory", this.formdata.directory);
      data.append("args", this.formdata.args);

      this.$http
        .post(`/api/service-app/${this.id}`, data)
        .then((response) => {
          this.$router.push({ path: `/service/detail/${response.data}` });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {},
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
</style>
