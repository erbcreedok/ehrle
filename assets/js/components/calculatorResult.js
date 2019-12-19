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
					<strong class="text">{{account.value}}</strong>
				</li>
			</ul>
		</template>
		<div class="mb-4 pt-2">
			<button class="btn btn_primary">Получить консультацию</button>
		</div>
	</div>
</div>
`;

const BUILD = [10020000,	19590000,	27752500,	33400000,	34282500,	35915000];

const PAYBACK_PERIOD = [
	[142, 	 36, 	 26, 	 27, 	 23, 	 20],
	[168, 	 33, 	 25, 	 29, 	 24, 	 21],
	[230, 	 38, 	 28, 	 29, 	 24, 	 22],
];

const CIR = [
	[50.5,	38.2,	31.6,	38.0,	34.1,	31.4,],
	[59.0,	41.0,	34.1,	40.5,	36.5,	33.8,],
	[63.0,	40.6,	33.2,	40.1,	35.80,	32.9,],
];

const CARS_PER_BOX = [	2500,	2400,	2300,	2200,	2100,	2000];

const NET_PROFIT = [
	[84375,		137700,		197943.75,	252450,		301218.75,	344250],
	[50625,		82620,		118766.25,	151470,		180731.25,	206550],
	[112500,	1075600,	1954600,		2285600,	3020500,		3676000],
];

const WASH_PRICE = [	500,	500,	500,	500,	500,	500];

const BOILER_PERCENTS = [99.5, 100, 90];
const CONTAINER_PRICE = [	15843780,	21694833,	26124822,	32855139,	38729799,	43138890];
const REVENUE = [
	[304054.054054054,	1810774.41077441,	2926047.90419162,	3815692.82136895,	4704828.66043614,	5478390.46199702,],
	[93750,	153000,	219937.5,	280500,	334687.5,	382500,],
	[56250,	91800,	131962.5,	168300,	200812.5,	229500,]
];
const POSTS_VACUUM = [
	[	27991119,	27368436,	25863780],
	[	43412172, 38731794, 41284833],
	[	56004661, 51698512,	53877322],
	[	68382478, 70178932, 66255139],
	[	75139638, 75865650, 73012299],
	[	81181229, 82302368, 79053890],
];

const POSTS_BOILER = [
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
			if (values.posts && values.vacuum) {
				sum += POSTS_VACUUM[values.posts-1][values.vacuum-1];
				accounts.push({text: 'Средний срок окупаемости', value: PAYBACK_PERIOD[values.vacuum-1][values.posts - 1] + ' мес.'});
				accounts.push({text: 'CIR', value: CIR[values.vacuum-1][values.posts - 1] + '%'});
				accounts.push({text: 'Количество машин в сутки на 1 бокс', value: CARS_PER_BOX[values.posts - 1] + ''});
				accounts.push({text: 'Средний чек (1 мойка)', value: this.maskPrice(WASH_PRICE[values.posts - 1]) + ' тг.'});
				var revenue = REVENUE[1][values.posts - 1];
				if (values.vacuum === 1 || values.vacuum === 2) {
					revenue += REVENUE[values.vacuum-1][values.posts - 1];
				}
				accounts.push({text: 'Среднемесячная выручка ', value: this.maskPrice(revenue) + ' тг.'});
			}
			if (values.posts && values.boiler) {
				const cr = CONTAINER_PRICE[values.posts - 1];
				sum -=  (cr - cr * (BOILER_PERCENTS[values.boiler - 1] / 100));
			}
			if (values.land === 2 && values.price) {
				sum += (values.price - 0)
			}
			// if (values.land === 3 && values.price) {
			// 	sum += (values.price - 0)
			// }
			if (values.posts && !values.build && values.buildPrice) {
				sum -= BUILD[values.posts - 1];
				sum += (values.buildPrice - 0);
			}
			this.accountingList = [...accounts];
			this.sum = sum;
		},
		calcDetails(values) {
			const accounts = [];

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