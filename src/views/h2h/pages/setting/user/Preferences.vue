<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Navigation theme</h3>
              <p>
                Customize the appearance of the application header and
                navigation sidebar.
              </p>
            </b-col>
            <b-col sm="8"> </b-col>
          </b-row>
        </li>
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Syntax highlighting theme</h3>
              <p>
                This setting allows you to customize the appearance of the
                syntax.
              </p>
            </b-col>
            <b-col sm="8"> </b-col>
          </b-row>
        </li>
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Behavior</h3>
              <p>
                This setting allows you to customize the behavior of the system
                layout and default views.
              </p>
            </b-col>
            <b-col sm="8"> </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>
<script>
export default {
  props: ["id"],
  components: {},
  data() {
    return {};
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {},
  created() {},
};
</script>
