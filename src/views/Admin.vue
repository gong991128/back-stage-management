<template>
    <div>
        <button @click='onClick'>退出</button>

    </div>
</template>
<script>
    export default {
        methods: {
            onClick() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            }
        },

    }

</script>
<style scoped>

</style>