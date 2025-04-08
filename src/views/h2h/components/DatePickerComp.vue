<template>
    <DatePicker :mode="mode" v-model="selectedDate" :is-range="isRange">
      <template class="input-group mb-3" v-slot="{ inputValue, inputEvents }">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <em class="fa fa-calendar"></em>
          </span>
          <input
            style="height: 2.5rem"
            type="text"
            :value="isRange ? inputValue.start == null ? '' : inputValue.start + ' - ' + inputValue.end : inputValue"
            v-on="isRange ? inputEvents.start : inputEvents"
            class="form-control"
            :placeholder="placeHolder"
            :disabled="disabled"
          />
          <div v-if="clearBtn && selectedDate !== null" class="input-group-append">
            <button
              @click="clearDate"
              class="btn btn-outline-info"
              type="button"
              v-b-tooltip.top
              title="Clear"
              :disabled="disabled"
            >
              <em class="fa fa-trash"></em>
            </button>
          </div>
        </div>
      </template>
    </DatePicker>
</template>



<script>

import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  components:{
    DatePicker,
  },
  props: [
    "mode",
    "placeHolder",
    "clearBtn" ,
    "isRange" ,
    "selectDate",
    "disabled"],
  data() {
    return {
      selectedDate: null,
    }
  },
  watch: {
    selectDate(val){
      this.selectedDate = val;
    },
    selectedDate(val){
      this.sendToParent(val);
    }
  },
  mounted() {
    this.selectedDate = this.selectDate;
  },
  methods: {
    clearDate() {
      this.selectedDate = null;
    },
    sendToParent(selected) {
      this.$emit("val", selected);
    },
  },
};
</script>
