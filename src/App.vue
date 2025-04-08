<template>
<router-view></router-view>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
  
// CoreUI Icons Set
@import '~@coreui/icons/css/coreui-icons.min.css';

/* Import Font Awesome Icons Set */
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome.scss';

/* Import Simple Line Icons Set */
$simple-line-font-path: '~simple-line-icons/fonts/';
@import '~simple-line-icons/scss/simple-line-icons.scss';

/* Import Bootstrap Vue Styles */
@import '~bootstrap-vue/dist/bootstrap-vue.css';

// Style.scss
@import 'assets/scss/style';

// Import Multi-select
@import "~vue-multiselect/dist/vue-multiselect.min.css";

// toastr
@import 'assets/vue-toastr/vue-toastr.min.css';

//emoji
@import '~emoji-mart-vue-fast/css/emoji-mart.css';

.multiselect__input {
    font-size: 0.8rem;
}

.multiselect__single {
   font-size: $font-size-base;
}

.multiselect {
   font-size: $font-size-base;
}

.toast {
  display: inherit;
}

.table td,
.table th {
    vertical-align: inherit;
}

.card {
  margin-bottom: 0px;
  padding: 10px;
}
</style>
