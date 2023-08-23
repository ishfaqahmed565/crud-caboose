<script lang="ts" setup>
	import { PropType } from "vue";

	const emit = defineEmits(["close"]);
	const props = defineProps({
		showEditModal: {
			required: true,
			type: Boolean,
		},
	});

	function close() {
		emit("close");
		console.log("i am here");
	}
</script>

<template>
	<Teleport to="body">
		<ModalMask :class="{ 'none ': !props.showEditModal }">
			<Transition name="wrapper">
				<div
					v-if="props.showEditModal"
					ref="editDrawer"
					class="w-[400px] h-[100vh] overflow-clip absolute z-[500] right-0 feature-container rounded-none pt-10 pr-0"
				>
					<NavButton
						class="form-nav-button px-1 absolute top-0 left-0 p-[3px] px-[3px]"
						style="border-radius: 0px"
						@click="$emit('close')"
					>
						<svg
							viewBox="0 0 24 24"
							class="w-4"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6 18L18 6M6 6l12 12"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</NavButton>
					<div
						class="flex flex-col gap-5 h-[85vh] overflow-auto w-full px-3 pb-12"
					>
						<slot></slot>
					</div>
				</div>
			</Transition>
		</ModalMask>
	</Teleport>
</template>
<style scoped>
	.none {
		display: none !important;
	}

	.wrapper-enter-active {
		animation-name: enter;
		animation-duration: 0.5s;
	}

	.wrapper-leave-active {
		animation: enter 0.5s reverse;
	}

	@keyframes enter {
		0% {
			right: -400px;
		}

		100% {
			right: 0px;
		}
	}
</style>
