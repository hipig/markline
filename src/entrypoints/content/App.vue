<template>
    <div v-if="toolbarVisible" ref="toolbarRef" class="absolute z-[9999]" :class="[toolbarPosition === 'bottom' ? 'pt-[12px]' : 'pb-[12px]']" :style="{top: `${toolbarTop}px`, left: `${toolbarLeft}px`}">
        <div class="relative">
            <div ref="toolbarPanelRef" class="text-white bg-[#3a3c3e] px-[0.375rem] rounded-2xl">
                <div class="flex items-center">
                    <button v-for="action in actionList" v-show="action?.visible !== false" class="w-[3.5rem] h-[4rem] flex flex-col items-center justify-center rounded-[0.375rem]" :class="[currentAction === action.key ? 'bg-[rgba(0,0,0,.2)]' : 'bg-transparent hover:bg-[rgba(0,0,0,.2)]']" @click="handleAction(action.key)">
                        <div class="text-xl" :class="[action.icon, currentAction === action.key ? iconColor : '']"></div>
                        <div class="text-xs mt-1">{{ action.text }}</div>
                    </button>
                </div>
            </div>
            <div v-if="underlineVisible" class="absolute bottom-[calc(100%+0.5rem)] bg-[#3a3c3e] p-[0.625rem] rounded-2xl">
                <div class="flex items-center flex-nowrap gap-3">
                    <button v-for="color in colorList" class="w-5 h-5 flex items-center justify-center rounded-full" :class="[color.bgColor]" @click="handleChangeColor(color.key)">
                        <div v-if="currentColor === color.key" class="i-mingcute:check-fill text-sm"></div>
                    </button>
                </div>
            </div>
            <div class="absolute left-0 border-l-solid border-r-solid border-l-[8px] border-r-[8px] border-l-transparent border-r-transparent" :class="[arrowCLass]" :style="{left: `calc(50% + ${arrowLeft}px)`}"></div>
        </div>
    </div>
    <div>
        <div v-for="range in rangeList" @click="handleViewRangeLine(range)">
            <div v-for="line in range.lines" class="line-wrapper" :class="[`line_color_${range.color}`]" :style="{...line.style}">
                <div v-if="range.action === 'mark'" class="line line_mark"></div>
                <div v-if="range.action === 'wave'" class="line line_wave">

                </div>
                <div v-if="range.action === 'straight'" class="line line_straight">
                    <span class="line_straight_start"></span>
                    <span class="line_straight_center"></span>
                    <span class="line_straight_end"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { debounce } from 'lodash'

const colorList = [
    {
        key: 'red',
        bgColor: 'bg-red-400',
        color: 'text-red-400'
    },
    {
        key: 'purple',
        bgColor: 'bg-purple-400',
        color: 'text-purple-400'
    },
    {
        key: 'blue',
        bgColor: 'bg-blue-400',
        color: 'text-blue-400'
    },
    {
        key: 'green',
        bgColor: 'bg-green-400',
        color: 'text-green-400'
    },
    {
        key: 'amber',
        bgColor: 'bg-amber-400',
        color: 'text-amber-400'
    }
]

const toolbarRef = ref<HTMLElement | null>(null)
const toolbarPanelRef = ref<HTMLElement | null>(null)

const toolbarLeft = ref(0)

const toolbarTop = ref(0)

const arrowLeft = ref(0)

const toolbarPosition = ref('top')

const currentRange = ref<object|null>(null)

const currentAction = ref<string|null>(null)

const currentColor = ref('blue')

const toolbarVisible = ref(false)

const removeVisible = ref(false)

const rangeList = ref([])

const arrowCLass = computed(() => {
    return toolbarPosition.value === 'bottom' ? 'top-[-6px] border-b-solid border-b-[8px] border-b-[#3a3c3e]' : 'bottom-[-6px] border-t-solid border-t-[8px] border-t-[#3a3c3e]'
})

const toolbarRect = computed(() => {
    return toolbarRef.value?.getBoundingClientRect()
})

const actionList = computed(() => {
    return [
        {
            key: 'copy',
            icon: 'i-solar:copy-bold',
            text: '复制'
        },
        {
            key: 'mark',
            icon: 'i-solar:text-bold-square-bold',
            text: '马克笔'
        },
        {
            key: 'wave',
            icon: 'i-solar:text-underline-circle-bold',
            text: '波浪线'
        },
        {
            key: 'straight',
            icon: 'i-solar:text-underline-cross-bold',
            text: '直线'
        },
        {
            key: 'remove',
            icon: 'i-solar:trash-bin-trash-bold',
            text: '删除划线',
            visible: removeVisible.value
        },
        {
            key: 'note',
            icon: 'i-solar:notes-bold',
            text: '写想法'
        },
        {
            key: 'ai',
            icon: 'i-solar:magic-stick-2-bold',
            text: 'AI提问'
        }
    ]
})

const underlineVisible = computed(() => {
    return ['mark', 'wave', 'straight'].includes(currentAction.value || '')
})

