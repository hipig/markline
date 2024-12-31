<template>
    <div  class="line-wrapper" :class="[lineColorClass]" :style="{...wrapperStyle}">
        <div v-if="type === 'mark'" class="line line_mark"></div>
        <div v-if="type === 'wave'" class="line line_wave">
            <span class="line_wave_item" :class="[waveRandomStartClass]"></span>
            <span v-for="centerClass in waveCenterClasses" class="line_wave_item" :class="[centerClass]"></span>
            <span class="line_wave_item" :class="[waveRandomEndClass]"></span>
        </div>
        <div v-if="type === 'straight'" class="line line_straight">
            <span class="line_straight_item line_straight_start"></span>
            <span class="line_straight_item line_straight_center"></span>
            <span class="line_straight_item line_straight_end"></span>
        </div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
    rect: {
        top: number
        left: number
        width: number
        height: number
    }
    type: string
    color: string
}>()


const top = computed(() => props.rect.top || 0)
const left = computed(() => props.rect.left || 0)
const width = computed(() => props.rect.width || 0)
const height = computed(() => props.rect.height || 0)
const wrapperStyle = computed(() => ({
    top: `${top.value}px`,
    left: `${left.value}px`,
    width: `${width.value}px`,
    height: `${height.value}px`
}))

const lineColorClass = computed(() => `line_color_${props.color}`)

const waveMiddleLineCount = computed(() => {
    const maxLines = Math.max(0, Math.floor((width.value - 24) / 58));
    const remainingWidth = width.value - 24 - 58 * maxLines;
    return remainingWidth > 29 && (maxLines > 0 || remainingWidth > 58 / 1.5) ? maxLines + 1 : maxLines;
})

const dividedRects = computed(() => {

})

const waveRandomStartClass = computed(() => {
    return `line_wave_start_${Math.floor(5 * Math.random()) + 1}`;
})

const waveRandomEndClass = computed(() => {
    return `line_wave_end_${Math.floor(5 * Math.random()) + 1}`;
})

const waveCenterClasses = computed(() => {
    const classes = [];
    for (let i = 0; i < waveMiddleLineCount.value; i++) {
        classes.push(`line_wave_center_${Math.floor(10 * Math.random()) + 1}`);
    }
    return classes;
})
</script>