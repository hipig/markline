<template>
    <div ref="selectionToolbarRef" class="absolute z-[9999]" :style="{top: `${toolbarTop}px`, left: `${toolbarLeft}px`}">
        <div class="relative">
            <div class="text-white bg-[#3a3c3e] px-[0.375rem] rounded-2xl">
                <div class="flex items-center">
                    <button class="w-[56px] h-[64px] flex flex-col items-center justify-center bg-transparent hover:bg-[rgba(0,0,0,.2)] rounded-[0.375rem]">
                        <div class="i-mingcute:copy-fill text-xl"></div>
                        <div class="text-xs mt-1">复制</div>
                    </button>
                    <button class="w-[56px] h-[64px] flex flex-col items-center justify-center bg-transparent hover:bg-[rgba(0,0,0,.2)] rounded-[0.375rem]">
                        <div class="i-mingcute:copy-fill text-xl"></div>
                        <div class="text-xs mt-1">马克笔</div>
                    </button>
                    <button class="w-[56px] h-[64px] flex flex-col items-center justify-center bg-transparent hover:bg-[rgba(0,0,0,.2)] rounded-[0.375rem]">
                        <div class="i-mingcute:copy-fill text-xl"></div>
                        <div class="text-xs mt-1">波浪线</div>
                    </button>
                    <button class="w-[56px] h-[64px] flex flex-col items-center justify-center bg-transparent hover:bg-[rgba(0,0,0,.2)] rounded-[0.375rem]">
                        <div class="i-mingcute:copy-fill text-xl"></div>
                        <div class="text-xs mt-1">直线</div>
                    </button>
                    <button class="w-[56px] h-[64px] flex flex-col items-center justify-center bg-transparent hover:bg-[rgba(0,0,0,.2)] rounded-[0.375rem]">
                        <div class="i-mingcute:copy-fill text-xl"></div>
                        <div class="text-xs mt-1">写想法</div>
                    </button>
                    <button class="w-[56px] h-[64px] flex flex-col items-center justify-center bg-transparent hover:bg-[rgba(0,0,0,.2)] rounded-[0.375rem]">
                        <div class="i-mingcute:copy-fill text-xl"></div>
                        <div class="text-xs mt-1">AI提问</div>
                    </button>
                </div>
            </div>
            <div class="absolute left-0 bottom-[-6px] ml-2 border-l-solid border-r-solid border-l-[8px] border-r-[8px] border-l-transparent border-r-transparent" :class="[arrowPositionCLass]" :style="{left: `calc(50% + ${arrowLeft}px)`}"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const selectionToolbarRef = ref<HTMLElement | null>(null)

const toolbarLeft = ref(-9999)

const toolbarTop = ref(-9999)

const arrowLeft = ref(0)

const arrowPosition = ref('top')

const arrowPositionCLass = computed(() => {
    return arrowPosition.value === 'bottom' ? 'top-[-6px] border-b-solid border-b-[8px] border-b-[#3a3c3e]' : 'bottom-[-6px] border-t-solid border-t-[8px] border-t-[#3a3c3e]'
})

const toolbarRect = computed(() => {
    return selectionToolbarRef.value?.getBoundingClientRect()
})

onMounted(() => {
    document.addEventListener('mouseup', () => {
        const selection = window.getSelection()
        if (!selection || selection.toString().trim().length === 0 || selection.rangeCount === 0) {
            resetToolbar()
            return
            
        }

        const range = selection.getRangeAt(0)
        const rects = range.getClientRects()

        if (rects.length === 0) {
            resetToolbar()
            return
        }

        const rect = rects[0]

        let top, left, position;
        const toolbarHeight = toolbarRect.value!.height;
        const toolbarWidth = toolbarRect.value!.width;
        const viewportHeight = document.documentElement.clientHeight;
        const viewportWidth = document.documentElement.clientWidth;

        if (rect.top - toolbarHeight - 12 > 10) {
            position = 'top';
            top = rect.top - rect.height - 4;
        } else {
            position = 'bottom';
            top = rect.bottom + rect.height;
        }

        if (position === 'bottom' && top + toolbarHeight > viewportHeight - 10) {
            top = viewportHeight - toolbarHeight - 10;
        }

        left = rect.left + rect.width / 2 - toolbarWidth / 2;

        let offsetX = 0;
        if (left < 10) {
            offsetX = left - 10;
            left = 10;
        } else if (left + toolbarWidth > viewportWidth - 10) {
            left = viewportWidth - toolbarWidth - 10;
            offsetX = rect.left + rect.width / 2 - left - toolbarWidth / 2;
        }

        // 设置悬浮框的位置
        toolbarTop.value = top;
        toolbarLeft.value = left;

        arrowPosition.value = position;
        arrowLeft.value = offsetX - 16;
    })

    resetToolbar()
})

const resetToolbar = () => {
    toolbarLeft.value = -9999
    toolbarTop.value = -9999
    arrowLeft.value = 0
}
</script>