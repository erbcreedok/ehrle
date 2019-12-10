Vue.component('factor-circle', {
	template:
		`<div class="factor_item_image" v-view="handleView">
      <percent-svg :percent="percentShow"></percent-svg>
      <div class="title">{{percentShow}}%</div>
    </div>`,
	props: ['percent', 'duration', 'isSelected'],
	data() {
		return {
			percentShow: this.percent - 0,
			interval: null,
			animatedOnce: false,
			windowWidth: window.innerWidth,
		};
	},
	computed: {
		durationInt() {
			if (!this.duration) {
				return 1000;
			}
			return this.duration - 0;
		},
		percentInt() {
			return this.percent - 0;
		},
		delay() {
			if (this.percentInt === 0) return 0;
			return this.durationInt / this.percentInt;
		},
		isMobile() {
			return this.windowWidth <= factorBreakpoint;
		}
	},
	watch: {
		isSelected(to) {
			if (to) {
				this.handleView({percentInView: 1});
			}
		}
	},
	methods: {
		prepareToAnimate() {
			this.stopAnimate();
			this.percentShow = 0;
		},
		startAnimate() {
			this.interval = setInterval((function() {
				this.percentShow += 1;
				if (this.percentShow >= this.percentInt) {
					this.stopAnimate();
				}
			}).bind(this), this.delay);
		},
		stopAnimate() {
			this.percentShow = this.percentInt;
			if (this.interval) {
				clearInterval(this.interval);
			}
		},
		handleView(options) {
			if (options.percentInView > .5 && !this.animatedOnce) {
				this.prepareToAnimate();
				if (!this.isMobile || this.isSelected) {
					this.startAnimate();
					this.animatedOnce = true;
				}
			}
		},
		getWindowWidth() {
			this.windowWidth = window.innerWidth;
		},
	},
	mounted() {
		this.$nextTick(function() {
			window.addEventListener('resize', this.getWindowWidth);
		});
		this.getWindowWidth();
	},
});