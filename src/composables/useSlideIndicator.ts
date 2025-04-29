import { ref, computed, watch } from 'vue';

export function useSlideIndicator(getIncomes: () => any[], maxBars = 5) {
  const currentSlide = ref(0); 
  const totalSlides = ref(0);

  // Watch function result instead
  watch(getIncomes, (newVal) => {
    console.log('[DEBUG] incomes updated:', newVal);
    if (newVal && Array.isArray(newVal)) {
      totalSlides.value = newVal.length;
      console.log('[DEBUG] totalSlides updated:', totalSlides.value);
    } else {
      totalSlides.value = 0;
    }
  }, { immediate: true });

  const visibleBars = computed(() => {
    const value = totalSlides.value > 0 ? Math.min(totalSlides.value, maxBars) : 0;
    console.log('[DEBUG] visibleBars computed:', value); // Log visibleBars
    return value;
  });

  const slidesPerBar = computed(() => {
    const value = visibleBars.value > 0 ? totalSlides.value / visibleBars.value : 0;
    console.log('[DEBUG] slidesPerBar computed:', value); // Log slidesPerBar
    return value;
  });

  const isActiveBar = (barIndex: number) => {
    const activeBar = Math.floor(currentSlide.value / slidesPerBar.value);
    const result = activeBar === (barIndex - 1);
    console.log('[DEBUG] isActiveBar', barIndex, result); // Log active bar check
    return result;
  };

  const jumpToSlide = (barIndex: number) => {
    const targetSlide = Math.floor((barIndex - 1) * slidesPerBar.value);
    currentSlide.value = targetSlide;
    console.log('[DEBUG] jumpToSlide:', targetSlide); // Log slide jump
  };

  console.log('[DEBUG] maxBars:', maxBars); // Log maxBars value

  return {
    currentSlide,
    totalSlides,
    visibleBars,
    isActiveBar,
    jumpToSlide,
  };
}