<template>
  <div class="wrapper">
    <p-card>
      <div v-if="errorStatus">
        <p-error
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <div v-else>
        <b-row class="my-1" align-h="between">
          <b-col sm="3">
            <div class="text">
              <p>
                Messages are displayed for every user and can be used to notify
                users about scheduled maintenance, recent upgrades and more.
              </p>
            </div>
          </b-col>
          <b-col sm="9">
            <b-alert show :style="getStyle()" class="message-preview mb-4"
              ><em
                class="fa fa-bullhorn"
                style="width: inherit; padding: 0px 5px"
              ></em
              ><span v-if="data.message">{{ data.message }}</span
              ><span v-else>Your message</span>
            </b-alert>
            <p-modal
              @confirm="deleteMessage()"
              :message="modalMessage"
            ></p-modal>
          </b-col>
        </b-row>
        <b-row class="my-1" align-h="between">
          <b-col md="3"></b-col>
          <b-col md="5">
            <b-form-fieldset
              label="Message"
              description=""
              label-text-align="right"
              :horizontal="true"
            >
              <b-form-textarea
                id="messagearea"
                v-model="data.message"
                placeholder=""
                :rows="10"
                no-resize
              >
              </b-form-textarea>
            </b-form-fieldset>
          </b-col>
          <b-col md="4">
            <b-row>
              <b-col cols="12">
                <p>Date</p>

                <p-date-picker
                  @val="dateRangeData = $event"
                  :isRange="true"
                  :clearBtn="true"
                  mode="dateTime"
                  placeHolder="Date Range"
                  :select-date="dateRangeData"
                />
                <br />
                <br />
                <br />
              </b-col>
              <b-col cols="6" class="mb-3">
                <b-form-fieldset
                  label="Background Color"
                  description=""
                  label-text-align="right"
                  :horizontal="true"
                >
                  <b-form-input
                    type="color"
                    v-model="data.backgroundColor"
                  ></b-form-input>
                </b-form-fieldset>
              </b-col>
              <b-col cols="6" class="mb-3">
                <b-form-fieldset
                  label="Font Color"
                  description=""
                  label-text-align="right"
                  :horizontal="true"
                >
                  <b-form-input
                    type="color"
                    v-model="data.fontColor"
                  ></b-form-input>
                </b-form-fieldset>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-form-group
                  id="fontSizeForm"
                  horizontal
                  label="Font Size"
                  label-for="fontSize"
                  label-text-align="left"
                  description="Input the Font Size"
                >
                  <b-form-input
                    type="number"
                    id="fontSize"
                    aria-describedby="fontSize-input-help fontSize-input-feedback"
                    min="10"
                    max="20"
                    :state="state()"
                    v-model="data.fontsize"
                  ></b-form-input>
                  <b-form-invalid-feedback id="fontSize-input-feedback">
                    Please enter numbers greater than 9 and less than 21
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="d-flex justify-content-end">
            <b-button
              variant="success"
              :disabled="isDisabled"
              @click="addMessage"
              >Add Message</b-button
            >
            <b-button variant="warning" @click="reset" class="ml-2"
              >Reset</b-button
            >
          </b-col>
        </b-row>
        <hr />
        <p-loading v-if="loading" class="my-5" message="Loading..." />
        <p-initial
          v-else-if="items.length === 0"
          icon="file-plus"
          header="Not found any message."
          message="Please create a new message"
        />
        <b-table
          v-else
          small
          :items="items"
          :fields="fields"
          responsive
          show-empty
        >
          <template v-slot:cell(delete_button)="row">
            <b-button
              size="sm"
              variant="danger"
              title="Remove"
              @click.stop="deleteButton(row.item, row.index, $event.target)"
              v-b-modal.modal
              class="btn"
            >
              <em class="fa fa-trash-o"></em>
            </b-button>
          </template>
        </b-table>
      </div>
    </p-card>
  </div>
</template>



