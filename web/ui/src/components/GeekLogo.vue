<template>
  <div class="text" :class="{ glitch: showGlitch }" :data-text="text">
    {{ text }}
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const text = ref("Powered by GeekIoT");
const showGlitch = ref(false);
let timer = -1;
onMounted(() => {
  timer = setInterval(() => {
    const show = Math.random() > 0.4;
    showGlitch.value = show;
  }, 3000);
});

onUnmounted(() => {
  clearInterval(timer);
})
</script>

<style lang="scss" scoped>
.text {
  color: #eee;
  font-family: "Fira Code", monospace, Arial, Helvetica, sans-serif;
  font-size: 2rem;
  letter-spacing: 0.5em;
}

@mixin flex-center($direction: row) {
  align-items: center;
  display: flex;
  flex-direction: $direction;
  justify-content: center;
}

@mixin sizer($width, $height: $width) {
  height: $height;
  width: $width;
}

@mixin glitchCopy {
  content: attr(data-text);
  @include sizer(100%);
  left: 0;
  position: absolute;
  top: 0;
}

.glitch {
  animation: glitch-skew 1s infinite linear alternate-reverse;
  // background: rgba($color: #000000, $alpha: 0.7);
  position: relative;

  &::before {
    animation: glitch-anim 2s infinite linear alternate-reverse;
    clip: rect(44px, 450px, 56px, 0);
    @include glitchCopy;
    left: 2px;
    text-shadow: -2px 0 #ff00c1;
  }

  &::after {
    animation: glitch-anim2 3s infinite linear alternate-reverse;
    @include glitchCopy;
    left: -2px;
    text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
  }
}

@keyframes glitch-anim {
  $steps: 20;

  @for $i from 0 through $steps {
    #{percentage($i*(calc(1 / $steps)))} {
      clip: rect(random(100) + px, 9999px, random(100) + px, 0);
      transform: skew(calc(random(100) / 100) + deg);
    }
  }
}

@keyframes glitch-anim2 {
  $steps: 20;

  @for $i from 0 through $steps {
    #{percentage($i*(calc(1 / $steps)))} {
      clip: rect(random(100) + px, 9999px, random(100) + px, 0);
      transform: skew(calc(random(100) / 100) + deg);
    }
  }
}

@keyframes glitch-skew {
  $steps: 10;

  @for $i from 0 through $steps {
    #{percentage($i*(calc(1 / $steps)))} {
      transform: skew((random(10) - 5) + deg);
    }
  }
}
</style>