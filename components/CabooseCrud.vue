<script setup>
	//when i click on edit it call a setter to change the state of edit modal;
	//with specific user info;

	import { ref } from "vue";
	import { ElTable } from "element-plus";
	import { ElDatePicker } from "element-plus";
	import { ElForm } from "element-plus";
	import { ElTableColumn } from "element-plus";
	import { ElInputNumber } from "element-plus";
	import "element-plus/es/components/table/style/css";
	import "element-plus/es/components/input-number/style/css";
	import "element-plus/es/components/date-picker/style/css";

	let createForm = ref();
	let editForm = ref();
	const createFormData = ref({});
	const editFormData = ref({});
	const filterInputDropDown = ref(null);
	let showFilterInputDropDown = ref(false);
	const filterData = ref({});
	const filterInput = ref("");
	let props = defineProps({
		store: {
			type: Object,
			required: false,
		},
	});
	const filteredTableData = computed(() => {
		return props.store.configurations.cols.filter((object) => object.show);
	});
	const searchableTableData = computed(() => {
		return props.store.configurations.cols.filter(
			(object) => object.searchable
		);
	});
	const submitEditForm = async (formEl) => {
		if (!formEl) return;
		if (store.props.configurations.actions.edit) {
			await formEl.validate((valid, fields) => {
				if (valid) {
					props.store.editTableData(...editFormData.value);
					store.setEditDrawerVisibility(false);
				} else {
					open1();
					console.log("error submit!", fields);
				}
			});
		}
	};
	const submitCreateForm = async (formEl) => {
		if (!formEl) return;

		if (store.props.configurations.actions.create) {
			await formEl.validate((valid, fields) => {
				if (valid) {
					props.store.createTableData(createFormData);
					store.setCreateDrawerVisibility(false);
				} else {
					open1();
					console.log("error submit!", fields);
				}
			});
		}
	};
	const gotoPage = async function (pageNo) {
		await props.store.getData(undefined, pageNo);
	};

	async function rowChange(event) {
		props.store.setPerPage(event);
		await props.store.getData(event);
	}
	const openCreateDrawer = () => {
		props.store.setCreateDrawerVisibility(true);
	};
	const exportExcel = () => {
		if (props.store.configurations.action.export) {
			props.store.exportExcel();
		}
	};
	const exportCSV = () => {
		if (props.store.configurations.action.export) {
			props.store.exportCSV();
		}
	};
	const handleEdit = (index, row) => {
		props.store.setEditDrawerVisibility(true);
		props.store.setDataForEdit(row);
	};
	const handleDelete = (index, row) => {
		props.store.deleteData(row);
	};
	const showFilterInputType = ref("");

	const setFilter = (val) => {
		showFilterInputDropDown.value = true;
		console.log(val);
		showFilterInputType.value = val;
	};
	const applyFilter = () => {
		filterData.value[showFilterInputType.value] = filterInput.value;
		filterInput.value = "";
		props.store.setFilterData(filterData.value);
		showFilterInputDropDown.value = false;
	};
	const removeFilterKey = async function (key) {
		delete filterData.value[key];
		props.store.setFilterData(filterData.value);
		await store.getData();
	};
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex flex-col gap-2">
			<h1 class="text-medium text-black font-medium">
				{{ store.configurations.title }}
			</h1>
			<div class="flex justify-between gap-2">
				<div
					v-if="searchableTableData.length > 0"
					class="w-full flex-wrap border rounded shadow-sm px-1 items-center flex gap-2 relative"
				>
					<DropDown v-if="!showFilterInputDropDown">
						<template #drop-button>
							<button
								class="hover:bg-gray-200 transition-all border-gray-200 border-[2px] flex gap-1 px-3 pr-4 py-[3px] text-xs text-table-text-secondary rounded border-dotted border-table-border"
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									stroke-width="1"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7 2.91675V11.0834M2.91667 7.00008H11.0833"
										stroke="#586887"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>

								<span> Add filter </span>
							</button>
						</template>
						<template #drop-data>
							<button
								v-for="item in searchableTableData"
								:key="item"
								@click="setFilter(item.name)"
								class="filter-drop-data text-xs"
							>
								<span class="first-letter:uppercase"> {{ item.name }} </span>
							</button>
						</template>
					</DropDown>

					<div
						class="relative grid w-[10rem]"
						ref="filterInputDropDown"
						v-if="showFilterInputDropDown"
					>
						<div
							class="bg-slate-500 text-xs py-1.5 px-2 text-white rounded-t first-letter:uppercase"
						>
							{{ showFilterInputType }}
						</div>
						<TransWrap :show="true">
							<PopUp
								class="w-full rounded-none rounded-b px-2 py-2 flex flex-col gap-2"
							>
								<input
									v-if="showFilterInputType !== 'date'"
									v-model="filterInput"
									type="text"
									placeholder="Start with"
									class="w-[8rem] border-b active:outline-none outline-none text-xs"
								/>
								<el-date-picker
									class="dateWidth"
									v-else
									v-model="filterInput"
									format="YYYY-MM-DD HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>

								<div class="w-full flex justify-end pr-3">
									<div class="flex gap-2">
										<button
											@click="showFilterInputDropDown = false"
											class="text-xs text-table-text-secondary hover:text-red-500 transition-all"
										>
											Cancel
										</button>
										<button
											@click="applyFilter"
											class="text-xs text-table-text-secondary hover:text-black transition-all"
										>
											Apply
										</button>
									</div>
								</div>
							</PopUp>
						</TransWrap>
					</div>
					<div
						v-for="(index, item) in filterData"
						:key="item"
						class="bg-table-header py-[3px] text-xs px-3 rounded flex gap-1 items-center text-[#3C475D]"
					>
						<span class="first-letter:uppercase">{{ item }}:</span>
						<span> {{ filterData[item] }} </span>
						<button @click="removeFilterKey(item)">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1"
								stroke="currentColor"
								class="w-[18px] text-table-text-black"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div class="flex gap-2">
					<DropDown v-if="store.configurations.actions.export">
						<template #drop-button>
							<NavButton class="active:animate-pulse text-table-text-secondary">
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M14 10V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H5.2C4.07989 14 3.51984 14 3.09202 13.782C2.71569 13.5903 2.40973 13.2843 2.21799 12.908C2 12.4802 2 11.9201 2 10.8V10M11.3333 6.66667L8 10M8 10L4.66667 6.66667M8 10V2"
										stroke="#586887"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>

								<span> Export </span>
							</NavButton>
						</template>
						<template #drop-data>
							<button class="drop-data" @click="exportExcel">
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_188_3741)">
										<path
											d="M15.5 13.5005H8.5C8.224 13.5005 8 13.2765 8 13.0005V3.00049C8 2.72449 8.224 2.50049 8.5 2.50049H15.5C15.776 2.50049 16 2.72449 16 3.00049V13.0005C16 13.2765 15.776 13.5005 15.5 13.5005Z"
											fill="#ECEFF1"
										/>
										<path
											d="M10.5 5.50049H8.5C8.224 5.50049 8 5.27649 8 5.00049C8 4.72449 8.224 4.50049 8.5 4.50049H10.5C10.776 4.50049 11 4.72449 11 5.00049C11 5.27649 10.776 5.50049 10.5 5.50049ZM10.5 7.50049H8.5C8.224 7.50049 8 7.27649 8 7.00049C8 6.72449 8.224 6.50049 8.5 6.50049H10.5C10.776 6.50049 11 6.72449 11 7.00049C11 7.27649 10.776 7.50049 10.5 7.50049ZM10.5 9.50049H8.5C8.224 9.50049 8 9.27649 8 9.00049C8 8.72449 8.224 8.50049 8.5 8.50049H10.5C10.776 8.50049 11 8.72449 11 9.00049C11 9.27649 10.776 9.50049 10.5 9.50049ZM10.5 11.5005H8.5C8.224 11.5005 8 11.2765 8 11.0005C8 10.7245 8.224 10.5005 8.5 10.5005H10.5C10.776 10.5005 11 10.7245 11 11.0005C11 11.2765 10.776 11.5005 10.5 11.5005ZM13.5 5.50049H12.5C12.224 5.50049 12 5.27649 12 5.00049C12 4.72449 12.224 4.50049 12.5 4.50049H13.5C13.776 4.50049 14 4.72449 14 5.00049C14 5.27649 13.776 5.50049 13.5 5.50049ZM13.5 7.50049H12.5C12.224 7.50049 12 7.27649 12 7.00049C12 6.72449 12.224 6.50049 12.5 6.50049H13.5C13.776 6.50049 14 6.72449 14 7.00049C14 7.27649 13.776 7.50049 13.5 7.50049ZM13.5 9.50049H12.5C12.224 9.50049 12 9.27649 12 9.00049C12 8.72449 12.224 8.50049 12.5 8.50049H13.5C13.776 8.50049 14 8.72449 14 9.00049C14 9.27649 13.776 9.50049 13.5 9.50049ZM13.5 11.5005H12.5C12.224 11.5005 12 11.2765 12 11.0005C12 10.7245 12.224 10.5005 12.5 10.5005H13.5C13.776 10.5005 14 10.7245 14 11.0005C14 11.2765 13.776 11.5005 13.5 11.5005Z"
											fill="#388E3C"
										/>
										<path
											d="M8.819 0.61543C8.705 0.52043 8.552 0.47943 8.408 0.50943L0.408 2.00943C0.293301 2.03062 0.189662 2.09136 0.115116 2.18107C0.0405697 2.27078 -0.000164571 2.38379 4.99728e-07 2.50043V13.5004C4.99728e-07 13.7404 0.171 13.9474 0.408 13.9914L8.408 15.4914C8.438 15.4974 8.469 15.5004 8.5 15.5004C8.616 15.5004 8.729 15.4604 8.819 15.3854C8.87562 15.3385 8.92119 15.2797 8.95247 15.2131C8.98376 15.1466 8.99999 15.074 9 15.0004V1.00043C9 0.85143 8.934 0.71043 8.819 0.61543Z"
											fill="#2E7D32"
										/>
										<path
											d="M6.87603 9.67149L5.29503 7.86449L6.89403 5.80849C7.06403 5.59049 7.02403 5.27649 6.80703 5.10649C6.59003 4.93649 6.27603 4.97649 6.10503 5.19349L4.62403 7.09749L3.37603 5.67149C3.19303 5.46149 2.87703 5.44249 2.67103 5.62449C2.46303 5.80649 2.44203 6.12249 2.62403 6.32949L3.99903 7.90149L2.60503 9.69349C2.43503 9.91149 2.47503 10.2255 2.69203 10.3955C2.78023 10.4636 2.88856 10.5006 3.00003 10.5005C3.14903 10.5005 3.29603 10.4345 3.39503 10.3075L4.67003 8.66749L6.12403 10.3285C6.17064 10.3825 6.22836 10.4258 6.29325 10.4555C6.35814 10.4852 6.42867 10.5006 6.50003 10.5005C6.61703 10.5005 6.73403 10.4595 6.82903 10.3765C7.03703 10.1945 7.05803 9.87849 6.87603 9.67149Z"
											fill="#FAFAFA"
										/>
									</g>
									<defs>
										<clipPath id="clip0_188_3741">
											<rect width="16" height="16" fill="white" />
										</clipPath>
									</defs>
								</svg>

								<span> Excel </span>
							</button>
							<button class="drop-data" @click="exportCSV">
								<svg
									width="16"
									height="17"
									viewBox="0 0 16 17"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_188_3760)">
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M5.26915 0.5H10.6872L15.4706 5.28344V14.4708C15.4706 15.5874 14.558 16.5 13.4415 16.5H5.26915C4.15261 16.5 3.23999 15.5874 3.23999 14.4708V2.52916C3.23999 1.41259 4.15258 0.5 5.26915 0.5Z"
											fill="#00733B"
										/>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M10.6872 0.5L15.4706 5.28344H11.2029C10.9185 5.28344 10.6872 5.05209 10.6872 4.76769V0.5ZM0.974885 7.31259H11.9948C12.2399 7.31259 12.4402 7.51284 12.4402 7.75794V11.8007C12.4402 12.0458 12.2399 12.2469 11.9948 12.2469H0.974885C0.729822 12.2469 0.529541 12.0458 0.529541 11.8007V7.75794C0.529541 7.51284 0.729791 7.31259 0.974885 7.31259Z"
											fill="#005C2F"
										/>
										<path
											d="M3.22933 9.22748V10.3321C3.22933 10.648 3.48633 10.905 3.80224 10.905C4.11812 10.905 4.37512 10.648 4.37512 10.3321C4.37512 10.2982 4.3818 10.2646 4.39478 10.2333C4.40776 10.2019 4.42679 10.1734 4.45077 10.1495C4.47476 10.1255 4.50324 10.1064 4.53458 10.0935C4.56592 10.0805 4.59951 10.0738 4.63343 10.0738C4.66735 10.0738 4.70094 10.0805 4.73228 10.0935C4.76362 10.1064 4.7921 10.1255 4.81608 10.1495C4.84007 10.1734 4.8591 10.2019 4.87208 10.2333C4.88506 10.2646 4.89174 10.2982 4.89174 10.3321C4.89174 10.9329 4.40299 11.4216 3.80221 11.4216C3.20143 11.4216 2.71265 10.9329 2.71265 10.3321V9.22748C2.71265 8.6267 3.20143 8.13795 3.80221 8.13795C4.40299 8.13795 4.89174 8.62673 4.89174 9.22748C4.89174 9.26141 4.88506 9.29499 4.87208 9.32633C4.8591 9.35767 4.84007 9.38615 4.81608 9.41014C4.7921 9.43412 4.76362 9.45315 4.73228 9.46613C4.70094 9.47911 4.66735 9.4858 4.63343 9.4858C4.59951 9.4858 4.56592 9.47911 4.53458 9.46613C4.50324 9.45315 4.47476 9.43412 4.45077 9.41014C4.42679 9.38615 4.40776 9.35767 4.39478 9.32633C4.3818 9.29499 4.37512 9.26141 4.37512 9.22748C4.37512 8.91161 4.11812 8.65461 3.80224 8.65461C3.48633 8.65461 3.22933 8.91161 3.22933 9.22748ZM6.28771 8.65461H6.69921C6.86537 8.65461 7.00052 8.78976 7.00052 8.95592C7.00052 9.02443 7.02774 9.09013 7.07618 9.13858C7.12462 9.18702 7.19033 9.21423 7.25883 9.21423C7.32734 9.21423 7.39305 9.18702 7.44149 9.13858C7.48993 9.09013 7.51715 9.02443 7.51715 8.95592C7.51715 8.50489 7.15021 8.13795 6.69918 8.13795H6.28768C5.76355 8.13795 5.33712 8.56398 5.33712 9.08758C5.33712 9.55105 5.57524 9.77711 5.77499 9.88517C6.02846 10.0223 6.34815 10.0381 6.56655 10.0381C6.8058 10.0381 7.00046 10.2324 7.00046 10.4711C7.00046 10.7103 6.8058 10.905 6.56655 10.905H6.15505C5.98893 10.905 5.85374 10.7698 5.85374 10.6037C5.85374 10.5352 5.82653 10.4695 5.77808 10.421C5.72964 10.3726 5.66394 10.3454 5.59543 10.3454C5.52692 10.3454 5.46122 10.3726 5.41277 10.421C5.36433 10.4695 5.33712 10.5352 5.33712 10.6037C5.33712 11.0547 5.70405 11.4216 6.15508 11.4216H6.56658C7.09071 11.4216 7.51715 10.9952 7.51715 10.4711C7.51715 9.94742 7.09071 9.52145 6.56658 9.52145C5.90743 9.52145 5.8538 9.32492 5.8538 9.08755C5.8538 8.84886 6.04843 8.65461 6.28771 8.65461ZM10.0799 8.15111C10.0149 8.12951 9.94397 8.13463 9.88273 8.16533C9.82148 8.19604 9.77494 8.24981 9.75333 8.31483L9.07949 10.3437L8.40565 8.31483C8.38396 8.24991 8.33741 8.19625 8.2762 8.16562C8.21499 8.135 8.14412 8.12992 8.07917 8.15149C8.01422 8.17307 7.96048 8.21954 7.92975 8.2807C7.89903 8.34186 7.89383 8.41271 7.9153 8.4777L8.83433 11.2448C8.85146 11.2962 8.88436 11.341 8.92836 11.3727C8.97237 11.4045 9.02524 11.4216 9.07949 11.4216C9.13374 11.4216 9.18661 11.4045 9.23062 11.3727C9.27462 11.341 9.30752 11.2962 9.32465 11.2448L10.2436 8.4777C10.2543 8.44551 10.2586 8.41152 10.2562 8.37768C10.2537 8.34385 10.2446 8.31082 10.2294 8.28049C10.2142 8.25017 10.1932 8.22313 10.1676 8.20093C10.1419 8.17873 10.1121 8.1618 10.0799 8.15111Z"
											fill="white"
										/>
									</g>
									<defs>
										<clipPath id="clip0_188_3760">
											<rect
												width="16"
												height="16"
												fill="white"
												transform="translate(0 0.5)"
											/>
										</clipPath>
									</defs>
								</svg>

								<span> CSV </span>
							</button>
						</template>
					</DropDown>
					<NavButton
						@click="openCreateDrawer"
						v-if="store.configurations.actions.create"
						class="bg-slate-500 text-white h-fit"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 8V16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
								stroke="white"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>

						<span> Create </span>
					</NavButton>
				</div>
			</div>
		</div>
		<div
			class="flex flex-col gap-2 p-[2rem] border rounded-md shadow bg-table-gray"
		>
			<el-table :data="store.tableData" style="width: 100%">
				<el-table-column
					v-for="item in filteredTableData"
					:key="item"
					:label="item.name"
					:prop="item.name"
				>
				</el-table-column>

				<slot />
				<el-table-column
					label="Operations"
					v-if="store.configurations.actions.showOperations"
				>
					<template #default="scope">
						<div class="flex gap-2">
							<div
								@click="handleEdit(scope.$index, scope.row)"
								v-if="store.configurations.actions.edit"
								class="p-2 rounded-full bg-slate-300 w-fit shadow"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clip-path="url(#clip0_307_2611)">
										<path
											d="M7.33337 2.66666H4.53337C3.41327 2.66666 2.85322 2.66666 2.42539 2.88464C2.04907 3.07639 1.74311 3.38235 1.55136 3.75867C1.33337 4.1865 1.33337 4.74655 1.33337 5.86666V11.4667C1.33337 12.5868 1.33337 13.1468 1.55136 13.5746C1.74311 13.951 2.04907 14.2569 2.42539 14.4487C2.85322 14.6667 3.41327 14.6667 4.53337 14.6667H10.1334C11.2535 14.6667 11.8135 14.6667 12.2414 14.4487C12.6177 14.2569 12.9236 13.951 13.1154 13.5746C13.3334 13.1468 13.3334 12.5868 13.3334 11.4667V8.66666M5.33336 10.6667H6.44972C6.77584 10.6667 6.9389 10.6667 7.09235 10.6298C7.2284 10.5972 7.35846 10.5433 7.47775 10.4702C7.61231 10.3877 7.72761 10.2724 7.95821 10.0418L14.3334 3.66666C14.8857 3.11437 14.8857 2.21894 14.3334 1.66666C13.7811 1.11437 12.8857 1.11437 12.3334 1.66665L5.9582 8.04182C5.72759 8.27242 5.61229 8.38772 5.52984 8.52228C5.45673 8.64157 5.40286 8.77163 5.3702 8.90768C5.33336 9.06113 5.33336 9.22419 5.33336 9.55031V10.6667Z"
											stroke="#3C475D"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</g>
									<defs>
										<clipPath id="clip0_307_2611">
											<rect width="16" height="16" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</div>
							<div
								@click="handleDelete(scope.$index, scope.row)"
								v-if="store.configurations.actions.delete"
								class="p-2 rounded-full bg-slate-300 w-fit shadow"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M6 2H10M2 4H14M12.6667 4L12.1991 11.0129C12.129 12.065 12.0939 12.5911 11.8667 12.99C11.6666 13.3412 11.3648 13.6235 11.0011 13.7998C10.588 14 10.0607 14 9.00623 14H6.99377C5.93927 14 5.41202 14 4.99889 13.7998C4.63517 13.6235 4.33339 13.3412 4.13332 12.99C3.90607 12.5911 3.871 12.065 3.80086 11.0129L3.33333 4M6.66667 7V10.3333M9.33333 7V10.3333"
										stroke="#3C475D"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="w-full justify-between flex">
				<div class="flex gap-2 items-center">
					<div class="text-slate-500 text-sm font-normal">Rows per page:</div>
					<el-input-number
						:controls="false"
						v-model="props.store.pagination.perPage"
						:min="props.store.pagination.minPerPage"
						:max="props.store.pagination.maxPerPage"
						size="small"
						@input="rowChange"
					/>
				</div>
				<div
					class="w-[153px] h-[17px] justify-start items-start gap-3 inline-flex items-center"
				>
					<div class="text-slate-500 text-sm font-normal">
						{{ props.store.pagination.from }} -
						{{ props.store.pagination.to }} of
						{{ props.store.pagination.total }}
					</div>
					<div class="justify-start items-start gap-2 flex">
						<button
							:class="{
								'text-gray-500': store.pagination.prev_page_url === null,
							}"
							:disabled="store.pagination.prev_page_url === null"
							class="-rotate-180"
							@click="gotoPage(props.store.pagination.current_page - 1)"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8.25 4.5l7.5 7.5-7.5 7.5"
								/>
							</svg>
						</button>
						<button
							:class="{
								'text-gray-500': store.pagination.next_page_url === null,
							}"
							:disabled="store.pagination.next_page_url === null"
							@click="gotoPage(props.store.pagination.current_page + 1)"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8.25 4.5l7.5 7.5-7.5 7.5"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<TableModal
		:showEditModal="props.store.editDrawer"
		@close="props.store.setEditDrawerVisibility(false)"
	>
		<el-form
			ref="editForm"
			:rules="props.store.configurations.editFormRules"
			:model="createEditData"
		>
			<slot name="editModal"> </slot>

			<div
				class="bg-table-header py-4 flex gap-1 w-full px-7 absolute bottom-0 w-full left-0"
			>
				<NavButton
					class="bg-slate-500 px-4 text-white py-2"
					@click.prevent="submitEditForm(editForm)"
				>
					Submit
				</NavButton>
				<NavButton
					class="bg-white text-slate-500 px-4 py-2"
					@click.prevent="store.setEditDrawerVisibility(false)"
				>
					Cancel
				</NavButton>
			</div>
		</el-form>
	</TableModal>
	<TableModal
		:showEditModal="props.store.createDrawer"
		@close="props.store.setCreateDrawerVisibility(false)"
	>
		<el-form
			ref="createForm"
			:model="createFormData"
			:rules="props.store.configurations.createFormRules"
		>
			<slot name="createModal"> </slot>
			<div
				class="bg-table-header py-4 flex gap-1 w-full px-7 absolute bottom-0 w-full left-0"
			>
				<NavButton
					class="bg-slate-500 px-4 text-white py-2"
					@click.prevent="submitCreateForm(createForm)"
				>
					Submit
				</NavButton>
				<NavButton
					class="bg-white text-slate-500 px-4 py-2"
					@click.prevent="props.store.setCreateDrawerVisibility(false)"
				>
					Cancel
				</NavButton>
			</div>
		</el-form>
	</TableModal>
</template>
