<template>
  <div class="mask" @click="closeModal">
    <div class="modal-wrapper" @click.stop>
      <div class="content">
        <div class="details">
          <div class="left">
            <div class="project-name">
              {{ props.project.name }}
            </div>

            <div class="project-desc">
              {{ props.project.desc }}
            </div>

            <div>
              <image class="project-cover" :src="coverImg" />
            </div>
          </div>
          <div class="right">
            <div class="vote-number">
              <span class="vote-number-frame">{{ total }}</span>
            </div>
          </div>
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
          <button class="vote-ctrl" style="width:400px; margin-left: 100px;" @click="toggleVote()">
            <img v-if="!isVoting" src="@/assets/start.svg" alt="minus" width="48" height="48" />
            <img v-if="isVoting" src="@/assets/stop.svg" alt="minus" width="48" height="48" />
          </button>
        </div>
      </div>

      <button v-if="!props.isFirst" class="btn-center btn-center-left" @click="prevClick">
        <img src="@/assets/caret-left.svg" alt="Previous" width="48" height="48" />
      </button>
      <button v-if="!props.isLast" class="btn-center btn-center-right" @click="nextClick">
        <img src="@/assets/caret-right.svg" alt="minus" width="48" height="48" />
      </button>
      <button class="btn-close" @click="closeModal">
        <img src="@/assets/close.svg" alt="Close" width="48" height="48" />
      </button>
    </div>
  </div>
</template>
<script setup>
import { defineEmits, defineProps, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import axios from '../requestor';

const props = defineProps({ project: Object, isFirst: Boolean, isLast: Boolean });

const emit = defineEmits(['modalVisible', 'changeProject']);
const isVoting = ref(false);

const total = ref(0);

const coverImg = ref(require('@/assets/logo-with-shade.png'));

const closeModal = () => {
  emit('modalVisible', false);
  stopVote();
};

const prevClick = () => {
  if (props.isFirst) return;
  emit('changeProject', -1);
  stopVote();
}
const nextClick = () => {
  if (props.isLast) return;
  emit('changeProject', 1);
  stopVote();
}

const refreshVoteCount = async () => {
  try {
    const result = await axios.get(`/api/vote/count?pid=${props.project.pid}`);
    total.value = result.count;
  } catch (e) {
  }
}

onMounted(() => {
  refreshVoteCount();
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

watch(() => props.project, () => {
  refreshVoteCount();
});

const handleKeyPress = (event) => {
  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'ArrowLeft') {
    prevClick();
  } else if (event.key === 'ArrowRight') {
    nextClick();
  }
}

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
    await axios.get(`/api/vote/start?pid=${props.project.pid}`);
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
    await axios.get(`/api/vote/stop`);
    isVoting.value = false;
  } catch (e) {
    console.error(e);
  }
}

const resetVote = async () => {
  try {
    await axios.get(`/api/vote/reset?pid=${props.project.pid}`);
    total.value = 0;
  } catch (e) {
    console.error(e);
  }
}

const changeVote = async (seq) => {
  try {
    const deviceId = seq > 0 ? "admin-" + new Date().getTime() : "admin-pop";
    const result = await axios.get(`/api/vote/submit?deviceId=${deviceId}&pid=${props.project.pid}`);
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
  top: 0;
  background-color: rgba(50, 50, 50, 0.8);
  // background-color: #fff;
}

.modal-wrapper {
  border-image-source: url('~@/assets/bg-modal.png');
  border-image-slice: 100 fill;
  border-image-width: 80px 120px;
  border-image-outset: 0;

  backdrop-filter: blur(20px);
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.9);
  // box-shadow: 8px 8px 20px red; // test
  border-radius: $border-radius;
  width: calc(100% - $padding-h * 2);
  height: calc(100% - $padding-v * 2);
  top: $padding-v;
  left: $padding-h;
  right: $padding-h;
  bottom: $padding-v;
  position: fixed;

  .content {
    margin: $border-radius $border-radius;
    width: calc(100% - $border-radius * 2);
    height: calc(100% - $border-radius * 2);
    position: relative;

    .details {
      display: flex;
      height: 100%;

      .left {
        flex: 1.2;
        height: 100%;
        margin-left: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .project-name {
          font-size: 50px;
          font-weight: 600;
          color: #fff;
          text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
        }

        .project-desc {
          margin-top: 12px;
          font-size: 30px;
          color: #777;
          font-weight: 600;
        }
      }

      .right {
        margin-left: 20px;
        margin-right: 120px;
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .vote-number {
          font-size: 120px;
          width: 100%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);

          &-frame {
            border: 1px dashed #ccc;
            width: 320px;
            height: 240px;
            line-height: 240px;
            text-align: center;
          }
        }
      }
    }

    .control-btns {
      position: absolute;
      bottom: 0;
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
        // border: none;
        // background-color: #ccc;
        cursor: pointer;
        background: #aaa;
        border: 4px solid #aaa;

        img:hover {
          scale: 1.2;
        }
      }
    }
  }
}

.btn-close {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 4px;
  right: 4px;
  border: none;
  background-color: transparent;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transition: transform 0.3s;
    transform: scale(1.2);
  }
}

.btn-center {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background-color: transparent;
  cursor: pointer;

  img:hover {
    transition: transform 0.3s;
    transform: scale(1.2);
  }

  &-left {
    left: 16px;
  }

  &-right {
    right: 16px;
  }
}
</style>