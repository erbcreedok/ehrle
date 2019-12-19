var calculatorResultsTemplate = `
<div class="calculator_result" :class="{'calculator_result-fixed': fixed}">
	<div class="calculator_result_wrapper">
		<div class="calculator_result_header my-4">
			<div class="label mb-2" v-if="revenue">Ежемесячная выручка:</div>
			<div class="label mb-2" v-else>Стоймость не расчитана:</div>
			<div class="heading heading-light" v-if="revenue" v-html="revenue"></div>
			<div class="opacity-middle" v-else>Выберите кол-во постов и пылесосов</div>
		</div>
		<template v-if="accountingList.length">
			<div class="calculator_result_label d-flex justify-content-between flex-wrap align-items-center mt-4 mb-2">
				<div class="label mb-1">Результаты расчёта</div>
				<span class="pseudo_link" v-if="showDetails" @click="closeDetails">Скрыть детали</span>
				<span class="pseudo_link" v-if="!showDetails" @click="openDetails">Показать детали</span>
			</div>
			<ul class="calculator_result_list ul_custom" :class="{'calculator_result_list-hide': !showDetails}">
				<li class="calculator_result_item d-flex flex-wrap justify-content-between" v-for="account in accountingList" :key="account.text">
					<span class="text" v-html="account.text"></span>
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

var BUILD = [10020000,	19590000,	27752500,	33400000,	34282500,	35915000];

var PAYBACK_PERIOD = [
	[142, 	 36, 	 26, 	 27, 	 23, 	 20],
	[168, 	 33, 	 25, 	 29, 	 24, 	 21],
	[230, 	 38, 	 28, 	 29, 	 24, 	 22],
];

var CIR = [
	[50.5,	38.2,	31.6,	38.0,	34.1,	31.4,],
	[59.0,	41.0,	34.1,	40.5,	36.5,	33.8,],
	[63.0,	40.6,	33.2,	40.1,	35.80,	32.9,],
];

var CARS_PER_BOX = [	2500,	2400,	2300,	2200,	2100,	2000];

var NET_PROFIT = [
	[84375,		137700,		197943.75,	252450,		301218.75,	344250],
	[50625,		82620,		118766.25,	151470,		180731.25,	206550],
	[112500,	1075600,	1954600,		2285600,	3020500,		3676000],
];

var WASH_PRICE = [	500,	500,	500,	500,	500,	500];

var BOILER_PERCENTS = [99.5, 100, 90];
var CONTAINER_PRICE = [	5633559,	21694833,	26124822,	32855139,	38729799,	43138890];
var REVENUE = [
	[93750,	153000,	219937.5,	280500,	334687.5,	382500,],
	[56250,	91800,	131962.5,	168300,	200812.5,	229500,],
	[304054.054054054,	1810774.41077441,	2926047.90419162,	3815692.82136895,	4704828.66043614,	5478390.46199702,],
];
var PURE_REVENUE = [
  [84375, 	  137700, 	  197944, 	  252450, 	  301219, 	  344250],
  [50625, 	  82620, 	  118766, 	  151470, 	  180731, 	  206550],
  [112500, 		1075600, 	  1954600, 	  2285600, 	  3020500, 	  3676000],
]


var POSTS_VACUUM = [
	[	27991119,	27368436,	25863780],
	[	43412172, 38731794, 41284833],
	[	56004661, 51698512,	53877322],
	[	68382478, 70178932, 66255139],
	[	75139638, 75865650, 73012299],
	[	81181229, 82302368, 79053890],
];

var POSTS_BOILER = [
	[null, 		14557, 		13702	],
	[56059, 	56059, 		50897	],
	[67506, 	67506, 		62344	],
	[84897, 	85628, 		74985	],
	[100077, 	100808, 	90165	],
	[111470, 	112201, 	102743],
];
var EURO_CURRENCY = 430;
var DOLLAR_CURRENCY = 384;

function getNumbers(str) {
	return str.match(/\d+/g).join('');
}

Vue.component('calculator-result', {
	name: 'calculator-result',
	template: calculatorResultsTemplate,
	props: {
		values: Object,
		fixed: Boolean,
	},
	data() {
		return {
			revenue: 0,
			showDetails: true,
			accountingList: [],
		}
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
			var accounts = [];
			var sum = 0;
			var revenue = 0;
			var pure_revenue = 0;
			var total_outcomes = 0;
			if (values.posts && values.vacuum) {
				sum += POSTS_VACUUM[values.posts-1][values.vacuum-1];
        revenue = REVENUE[2][values.posts - 1];
        pure_revenue = PURE_REVENUE[2][values.posts - 1];
        if (values.vacuum === 1 || values.vacuum === 2) {
          revenue += REVENUE[values.vacuum-1][values.posts - 1];
          pure_revenue += PURE_REVENUE[values.vacuum-1][values.posts - 1];
        }
        total_outcomes = revenue - pure_revenue;
        if (values.boiler) {
          var cr = CONTAINER_PRICE[values.posts - 1];
          sum -=  (cr - cr * (BOILER_PERCENTS[values.boiler - 1] / 100));
        }
        if (values.land === 2 && values.price) {
          sum += (getNumbers(values.price) - 0)
        }
        if (values.land === 3 && values.price) {
        	revenue -= (getNumbers(values.price) - 0)
        	pure_revenue -= (getNumbers(values.price) - 0)
        }
        if (!values.build && values.buildPrice) {
          sum -= BUILD[values.posts - 1];
          sum += (getNumbers(values.buildPrice) - 0);
        } else if (!values.build){
          sum -= BUILD[values.posts - 1];
        }
        accounts.push({text: 'Средний срок окупаемости', value: Math.ceil(sum/revenue) + ' мес.'});
        accounts.push({
					text: `CIR <span class="tooltip_container"><span class="icon icon-small icon-faq"></span><span class="tooltip_body">Cost Income Ratio (CIR) -- отношение операционных затрат к операционному доходу. CIR активно используется во всем мире для оценки эффективности банка инвесторами, акционерами, рейтинговыми агентствами и т.д.</span></span>`,
					value: CIR[values.vacuum-1][values.posts - 1] + '%'});
        accounts.push({text: 'Количество машин в сутки на 1 бокс', value: Math.floor(CARS_PER_BOX[values.posts - 1]/30.5) + ''});
        accounts.push({text: 'Средний чек (1 мойка)', value: this.maskPrice(WASH_PRICE[values.posts - 1]) + ' тг.'});
        accounts.push({text: 'Среднемесячная выручка', value: this.maskPrice(revenue) + ' тг.'});
        if (values.land === 3 && values.buildPrice) {
          accounts.push({text: 'Аренда в месяц', value: this.maskPrice(getNumbers(values.price) - 0) + ' тг.'});
				}
				accounts.push({text: 'Все расходы на месяц', value: this.maskPrice(total_outcomes) + ' тг.'});


        accounts.push({text: 'Полная стоймость стройки ', value: this.maskPrice(sum) + ' тг.'});
        if (revenue < 0) {
          this.revenue = '<span class="small opacity-high">Мойка не окупается</span>';
        } else {
        	this.revenue = this.maskPrice(pure_revenue) + '  <span class="small" style="font-weight: 500">₸</span>';
				}
        this.accountingList = [...accounts];
			}
		},
		closeDetails() {
			this.showDetails = false;
		},
		openDetails() {
			this.showDetails = true;
		},
		maskPrice(revenue) {
			return (revenue.toFixed(0)+'').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
	},
});