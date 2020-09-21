<template>
    <el-container class="home_container">
        <!-- 头部区 -->
        <el-header>
            <img width="70px" src="../assets/微信图片_20200915141108.jpg" alt="">
            <h2>电商后台管理系统</h2>
            <el-button type="info" @click='quit'>退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
            <!-- 左侧区 -->
            <el-aside :width="iscollapse ? '64px' : '200px' ">
                <div class="toggle_botton" @click="collapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <el-menu background-color="rgb(50,55,67)" text-color="#fff" 
                    active-text-color="#0f77ff" 
                    unique-opened
                    :collapse="iscollapse" 
                    :collapse-transition="false" 
                    router :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu v-for="(item,index) in menulist" :key="item.id" :index="item.id+'' ">
                        <!-- 一级菜单模板区 -->
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单  -->
                        <el-menu-item @click="saveState('/'+item.path)" :index="'/'+item.path+'' "
                            v-for="(item,index) in item.children" :key="item.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{item.authName}}</span>
                            </template>
                        </el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-aside>
            <!--右侧主体区 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import { getmenu } from '../api/user.js'
    export default {
        data() {
            return {
                // 左侧菜单数据
                menulist: [],
                // icon数据
                iconObj: {
                    "125": 'el-icon-s-check',
                    "103": 'el-icon-share',
                    "101": 'el-icon-s-claim',
                    "102": 'el-icon-document',
                    "145": 'el-icon-discount',
                },
                // 展开与折叠
                iscollapse: false,
                // 被激活链接地址
                activePath: ""


            }
        },
        created() {
            //拿到激活菜单的值
            this.activePath = window.sessionStorage.getItem('activePath')
            // 获取菜单数据
            getmenu().then(res => {
                // console.log(res.data.data)
                this.menulist = res.data.data
            })

        },
        methods: {
            // 退出
            quit() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            // 点击按钮折叠菜单和展开
            collapse() {
                this.iscollapse = !this.iscollapse
            },
            // 保存链接激活状态
            saveState(activePath) {
                window.sessionStorage.setItem('activePath', activePath)
                this.activePath = activePath
            }
        },

    }

</script>
<style scoped>
    .home_container {
        height: 100%;
    }

    .el-header {
        background-color: rgb(55, 61, 63);
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        background-color: #323743;
        color: #333;
    }

    .el-menu {
        border-right: 0;
    }

    .el-main {
        color: #0f77ff;
        background-color: #E9EDF0;
        color: #333;
    }

    body>.el-container {
        margin-bottom: 40px;
    }

    .toggle_botton {
        background-color: #4A5064;
        font-size: 10PX;
        line-height: 24PX;
        text-align: center;
        letter-spacing: 2px;
        color: white;
        cursor: pointer;
    }
    .el-header{
        display: flex;
        justify-content: space-between;
    }
    h2{
        width: 80%;
        display: flex;
        align-items: center;
    }
    .el-button{
        width: 70px;
        height: 40px;
        border:1px solid whitesmoke;
        margin-top: 10px;
    }
</style>