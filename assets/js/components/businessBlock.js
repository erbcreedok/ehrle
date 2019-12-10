Vue.component('business-block', {
	name: 'business-block',
	template: `
    <div class="business_block" :class="{'business_block-hidden': !inView}" v-view="handleView"><slot></slot></div>
    `,
	data() {
		return {
			inView: false,
		};
	},
	methods: {
		handleView(options) {
			if (!this.inView && options.percentInView > 0.3) {
				this.inView = true;
			}
		}
	}
});