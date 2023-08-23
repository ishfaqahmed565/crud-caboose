<script setup>
	import useDetectOutsideClick from "~/composable/useDetectOutsideClick.js";

	const props = defineProps({
		showCarret: {
			default: true,
			type: Boolean,
		},
		buttonStyle: {
			required: false,
			type: String,
		},
	});
	const showDropdown = ref(false);
	const dropDown = ref(null);
	useDetectOutsideClick(dropDown, () => {
		showDropdown.value = false;
	});
</script>
<template>
	<div ref="dropDown" class="relative grid">
		<div :class="buttonStyle" @click="showDropdown = !showDropdown">
			<slot name="drop-button"></slot>
		</div>
		<TransWrap :show="showDropdown">
			<PopUp class="w-full">
				<slot name="drop-data"></slot>
			</PopUp>
		</TransWrap>
	</div>
</template>
