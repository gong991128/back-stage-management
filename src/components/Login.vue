<template>
    <div class="login">
        <div class="login_box">
            <!-- 头像区 -->
            <div class="avatar_box">
                <img src="../assets/微信图片_20200915141108.jpg" alt="">
            </div>
            <!-- 登录表单 -->
            <el-form ref="loginref" :model="loginfrom" :rules="loginFromreles" label-width="100px" class="Dlufrom">
                <!-- 用户名 -->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginfrom.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginfrom.password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="Dlufrom_bot">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { postlogin } from '../api/user.js'
    export default {
        data() {
            return {
                // 登录表单的数据绑定
                loginfrom: {
                    username: "admin",
                    password: "123456"
                },
                // 表单验证规则
                loginFromreles: {
                    username: [
                        { required: true, message: '请输入登录名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }

            }
        },
        methods: {
            // 点击重置按钮
            resetForm() {

                // console.log(this)
                this.$refs.loginref.resetFields();
            },
            // 点击登录
            login() {
                this.$refs.loginref.validate(valid => {
                    // console.log(valid);
                    if (!valid) return;
                    postlogin(this.loginfrom).then(res => {
                        // console.log(res)
                        if (res.data.meta.status !== 200) {
                            this.$message.error("登录失败")
                        } else {
                            this.$message.success("登录成功！")
                        }
                        // console.log(res.data.data.token)
                        window.sessionStorage.setItem('token', res.data.data.token)
                        this.$router.push('/home')
                    }).catch((err) => {
                        console.log(err)
                    })
                })



            }
        },
    }
</script>
<style scoped>
    .login {
        background: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background: #fff;
        border-radius: 3px;
        /* margin:  auto; */
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

    }

    .avatar_box {
        width: 140px;
        height: 140px;
        border: 1px solid rgb(240, 235, 235);
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;


    }

    .avatar_box img {
        width: 100%;
        /* height: ; */
        border-radius: 50%;
        background-color: gainsboro;
    }

    .Dlufrom {
        width: 100%;
        position: absolute;
        bottom: 0%;

    }

    .Dlufrom_bot {
        float: right;
    }
</style>