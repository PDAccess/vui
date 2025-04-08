<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <p-loading class="my-5" v-if="loading" message="Loading..." />
      <div v-else-if="groups.length === 0">
        <p-empty message="You don't have any Private Group." />
      </div>
      <div v-else>
        <p-card>
          <ul class="list-group list-group-flush">
            <li
              class="
                list-group-item
                d-flex
                justify-content-between
                align-items-center
              "
              :key="index"
              v-for="(item, index) in policies"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <avatar
                    :rounded="false"
                    :size="40"
                    :username="item.groupname"
                  ></avatar>
                </div>
                <div style="margin-left: 15px">
                  <b-link @click.stop="infoGroup(item)">
                    <p class="mb-1">
                      <strong>{{ item.groupname }}</strong>
                    </p>
                  </b-link>
                  <small>{{ item.description }}</small>
                </div>
              </div>
              <div>
                <p>
                  <strong>{{ item.createdAt | moment("calendar") }}</strong>
                </p>
              </div>
            </li>
          </ul>
        </p-card>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
  name: "GroupsPage",
  components: {
    Avatar,
  },
  data() {
    return {
      policies: [],
      user: {},
      loading: true,
    };
  },
  methods: {
    infoGroup(item) {
      this.$router.push({
        name: "Group Detail",
        params: {
          id: item.groupid,
        },
      });
    },
  },
};
</script>
