<template>
  <div class="mask" @click="closeModal">
    <div class="modal-wrapper" @click.stop>
      <div class="content">
        <div class="left">
          <div class="project-name">
            {{ props.project.name }}
          </div>

          <div class="project-desc">
            {{ props.project.desc }}
          </div>
        </div>
        <div class="right">
          <div class="vote-number">
            <span>Total&nbsp;&nbsp;</span> <span>{{ total }}</span>
          </div>
          <div class="control-btns">
            <div class="control-btns-left">
              <button class="vote-ctrl" @click="resetVote()">
                <img src="@/assets/reset.svg" alt="minus" width="48" height="48" />
              </button>
              <button class="vote-ctrl" @click="changeVote(-1)">
                <img src="@/assets/minus.svg" alt="minus" width="48" height="48" />
              </button>
              <button class="vote-ctrl" @click="changeVote(1)">
                <img src="@/assets/plus.svg" alt="plus" width="48" height="48" />
              </button>
            </div>
            <button class="vote-ctrl" style="width:200px; margin-left: 12px;" @click="toggleVote()">
              <img v-if="!isVoting" src="@/assets/forward.svg" alt="minus" width="48" height="48" />
              <img v-if="isVoting" src="@/assets/stop.svg" alt="minus" width="48" height="48" />
            </button>
          </div>
        </div>
      </div>

      <button v-if="!props.isFirst" class="btn-center btn-center-left" @click="prevClick">
      </button>
      <button v-if="!props.isLast" class="btn-center btn-center-right" @click="nextClick" />
      <button class="btn-close" @click="closeModal">x</button>
    </div>
  </div>
</template>
<script setup>
import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';
import axios from '../requestor';

const props = defineProps({ project: Object, isFirst: Boolean, isLast: Boolean });

const emit = defineEmits(['modalVisible', 'changeProject']);
const isVoting = ref(false);

const total = ref(0);

const closeModal = () => {
  emit('modalVisible', false);
  stopVote();
};

const prevClick = () => {
  emit('changeProject', -1);
  stopVote();
}
const nextClick = () => {
  emit('changeProject', 1);
  stopVote();
}

const refreshVoteCount = async () => {
  try {
    const result = await axios.get(`/vote/count?pid=${props.project.pid}`);
    total.value = result.count;
  } catch (e) {
  }
}

onMounted(() => {
  refreshVoteCount();
})

watch(() => props.project, () => {
  refreshVoteCount();
})

const toggleVote = async () => {
  if (!isVoting.value) {
    startVote();
  } else {
    stopVote();
  }
}

let intervalSeq = -1;
const startVote = async () => {
  try {
    await axios.get(`/vote/start?pid=${props.project.pid}`);
    isVoting.value = true;

    intervalSeq = setInterval(() => {
      refreshVoteCount();
    }, 1000);
  } catch (e) {
    console.error(e);
  }
}

const stopVote = async () => {
  if (intervalSeq > 0) {
    clearInterval(intervalSeq);
  }
  try {
    await axios.get(`/vote/stop`);
    isVoting.value = false;
  } catch (e) {
    console.error(e);
  }
}

const resetVote = async () => {
  try {
    await axios.get(`/vote/reset?pid=${props.project.pid}`);
    total.value = 0;
  } catch (e) {
    console.error(e);
  }
}

const changeVote = async (seq) => {
  try {
    const deviceId = seq > 0 ? "admin-" + new Date().getTime() : "admin-pop";
    const result = await axios.get(`/vote/submit?deviceId=${deviceId}&pid=${props.project.pid}`);
    total.value = result.count;
  } catch (e) {
    console.error(e);
  }
}
</script>
<style lang="scss" scoped>
$padding-v: 50px;
$padding-h: 100px;
$border-radius: 24px;

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  // backdrop-filter: blur(10px);
  // -webkit-backdrop-filter: blur(20px);
}

.modal-wrapper {
  background: rgba(255, 255, 255, 0.7);
  border-radius: $border-radius;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.67);
  box-shadow: 4px 4px 8px 4px #aaa;
  width: calc(100% - $padding-h * 2);
  height: calc(100% - $padding-v * 2);
  top: $padding-v;
  left: $padding-h;
  right: $padding-h;
  bottom: $padding-v;
  position: fixed;
}

.btn-close {
  width: 100px;
  height: 100px;
  position: absolute;
  top: -16px;
  right: -12px;
  border: none;
  background-color: transparent;
  overflow: hidden;
  cursor: pointer;
  font-size: 50px;
  color: #777;
}

.btn-center {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background-color: transparent;
  text-indent: -9999px;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: "";
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    height: 100%;
    display: block;
    background-size: 100% 100%;
    transition: transform 0.3s;
  }

  &:hover::before {
    transform: scale(1.2);
  }

  &-left {
    left: 4px;

    &::before {
      background-image: url("~@/assets/caret-left.svg");
    }
  }

  &-right {
    right: 4px;

    &::before {
      background-image: url("~@/assets/caret-right.svg");
    }
  }
}

.btn-next {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
}

.content {
  display: flex;
  margin: $border-radius $border-radius;
  width: calc(100% - $border-radius * 2);
  height: calc(100% - $border-radius * 2);

  .left {
    flex: 1;
    height: 100%;
    margin-left: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .right {
    margin-left: 20px;
    margin-right: 120px;
    flex: 1.5;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .project-name {
    font-size: 50px;
    color: #333;
    font-weight: 600;
  }

  .project-desc {
    margin-top: 12px;
    font-size: 30px;
    color: #777;
    font-weight: 600;
  }

  .vote-number {
    font-size: 120px;
    color: #000;
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-btns {
    display: flex;
    height: 100px;
    width: 100%;
    justify-content: center;
    align-items: center;

    &-left :not(:first-child) {
      margin-left: 12px;
    }

    .vote-ctrl {
      width: 80px;
      height: 80px;
      border-top-left-radius: 40px;
      border-top-right-radius: 40px;
      border-bottom-left-radius: 40px;
      border-bottom-right-radius: 40px;
      border: none;
      background-color: #ccc;
      cursor: pointer;

      img:hover {
        scale: 1.2;
      }
    }
  }
}
</style>