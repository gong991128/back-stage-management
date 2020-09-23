<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区 -->
        <el-card>
            <!-- 消息提示 -->
            <el-alert :closable="false" title="添加商品信息" type="info" center show-icon>
            </el-alert>
            <!-- 步骤条区 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title=" 商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- tab栏区 -->
            <el-form label-position="top" :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <!-- 标签页 -->
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="TabBeforeLeave"
                    @tab-click='tabClicked'>
                    <!-- 基本信息 -->
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="">
                            <el-cascader v-model="addForm.goods_cat" :options="classList" :props="classProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>

                    </el-tab-pane>
                    <!-- 商品参数 -->
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="(item,index) in manyList" :key="item.attr_id">
                            <!--复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="item" v-for="(item,index) in item.attr_vals" border
                                    :key="item.attr_id">
                                </el-checkbox>

                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="(item,index) in onlyList">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action代表上传图片 要上传的地址 -->
                        <el-upload :action="uplodURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览 对话框 -->
        <el-dialog title="图片预览" :visible.sync="Previewvisible" width="30%">
            <img width="100%" :src="PreviewPath" alt="">
        </el-dialog>
    </div>
</template>
<script>
    import _ from 'lodash'

    export default {
        data() {
            return {
                // 步骤条 初始状态
                activeIndex: '0',
                // 添加商品的表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 1,
                    goods_weight: 1,
                    goods_number: 1,
                    goods_cat: [],
                    // 图片的数组
                    pics: [],
                    // 商品的详情描述
                    goods_introduce: '',
                    attrs: []

                },
                // 验证规则
                addFormRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' },
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' },
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                    ],
                },
                // 所有商品分类的数据
                classList: [],
                classProps: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                // 动态参数列表数据
                manyList: [],
                // 静态参数列表数据
                onlyList: [],
                // 上传图片的URL地址
                uplodURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                // 图片上传组件的Headers
                headerObj: {
                    Authorization: window.sessionStorage.getItem("token")
                },
                // 图片预览的路径url
                PreviewPath: '',
                //动态控制图片预览对话框显示隐藏
                Previewvisible: false,

            }
        },
        created() {
            // 调用所有商品分类的数据请求
            this.goodsClassList()
        },
        methods: {
            // 获取所有商品分类的数据
            async goodsClassList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类数据失败')
                }
                this.classList = res.data
                // console.log(this.classList)
            },
            // 级联选择器选中项变化会触发这个函数
            handleChange() {
                // 判断选中项的长度小于3 则选中空数组
                if (this.addForm.goods_cat.length !== 3) {
                    return this.addForm.goods_cat = []
                }
                console.log(this.addForm.goods_cat)

            },
            // 标签页的切换
            TabBeforeLeave(activeName, oldActiveName) {
                // console.log(activeName)
                // console.log(oldActiveName)
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类')
                    return false
                }
            },
            // 标签页选中时触发
            async tabClicked() {
                // 证明访问的时动态参数面板
                if (this.activeIndex == '1') {
                    // 发起参数列表请求
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                        { params: { sel: 'many' } })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取分类数据失败')
                    }
                    console.log(res.data)
                    this.manyList = res.data

                    res.data.forEach(item => {
                        if (item.attr_vals !== "") {
                            item.attr_vals = item.attr_vals.split(',')

                        } else {
                            return item.attr_vals = ""

                        }
                    })
                } else if (this.activeIndex == '2') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                        { params: { sel: 'only' } })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取分类属性失败')
                    }
                    console.log(res.data)
                    this.onlyList = res.data
                }

            },
            // 处理图片预览效果
            handlePreview(file) {
                console.log(file)
                this.PreviewPath = file.response.data.url
                this.Previewvisible = true
            },
            // 处理移除图片的操作
            handleRemove(file) {
                // console.log(file)
                //1.获取将要删除图片的临时路径
                const filePath = file.response.data.tmp_path

                //2.从 pics 数组中，找到这个图片对应的索引值
                const i =
                    this.addForm.pics.findIndex(x => {
                        x.pic === filePath
                    })
                // 3.调用数组 splice方法 ，把图片信息对象，从 pics数组中移除
                this.addForm.pics.splice(i, 1)
                console.log(this.addForm)
            },
            // 监听图片上传成功的事件
            handleSuccess(response) {
                console.log(response)
                //1.拼接得到一个图片信息对象
                const picInfo = { pic: response.data.tmp_path }
                // 2.将图片信息对象，push 到pics数组中
                this.addForm.pics.push(picInfo)
                console.log(this.addForm)
            },
            // 添加商品
            addGoods() {
                // console.log(this.addForm)
                this.$refs.addFormRef.validate((async valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项')
                    }
                    // 执行添加的业务逻辑
                    //lodash choneDeep(obj)
                    const from = _.cloneDeep(this.addForm)
                    from.goods_cat = from.goods_cat.join(',')
                    // console.log(from)
                    // 处理动态参数
                    this.manyList.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals ? item.attr_vals.join() : item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    // 处理静态属性
                    this.onlyList.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    from.attrs = this.addForm.attrs
                    console.log(from)
                    // 发起请求添加商品
                    // 商品的名称必须是唯一的
                    const { data: res } = await this.$http.post('goods', from)
                    console.log(res)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加商品失败')
                    }
                    this.$message.success('添加商品成功')
                    this.$router.push('/goods')
                }))
            }


        },
        computed: {
            // 分类的id
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        },
    }
</script>
<style scoped>
    .el-card {
        margin-top: 15px;
    }

    .el-steps {
        margin: 20px 0px;
    }

    .el-step__title {
        font-size: 12px;
    }

    .el-checkbox {
        margin: 0px 10px 0px 0px !important;
    }

    .el-button {
        margin-top: 10px;
    }
</style>