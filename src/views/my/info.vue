<template>
  <div class="app-container personal">
    <el-row>
      <!-- 个人信息 -->
      <el-col :xs="24" :sm="16">
        <el-card shadow="hover" header="个人信息">
          <div class="personal-user">
            <div class="personal-user-left">
              <img :src="filterAvatar(userInfo.avatar)" />
            </div>
            <div class="personal-user-right">
              <el-row>
                <el-col :span="24" class="personal-title mb18"
                  >{{ currentTime }}，{{
                    userInfo.username
                  }}，生活变的再糟糕，也不妨碍我变得更好！
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">昵称：</div>
                      <div class="personal-item-value">
                        {{ userInfo.nickname }}
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">登录IP：</div>
                      <div class="personal-item-value">
                        {{ userInfo.last_login_ip }}
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">登录时间：</div>
                      <div class="personal-item-value">
                        {{ userInfo.last_login_time }}
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { defineComponent, computed, reactive, toRefs } from "vue";
import { formatAxis } from "@/landao/utils/time";
import { useBaseStore } from "@/store";
import defaultAvatar from "@/assets/img/default-avatar.png";
export default defineComponent({
  name: "personal",
  setup() {
    // 当前时间提示语
    const currentTime = computed(() => {
      return formatAxis(new Date());
    });
    const { user } = useBaseStore();
    const state = reactive({
      userInfo: user.userInfo,
    });
    function filterAvatar(avatar) {
      if (avatar == "") {
        return defaultAvatar;
      }
      return url;
    }

    return {
      currentTime,
      ...toRefs(state),
      filterAvatar,
    };
  },
});
</script>
<style scoped lang="scss">
.personal {
  .personal-user {
    height: 130px;
    display: flex;
    align-items: center;
    .personal-user-left {
      width: 100px;
      height: 100px;
      border-radius: 3px;
      ::v-deep(.el-upload) {
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
      &:hover {
        img {
          animation: logoAnimation 0.3s ease-in-out;
        }
      }
    }
    .personal-user-right {
      flex: 1;
      padding: 0 15px;
      .personal-title {
        font-size: 18px;
      }
      .personal-item {
        display: flex;
        align-items: center;
        font-size: 13px;
        .personal-item-label {
          color: var(--el-text-color-secondary);
        }
        .personal-item-value {
        }
      }
    }
  }
  .personal-info {
    .personal-info-more {
      float: right;
      color: var(--el-text-color-secondary);
      font-size: 13px;
      &:hover {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
    .personal-info-box {
      height: 130px;
      overflow: hidden;
      .personal-info-ul {
        list-style: none;
        .personal-info-li {
          font-size: 13px;
          padding-bottom: 10px;
          .personal-info-li-title {
            display: inline-block;
            color: var(--el-text-color-secondary);
            text-decoration: none;
          }
          & a:hover {
            color: var(--el-color-primary);
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
