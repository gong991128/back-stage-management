<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区 -->
        <el-card>
            <!-- 添加角色区 -->
            <el-button type="primary">添加角色</el-button>
            <!-- 权限列表区 -->
            <el-table :data="roles" border stripe style="width: 100%">
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <!--分栏布局  -->
                            <el-row v-for="(item1,index1) in scope.row.children"
                                :class="[ 'item1.id == 30' ? 'row_top' : '','vcenter' ]" :gutter="24" :key="item1.id">
                                <!-- 渲染一级权限 -->
                                <el-col :span="5">
                                    <el-tag @close="removeById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 渲染二级和三级权限 -->
                                <el-col :span="19">
                                    <el-row :class="[index2 ===0 ? '': 'bdtop','vcenter']"
                                        v-for="(item2,index2) in item1.children">
                                        <el-col :span="6">
                                            <el-tag @close="removeById(scope.row,item2.id)" closable type="success">
                                                {{item2.authName}}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>

                                        <el-col :span="18">
                                            <el-tag closable @close="removeById(scope.row,item3.id)"
                                                v-for="(item3,index3) in item2.children" type="warning">
                                                {{item3.authName}}
                                            </el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- <pre>{{scope.row}}</pre> -->
                        </template>
                    </el-table-column>


                </el-table-column>

                </el-table-column>
                <!-- 表格区 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="usersById(scope.row.id)">删除
                        </el-button>
                        <el-button type="warning" size="small" icon="el-icon-share">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>


        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // 角色列表数据
                roles: [],
            }
        },
        methods: {
            // 请求角色列表
            getrolesList() {
                this.$http.get('roles').then(res => {
                    // console.log(res.data.data)
                    this.roles = res.data.data
                })
            },
            // 删除角色
            usersById(id) {
                console.log(id)
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`roles/${id}`).then(res => {
                        console.log(res)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getrolesList()
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }
        },
        created() {
            this.getrolesList()
        },
    }

</script>
<style scoped>
    .el-card {
        margin-top: 10px;
    }

    .el-button {
        margin-bottom: 15px;
    }

    .el-tag {
        margin: 7px;
    }

    /* .el-row {
        border-bottom: 1px solid gray;

    } */

    .row_top {
        border-top: 0.5px solid gray;
    }

    .bdtop {
        border-top: 0.5px solid gray;

    }

    .el-breadcrumb-item {
        line-height: 60px;
        height: 50px;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>