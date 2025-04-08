<template>
      <b-form-fieldset
        :description="description"
        horizontal
        id="os-type"
        :label="label"
        label-for="os"
        label-text-align="left"
      >
        <b-form-radio-group :id="radioGroup" v-model="selectedValue" name>
          <b-row>
            <b-col
              @click="sendToParent(item.value)"
              lg="3"
              md="4"
              sm="6"
              :key="index"
              v-for="(item, index) in values"
            >
              <br />
              <div :class="item.classdata"></div>
              <br />
              <b-form-radio name="radio-size" size="sm" :value="item.value">{{
                item.name
              }}</b-form-radio>
            </b-col>
          </b-row>
        </b-form-radio-group>
      </b-form-fieldset>
</template>

<script>
export default {
  props: {
    description: String,
    label: String,
    values: Array,
    radioGroup: String,
    selectedValue: String,
  },
  methods: {
    sendToParent(val) {
      this.$emit("val", val.toString());
    },
  },
};
</script>

<style scoped>
.inventory-logo {
  width: 50px;
  height: 40px;
}
</style>
