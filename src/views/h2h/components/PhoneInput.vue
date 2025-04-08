<template>
    <div class="phone-input">
        <vue-tel-input
            :class="'form-control' + (phone.selected ? (phone.invalid ? ' is-invalid' : ' is-valid') : '') + ' nopadding'"
            :preferred-countries="['us', 'gb', 'ua']"
            :valid-characters-only="true"
            @input="onInput"
            :required="true"
            v-model="phoneNumber" />
        <b-form-invalid-feedback>
            <div v-if="phone.required">Phone is required.</div>
            <div v-else-if="phone.invalid">Phone is invalid.</div>
        </b-form-invalid-feedback>
    </div>
</template>
<script>
import { VueTelInput } from 'vue-tel-input'
export default {
    name: 'PhoneInput',
    data() {
        return {
            phoneNumber: ""
        }
    },
    props: {
      phone: Object,
      clearNumber: Boolean
    },
    components: {
        VueTelInput,
    },
    watch: {
        clearNumber: function() {
            this.phoneNumber = "";
        }
    },
    methods: {
        onInput(formattedNumber, { number, valid, country }) {
            this.phone.selected = true;
            this.phone.number = number.international;
            this.phone.required = !number.input;
            this.phone.invalid = !valid;
            this.phone.country = country && country.name;

            this.$emit('update:phone', this.phone);
            this.$emit('update:valid', valid);
        },
    },
    created() {
        this.phoneNumber = this.phone.number
    }
}
</script>
<style>
.nopadding {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
}

.vue-tel-input {
    border-color: #e4e7ea;
}

.vue-tel-input.is-invalid:focus-within {
    border-color: #f86c6b;
    -webkit-box-shadow: 0 0 0 0.2rem rgba(248, 108, 107, 0.25);
    box-shadow: 0 0 0 0.2rem rgba(248, 108, 107, 0.25);
}

.vue-tel-input.is-valid:focus-within {
    border-color: #4dbd74;
    -webkit-box-shadow: 0 0 0 0.2rem rgba(77, 189, 116, 0.25);
    box-shadow: 0 0 0 0.2rem rgba(77, 189, 116, 0.25);
}

.vti__dropdown-list.below {
    z-index: 10;
}

</style>