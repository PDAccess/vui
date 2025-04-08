<template>
    <div style="font-size: 5.5rem;">
        <br><br><br>
        <div class="text-center">
            <h2 class="text-center">Your device has been registered for qr login</h2>
                
            <em class="fa fa-check-circle fa-4x"></em>
        </div>
        
    </div>
</template>

<script>

export default {
    data(){
        return {
            info: '',
            token: '',
            username: '',
        }
    },
    created(){
        this.info = this.$route.params.tokenUsername;
        this.token = this.info.split("=")[0];
        this.username = this.info.split("=")[1];
        localStorage.setItem("user-token", this.token);
        localStorage.setItem("username", this.username);
    }
}
</script>

<style>
.input-group-prepend {
  margin-left: 1000px;
}
</style>