<script>
export default {
  components: {},
  data() {
    const hSpacing = "20px";
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: true,
      customizeColor: true,
      list_message: "d",
      dateRangeData: null,
      dataObject: {},
      data: {
        dateRange: null,
        message: "",
        backgroundColor: "#D1ECF1",
        fontColor: "#336573",
        startAtVal: 0,
        endAtVal: 0,
        messageId: "f",
        messageIndex: 0,
        fontsize: 10,
      },
      themeStyles: {
        wrapper: {
          background: "",
          color: "#fafafa",
          border: "0",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)",
          borderRadius: "5px",
        },
        header: {
          padding: `20px ${hSpacing}`,
        },
        headerHorizontalDivider: {
          borderTop: "solid rgba(255, 255, 255, 0.2) 1px",
          width: "80%",
        },
        weekdays: {
          color: "#000000", // New color
          fontWeight: "100", // And bolder font weight
          padding: `20px ${hSpacing} 5px ${hSpacing}`,
          fontSize: "0.8rem",
        },
        weeks: {
          padding: `0 ${hSpacing} ${hSpacing} ${hSpacing}`,
        },
        dayContent: {
          fontSize: "0.8rem",
        },
      },
      style: {
        backgroundColor: "",
        color: "",
        fontSize: 10,
      },
      fields: [
        {
          key: "message",
          label: "Message",
        },
        {
          key: "startDate",
          label: "Start Date",
        },
        {
          key: "endDate",
          label: "End Date",
        },
        {
          key: "delete_button",
          label: "Delete",
        },
      ],
      items: [],
      modalMessage: "",
    };
  },
  methods: {
    state() {
      return !(this.data.fontsize < 10 || this.data.fontsize > 20);
    },
    reset() {
      this.dateRangeData = null;
      this.data.message = "";
      this.data.backgroundColor = "#D1ECF1";
      this.data.fontColor = "#336573";
      this.data.startAtVal = 0;
      this.data.endAtVal = 0;
      this.data.fontsize = 10;
    },
    getStyle() {
      this.style.backgroundColor = this.data.backgroundColor;
      this.style.color = this.data.fontColor;
      this.style.fontSize = this.data.fontsize + "px";
      return this.style;
    },
    addMessage() {
      this.$http
        .post("/api/v1/broadcast", this.data)
        .then(() => {
          this.reset();
          this.$bvToast.toast(`Added Broadcast Messages`, {
            title: "Broadcast Messages Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$http
            .get("/api/v1/broadcast/list")
            .then((response2) => {
              this.items = response2.data;
              this.dateShow();
            })
            .catch((error) => {
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Add message operation has error!";
            });
        })
        .catch((error) => {
          this.$bvToast.toast(error.data, {
            title: "Broadcast Messages Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Add message operation has error!";
        });
    },
    deleteButton(item, index, event) {
      this.list_message = item.message;
      this.message_id = item.messageid;
      this.message_index = index;
      this.modalMessage =
        "Are you sure you want to delete the message with the name " +
        this.list_message +
        " ?";
    },
    deleteMessage() {
      this.$http
        .delete("/api/v1/broadcast" + this.message_id)
        .then((response) => {
          if (response.status == 200) {
            this.$bvToast.toast(`Deleted Broadcast Messages`, {
              title: "Broadcast Messages Notification",
              variant: "success",
              autoHideDelay: 5000,
            });
            this.items.splice(this.message_index, 1);
          }
        })
        .catch((error) => {
          this.$bvToast.toast(`Someting went wrong!`, {
            title: "Broadcast Messages Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete message operation has error!";
        });
    },
    clearDate() {
      this.dateRange = "";
      this.dateRangeData = null;
    },
    manageDate(value) {
      localStorage.setItem("dateRangeData", JSON.stringify(value));
      this.data.startAtVal = 1;
      this.data.endAtVal = 1;
    },
    dateShow() {
      this.items.forEach((element) => {
        element.startDate = this.$moment(element.startDate).calendar();
        element.endDate = this.$moment(element.endDate).calendar();
      });
    },
  },
  computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: "is-danger",
          message: "Date required.",
        };
      }
      return {
        type: "is-primary",
        message: "",
      };
    },
    isDisabled() {
      return !(
        this.data.startAtVal == 1 &&
        this.data.endAtVal == 1 &&
        this.data.message != ""
      );
    },
  },
  watch: {
    dateRangeData: function (value) {
      this.data.dateRange = value;
      this.manageDate(value);
    },
  },
  created() {
    this.dateRangeData = JSON.parse(localStorage.getItem("dateRangeData"));
    this.$http
      .get("/api/v1/broadcast/list")
      .then((response) => {
        this.items = response.data;
        this.dateShow();
        this.loading = false;
      })
      .catch((error) => {
        console.log("error ", error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Message list operation has error!";
      });

    this.dataObject = {
      dateRange: this.dateRangeData,
    };
  },
};
</script>
<style>
.message-preview {
  text-align: center;
}

.fa-calendar {
  scale: 2;
}
</style>
