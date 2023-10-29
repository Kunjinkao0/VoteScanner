<template>
  <div class="page">
    <!-- <div class="header"></div> -->
    <div class="content">
      <div class="projects">
        <div class="card-wrapper" v-for="(p, index) in projects">
          <div class="card" @click="openProjectDetail(p, index)">
            <div class="project-name">{{ p.name }}</div>
            <div class="project-vote">{{ p.count }}</div>
          </div>
          <!-- <div v-if="p.count > 0" class="card-badge">
            <img v-if="index === 0" :src="require('@/assets/gold-medal.png')" width="72" height="72"
              style="margin-top: -4px;">
            <img v-if="index === 1" :src="require('@/assets/silver-medal.png')" width="60" height="60"
              style="margin-top: -4px; margin-right: 4px;">
            <img v-if="index === 2" :src="require('@/assets/bronze-medal.png')" width="48" height="48"
              style="margin-top: -4px;">
            <img v-if="index >= 3 && index <= 9" :src="require('@/assets/winner.png')" width="40" height="40"
              style="margin-top: 2px;">
          </div> -->
        </div>
      </div>
    </div>

    <div class="footer">
      <img src="@/assets/logo-with-shade.png" height="200" />
    </div>

    <transition name="fade" mode="out-in">
      <VoteModal v-if="detailModalVisible" @modal-visible="onModalClosed" :project="currentProject" :is-first="isFirst"
        :is-last="isLast" @change-project="changeProject($event)" />
    </transition>
  </div>
</template>

<script setup>
import VoteModal from './VoteModal.vue';
import { ref, onMounted } from "vue";
import axios from '../requestor';

onMounted(() => {
  getProjects();
  getVoteResults();
})

const getProjects = async () => {
  const result = await axios.get('/api/project/all');
  projects.value = result;
}

const getVoteResults = async () => {
  const result = await axios.get('/api/vote/result');
  const combined = projects.value.map(p => {
    return { ...p, count: result.find(r => r.pid === p.pid).count }
  });
  const sorted = combined.filter(p => p.count > 0).sort((a, b) => b.count - a.count);
  const unvoted = combined.filter(p => p.count == 0);
  projects.value = [...sorted, ...unvoted];
}

const onModalClosed = () => {
  detailModalVisible.value = false;
  getVoteResults();
}

const detailModalVisible = ref(false);

const projects = ref([]);

const currentProject = ref(null);
const isFirst = ref(false);
const isLast = ref(false);

const openProjectDetail = (p, index) => {
  const ps = projects.value;
  isFirst.value = index === 0;
  isLast.value = index === ps.length - 1;
  currentProject.value = p;
  detailModalVisible.value = true;
}

const changeProject = (accum) => {
  const ps = projects.value;
  const newIdx = ps.findIndex(p => p === currentProject.value) + accum;
  isFirst.value = newIdx === 0;
  isLast.value = newIdx === ps.length - 1;
  currentProject.value = ps[newIdx];
}
</script>

<style lang="scss" scoped>
$footer-height: 100px;
$nth: 5;

ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pitem {
  padding: 12px;
  font-size: 20px;
}

.page {
  height: 100vh;
  background: url('~@/assets/main-bg.jpeg');
  overflow: hidden;
}

.header {
  height: 60px;
  background-color: #333;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  align-items: center;
  overflow-y: auto;
  height: 100%;
  padding-bottom: $footer-height;
  margin-bottom: $footer-height;
}

.projects {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;

  .card-wrapper {
    width: calc(100% / $nth);
    position: relative;

    .card-badge {
      top: 24px;
      right: 32px;
      position: absolute;
    }

    .card {
      padding: 20px;
      margin: 20px;
      min-height: 300px;
      cursor: pointer;
      // background-color: #eaeaea;
      // border-radius: 20px;
      // border: 0.5px solid rgba(200, 200, 200, 0.3);
      // box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
      // transition: box-shadow .3s;
      display: flex;
      flex-direction: column;
      background: url('~@/assets/bg-card.png');
      background-size: 100% 100%;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
      border-radius: 25px;
      transition: transform .2s ease, box-shadow .2s ease;

      &:hover {
        box-shadow: 4px 8px 10px rgba(0, 0, 0, 0.7);
        transform: translateY(-4px);
      }
    }
  }

  .project-name {
    font-weight: 600;
    text-align: center;
    color: #fff;
    text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
  }

  .project-vote {
    height: 100%;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    font-size: 80px;
    font-weight: 600;
    color: #fff;
    text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
  }
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #000c25cc;
  height: $footer-height;
  color: #eaeaea;
  font-weight: 600;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  .control-btn {
    width: 200px;
    height: 80px;
  }
}

.current {
  display: flex;
  padding: 20px;
  width: 100%;
  height: 100%;

  &-proj {
    display: 1;
    font-size: 60px;
    display: flex;
    width: 0;
    flex: 0.4;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  &-count {
    display: 1;
    width: 0;
    flex: 0.6;
    font-size: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}
</style>
