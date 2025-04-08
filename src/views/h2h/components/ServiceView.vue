<template>
  <div class="d-flex flex-row justify-content-start align-items-center">
    <p-avatar-loading v-if="imageLoading" />
    <b-button
      v-else-if="existService"
      class="avatar-link-btn"
      variant="link"
      @click.stop="infoService"
    >
      <img v-if="imageUrl" alt="" :style="imageStyle" :src="imageUrl" />
      <avatar
        v-else
        :rounded="false"
        :size="size"
        :username="username"
        color="#fff"
      ></avatar>
      <div v-if="isBlockedOrDeleted" class="profile-status-wrapper">
        <em
          v-if="isDeleted"
          class="fa fa-trash"
          title="Deleted User"
          v-b-tooltip.bottom
        />
        <em v-else class="fa fa-ban" title="Blocked User" v-b-tooltip.bottom />
      </div>
      <div class="ml-2" v-if="usernameShow">{{ username }}</div>
    </b-button>
    <template v-else>
      <avatar :rounded="false" username="" :size="size" color="#fff"></avatar>
      <div class="ml-2 text-danger">No Service</div>
    </template>
  </div>
</template>
<script>
import Avatar from "vue-avatar";
import { mapGetters } from "vuex";

export default {
  name: "UserView",
  data() {
    return {
      imageUrl: null,
      baseSrc: null,
      imageLoading: true,
      username: "",
      isDeleted: false,
      existService: false,
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 32,
    },
    imageWidth: String,
    imageHeight: String,
    usernameShow: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Avatar,
  },
  // watch: {
  //   username: function () {
  //     if (!this.baseSrc) {
  //       this.imageLoading = true;

  //       this.$http
  //         .get(
  //           `/api/v1/user/id/${this.id}?c=${this.cacheNumber}`
  //         )
  //         .then((response) => {
  //           this.username = response.username;
  //         this.isBlockedOrDeleted = response.blocked;
  //         this.imageUrl = null;
  //         this.imageLoading = false;

  //         })
  //         .catch((error) => {
  //           console.log(error);
  //           this.imageLoading = false;
  //         });
  //     }
  //   },
  // },
  computed: {
    ...mapGetters({
      cacheNumber: "util/cacheNumber",
    }),
    imageStyle() {
      return {
        width: this.imageWidth,
        height: this.imageHeight,
      };
    },
    imageLoadingStyle() {
      return {
        height: this.size / 2 + "px",
        width: this.size / 2 + "px",
      };
    },
    isBlockedOrDeleted() {
      return this.isBlocked || this.isDeleted;
    },
  },
  methods: {
    infoService() {
      this.$router.push({
        name: "Service Detail",
        params: {
          id: this.id,
        },
      });
    },
  },
  created() {
    console.log("id: ", this.id);
    if (this.id) {
      this.$http
        .get(`/api/v1/service/id/${this.id}?c=${this.cacheNumber}`)
        .then((response) => {
          if (response.status == 200) {
            this.existService = true;
            this.username = response.data.name;
            this.isDeleted = response.data.deletedAt != null;
            this.imageUrl = null;
          } else {
            this.existService = false;
          }
          this.imageLoading = false;
        })
        .catch((error) => {
          console.log("---> err ", error);
        });
    } else {
      this.imageLoading = false;
    }
  },
};
</script>

<style scoped>
.profile-status-wrapper {
  position: relative;
  bottom: -12px;
  left: -8px;
  color: red;
  background-color: #e7e3e3;
  padding: 4px;
  border-radius: 50%;
}

</style>
