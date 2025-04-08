<template>
  <div class="pb-5 helpBorder">
    <b-container class="mt-3">
      <div class="d-flex justify-content-end">
        <b-link v-if="language === 'En'" @click="setLanguage('Tr')" :active="language === 'Tr'"><b>TR</b></b-link>
        <b-link v-else @click="setLanguage('En')" :active="language === 'En'"><b>EN</b></b-link>
      </div>
      <component :is="componentsData"> </component>

      <div class="d-flex justify-content-end">
        <b-button v-show="componentsData != 'helpIndex' + language" class="mt-3 mr-4" variant="primary"
          href="helpIndex">Back</b-button>
      </div>
    </b-container>
  </div>
</template>

<script>
// import {
//   helpIndexEn,
//   serviceDetailEn,
//   groupDetailEn,
//   administrationDetailEn,
//   helpIndexTr,
//   serviceDetailTr,
//   groupDetailTr,
//   administrationDetailTr,
// } from "./markdown";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["title"],
  data() {
    return {
      markdown: "",
      componentsData: this.$route.params.title
        ? this.$route.params.title
        : helpIndexEn,
    };
  },
  methods: {
    ...mapActions({
      setLanguage: "util/setLang",
    }),
  },
  watch: {
    lang: function (val) {
      this.componentsData = this.$route.params.title + val;
    },
  },
  components: {
    // serviceDetailEn,
    // helpIndexEn,
    // groupDetailEn,
    // administrationDetailEn,
    // helpIndexTr,
    // serviceDetailTr,
    // groupDetailTr,
    // administrationDetailTr,
  },
  computed: {
    ...mapGetters({
      lang: "util/lang",
    }),
    language: {
      get() {
        return this.lang;
      },
      set(lang) { },
    },
  },
  created() {
    if (this.$route.params.title) {
      this.componentsData = this.$route.params.title + this.lang;
    }
  },
};
</script>

<style scoped>
.helpBorder {
  background: white;
  border-top: 1px solid #e5e5e5;
}
</style>