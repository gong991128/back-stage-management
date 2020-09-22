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
            <!-- 添加按钮 -->
            <el-button @click="addcate">添加</el-button>
            <!-- 添加的对话框 -->
            <el-dialog title="添加分类" :visible.sync="addcateVisible" width="50%" @close="addCateDialogClose">
                <!-- 添加分类的 表单区 -->
                <el-form :model="addCateForm" label-width="120px">
                    <el-form-item label="分类名称">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>

                    <el-form-item expand-trigger="hover" ref="addCateFormRef" :model="addCateForm" label="父级分类：">
                        <!-- options 用来指定数据源 -->
                        <!-- props 用来指定配置对象 -->
                        <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                            @change="parentCateChanged" clearable change-on-select>
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addcateVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCateOk">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 表格区 -->
            <tree-table :data="catelist" :columns="columns" border :show-index="true" index-text="#"
                :expand-type="false" :selection-type="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i style="color:lightgreen;" class="el-icon-success" v-if="scope.row.cat_deleted===false">
                    </i>
                    <i style="color:lightgreen;" class="el-icon-error" v-else></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level===1" type="success" size="mini">二级</el-tag>
                    <el-tag v-else size="mini">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" @click="cateById(scope.row.cat_id)" icon="el-icon-delete">删除
                    </el-button>
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" :page-sizes="[1, 2, 5, 10]"
                layout="total, sizes, prev, pager, next ,jumper" :total="total">
            </el-pagination>

        </el-card>


    </div>
</template>
<script>
    export default {
        data() {
            return {
                // 商品分类的数据列表
                catelist: [],
                // 查询条件
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5,
                },
                // 总条数
                total: 0,
                // 位table指定列的数据
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name',
                    },
                    {
                        label: '是否有效',
                        // 表示，将当前定义列为模板列
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'isok',
                    },
                    {
                        label: '排序',
                        // 表示，将当前定义列为模板列
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'order',
                    },
                    {
                        label: '操作',
                        // 表示，将当前定义列为模板列
                        type: 'template',
                        // 表示当前这一列使用模板名称
                        template: 'opt',
                    },
                ]
                ,
                // 添加的对话框 默认关闭
                addcateVisible: false,
                // 添加分类表单的数据对象
                addCateForm: {
                    //添加的分类名称
                    cat_name: '',
                    // 添加分类的父id
                    cat_pid: 0,
                    // 分类等级，，默认添加的分类是一级分类
                    cat_level: 0
                },
                // 父级分类的列表
                parentCateList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 选中的父级分类id数组
                selectedKeys: []
            }
        },
        created() {
            // 触发商品分类列表请求
            this.getcateList()
        },
        methods: {
            // 商品分类列表请求
            getcateList() {
                this.$http.get('categories', { params: this.queryInfo }).then(res => {
                    console.log(res.data.data.total)
                    this.total = res.data.data.total
                    this.catelist = res.data.data.result
                })
            },
            //监听 pagesize 改变的事件
            handleSizeChange(newsize) {
                //这里conso 选中第几页 最新的值
                console.log(newsize)
                //最新的条数（newsize）赋值给 动态的 pagesie
                this.queryInfo.pagesize = newsize
                //获取到最新一页显示的数据  重新发送axios请求 这里是封装好的请求方法
                this.getcateList()
            },
            // 监听 页码值 改变的事件
            handleCurrentChange(newPage) {
                console.log(newPage)
                //把最新的页码（newPage）赋值给 动态的 pagenum 
                this.queryInfo.pagenum = newPage
                //获取到最新显示的页码值  重新发送axios请求 这里是封装好的请求方法
                this.getcateList()
            },
            // 点击添加调出对话框
            addcate() {
                // 先获取父级分类的数据列表 在展示出对话框
                this.getparentCateList()
                this.addcateVisible = true
            },
            // 获取父级分类的数据表
            getparentCateList() {
                this.$http.get('categories', { params: { type: 2 } }).then(res => {
                    console.log(res.data.data)
                    this.parentCateList = res.data.data
                })
            },
            // 选中项发生变化触发这个函数
            parentCateChanged() {
                console.log(this.selectedKeys)
                // 如果selecteKeys 数组length大于0 证明选中的父级分类
                // 反之就说明没有选中任何父级分类
                if (this.selectedKeys.length > 0) {
                    // 父级分类的id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    //    为当前的分类的等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length
                } else {
                    //父级分类的id
                    this.addCateForm.cat_pid = 0
                    // 为当前分类的等级赋值
                    this.addCateForm.cat_level = 0
                }
            },
            // 点击按钮 添加新的分类
            addCate() {
                console.log(this.addCateForm)
                //    this.addcateVisible = false
            },
            //监听对话框的关闭事件 重置表单数据
            addCateDialogClose() {
                //    级联选择器清空
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_name = ""
                //    this.$refs.addCateFormRef.resetFields()
            },
            // 点击添加分类
            async addCateOk() {
                const { data: res } = await this.$http.post('categories', this.addCateForm)

                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败')
                }
                this.$message.success("添加分类成功!")
                this.getcateList()
                this.addcateVisible = false
            },
            // 根据id分类删除
            cateById(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`categories/${id}`).then(res => {
                        console.log(res.data)
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('删除分类失败')
                        }
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getcateList()
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }

            //编辑商品分类
        }




    }


</script>
<style scoped>
    .el-card {
        margin-top: 10px;
        /* height: 530px; */
    }
    .el-button {
        margin-bottom: 15px;
    }
</style>