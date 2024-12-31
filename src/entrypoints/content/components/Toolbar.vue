<template>
    <div v-if="visible" ref="toolbarRef" class="absolute z-[9999]" :class="[toolbarCLass]" :style="{...toolbarStyle}">
        <div class="relative">
            <div ref="toolbarPanelRef" class="text-white bg-[#3a3c3e] px-[0.375rem] rounded-2xl">
                <div class="flex items-center">
                    <button v-for="action in actionList" v-show="action?.visible !== false" class="w-[3.5rem] h-[4rem] flex flex-col items-center justify-center rounded-[0.375rem]" :class="[currentAction === action.key ? 'bg-[rgba(0,0,0,.2)]' : 'bg-transparent hover:bg-[rgba(0,0,0,.2)]']" @click="currentAction = action.key">
                        <div class="text-xl" :class="[action.icon, currentAction === action.key ? iconColor : '']"></div>
                        <div class="text-xs mt-1">{{ action.text }}</div>
                    </button>
                </div>
            </div>
            <div v-if="underlineVisible" class="absolute bg-[#3a3c3e] p-[0.625rem] rounded-2xl" :class="[position === 'bottom' ? 'top-[calc(100%+0.5rem)]' : 'bottom-[calc(100%+0.5rem)]']">
                <div class="flex items-center flex-nowrap gap-3">
                    <button v-for="color in colorList" class="w-5 h-5 flex items-center justify-center rounded-full" :class="[color.bgColor]" @click="currentColor = color.key">
                        <div v-if="currentColor === color.key" class="i-mingcute:check-fill text-sm"></div>
                    </button>
                </div>
            </div>
            <div class="absolute left-0 border-l-solid border-r-solid border-l-[8px] border-r-[8px] border-l-transparent border-r-transparent z-[-1]" :class="[toolbarArrowCLass]" :style="{...toolbarArrowStyle}"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps({
    top: Number,
    left: Number,
    arrowLeft: Number,
    position: String,
    action: String,
    color: String,
})

const emit = defineEmits(['changeAction', 'changeColor'])

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

const visible = ref(false)

const toolbarRef = ref<HTMLElement | null>(null)

const removeVisible = ref(false)

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

const toolbarCLass = computed(() => {
    return props.position === 'bottom' ? 'pt-[12px]' : 'pb-[12px]'
})

const toolbarStyle = computed(() => ({
    top: `${props.top}px`,
    left: `${props.left}px`
}))

const toolbarArrowCLass = computed(() => {
    return props.position === 'bottom' ? 'top-[-6px] border-b-solid border-b-[8px] border-b-[#3a3c3e]' : 'bottom-[-6px] border-t-solid border-t-[8px] border-t-[#3a3c3e]'
})

const toolbarArrowStyle = computed(() => {
    return {
        left: `calc(50% + ${props.arrowLeft}px)`
    }
})

const currentAction = computed({
    get: () => props.action,
    set: (val: string) => {
        emit('changeAction', val)
    }
})

const currentColor = computed({
    get: () => props.color,
    set: (val: string) => {
        emit('changeColor', val)
    }
})

const underlineVisible = computed(() => {
    return ['mark', 'wave', 'straight'].includes(currentAction.value || '')
})

const iconColor = computed(() => {
    const color = colorList.find(item => item.key === currentColor.value)
    return color && underlineVisible.value ? color.color : ''
})

const showToolbar = () => {
    
}

defineExpose({
    show() {
        visible.value = true
        requestAnimationFrame(() => {
            showToolbar()
        })
    }
})
</script>