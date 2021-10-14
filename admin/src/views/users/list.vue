<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.userName"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
      >
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录名称">
        <template slot-scope="scope" align="center">
          {{ scope.row.account }}
        </template>
      </el-table-column>

      <el-table-column label="用户名" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80px" align="center">
        <template slot-scope="scope">
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="120">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleModifyStatus(row)"
          >
          </el-switch>
          {{ row.enabled ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createDate | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="330"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status !== 'deleted'"
            size="mini"
            type="warning"
            @click="handleResetPassword(row)"
          >
            重置密码
          </el-button>
          <el-button
            v-if="!row.enabled"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getUserList,
  modifyState,
  removeUser,
  resetPassword
} from "@/api/users";
import Pagination from "@/components/Pagination/index.vue";
// import { IArticleData } from "@/api/types";

@Component({
  name: "Table",
  components: {
    Pagination
  },
  filters: {
    statusFilter: (status: string) => {
      const statusMap: { [key: string]: string } = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      let _status = status ? "published" : "deleted";
      return statusMap[_status];
    }
  }
})
export default class extends Vue {
  private list = [];
  private listLoading = true;
  private total = 0;
  private listQuery = {
    pageIndex: 1,
    pageSize: 20,
    account: "",
    userName: ""
  };

  created() {
    this.getList();
  }
  private async getList() {
    this.listLoading = true;
    const { data } = await getUserList(this.listQuery);
    this.list = data.records;
    this.total = data.total;
    setTimeout(() => {
      this.listLoading = false;
    }, 0.5 * 1000);
  }

  private handleFilter() {
    this.listQuery.pageIndex = 1;
    this.getList();
  }
  private handleUpdate(row: any) {
    // this.tempArticleData = Object.assign({}, row)
    // this.tempArticleData.timestamp = +new Date(this.tempArticleData.timestamp)
    // this.dialogStatus = 'update'
    // this.dialogFormVisible = true
    // this.$nextTick(() => {
    //   (this.$refs.dataForm as Form).clearValidate()
    // })
  }
  private async handleModifyStatus(row: any) {
    await modifyState({ userId: row.userId });
    await this.getList();
    this.$message({
      message: "操作成功",
      type: "success"
    });
  }

  private async handleResetPassword(row: any) {
    await resetPassword({ userId: row.userId });
    await this.getList();
    this.$message({
      message: "操作成功",
      type: "success"
    });
  }

  private async handleDelete(row: any) {
    this.$confirm("此操作将永久删除, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true
    })
      .then(async () => {
        await removeUser({ userId: row.userId });
        await this.getList();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
}
</script>
