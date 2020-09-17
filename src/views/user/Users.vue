<template>
    <div>
        <!-- 面包屑区 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区 -->
        <el-card class="box-card">
            <!-- 分栏表格区 -->
            <el-row :gutter="20">
                <!-- 输入框 -->
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <el-input v-model="value" @clear="userlistinfo" placeholder="请输入内容" clearable
                            class="input-with-select">
                            <el-button @click="changeinfo" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                </el-col>
                <!-- 按钮 -->
                <el-col :span="2">
                    <div class="grid-content bg-purple-light">
                        <el-button type="primary" @click="addusers = true">添加</el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- 添加功能的对话框 -->
            <el-dialog title="添加用户" :visible.sync="addusers" width="40%" @close="addClonsed">
                <!--内容主体区  -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号"" prop=" mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部区 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addusers = false">取 消</el-button>
                    <el-button type="primary" @click="adduser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改功能的对话框 -->
            <el-dialog title="修改用户" :visible.sync="modifyVisible" width="30%" @close="modifyFromClonsed">
                <!-- 主体区 -->
                <el-form :model="modifyFrom" :rules="modifyRules" ref="modifyFromRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input disabled v-model="modifyFrom.username"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="modifyFrom.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="modifyFrom.mobile"></el-input>
                    </el-form-item>
                </el-form>

                <!-- 底部区 -->
                <el-button @click="modifyVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyFromUserInfo">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 表格区 -->
            <el-table :data="userlist" border stripe style="width: 100%">
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="startChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button @click="modifyOnclick(scope.row.id) " type="primary" size="mini" icon="el-icon-edit">
                        </el-button>
                        <!-- 删除 -->
                        <el-button @click="deleteUserByid(scope.row.id)" type="danger" size="mini"
                            icon="el-icon-delete"></el-button>
                        <!-- 文字提示 -->
                        <el-tooltip :enterable="false" class="item" effect="dark" content=" 分配角色" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-setting"></el-button>

                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryinfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryinfo.pagesize"
                layout=" sizes, prev, pager, next ,jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
    import { getusers, putuserstate, postaddusers, getuserid } from '../../api/user.js'
    export default {
        data() {
            // 验证邮箱的校验规则
            var checkEmail = (rule, value, cb) => {
                const regEmil =
                    /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/

                if (regEmil.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }

            // 验证手机的校验规则
            var checkMobile = (rule, value, cb) => {
                //验证手机号的正则表达式‘
                const regMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/

                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error('请输入正确的手机号'))
            }
            return {

                // 用户数据列表
                userlist: [],
                // 总条数
                total: 0,
                queryinfo: {
                    query: '',
                    // 当前页数
                    pagenum: 1,
                    // 显示一页多少条数据
                    pagesize: 2,
                },

                // 搜索关键字
                changes: [],
                // 动态获取输入框的值
                value: '',
                // 添加的对话框默认隐藏
                addusers: false,
                // 修改的对话框默认隐藏
                modifyVisible: false,
                // 根据id查询到的信息对象
                modifyFrom: {},
                // 修改用户的表单数据
                // modifyFrom:{},
                //添加用户表单数据
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',

                },
                // 添加表单的归责验证对象
                addFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '用户的长度在3-10位', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '用户的长度在6-15位', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }

                    ]

                },
                // 修改表单的验证规则
                modifyRules: {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }

                    ]
                }


            }
        },
        created() {
            this.userlistinfo()
        },
        methods: {
             // 请求用户数据列表的封装的函数
            userlistinfo() {
             // 请求用户数据列表
                getusers(this.queryinfo).then(res => {
                    // console.log(res.data.data)
                    this.userlist = res.data.data.users
                    this.changes = res.data.data.users
                    this.total = res.data.data.total
                })
            },
            // 监听pagesize改变事件
            handleSizeChange(newsize) {
                console.log(newsize)
                this.queryinfo.pagesize = newsize
                this.userlistinfo()

            },
            // 监听 页码值 改变的事件
            handleCurrentChange(newPage) {
                console.log(newPage)
                this.queryinfo.pagenum = newPage
                this.userlistinfo()

            },
            // 监听swiper状态的改变
            startChange(userinfo) {
                console.log(userinfo)
                this.$axios.put('http://127.0.0.1:8888/api/private/v1/' + `users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
                    console.log(res)
                })
            },
            // 搜索关键字
            changeinfo() {

                // 原数据清空
                this.userlist = []

                // 新数据循环  使用includes方法  在输入框查找username
                this.changes.forEach(element => {
                    if (element.username.includes(this.value)) {
                        this.userlist.push(element)
                        // 把查找的数据在tableData重新渲染
                        console.log(element)
                    }
                });
                //includes用于搜索筛选关键字 后把数据重新渲染列表

            },
            // 监听添加用户的对话框关闭事件
            addClonsed() {
                this.$refs.addFormRef.resetFields()
            },
            // 监听用户的对话框关闭事件
            modifyFromClonsed() {
                this.$refs.modifyFromRef.resetFields()
            },
            //  点击事件添加新用户
            adduser() {
                this.$refs.addFormRef.validate(valid => {
                    console.log(valid)
                    if (!valid) return
                    //    console.log(this.addForm)
                    // 可以发起网络请求
                    postaddusers().then(res => {
                        console.log(res.data)
                    })

                })
            },
            // 点击打开修改用户对话框
            modifyOnclick(id) {
                this.modifyVisible = true
                console.log(id)
                // get方法根据id查询用户信息
                this.$http.get('users/' + id).then(res => {
                    // console.log(res.data.data)
                    this.modifyFrom = res.data.data
                }).catch(err => {
                    cosnole.log(err)
                })

            },
            // 修改用户信息并提及
            modifyFromUserInfo() {
                this.$refs.modifyFromRef.validate(valid => {
                    console.log(valid)
                    if (!valid) return

                    // 发起给更改用户信息网络请求
                    this.$http.put('users/' + this.modifyFrom.id, {
                        email: this.modifyFrom.email,
                        mobile: this.modifyFrom.mobile
                    }).then(res => {
                        // console.log(res.data.meta)
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('更新用户信息失败')
                        } else {
                            // 关闭对话框
                            this.modifyVisible = false
                            //刷新数据列表
                            this.userlistinfo()
                            //提示修改成功
                            this.$message.success('更新用户信息成功')
                        }
                    });

                })
            },
            // 根据用户id删除信息
            deleteUserByid(id) {
                // 询问用户是否删除数据
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 发送删除的网络请求
                    this.$http.delete('users/' + id, { id: id }).then(res => {
                        // console.log(res.data.meta)

                        if (res.data.meta.status !== 200) {
                            this.$message.info('不允许删除admin账户')
                        } else {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 














        }


    }
</script>
<style scoped>
    .el-breadcrumb {
        font-size: 13px;
    }
    .el-card {
        /* line-height: 100px; */
        margin: 10px 0px;
    }
    .el-row {
        margin-bottom: 20px;


    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .el-table-column {
        height: 30px;
    }
</style>