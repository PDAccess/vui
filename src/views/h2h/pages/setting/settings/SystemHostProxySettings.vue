<template>
    <div>
        <h5>Default System Host Settings</h5>
        <hr>
        <b-form-fieldset
                label="Host Name"
                description="Your default PDAccess hostname;this url using for connecting inventory"
                :label-cols="3"
                :horizontal="true">
            <b-form-input type="url" placeholder="pdaccess.com" v-model="defaultHostName" v-on:input="setProxySettings"></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
                label="Port"
                description="Your default PDAccess port"
                :label-cols="3"
                :horizontal="true">
            <b-form-input type="number" placeholder="80" v-model="defaultHostPort" v-on:input="setProxySettings"></b-form-input>
        </b-form-fieldset>
        <h5>Default Proxy Settings</h5>
        <hr>
        <b-form-fieldset
                label=""
                description=""
                :label-cols="3"
                :horizontal="true">
            <b-form-checkbox id="useSameSettings"
                             v-model="useSameSettings"
                             value="use"
                             unchecked-value="do_not_use">
                Use Same Incredients in Default System Host Settings
            </b-form-checkbox>
        </b-form-fieldset>
        <b-form-fieldset
                label="Proxy Host Name"
                description="Your default inventory PDAccess proxy hostname,for routing tunnel connection when connecting inventory"
                :label-cols="3"
                :horizontal="true">
            <b-form-input type="url" placeholder="pdaccess.com" v-model="proxyHostName"></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
                label="Port"
                description="Proxy port"
                :label-cols="3"
                :horizontal="true">
            <b-form-input type="number" placeholder="80" v-model="proxyHostPort"></b-form-input>
        </b-form-fieldset>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                defaultHostName: '',
                defaultHostPort: '',
                proxyHostName: '',
                proxyHostPort: '',
                useSameSettings: 'use'
            }
        },
        watch: {
            useSameSettings(val) {
                if (val === 'use') {
                    this.proxyHostName = this.defaultHostName;
                    this.proxyHostPort = this.defaultHostPort;
                } else {
                    this.proxyHostName = '';
                    this.proxyHostPort = '';
                }
            }
        },
        methods: {
            setProxySettings(){
                if (this.useSameSettings === 'use') {
                    this.proxyHostName = this.defaultHostName;
                    this.proxyHostPort = this.defaultHostPort;
                } else {
                    this.proxyHostName = '';
                    this.proxyHostPort = '';
                }
            }
        },
    }
</script>
