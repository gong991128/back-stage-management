<template>
    <div>
   <!-- 面包屑 -->
   <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
 <!-- 卡片区 -->
 <el-card>
    <!-- 权限列表区 -->
    <el-table :data="rightslist" border stripe style="width: 100%" max-height="550px" >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope = "scope">
                <el-tag v-if="scope.row.level == '0' ">标签一</el-tag>
                <el-tag v-else-if="scope.row.level == '1' " type="success">标签二</el-tag>
                <el-tag v-else="scope.row.level == '2' "  type="danger">标签三</el-tag>
            </template>
        </el-table-column>
    </el-table>
</el-card>



    </div>
</template>
<script>
    export default{
        data() {
            return {
                rightslist: []
            }
        },
        created() {
            // 网络请求权限列表数据
            this.$http.get('rights/list').then(res => {
                // console.log(res.data.data)
                this.rightslist = res.data.data
            })
        },

    }
</script>
<style scoped>
        .el-card {
        margin-top: 10px;
        height: 530px;
    }
</style>