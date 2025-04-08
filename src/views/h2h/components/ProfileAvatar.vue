<template>
  <div class="d-flex flex-row justify-content-start align-items-center">
    <div v-if="imageLoading" class="loadingImage">
      <p-loading :gif-height="size / 2" />
    </div>
    <img
      v-else-if="baseSrc || imageUrl"
      alt=""
      :style="imageStyle"
      :src="baseSrc || imageUrl"
    />
    <avatar
      v-else
      :rounded="false"
      :size="size"
      :username="username"
      color="#fff"
    ></avatar>
    <div v-if="isBlockedOrDeleted" class="profile-status-wrapper">
     <em v-if="isDeleted" class="fa fa-trash" title="Deleted User" v-b-tooltip.bottom />
     <em v-else class="fa fa-ban" title="Blocked User" v-b-tooltip.bottom />
    </div>
    <div class="ml-2" v-if="usernameShow">{{ profileUsername }}</div>
  </div>
</template>
<script>
import Avatar from "vue-avatar";
import { mapGetters } from "vuex";

import { UserApi } from '@/generated/authws';

export default {
  name: "ProfileAvatar",
  data() {
    return {
      imageUrl: "",
      imageLoading: false,
    };
  },
  props: {
    id: String,
    username: String,
    size: Number,
    imageWidth: String,
    imageHeight: String,
    baseSrc: String,
    profileUsername: String,
    usernameShow: {
      type: Boolean,
      default: true,
      required: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
      required: false
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  components: {
    Avatar,
  },
  watch: {
    profileUsername: function () {
      if (this.baseSrc == null) {
        this.imageLoading = true;

        this.$http
          .get(
            `/api/v1/user/image/${this.profileUsername}?c=${this.cacheNumber}`
          )
          .then((response) => {
            this.imageUrl = response.data;
            this.imageLoading = false;
          })
          .catch((error) => {
            console.log(error);
            this.imageLoading = false;
          });
      }
    },
  },
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
      return this.isBlocked || this.isDeleted
    }
  },
  created() {
    if (this.baseSrc == null && this.id) {
      this.imageLoading = true;

      new UserApi(this.$authHttpConfig, undefined, this.$http).getAvatarById(this.id)
        .then((response) => {
          this.imageUrl = response.data;
          this.imageLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.imageLoading = false;
        });
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