var calculatorTemplate = `
<div class="calculator">
	<div class="label my-3">1. Детали мойки</div>
	<div class="row">
		<div class="col-md-6 mb-4">
			<div class="text mb-2">Количество постов для мойки</div>
			<div class="radio_buttons ">
				<div v-for="i in posts" :key="i" class="radio_button radio_button-squared" :class="{'radio_button-selected': i===selected.posts}" @click="selected.posts = i; handleUpdate()">{{i}}</div>
			</div>
		</div>
		<div class="col-md-6 mb-4">
			<div class="text mb-2">Количество постов пылесоса <span class="tooltip_container"><span class="icon icon-small icon-faq"></span><span class="tooltip_body">Количество постов с пылесосом в автомойке</span></span></div>
			<div class="radio_buttons">
				<div class="radio_button" :class="{'radio_button-selected': 1===selected.vacuum}" @click="selected.vacuum = 1; handleUpdate()">2</div>
				<div class="radio_button" :class="{'radio_button-selected': 2===selected.vacuum}" @click="selected.vacuum = 2; handleUpdate()">1</div>
				<div class="radio_button" :class="{'radio_button-selected': 3===selected.vacuum}" @click="selected.vacuum = 3; handleUpdate()">Без пылесоса</div>
			</div>
		</div>
		<div class="col-md-6 mb-4 pr-md-5">
			<div class="text mb-2">Тип котла</div>
			<div class="form_select form_select-block pr-md-2" :class="{'form_select-selected': !!selected.boiler}">
				<select v-model="selected.boiler" @change="handleUpdate" :class="{'opacity-middle': !selected.boiler}">
					<option v-if="!selected.boiler" :value="null" disabled selected>Выберите вариант</option>
					<option v-for="i in boiler" :disabled="i.value===1 && selected.posts===1" :value="i.value">{{i.text}}</option>
				</select>
				<span class="form_select_arrow"></span>
			</div>
		</div>
		<div class="col-md-6"></div>
		<div class="col-md-6 mb-4 pr-md-5">
			<div class="text mb-2">Собственный участок</div>
			<div class="form_select form_select-block pr-md-2" :class="{'form_select-selected': !!selected.land}">
				<select v-model="selected.land" @change="handleUpdate" :class="{'opacity-middle': !selected.land}">
					<option v-if="!selected.land" :value="null" disabled selected>Выберите вариант</option>
					<option v-for="i in land" :key="i.value" :value="i.value">{{i.text}}</option>
				</select>
				<span class="form_select_arrow"></span>
			</div>
		</div>
		<div class="col-md-6 mb-4">
			<template v-if="selected.land && selected.land !== 1">
				<div class="text mb-2" v-if="selected.land == 3">Цена за аренду в месяц <strong class="small opacity-middle">(в тенге)</strong></div>
				<div class="text mb-2" v-else>Цена за участок <strong class="small opacity-middle">(в тенге)</strong></div>
				<div class="form_input">
					<input type="text" v-currency="currency" v-model="selected.price" @input="handleUpdate" placeholder="10,000,000 ₸"/>
				</div>
			</template>
		</div>
		<div class="col-md-6 mb-4">
			<div class="text mb-2">Строительство под ключ</div>
			<div class="form_checkboxes">
				<label for="type" class="form_checkbox">
					<input type="checkbox" id="type" v-model="selected.build" @change="handleUpdate">
					<span class="form_checkbox_label">Да, постройте мне мойку</span>
					<span class="form_checkbox_icon"></span>
				</label>
			</div>
		</div>
		<div class="col-md-6 mb-4">
			<template v-if="!selected.build">
				<div class="text mb-2">Цена за строительство <strong class="small opacity-middle">(в тенге)</strong></div>
				<div class="form_input">
					<input type="text" v-currency="currency" v-model="selected.buildPrice" @input="handleUpdate" placeholder="10,000,000 ₸"/>
				</div>
			</template>
		</div>
	</div>
</div>
`;
Vue.component('calculator', {
	name: 'calculator',
	template: calculatorTemplate,
	directives: {mask: VueTheMask.mask},
	data() {
		return {
      currency: {distractionFree: false, currency: {'suffix': ' ₸'}, valueAsInteger: true, precision: 0},
			selected: {
				posts: null,
				vacuum: null,
				boiler: null,
				build: null,
				land: null,
				price: null,
				buildPrice: null,
			},
			posts: [1, 2, 3, 4, 5, 6],
			land: [
				{value: 1, text: 'У меня собственный участок'},
				{value: 2, text: 'Я буду покупать участок'},
				{value: 3, text: 'Я буду арендовать участок'}
			],
			boiler: [
				{value: 1, text: 'На газе'},
				{value: 2, text: 'На дизеле'},
				{value: 3, text: 'На электричестве'}
			],
		};
	},
	methods: {
		handleUpdate() {
			if (this.selected.posts === 1 && this.selected.boiler === 1) {
				this.selected.boiler = null;
			}
			this.$emit('change', {...this.selected});
		}
	}
});