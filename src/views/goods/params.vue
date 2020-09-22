<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区 -->
        <el-card>
            <!-- 警告提示区 -->
            <el-alert title="注意：只允许为第三方分类设置的相关参数" show-icon :closable="false" type="warning">
            </el-alert>

            <!-- 商品分类区域 -->
            <div class="goodsClassTab">
                <span>选择商品分类：</span>
                <!-- 选择商品分类的级联选择框 -->
                <el-cascader v-model="seleCateKeys" :options="catelist" :props="cateProps" @change="handleChange">
                </el-cascader>
            </div>

            <!-- tab 页签区 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加动态参数的按钮 -->
                    <el-button type='primary' @click="addDialogVisible = true" :disabled="isBtnDisabled" size="mini">
                        添加参数
                    </el-button>

                    <!--动态参数的表格  -->
                    <el-table :data="manyTableData" style="width: 100%">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">

                                <!-- 循环选人tag标签 -->
                                <el-tag v-for="(item,index) in scope.row.attr_vals" closable :key="index">
                                    {{item}}
                                </el-tag>
                                <!-- 输入的文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                                </el-input>
                                <!-- 添加的按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>

                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>

                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="goodsXiuGai(scope.row.attr_id)" icon="el-icon-edit"
                                    size="mini">编辑
                                </el-button>
                                <el-button type="danger" @click="goodsByIdDelete(scope.row.attr_id)"
                                    icon="el-icon-delete" size="mini">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>


                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type='primary' @click="addDialogVisible = true" :disabled="isBtnDisabled" size="mini">
                        添加属性</el-button>
                    <!--静态属性的表格  -->
                    <el-table :data="onlyTableData" style="width: 100%">
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>

                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="goodsXiuGai(scope.row.attr_id)" icon="el-icon-edit"
                                    size="mini">编辑</el-button>
                                <el-button type="danger" @click="goodsByIdDelete(scope.row.attr_id)"
                                    icon="el-icon-delete" size="mini">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog @close="addDialogClose" :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%">
            <!-- 添加参数from 表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParamsOk">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
        <el-dialog @close="xiuGaiDialogClose" :title="'修改' + titleText" :visible.sync="xiuGaiDialogVisible" width="50%">
            <!-- 修改参数from 表单 -->
            <el-form :model="xiuGaiForm" :rules="xiuGaiFormRules" ref="xiuGaiFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="xiuGaiForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="xiuGaiDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="xiuGaiParamsOk">确 定</el-button>
            </span>
        </el-dialog>



    </div>
</template>
<script>
    export default {
        data() {
            return {
                // 所有商品分类的数据
                catelist: [],
                // 级联选择框的配置对象
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 级联选择框双向绑定的数组
                seleCateKeys: [],
                // 被激活页签的名称
                activeName: 'many',
                // 动态参数的数据
                manyTableData: [],
                //静态属性的数据
                onlyTableData: [],
                // 控制添加对话框的隐藏
                addDialogVisible: false,
                // 添加参数的表单的数据对象
                addForm: {
                    attr_name: ''
                },
                // 添加表单的验证规则对象
                addFormRules: {
                    attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
                },
                // 控制修改对话框的隐藏
                xiuGaiDialogVisible: false,
                // 修改表单的from数据对象‘
                xiuGaiForm: {
                    attr_name: ''
                },
                // 修改表单的验证规则对象
                xiuGaiFormRules: {
                    attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
                },
                // 当前分类参数的数据 
                goodsClassItem: {},

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            // 获取所有商品分类的数据
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败')
                }
                this.catelist = res.data
                // console.log(this.catelist)
            },
            // 级联选择框变化会触发这个函数
            handleChange() {
                this.getParamsData()

            },

            // tab页签点击事件的处理函数
            handleTabClick() {
                console.log(this.activeName)
                this.getParamsData()
            },
            //获取参数的列表数据
            async getParamsData() {
                if (this.seleCateKeys.length !== 3) {
                    this.seleCateKeys = []
                    return
                }
                // 根据所选分类的id，和当前所处的面板，获取对应的参数
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                    { params: { sel: this.activeName, } })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败')
                }
                if (this.activeName == 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }
                // 分割attr_vals的数据 转换为数组
                res.data.forEach(item => {
                     // 获取文本框的显示与隐藏
                     item.inputVisible = false
                    //文本框中的值
                    item.inputValue = ''

                    
                    if (item.attr_vals !== '') {
                        item.attr_vals = item.attr_vals.split(',')

                    }
                   
                });

                console.log(res.data)
            },
            // 监听添加参数对话框关闭做一些操作
            addDialogClose() {
                //清空表单数据
                this.$refs.addFormRef.resetFields()
            },
            // 点击按钮添加参数
            async addParamsOk() {
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
                    { attr_name: this.addForm.attr_name, attr_sel: this.activeName })

                if (res.meta.status !== 201) {
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加成功')
                this.addDialogVisible = false
                this.getParamsData()

            },

            // 点击按钮展示修改当分类对话框  并查询当前的参数信息
            async goodsXiuGai(id) {
                // console.log(id)
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeName } })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数失败')
                }
                this.$message.success('获取参数成功')
                // console.log(res.data)
                this.goodsClassItem = res.data
                // 把获取到的表单数据赋值给修改的输入框
                this.xiuGaiForm = res.data

                this.xiuGaiDialogVisible = true
            },
            // 点击按钮 修改表单参数修改
            async xiuGaiParamsOk() {
                // 发起修改的请求
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.goodsClassItem.attr_id}`, {

                    attr_name: this.xiuGaiForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('更新数据失败')
                }
                this.$message.success('更新数据成功')
                console.log(res)
                this.xiuGaiDialogVisible = false
                this.getParamsData()
            },
            // 重置修改表单数据
            xiuGaiDialogClose() {
                this.$refs.xiuGaiFormRef.resetFields()
            },
            // 根据id 删除当前分类数据
            async goodsByIdDelete(id) {
                const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除参数失败')
                }
                this.$message.success('删除参数成功')
                this.getParamsData()
            },
            //    文本框失去焦点或按下enter键都会触发
            handleInputConfirm() {
                console.log('ok')
            },
            // 点击按钮展示文本输入框
            showInput(row) {
                row.inputVisible = true
                // row.inputVisible = row.inputVisible

            }



        },

        computed: {
            //如果按钮被禁用 返回true， 否则返回false
            isBtnDisabled() {
                if (this.seleCateKeys.length !== 3) {
                    return true
                } else {
                    return false
                }
            },
            // 当前选中的三级分类Id
            cateId() {
                if (this.seleCateKeys.length === 3) {
                    return this.seleCateKeys[2]
                }
                return null
            },
            // 动态计算标题文本
            titleText() {
                if (this.activeName == 'many') {
                    return '动态参数'
                }
                return '静态属性'

            }
        },
    }
</script>
<style scoped>
    .el-card {
        margin-top: 10px;
    }

    .goodsClassTab {
        margin-top: 15px;
    }

    .el-tag {
        margin: 8px;
    }

    .input-new-tag {
        width: 100px;
    }
</style>