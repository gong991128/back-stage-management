<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区 -->
        <el-card>
            <!-- 查询订单区 -->
            <el-input placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>

            <!-- 订单表格区 -->
            <el-table :data="orderList" style="width:100%" border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" width="300px"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status =='0' " type="danger">未付款</el-tag>
                        <el-tag v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModify" circle>
                        </el-button>
                        <el-button type="success" icon="el-icon-s-help" size="mini" @click="showProgressBox" circle>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="orderListInfo.pagenum" :page-size="orderListInfo.pagesize" :page-sizes="[1, 2, 5, 10]"
                layout="total, sizes, prev, pager, next ,jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 修改的对话框 -->
        <el-dialog title="修改地址" :visible.sync="modifyVisible" width="50%" @close="modifyFromclose">
            <!-- from表单区 -->
            <el-form :model="modifyForm" :rules="modifyFormRules" ref="ruleForm" label-width="100px">
                <el-form-item label="省市区/县" prop="name1">
                    <el-cascader :options="citydata" v-model="modifyForm.name1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="name2">
                    <el-input v-model="modifyForm.name2"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 物流进度的对话框 -->
        <el-dialog title="物流进度" :visible.sync="showProgressBoxVisible" width="50%" @close="showProgressBoxclose">
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfo" 
                :key="index" :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showProgressBoxVisible = false">取 消</el-button>
                <el-button type="primary" @click="showProgressBoxVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import citydata from './citydata.js'
    export default {
        data() {
            return {
                //所有订单列表数据
                orderList: [],
                // 请求订单列表数据参数
                orderListInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5,
                },
                // 总条数
                total: 0,
                //修改对话框的显示隐藏
                modifyVisible: false,
                //修改 from表单的对象属性
                modifyForm: {
                    name1: [],
                    name2: ""
                },
                // from表单的权限验证
                modifyFormRules: {
                    name1: [
                        { required: true, message: '请输入省市区/县', trigger: 'blur' },
                    ],
                    name2: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                    ],
                },
                citydata,
                // 物流进度的对话框显示隐藏
                showProgressBoxVisible: false,
                // 物流进度的数据
                progressInfo: []
            }
        },
        created() {
            // 请求订单数据列表
            this.order()

        },
        methods: {
            // 请求订单数据列表
            async order() {
                const { data: res } = await this.$http.get('orders', { params: this.orderListInfo })
                if (res.meta.status !== 200) {
                    return this.$message.error('请求订单数据列表失败')
                }
                this.orderList = res.data.goods
                // console.log(res.data.goods)
                this.total = res.data.total
            },
            //监听 pagesize 改变的事件
            handleSizeChange(newsize) {
                //这里conso 选中第几页 最新的值
                console.log(newsize)
                //最新的条数（newsize）赋值给 动态的 pagesie
                this.orderListInfo.pagesize = newsize
                //获取到最新一页显示的数据  重新发送axios请求 这里是封装好的请求方法
                this.order()
            },

            // 监听 页码值 改变的事件
            handleCurrentChange(newPage) {
                console.log(newPage)
                //把最新的页码（newPage）赋值给 动态的 pagenum 
                this.orderListInfo.pagenum = newPage
                //获取到最新显示的页码值  重新发送axios请求 这里是封装好的请求方法
                this.order()
            },

            // 点击显示修改地址 对话框
            showModify() {
                // alert('ss')
                this.modifyVisible = true
            },
            //监听对话框的关闭
            modifyFromclose() {
                this.$refs.ruleForm.resetFields()
            },
            //点击 查询物流进度 展示对话框
            async showProgressBox() {
                const { data: res } = await this.$http.get('/kuaidi/1106975712662')
                if (res.meta.status !== 200) {
                    return this.$message.error('查询物流进度失败')
                }
                // console.log(res.data)
                this.progressInfo = res.data

                this.showProgressBoxVisible = true
            },
            // 监听物流进度的对话框的关闭
            showProgressBoxclose() {

            }



        },
    }
</script>
<style scoped>
    .el-card {
        margin-top: 10px;
    }

    .el-input {
        width: 300px;
    }

    .el-cascader {
        width: 80%;
    }
</style>