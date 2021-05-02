<template>
  <div>
    <!-- <el-row :gutter="20">
        <el-col span="8">
            
        </el-col>
    </el-row> -->
    <div class="pet-button-box">
      <div style="display:inline-block;">
        <el-button type="primary" size="small" @click="showAddPetsDialog">添加宠物</el-button>
        <el-button type="primary" size="small" @click="goSeeIn">查看在售</el-button>
      </div>

      <div>
        <!-- <el-select size="small" class="select" v-model="search_type" @change="change">
          <el-option value="姓名" label="姓名"></el-option>
          <el-option value="状态" label="状态"></el-option>
          <el-option value="种类" label="种类"></el-option>
        </el-select> -->

        <el-input  placeholder="请输入搜索内容" v-model="search" type="text" size="small" clearable
          class="select"></el-input>
        <!-- <el-select v-else clearable size="small" class="select" v-model="searchData">
          <el-option v-if="search_type=='种类'" value="cat" label="猫咪"></el-option>
          <el-option v-if="search_type=='种类'" value="dog" label="狗狗"></el-option>
          <el-option v-if="search_type=='种类'" value="pig" label="香猪"></el-option>
          <el-option v-if="search_type=='状态'" value="saling" label="在售"></el-option>
          <el-option v-if="search_type=='状态'" value="caring" label="寄养"></el-option>
        </el-select> -->
        <el-button type="primary" size="small" @click="searchData">搜索</el-button>
      </div>


    </div>

    <!-- 宠物信息 -->
    <div v-if="tableData.length!=0">
      <div class="pet-list-box" @click="goDetail(item)" v-for="(item,index) in tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" :key="index">
        <span class="pet-info">{{item.nickname}}</span>
        <el-image class="pet-picture" :src="item.picture" fit="fill"></el-image>
        <span class="pet-title">{{item.name}}</span>
        <div class="pet-info-box">
          <span class="pet-info">{{item.variety}}</span>
          <span class="pet-info">{{item.age}}</span>
        </div>
        <div class="pet-info-box">
          <span class="pet-info" v-if="item.isadopt=='0'">在售</span>
          <span class="pet-info" v-else>寄养中</span>
        </div>
      </div>


      <!-- 详情对话框 -->

      <el-dialog :dialogTitle="dialogTitle" :visible.sync="dialogVisible" @updateVisible="updateVisible"
        @resetPopupData="resetPopupData" @submitPopupData="submitPopupData" @handleClose="handleClose"
        :popupWidth="'550px'">
        <!-- <div style="height:150px;font-size:16px;color:#3c4354;font-family:PingFangSC-Medium;"> -->
        <div class="pet-info ">
          <el-form :model="dialogInfo" :rules="addPetFormRules" ref="dialogInfoRef" label-width="100px">
            <el-form-item label="宠物年龄" prop="age">
              <el-input v-model="dialogInfo.age"></el-input>
            </el-form-item>
            <el-form-item label="宠物姓名" prop="nickname">
              <el-input v-model="dialogInfo.nickname"></el-input>
            </el-form-item>

            <el-form-item label="主人姓名" prop="owner_id">
              <el-input v-model="dialogInfo.owner_id"></el-input>
            </el-form-item>

            <el-form-item label="宠物分类" prop="type">
              <el-select class="select" v-model="dialogInfo.type.typename" @change="change">
                <el-option v-for="item in typelevel1 " :key="item.pt_id" :label="item.typename" :value="item.pt_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="宠物分类" prop="type_id">
              <el-select clearable size="small" class="select" v-model="dialogInfo.type.type" @change="change2">
                <el-option v-for="item in typelevel2" :label="item.typename" :value="item.pt_id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否疫苗" prop="isvaccin">
              <el-radio-group v-model="dialogInfo.isvaccin">
                <el-radio :label="1" value="1">是</el-radio>
                <el-radio :label="0" value="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="是否寄养" prop="isadopt">
              <el-radio-group v-model="dialogInfo.isadopt">
                <el-radio :label="1" value="1">是</el-radio>
                <el-radio :label="0" value="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item class='fyclass'>
              <el-button  type="primary" @click="edit(dialogInfo)">确 定</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="danger" @click="remove(dialogInfo.id)">删除</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>

    <el-card class="box-card pet-card-box" v-else>
      <div slot="header" class="clearfix">
        <span>告示</span>
      </div>
      <p>暂无符合搜索要求的宠物</p>
    </el-card>



    <!--添加宠物弹框  -->
    <el-dialog title="添加宠物" :visible.sync="addPetDialogVisivle" width="50%" @close="addPetDialogClose">
      <!-- 添加分类表单 -->
      <el-form :model="addPetForm" :rules="addPetFormRules" ref="addPetFormRef" label-width="100px">
        <el-form-item label="宠物年龄" prop="age">
          <el-input v-model="addPetForm.age"></el-input>
        </el-form-item>
        <el-form-item label="宠物姓名" prop="nickname">
          <el-input v-model="addPetForm.nickname"></el-input>
        </el-form-item>

        <el-form-item label="主人姓名" prop="owner_id">
          <el-input v-model="addPetForm.owner_id"></el-input>
        </el-form-item>

        <el-form-item label="宠物分类" prop="type">
          <el-select class="select" v-model="typelevel1.typename" @change="change">
            <el-option v-for="item in typelevel1 " :key="item.pt_id" :label="item.typename" :value="item.pt_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="宠物分类" prop="type_id">
          <el-select clearable size="small" class="select" v-model="typelevel2.typename" @change="change2">
            <el-option v-for="item in typelevel2" :label="item.typename" :value="item.pt_id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否疫苗" prop="isvaccin">
          <el-radio-group v-model="addPetForm.isvaccin">
            <el-radio :label="1" value="1">是</el-radio>
            <el-radio :label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否寄养" prop="isadopt">
          <el-radio-group v-model="addPetForm.isadopt">
            <el-radio :label="1" value="1">是</el-radio>
            <el-radio :label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addPet(addPetForm)">确 定</el-button>
          <el-button @click="addPetDialogVisivle = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分页栏 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
    :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
    :total="totalNum" class="fyclass">
