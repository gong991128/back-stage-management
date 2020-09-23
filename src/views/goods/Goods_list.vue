<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区 -->
        <el-card>
            <!-- 输入框区 -->
            <el-input placeholder="请输入内容" v-model="goodsInfo.query" clearable @clear="goodsList">
                <el-button   @click="goodsList" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <!-- 添加按钮区 -->
            <el-button type="primary" @click="addGoods" >添加商品</el-button>
            <!-- 商品列表  表格区 -->
            <el-table :data="goods_list" style="width: 100%" border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" width="550px"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）" width="120px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="170px">
                    <template slot-scope="scope">
                        {{scope.row.add_time |dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="goodsInfo.pagenum" :page-size="goodsInfo.pagesize" :page-sizes="[1, 2, 5, 10]"
                layout="total, sizes, prev, pager, next ,jumper" :total="total">
            </el-pagination>
        </el-card>

       

    </div>
</template>
<script>
    export default {
        data() {
            return {
                //所有商品列表数据 
                goods_list: [],
                //请求商品列表 商品参数数据对象
                goodsInfo: {
                    //查询参数
                    query: '',
                    // 当前页码
                    pagenum: 1,
                    // 每页条数
                    pagesize: 5,

                },
                //   商品总数量
                total: 0,
            }
        },
        created() {
            // 发起商品列表数据请求
            this.goodsList()
        },
        methods: {
            // 发起商品列表数据请求
            async goodsList() {
                const { data: res } = await this.$http.get('goods', { params: this.goodsInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取列表数据失败')
                }

                console.log(res.data.goods)
                this.goods_list = res.data.goods
                this.total = res.data.total
                // console.log(this.total)
            },
            //监听 pagesize 改变的事件
            handleSizeChange(newsize) {
                //这里conso 选中第几页 最新的值
                console.log(newsize)
                //最新的条数（newsize）赋值给 动态的 pagesie
                this.goodsInfo.pagesize = newsize
                //获取到最新一页显示的数据  重新发送axios请求 这里是封装好的请求方法
                this.goodsList()
            },
            // 监听 页码值 改变的事件
            handleCurrentChange(newPage) {
                console.log(newPage)
                //把最新的页码（newPage）赋值给 动态的 pagenum 
                this.goodsInfo.pagenum = newPage
                //获取到最新显示的页码值  重新发送axios请求 这里是封装好的请求方法
                this.goodsList()
            },



            // 点击添加商品 显示对话框
            addGoods() {
                this.$router.push('/goods/add')
            }
        },
    }
</script>
<style scoped>
    .el-card {
        margin-top: 10px;
    }

    .el-input {
        width: 400px;
        margin-right: 20px;
    }
</style>