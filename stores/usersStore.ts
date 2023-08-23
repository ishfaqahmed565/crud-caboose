export const useUsersStore = definePiniaStore("usersStore", {
	state: () => ({
		createDrawer: false,
		editDrawer: false,
		createFormRules: [],
		editFormRules: [],
		filterData: {},
		tableData: [
			{
				date: "2016-05-03",
				name: "Tom",
				address: "No. 189, Grove St, Los Angeles",
			},
			{
				date: "2016-05-02",
				name: "Tom",
				address: "No. 189, Grove St, Los Angeles",
			},
			{
				date: "2016-05-04",
				name: "Tom",
				address: "No. 189, Grove St, Los Angeles",
			},
			{
				date: "2016-05-01",
				name: "Tom",
				address: "No. 189, Grove St, Los Angeles",
			},
		],
		dataForEdit: {},
		pagination: {
			minPerPage: 1,
			maxPerPage: 20,
			perPage: 10,
			from: 0,
			to: 5,
			total: 100,
		},
		configurations: {
			editFormRules: {},
			createFormRules: {},

			title: "Users",
			cols: [
				{
					name: "date",
					type: "string",
					searchable: true,
					show: true,
				},
				{
					name: "name",
					type: "string",
					searchable: true,
					show: true,
				},
				{
					name: "address",
					type: "string",
					searchable: true,
					show: true,
				},
			],
			actions: {
				create: true,
				delete: true,
				edit: true,
				export: true,
				showOperations: true,
			},
		},
	}),
	actions: {
		async getData(perPage = 10) {},
		setPerPage(page: number) {
			this.pagination.perPage = page;
		},
		setFilterData(data: any) {
			this.filterData = data;
		},
		createTableData(formData: any) {
			console.log("creating a user" + formData);
		},
		editTableData(formData: any) {
			console.log("editing a user" + formData);
		},
		setCreateDrawerVisibility(bool: boolean) {
			this.createDrawer = bool;
		},
		setEditDrawerVisibility(bool: boolean) {
			this.editDrawer = bool;
		},
		setDataForEdit(data: any) {
			this.dataForEdit = data;
		},
		deleteData(data: any) {
			console.log(data);
		},
	},
	getters: {},
});