</el-pagination>
  </div>

</template>

<script>
  // import Dialog from "@common/dialog.vue";
  import PetDialog from "@common/PetDialog.vue"

  import detail from "./detail.vue";
  import Util from "@assets/Util.js";
  export default {
    components: {
      // Dialog
      PetDialog
    },
    name: "index",
    data() {
      return {
        pt_id: "",
        pet_type: '',

        money1: "",
        money2: "",
        // page_no: 1,

        seeOut: false,
        typelevel1: [{}],
        typelevel2: [{}],

        collectObs: [],
        flag: false,
        queryInfo: {
          offset: 0,
          size: 10
        },


        list: [],
        tableData: [],
        search: '',
        currentPage: 1,
        pageSize: 10,
        totalNum: 100,

        filterTableDataEnd: [{}],
        dialogVisible: false, // 弹框的出现与否
        dialogTitle: '宠物详情', // 标题
        // 对话框宠物信息
        dialogInfo: {
          "age": '',
          "owner_id": '',
          "type": '',
          "type_id": '',
          "nickname": "",
          "isvaccin": "",
          "isadopt": ""
        },
        // 添加宠物弹框信息
        addPetDialogVisivle: false,
        addPetForm: {
          "age": '',
          "owner_id": '',
          "type": '',
          "type_id": '',
          "nickname": "",
          "isvaccin": "",
          "isadopt": ""
        },
        addPetFormRules: {
          age: [
            { required: true, message: '请输入年龄', trigger: 'blur' },
          ],
          nickname: [
            { required: true, message: '请输入宠物姓名', trigger: 'change' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          // owner_id: [
          //   { required: true, message: '请输入宠物主人姓名', trigger: 'change' },
          //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          // ],
          type: [
            { required: true, message: '请选择宠物分类', trigger: "blur" }
          ],
          type_id: [
            { required: true, message: '请选择宠物品种', trigger: "blur" }
          ],
          isvaccin: [
            { required: true, message: '请选择是否接种疫苗', trigger: "change" }
          ],
          isadopt: [
            { required: true, message: '请选择是否寄养', trigger: "change" }
          ],

        }
      };
    },
    created() {
      // 渲染宠物列表
      // this.goQuery();
      this.type1()
      // this.getPetList();
      // this.type2()
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
        console.log(this.search)
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
      },
      // 获得一级分类s
      type1() {
        this.axios
          .get("/pets/firsttype/firsttype", {
          })
          .then(res => {
            // /console.log(res)
            this.typelevel1 = res.data
            console.log(this.typelevel1)
          })

      },
      type2(val) {
        // console.log(val)
        this.axios
          .get(`/pets/secondetype/${val}`, {
          })
          .then(res => {

            this.typelevel2 = res.data
            // console.log(this.typelevel2)
          })
      },
      type22(val) {
        this.axios
          .get(`/pets/secondetype/${val}`, {
          })
          .then(res => {
            console.log(res)
            // this.typelevel2 = res.data
            // console.log(this.typelevel2)
          })
      },
      change(val) {
        console.log(val)
        this.addPetForm.type = val
        this.dialogInfo.type = val
        this.type2(val)
      },
      change2(val) {
        console.log(val)
        this.addPetForm.type_id = val
        this.dialogInfo.type_id = val
      },
      editchange(val) {
        this.type22()
      },
      // 创建宠物
      addPet(addPetForm) {
        console.log(addPetForm)
        // this.$refs[addPetForm].resetFields();
        this.axios
          .post("/pets/add",
            {
              "age": this.addPetForm.age,
              "owner_id": this.addPetForm.owner_id,
              "type": this.addPetForm.type,
              "type_id": this.addPetForm.type_id,
              "nickname": this.addPetForm.nickname,
              "isvaccin": this.addPetForm.isvaccin,
              "isadopt": this.addPetForm.isadopt,
            }).then(res => {
              if (res.data.meta.status == 200) {
                this.$message.success("添加成功")
                this.goQuery()
                this.addPetDialogVisivle = false
              }
              else {
                this.$message.error("请仔细检查必选项！")
              }
            })
      },
      async edit(dialogInfo) {
        console.log(dialogInfo)
        const res = await this.axios.put(`/pets/${dialogInfo.id}`, {
          "age": dialogInfo.age,
          "owner_id": dialogInfo.owner_id,
          "type": dialogInfo.type,
          "type_id": dialogInfo.type_id,
          "nickname": dialogInfo.nickname,
          "isvaccin": dialogInfo.isvaccin,
          "isadopt": dialogInfo.isadopt
        })
        console.log(res)
        if (res.status == 200) {
          this.$message.success("修改成功")
          this.goQuery()
          this.dialogVisible = false
        } else {
          this.dialogVisible = false
        }
      },
      async remove(id) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const res = this.axios.delete(`/pets/${id}`)
          this.$message.success('删除成功')
          this.goQuery()
          this.dialogVisible = false
        })
      },
      
      currentChangePage(list) {
        let from = (this.currentPage - 1) * this.pageSize;
        let to = this.currentPage * this.pageSize;
        this.tableData = [];
        for (; from < to; from++) {
          if (list[from]) {
            this.tableData.push(list[from]);
          }
        }
      },
      goSeeIn() {
        this.page_no = 1;
        this.seeOut = false;
        this.money1 = "";
        this.money2 = "";
        this.goQuery();
      },
      // `/pets/secondetype/${val}`
      async goDetail(row) {
        this.dialogVisible = true
        this.dialogInfo.id = row.id
        const res = await this.$axios.get(`/pets/${row.id}`)
        // console.log(res.data)
        if (res.status == 200) {
          this.dialogInfo.age = res.data.age
          this.dialogInfo.nickname = res.data.nickname
          this.dialogInfo.isadopt = res.data.isadopt
          this.dialogInfo.isvaccin = res.data.isvaccin
          this.dialogInfo.type = res.data.type
          this.dialogInfo.owner_id = res.data.owner_id
          // console.log(this.dialogInfo)
        }
        // console.log(this.dialogInfo)

      },
      updateVisible(val) {
        this.dialogVisible = val
      },
      // 点击取消的事件
      resetPopupData() {
        //  这里可重置数据
        this.dialogVisible = false
      },
      // 点击确定的按钮
      submitPopupData() {
        this.dialogVisible = false
      },
      // 关闭对话框
      addPetDialogClose() {
        this.$refs.addPetForm.resetFields()
      },
      // 关闭弹框（头部的X）
      handleClose() {
        this.dialogVisible = false
      },
      showAddPetsDialog() {
        this.addPetDialogVisivle = true
      },

      
    }
  };
