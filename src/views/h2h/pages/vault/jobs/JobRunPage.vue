<template>
  <div class="mb-3">
    <h2>Run Job</h2>
    <p-card>
      <h6>Run for</h6>
      <p-select
        :options="options"
        placeholder="Select Service"
        track-by="key"
        label="value"
        v-model="selected"
      />
      <div
        class="my-3 d-flex justify-content-start align-items-center"
        :key="index"
        v-for="(variable, index) in selectedVariables"
      >
        <div>
          <label>{{
              "Variable " + [index + 1]
            }}</label>
        </div>
        <div class="ml-4">
          <b-input-group>
            <b-form-select
              placeholder="Select Type"
              :options="options2"
              v-model="selectedVariables[index].command"
            />
            <b-form-input
              placeholder="Enter variable"
              type="text"
              v-model="selectedVariables[index].variable"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="ml-4">
          <button
            @click="deleteField(index)"
            class="btn btn-pill btn-danger btn-sm"
            type="button"
          >
            <em class="fa fa-minus"></em>
          </button>
        </div>
      </div>
      <div class="mt-3">
        <button
          @click="addVariable"
          class="btn btn-outline-success btn-bg"
          type="button"
        >
          Add Variable
        </button>
      </div>
    </p-card>
    <p-card class="d-flex flex-row justify-content-between">
      <b-button variant="success">Run Job</b-button>
      <b-button variant="light" @click="$router.push({name: 'Jobs'})">Cancel</b-button>
    </p-card>
  </div>
</template>

<script>
export default {
  name: "JobRunPage",
  data() {
    return {
      options: [
        { key: 1, value: "master" },
        { key: 2, value: "prod" },
        { key: 3, value: "test" },
        { key: 4, value: "dev" },
      ],
      selected: null,
      variables: [],
      options2: [
        {
          value: "SELECT",
          text: "SELECT",
        },
        {
          value: "INSERT",
          text: "INSERT",
        },
        {
          value: "DELETE",
          text: "DELETE",
        },
      ],
      selectedVariables: [{command: "", variable: ""}]
    };
  },
  methods: {
    deleteField(data) {
      if (data > -1) this.selectedVariables.splice(data, 1);
    },
    addVariable() {
      if (
        this.selectedVariables.length === 0 ||
        this.selectedVariables[this.selectedVariables.length - 1].variable !== ""
      ) {
        this.selectedVariables.push({
          command: "SELECT",
          variable: "",
        });
      }
    },
  },
}
</script>
