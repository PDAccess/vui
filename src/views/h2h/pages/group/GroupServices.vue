<template>
  <div class="animated fadeIn">
    <p-card>
      <p-error
        v-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <b-row v-else class="my-1">
        <b-col sm="4">
          <h3>Group's Services</h3>
          <p>
            You can manage group's services, use multiselect for add/remove
            service
          </p>
        </b-col>
        <b-col sm="8">
          <div class="form-group">
            <label center for="name">Services</label>
            <p-select
              :disabled="locked"
              @input="serviceUpdate"
              v-model="selectedServices"
              :options="services"
              track-by="inventory_id"
              placeholder="Select Services"
              :multiple="true"
              :taggable="true"
              @tag="addTag"
              :custom-label="customLabel"
              :show-labels="false"
            >
              <template slot="singleLabel" slot-scope="props">
                <span class="option__title">
                  {{ props.option.name }}
                </span>
              </template>
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
          </div>
        </b-col>
      </b-row>
    </p-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  data() {
    return {
      selectedServices: [],
      services: [],
      locked: true,
      user: {},
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    serviceUpdate() {
      let datas = [];

      for (let i = 0; i < this.selectedServices.length; i++) {
        datas.push(this.selectedServices[i].inventory_id);
      }

      this.$http
        .put("/api/v1/group/service/" + this.id, datas)
        .then(() => {
          this.$bvToast.toast(`Group service is updated!`, {
            title: "Group Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
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
    customLabel({ name, serviceTypeLogo }) {
      return `${name} (${serviceTypeLogo})`;
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
  },
  created() {
    if (this.user.role === "Admin") {
      this.locked = false;
    } else {
      this.locked = true;
    }
    this.$http
      .get("/api/v1/service/all", {})
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
      .get("/api/v1/group/service/" + this.id)
      .then((response) => {
        this.selectedServices = response.data;
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
