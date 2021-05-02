<template>
    <div id="user">
         <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
            <el-table-column label="用户名" prop="nickname">
            </el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-row>
                        <el-col :span="19">
                            <el-input v-model="search" placeholder="输入姓名搜索"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="success" @click="searchData">搜索</el-button>
                        </el-col>
                    </el-row>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row, 'upd')">编辑
                    </el-button>
                    <el-button slot="reference" size="mini" type="danger"
                        @click="handleEdit(scope.$index, scope.row , 'del')">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
        </el-pagination>
    </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                
                list: [],
                tableData: [],
                search: '',
                currentPage: 1,
                pageSize: 10,
                totalNum: 100,
            };
        },
        created() {
            console.log("初始化...");
            this.gettableData();
        },
        methods: {
            gettableData() {
                this.axios.get('/pets/petlist/petlist/petlist'
                ).then((res) => {
                    console.log(res.data);
                    //后台返回结果对象赋值tableData
                    this.tableData = res.data;
                    //实现分页逻辑
                    this.getList();
                }).catch(function (error) {
                    console.log(error);
                    this.$message.error('获取用户信息失败');
                });
            },
            //调用同步方法，后面解释
            async gettableDataTmp() {
                return await this.axios.get('/pets/petlist/petlist/petlist'
                ).then((res) => {
                    console.log(res.data);
                    this.tableData = res.data
                }).catch(function (error) {
                    console.log(error);
                    this.$message.error('获取用户信息失败');
                });
            },
            //该方法也相应改为同步，否则this.gettableDataTmp()会有错误提示。
            async getList() {
                //条件查询时先获取全部信息
                await this.gettableDataTmp();
                console.log('this.tableData总记录数为=' + this.tableData);
                //前端过滤条件查询信息
                let list = this.tableData.filter(data => !this.search || data.nickname.toLowerCase().includes(this.search.toLowerCase()));
                console.log('list条件查询后为=' + list);
                //二次赋值
                this.tableData = list;
                console.log('this.tableData最终赋值为=' + this.tableData);
                list.filter((item, index) => index < this.currentPage * this.pageSize && index >= this.pageSize * (this.currentPage - 1));
                this.totalNum = list.length
            },
            handleSizeChange(val) {
                console.log('每页' + val + '条');
                this.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                console.log('当前页:' + val);
                this.currentPage = val;
                this.getList();
            },
            //搜索方法
            searchData() {
                this.currentPage = 1;
                this.getList();
            }
        }
    };
</script>