var calculatorResultsTemplate = `
<div class="calculator_result" :class="{'calculator_result-fixed': fixed}">
	<div class="calculator_result_wrapper">
		<div class="calculator_result_header my-4">
			<div class="label mb-2">Стоимость вашего проекта:</div>
			<div class="heading heading-light">12,220,000 <span class="small" style="font-weight: 500">₸</span></div>
		</div>
		<div class="calculator_result_label d-flex justify-content-between flex-wrap align-items-center mt-4 mb-2">
			<div class="label mb-1">Результаты расчёта</div>
			<span class="pseudo_link" v-if="showDetails" @click="closeDetails">Скрыть детали</span>
			<span class="pseudo_link" v-if="!showDetails" @click="openDetails">Показать детали</span>
		</div>
		<ul class="calculator_result_list ul_custom" :class="{'calculator_result_list-hide': !showDetails}">
			<li class="calculator_result_item d-flex flex-wrap justify-content-between">
				<span class="text">Стоймость мойка</span>
				<strong class="text">8,820,000 ₸</strong>
			</li>
			<li class="calculator_result_item d-flex flex-wrap justify-content-between">
				<span class="text">Стоймость мойка</span>
				<strong class="text">8,820,000 ₸</strong>
			</li>
			<li class="calculator_result_item d-flex flex-wrap justify-content-between">
				<span class="text">Стоймость мойка</span>
				<strong class="text">8,820,000 ₸</strong>
			</li>
			<li class="calculator_result_item d-flex flex-wrap justify-content-between">
				<span class="text">Стоймость мойка</span>
				<strong class="text">8,820,000 ₸</strong>
			</li>
			<li class="calculator_result_item d-flex flex-wrap justify-content-between">
				<span class="text">Стоймость мойка</span>
				<strong class="text">8,820,000 ₸</strong>
			</li>
			<li class="calculator_result_item d-flex flex-wrap justify-content-between">
				<span class="text">Стоймость мойка</span>
				<strong class="text">8,820,000 ₸</strong>
			</li>
		</ul>
		<div class="mb-4 pt-2">
			<button class="btn btn_primary">Получить консультацию</button>
		</div>
	</div>
</div>
`;

Vue.component('calculator-result', {
	name: 'calculator-result',
	template: calculatorResultsTemplate,
	props: {
		values: Object,
		fixed: Boolean,
	},
	data() {
		return {
			showDetails: true,
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
		},
		closeDetails() {
			this.showDetails = false;
		},
		openDetails() {
			this.showDetails = true;
		},
	},
});