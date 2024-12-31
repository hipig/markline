<template>
    <div v-if="toolbarVisible" ref="toolbarRef" class="absolute z-[9999]" :class="[toolbarCLass]" :style="{...toolbarStyle}">
        <div class="relative">
            <div class="text-white bg-[#3a3c3e] px-[0.375rem] rounded-2xl">
                <div class="flex items-center">
                    <button v-for="action in actionList" v-show="action?.visible !== false" class="w-[3.5rem] h-[4rem] flex flex-col items-center justify-center rounded-[0.375rem]" :class="[currentAction === action.key ? 'bg-[rgba(0,0,0,.2)]' : 'bg-transparent hover:bg-[rgba(0,0,0,.2)]']" @click="handleAction(action.key)">
                        <div class="text-xl" :class="[action.icon, currentAction === action.key ? iconColor : '']"></div>
                        <div class="text-xs mt-1">{{ action.text }}</div>
                    </button>
                </div>
            </div>
            <div v-if="underlineVisible" class="absolute bg-[#3a3c3e] p-[0.625rem] rounded-2xl" :class="[toolbarPosition === 'bottom' ? 'top-[calc(100%+0.5rem)]' : 'bottom-[calc(100%+0.5rem)]']">
                <div class="flex items-center flex-nowrap gap-3">
                    <button v-for="color in colorList" class="w-5 h-5 flex items-center justify-center rounded-full" :class="[color.bgColor]" @click="handleChangeColor(color.key)">
                        <div v-if="currentColor === color.key" class="i-mingcute:check-fill text-sm"></div>
                    </button>
                </div>
            </div>
            <div class="absolute left-0 border-l-solid border-r-solid border-l-[8px] border-r-[8px] border-l-transparent border-r-transparent z-[-1]" :class="[toolbarArrowCLass]" :style="{...toolbarArrowStyle}"></div>
        </div>
    </div>
    <div>
        <div v-for="range in rangeList" @click="handleViewRangeLine(range)">
            <UnderLine v-for="rect in range.range.rects" :rect="rect" :type="range.action" :color="range.color"/>
        </div>
    </div>
    <div v-if="false">
        <div class="fixed inset-0 bg-[rgba(0,0,0,.1)] z-[9999]"></div>
        <div class="absolute z-[9999]" style="top: 20%; left: 20%;">
            <div class="relative">
                <div class="w-[28rem] bg-gray-100 p-4 rounded-2xl">
                    <div class="space-y-2">
                        <div class="text-center text-lg">写想法</div>
                        <div class="relative">
                            <textarea class="w-full h-[10rem] px-3 py-2 bg-white border border-transparent rounded-xl focus:outline-none resize-none" placeholder="写下这一刻的想法"></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button class="px-[1rem] py-[0.5rem] bg-[#3a3c3e] text-white rounded-xl">保存</button>
                        </div>
                    </div>
                </div>
                <div class="absolute top-2 right-2">
                    <button class="p-2 bg-transparent">
                        <div class="i-mingcute:close-fill text-xl"></div>
                    </button>
                </div>
                <div class="absolute left-0 z-[-1]" :class="[noteArrowCLass]" :style="{left: `calc(50% + ${arrowLeft}px)`}"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UnderLine from './components/UnderLine.vue'
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

const toolbarLeft = ref(0)

const toolbarTop = ref(0)

const arrowLeft = ref(0)

const toolbarPosition = ref<'top' | 'bottom'>('top')

const currentRange = ref<object|null>(null)

const currentAction = ref<string|null>(null)

const currentColor = ref('blue')

const toolbarVisible = ref(false)

const removeVisible = ref(false)

const rangeList = ref([])

const notePosition = ref<'top' | 'bottom' | 'left' | 'right'>('top')

const toolbarCLass = computed(() => {
    return toolbarPosition.value === 'bottom' ? 'pt-[12px]' : 'pb-[12px]'
})

const toolbarStyle = computed(() => {
    return {
        top: `${toolbarTop.value}px`,
        left: `${toolbarLeft.value}px`
    }
})

const toolbarArrowCLass = computed(() => {
    return toolbarPosition.value === 'bottom' ? 'top-[-6px] border-b-solid border-b-[8px] border-b-[#3a3c3e]' : 'bottom-[-6px] border-t-solid border-t-[8px] border-t-[#3a3c3e]'
})

const toolbarArrowStyle = computed(() => {
    return {
        left: `calc(50% + ${arrowLeft.value}px)`
    }
})

const noteArrowCLass = computed(() => {
    const positionMap = {
        top: 'bottom-[-8px] border-t-solid border-t-[10px] border-t-gray-100 border-l-solid border-r-solid border-l-[10px] border-r-[10px] border-l-transparent border-r-transparent',
        bottom: 'top-[-8px] border-b-solid border-b-[10px] border-b-gray-100 border-l-solid border-r-solid border-l-[10px] border-r-[10px] border-l-transparent border-r-transparent',
        left: 'right-[-8px] border-r-solid border-r-[10px] border-r-gray-100 border-t-solid border-b-solid border-t-[10px] border-b-[10px] border-t-transparent border-b-transparent',
        right: 'left-[-8px] border-l-solid border-l-[10px] border-l-gray-100 border-t-solid border-b-solid border-t-[10px] border-b-[10px] border-t-transparent border-b-transparent'
    }

    return positionMap[notePosition.value]
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
    console.log(range);
    

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
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
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
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    if (mode === 'selection') {
        startX = startX + scrollX;
        startY = startY + scrollY;
    }

    const viewportWidth = document.documentElement.clientWidth;

    if (startY - scrollY - toolbarHeight > 10) {
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
        color: currentColor.value
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