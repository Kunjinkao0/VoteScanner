<template>
  <div class="page">
    <!-- <div class="header"></div> -->
    <div class="content">
      <div class="projects-card" v-if="showCard">
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

      <div class="project-list-wrapper" v-if="!showCard">
        <div class="projects-list">
          <div class="list-header">
            <button class="list-header-button" @click="showCard = true">
              <img src="@/assets/arrow-rotate-left.svg" width="32" height="32" />
            </button>
            <img class="list-header-logo" src="@/assets/logo-with-shade.png" height="150" />
            <button class="list-header-button">
              <img src="@/assets/file-export.svg" width="32" height="32" />
            </button>
          </div>
          <div class="list-item-wrapper">
            <transition-group name="list">
              <div class="list-item" v-for="(p, index) in projects" :key="p.pid">
                <span class="project-index">{{ index + 1 }}</span>
                <span class="project-name">{{ p.name }}</span>
                <span class="project-vote">{{ p.count }}</span>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>

    <div class="footer" v-if="showCard">
      <img class="footer-logo" src="@/assets/logo-with-shade.png" height="200" @click="showCard = false" />
    </div>

    <VoteModal v-if="detailModalVisible" @modal-visible="onModalClosed" :project="currentProject" :is-first="isFirst"
      :is-last="isLast" @change-project="changeProject($event)" />
  </div>
</template>

<script setup>
import VoteModal from './VoteModal.vue';
import { ref, onMounted } from "vue";
import axios from '../requestor';

const showCard = ref(true);

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

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.pitem {
  padding: 12px;
  font-size: 20px;
}

.page {
  height: 100%;
  background: url('~@/assets/main-bg.jpeg');
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
  height: 100%;
  width: 100%;
}

.projects-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  // padding-bottom: calc($footer-height + 40px);

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

.project-list-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.projects-list {
  color: white;
  width: 800px;
  text-align: center;
  height: 100%;
  padding-top: 40px;
  overflow-y: auto;

  .list-header {
    height: 80px;
    background-color: #000c25dd;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6);
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    &-button {
      background: transparent;
      border: none;
      transition: transform .3s;

      &:hover {
        transform: scale(1.2);

        // img {
        //   filter: drop-shadow(1000px 0 0 red);
        //   transform: translate(-1000px);
        // }
      }
    }

    &-logo {
      margin-top: -16px;
    }
  }

  .list-item-wrapper {
    height: calc(100% - 144px);
    overflow-y: auto;
    z-index: 1;
    padding-top: 24px;

    .list-item {
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.6);
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      // height: 40px;
      margin: 8px 40px;
      padding: 12px 20px;
      color: #FFF;
      font-size: 24px;
      text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;

      // &:not(:first-child) {
      //   border-top: 1px solid #ccc;
      // }

      // &:nth-of-type(1) {
      //   margin-left: 16px;
      //   margin-right: 16px;
      // }
    }

    .project-index {
      font-size: 20px;
      flex: 0 0 80px;
      text-align: left;
      color: #CCC;
    }

    .project-name {
      flex: 1;
      text-align: left;
    }

    .project-vote {
      flex: 0 0 20px;
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #000c25ee;
  height: $footer-height;
  color: #eaeaea;
  font-weight: 600;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  &-logo {
    cursor: pointer;
  }
}

// ------ animations ------
.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-enter-active {
  transition: 1s all ease;
}

.list-enter-to {
  opacity: 1;
}

.list-leave-from {
  opacity: 1;
}

.list-leave-active {
  transition: 1s all ease;
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
