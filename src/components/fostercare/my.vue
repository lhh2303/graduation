<template>
  <div>
    <span class="fontclass">寄养列表</span>
    <el-button type="primary" size="small" class="float" @click="goAdd">申请寄养</el-button>

    <!-- 添加寄养对话框 -->
    <el-dialog title="添加宠物" :visible.sync="addPetAdoptDialogVisivle" width="50%" @close="addPetAdoptDialogClose">
      <el-form :model="addPetAdoptForm" :rules="addPetAdoptFormRules" ref="addPetAdoptFormRef" label-width="100px">

        <el-form-item label="宠物分类" prop="type">
          <el-select class="select" v-model="typelevel1.typename" @change="change1leve">
            <el-option v-for="item in typelevel1 " :key="item.pt_id" :label="item.typename" :value="item.pt_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="宠物分类" prop="type_id">
          <el-select clearable size="small" class="select" v-model="typelevel2.typename" @change="change2level">
            <el-option v-for="item in typelevel2" :label="item.typename" :value="item.pt_id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="宠物名称" prop="unadopt_nickname">
          <el-select clearable size="small" class="select" v-model="unadopt_nickname.nickname" @change="change_unadopt_nickname">
            <el-option v-for="item in unadopt_nickname" :label="item.nickname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input v-model="addPetAdoptForm.price"></el-input>
        </el-form-item>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addPetAdopt(addPetAdoptForm)">确 定</el-button>
          <el-button @click="addPetAdoptDialogVisivle = false">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>


    <!-- 搜索框 -->
    <div class="seach-button">
      <el-select size="small" class="seach-select" v-model="type" @change="change">
        <el-option value="宠物种类" label="宠物种类"></el-option>
        <el-option value="寄养单号" label="寄养单号"></el-option>
      </el-select>
      <el-select size="small" class="seach-select" v-model="searchVal" v-if="type=='宠物种类'" clearable>
        <el-option value="cat" label="猫咪"></el-option>
        <el-option value="dog" label="狗狗"></el-option>
        <el-option value="pig" label="香猪"></el-option>
      </el-select>
      <el-input v-else placeholder="请输入内容" type="text" clearable size="small" class="seach-select" v-model="searchVal">
      </el-input>
      <el-button type="primary" size="small" @click="goSearch">搜索</el-button>

    </div>
    <el-table :data="tableData" stripe highlight-current-row>
      <el-table-column label="寄养单号" prop="pa_id" align="center" header-align="center"></el-table-column>
      <el-table-column label="宠物名" prop="nickname" align="center" header-align="center"></el-table-column>
      <el-table-column label="宠物种类" prop="typename" align="center" header-align="center"> </el-table-column>
      <el-table-column label="主人名称" prop="owner_id.name" align="center" header-align="center">
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.type=='cat'">猫咪</span>
          <span v-else-if="scope.row.type=='dog'">狗狗</span>
          <span v-else>香猪</span>
        </template> -->
      </el-table-column>
      <el-table-column label="寄养日期" prop="starttime" align="center" header-align="center"></el-table-column>
      <el-table-column label="寄养时长" prop="timerang" align="center" header-align="center"></el-table-column>
      <el-table-column label="金额 / 元" prop="price" align="center" header-align="center"></el-table-column>


      <el-table-column label="操作" align="center" header-align="center">
        <div slot-scope="scope">
          <el-button type="text" size="small" @click="goTolong(scope.row)"
            v-if="scope.row.carestatus=='agreed'||scope.row.carestatus=='refused'">延长</el-button>
          <el-button type="text" size="small" @click="goDel(scope.row)"
            v-if="scope.row.carestatus=='agreed'||scope.row.carestatus=='refused'">结束</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="goOver(scope.row)">删除</el-button>
        </div>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="page_no"
      :page-sizes="[10,20,50,100]" :page-size="page_size" :total="total"
      layout="total, sizes, prev, pager, next, jumper" class="fyclass"></el-pagination>

    <el-dialog title="延长寄养时间" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="延长时长：" label-width="100px" style="margin-bottom:0px;" prop="longtime">
          <el-input type="text" size="small" v-model.number="form.longtime"
            oninput="if(value.length>10)value=value.slice(0,10)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="goClear">取 消</el-button>
        <el-button type="primary" size="small" @click="goLong">确 定</el-button>
      </span>
    </el-dialog>
    <Dialog></Dialog>
  </div>
</template>

