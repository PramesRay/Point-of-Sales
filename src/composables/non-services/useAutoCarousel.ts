import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

export function useAutoCarousel(sortedIncomes: any) {
  const currentSlide = ref(0);
  const totalSlides = ref(0);
  const direction = ref<'forward' | 'backward'>('forward');
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let pauseTimeout: ReturnType<typeof setTimeout> | null = null;
  let paused = false;

  watch(sortedIncomes, (newVal) => {
    totalSlides.value = Object.keys(newVal).length;
  });

  const pauseAutoScroll = () => {
    paused = true;
    clearInterval(intervalId!);
    clearTimeout(pauseTimeout!);

    pauseTimeout = setTimeout(() => {
      paused = false;
      startAutoScroll();
    }, 5000); // Delay 5 detik setelah swipe
  };

  const startAutoScroll = () => {
    clearInterval(intervalId!);
    if (!paused) {
      intervalId = setInterval(() => {
        if (totalSlides.value > 0) {
          if (direction.value === 'forward') {
            if (currentSlide.value < totalSlides.value - 1) {
              currentSlide.value += 1;
            } else {
              direction.value = 'backward';
              currentSlide.value -= 1;
            }
          } else {
            if (currentSlide.value > 0) {
              currentSlide.value -= 1;
            } else {
              direction.value = 'forward';
              currentSlide.value += 1;
            }
          }
        }
      }, 5000);
    }
  };

  const resumeAutoScroll = () => {
    if (paused) {
      paused = false;
      startAutoScroll();
    }
  };  

  watch(currentSlide, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      pauseAutoScroll();
    }
  });

  onMounted(() => {
    startAutoScroll();
  });

  onBeforeUnmount(() => {
    clearInterval(intervalId!);
    clearTimeout(pauseTimeout!);
  });

  return {
    currentSlide,
    resumeAutoScroll
  };
}