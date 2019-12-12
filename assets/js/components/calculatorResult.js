var calculatorResultsTemplate = `
<div class="calculator_result" :class="{'calculator_result-fixed': fixed}">
	<div class="calculator_result_wrapper">
		<div class="calculator_result_header my-4">
			<div class="label mb-2">Стоимость вашего проекта:</div>
			<div class="heading heading-light" v-if="sum">{{price}} <span class="small" style="font-weight: 500">₸</span></div>
			<div class="heading heading-light" v-else><span class="small">Стоймость не расчитана</span></div>
		</div>
		<template v-if="accountingList.length">
			<div class="calculator_result_label d-flex justify-content-between flex-wrap align-items-center mt-4 mb-2">
				<div class="label mb-1">Результаты расчёта</div>
				<span class="pseudo_link" v-if="showDetails" @click="closeDetails">Скрыть детали</span>
				<span class="pseudo_link" v-if="!showDetails" @click="openDetails">Показать детали</span>
			</div>
			<ul class="calculator_result_list ul_custom" :class="{'calculator_result_list-hide': !showDetails}">
				<li class="calculator_result_item d-flex flex-wrap justify-content-between" v-for="account in accountingList" :key="account.text">
					<span class="text">{{account.text}}</span>
					<strong class="text">{{maskPrice(account.price)}} ₸</strong>
				</li>
			</ul>
		</template>
		<div class="mb-4 pt-2">
			<button class="btn btn_primary">Получить консультацию</button>
		</div>
	</div>
</div>
`;

const POSTS_BOILER = [
	[null, 		14557, 		13702	],
	[56059, 	56059, 		50897	],
	[67506, 	67506, 		62344	],
	[84897, 	85628, 		74985	],
	[100077, 	100808, 	90165	],
	[111470, 	112201, 	102743],
];

const POSTS_VACUUM = [
	[null, 		14557, 		13702	],
	[56059, 	56059, 		50897	],
	[67506, 	67506, 		62344	],
	[84897, 	85628, 		74985	],
	[100077, 	100808, 	90165	],
	[111470, 	112201, 	102743],
];
const EURO_CURRENCY = 430;
const DOLLAR_CURRENCY = 384;


Vue.component('calculator-result', {
	name: 'calculator-result',
	template: calculatorResultsTemplate,
	props: {
		values: Object,
		fixed: Boolean,
	},
	data() {
		return {
			sum: 0,
			showDetails: true,
			accountingList: [],
		}
	},
	computed: {
		price() {
			return this.maskPrice(this.sum);
		},
	},
	watch: {
		values(to) {
			if (to) {
				this.calculate({...to});
			}
		}
	},
	methods: {
		calculate(values) {
			const accounts = [];
			let sum = 0;
			if (values.posts && values.boiler) {
				sum += POSTS_BOILER[values.posts-1][values.boiler-1] * EURO_CURRENCY;
			}
			this.accountingList = [...accounts];
			this.sum = sum;
		},
		closeDetails() {
			this.showDetails = false;
		},
		openDetails() {
			this.showDetails = true;
		},
		maskPrice(sum) {
			return (sum.toFixed(0)+'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
	},
});