<script>
  import { mapMutations, mapState } from "vuex";
  import Dialog from "@common/dialog.vue";
  import caretable from "./caretable.vue";
  export default {
    components: {
      Dialog
    },
    data() {
      return {
        centerDialogVisible: false,
        tableData: [],
        type: "寄养单号",
        form: {
          longtime: ""
        },
        longTimeObs: "",
        searchVal: "",
        total: 0,
        page_no: 1,
        page_size: 10,
        typelevel1: [{}],
        typelevel2: [{}],
        pt_id: "",
        unadopt_nickname:[{}],
        addPetAdoptDialogVisivle: false,
        addPetAdoptForm: [{}],
        rules: {
          longtime: [{ type: "number", message: "时长必须为数字值" }]
        }
      };
    },
    created() {
      this.goQuery();
      this.type1()
    },
    computed: {
      computed: mapState(['pt_id']),
    },
    methods: {
      ...mapMutations(["setpt_id"]),
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
            console.log(res)
            this.typelevel2 = res.data
            // console.log(this.typelevel2)
          })
      },
      change1leve(val) {
        // console.log(val)
       
        this.setpt_id({ pt_id: val })
        this.type2(val)
      },
      change2level(val) {
        // await this.axios.
         this.addPetAdoptForm.petType=val
        
        this.pt_id = this.$store.state.pt_id.pt_id
        this.axios
          .get(`/adopt/petsunadoptlist/petsunadoptlist`, {
            params:{
              type_pid:this.pt_id,
              type_id:val
            }
          })
          .then(res => {
            console.log(res)
             this.unadopt_nickname = res.data
            // console.log(this.typelevel2)
          })
      },
      change_unadopt_nickname(val){
        this.addPetAdoptForm.petId =val
      },
      async addPetAdopt(addPetAdoptForm){
        console.log(addPetAdoptForm)
        const res= await this.axios.post(`/adopt/add/${addPetAdoptForm.petId}`,{
          'petType':this.addPetAdoptForm.petType,
          'price':this.addPetAdoptForm.price
        })
        if(res.status==200){
          this.$message.success("添加成功")
          this.goQuery()
          this.addPetAdoptDialogVisivle = false
        }
      },
      makeQuery() {
        let query = {
          page_no: this.page_no,
          page_size: this.page_size,
          username: this.$store.state.username
        };

        if (this.searchVal != "" && this.searchVal != null) {
          if (this.type == "寄养单号") {
            query.careid = this.searchVal;
          } else if (this.type == "宠物种类") {
            query.pettype = this.searchVal;
          }
        }
        return query;
      },
      goQuery() {
        // const query = this.makeQuery();
        this.axios
          .get("/adopt", {
          })
          .then(res => {
            // if (res.data.success) {
            //   var results = res.data;
            //   this.tableData = results.message;
            //   this.total = results.total;
            //   for (let i in this.tableData) {
            //     this.tableData[i].starttime = this.moment(
            //       this.tableData[i].starttime
            //     ).format("YYYY-MM-DD");
            //   }
            // }
            if (res.status == 200) {
              this.tableData = res.data
            }
          });
      },
      goDel(row) {
        this.$confirm("您确定要提前结束寄养?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.axios
              .put("/api/caretable/long_back", {
                careid: row.careid,
                type: "back"
              })
              .then(res => {
                if (res.data.success) {
                  this.$message.success("您已成功提交结束申请，请等待管理员处理");
                  this.goQuery();
                }
              });
          })
          .catch(() => { });
      },
      goTolong(row) {
        this.centerDialogVisible = true;
        this.longTimeObs = row;
      },
      goLong() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.axios
              .put("/api/caretable/long_back", {
                careid: this.longTimeObs.careid,
                longtime: this.form.longtime,
                type: "long"
              })
              .then(res => {
                if (res.data.success) {
                  this.centerDialogVisible = false;
                  this.$refs["form"].resetFields();
                  this.$message.success("您已成功提交延长申请，请等待管理员处理");
                  this.goQuery();
                }
              });
          } else {
            return false;
          }
        });
      },
      goOver(row) {
        console.log(row)
        this.$confirm("您确定要取消寄养申请?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.axios
              .delete(`/adopt/remove/${row.petId}`, {
              })
              .then(res => {
                if (res.status == 200) {
                  this.$message.success("您已成功取消申请！");
                  this.goQuery();
                }
              });
          })
          .catch(() => { });
      },
      goSearch() {
        this.page_no = 1;
        this.goQuery();
      },
      goAdd() {
        // this.Dialog.title("我要寄养")
        //   .width("600px")
        //   .currentView(caretable, {})
        //   .then(data => {
        //     this.goQuery();
        //   })
        //   .show();
        this.addPetAdoptDialogVisivle = true
      },
      sizeChangeHandle(val) {
        this.page_size = val;
        this.goQuery();
      },
      currentChangeHandle(val) {
        this.page_no = val;
        this.goQuery();
      },
      change() {
        this.searchVal = "";
      },
      goHistory() {
        this.$router.push("historyCare");
      },
      goClear() {
        this.longTimeObs = "";
        this.centerDialogVisible = false;
        this.$refs["form"].resetFields();
      }
    },
  };
</script>

<style scoped>
  .float {
    float: right;
  }

  .seach-select {
    width: 200px;
    display: inline-block;
    margin-right: 10px;
    vertical-align: bottom;
  }

  .seach-button {
    margin: 20px 0 10px 0;
  }
</style>