</script>

<style scoped>
  .inputwidth {
    height: 32px;
    line-height: 32px;
    width: 70px;
  }

  .pet-shopcar {
    cursor: pointer;
    position: absolute;
    display: none;
  }

  .pet-collect {
    float: right;
    padding: 2px 5px;
  }

  .pet-list-box:hover .pet-shopcar {
    display: block;
  }

  .pet-picture {
    width: 100px;
    height: 100px;
    display: block;
    border-radius: 50px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    transition: all 0.6s;
  }

  .pet-list-box .pet-picture:hover {
    transform: scale(1.4);
  }

  .pet-title {
    font-size: 30px;
    font-family: "jelly";
    color: #67b4fc;
    display: block;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
  }

  .pet-info {
    color: #6e6b6b;
    font-family: "jelly";
    font-size: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pet-info-box {
    display: flex;
    line-height: 25px;
    justify-content: space-between;
    padding-right: 10px;
  }

  .pet-list-box {
    cursor: pointer;
    width: 200px;
    height: 220px;
    border: 1px solid #dddddd;
    display: inline-block;
    padding-left: 20px;
    padding-right: 10px;
    margin-right: 24px;
    padding-top: 5px;
    margin-top: 30px;
  }

  .pet-button-box {
    display: flex;
    justify-content: space-between;
    margin-right: 20px;
  }

  .pet-card-box {
    width: 300px;
    text-align: center;
    margin: 50px auto;
  }

  .select {
    width: 200px;
    margin-right: 10px;
  }
</style>