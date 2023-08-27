<template>
	<div class="mx-10 my-20">
		<CabooseCrud :store="usersStore"> </CabooseCrud>
	</div>
</template>
<script setup>
	import { useUsersStore } from "~/stores/usersStore";
	let usersStore = useUsersStore();
</script>