const iconColor = computed(() => {
    const color = colorList.find(item => item.key === currentColor.value)
    return color && underlineVisible.value ? color.color : ''
})

onMounted(() => {
    document.addEventListener('mouseup', debounce(handleSelection, 100))
    document.addEventListener('selectionchange', debounce(checkSelection, 100))
})

const handleSelection = () => {
    if (currentRange.value) {
        return
    }

    const selection = checkSelection()
    if (selection === false) {
        return
    }

    const range = selection.getRangeAt(0)
    const rects = range.getClientRects()

    if (rects.length === 0) {
        resetToolbar()
        return
    }

    currentRange.value = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
        rects
    }
    currentAction.value = null
    toolbarVisible.value = true
    requestAnimationFrame(() => {
        showToolbar()
    })
}

const checkSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || selection.toString().trim().length === 0 || selection.rangeCount === 0) {
        resetToolbar()
        return false
    }

    return selection
}

const resetToolbar = () => {
    arrowLeft.value = 0
    toolbarVisible.value = false
    currentRange.value = null
    removeVisible.value = false
}

const showToolbar = (mode = 'selection') => {
    if (!currentRange.value) {
        return
    }

    const rect = currentRange.value.rects[0]    

    let top, left, position;
    const toolbarHeight = toolbarRect.value!.height;
    const toolbarWidth = toolbarRect.value!.width;
    let startX = rect.left;
    let startY = rect.top;
    if (mode === 'selection') {
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        startX = startX + scrollX;
        startY = startY + scrollY;
    }

    const viewportWidth = document.documentElement.clientWidth;

    if (rect.top - toolbarHeight > 10) {
        position = 'top';
        top = startY - toolbarHeight;
    } else {
        position = 'bottom';
        top = startY + rect.height;
    }

    left = startX + rect.width / 2 - toolbarWidth / 2;

    let offsetX = 0;
    if (left < 10) {
        offsetX = left - 10;
        left = 10;
    } else if (left + toolbarWidth > viewportWidth - 10) {
        left = viewportWidth - toolbarWidth - 10;
        offsetX = startX + rect.width / 2 + toolbarWidth / 2 + 10 - viewportWidth;
    }

    // 设置悬浮框的位置
    toolbarTop.value = top;
    toolbarLeft.value = left;
    console.log('Rect0: ', rect);

    console.log('toolbar: ', {top, left, position, width: toolbarWidth});


    toolbarPosition.value = position;
    arrowLeft.value = offsetX - 8;
}

const handleAction = (key: string) => {
    switch (key) {
        case 'copy':
            break;
        case 'mark':
        case 'wave':
        case 'straight':
            currentAction.value = key
            updateRangeList()
            break;
        case 'remove':
            removeCurrentRange()
            resetToolbar()
            break;    
        default:
            break;
    }
}

const handleChangeColor = (key: string) => {
    currentColor.value = key
    updateRangeList()
}

const handleViewRangeLine = (range) => {
    currentRange.value = range.range
    currentAction.value = range.action
    currentColor.value = range.color
    toolbarVisible.value = true
    removeVisible.value = true
    requestAnimationFrame(() => {
        showToolbar('view')
    })
}

const updateRangeList = () => {
    if (!currentRange.value) {
        return
    }

    const startContainer = currentRange.value.startContainer;
    const endContainer = currentRange.value.endContainer;
    const startOffset = currentRange.value.startOffset;
    const endOffset = currentRange.value.endOffset;
    for (const existingRange of rangeList.value) {
        if (
            existingRange.range.startContainer === startContainer &&
            existingRange.range.startOffset === startOffset &&
            existingRange.range.endContainer === endContainer &&
            existingRange.range.endOffset === endOffset
        ) {
            existingRange.action = currentAction.value
            existingRange.color = currentColor.value
            return
        }
    }

    const rangRects = currentRange.value.rects || [];
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    let rects = [];
    const lines = [];
    for (let i = 0; i < rangRects.length; i++) {
        const rect = rangRects[i];
        const top = rect.top + scrollY;
        const left = rect.left + scrollX;
        const width = rect.width;
        const height = rect.height;

        rects.push({
            top,
            left,
            width,
            height
        })
        lines.push({
            style: {
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`
            }
        })
    }

    rangeList.value.push({
        range: {
            startContainer,
            startOffset,
            endContainer,
            endOffset,
            rects
        },
        action: currentAction.value,
        color: currentColor.value,
        lines
    })
}

const removeCurrentRange = () => {
    if (!currentRange.value) {
        return
    }

    const index = rangeList.value.findIndex(item => {
        return item.range.startContainer === currentRange.value.startContainer &&
            item.range.startOffset === currentRange.value.startOffset &&
            item.range.endContainer === currentRange.value.endContainer &&
            item.range.endOffset === currentRange.value.endOffset
    })

    if (index > -1) {
        rangeList.value.splice(index, 1)
    }
}
</script>