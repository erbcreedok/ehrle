Vue.component('scroll-top', {
	props: ['percent'],
	methods: {
		scrollTop() {
			window.scrollTo(0, 0);
		}
	},
	template:
		`<button class="btn_circle scroll_to_top" @click="scrollTop"><img src="./assets/images/arrow-up.svg" alt=""></button>`,
});