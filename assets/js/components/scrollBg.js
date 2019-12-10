var programIcons = [
	{name: 'leaves', x: 45, y: -50, z: 0, rotate: 33},
	{name: 'sparkles', x: -10, y: -28, z: 0, rotate: -33},
	{name: 'water', x: 15, y: -43, z: 0, rotate: 0},
	{name: 'windshield', x: 45, y: -20, z: 0, rotate: -100},
	{name: 'wiper', x: 50, y: 9, z: 0, rotate: 0},
	{name: 'water', x: 10, y: -10, z: 0, rotate: -60},
	{name: 'leaves', x: 20, y: 25, z: -10, rotate: 0},
];

var businessIcons = [
	{name: 'leaves', x: -45, y: -40, z: 0, rotate: 33},
	{name: 'sparkles', x: 4, y: -20, z: 0, rotate: -33},
	{name: 'water', x: 15, y: -46, z: 0, rotate: 30},
	{name: 'windshield', x: 33, y: -31, z: 0, rotate: -10},
	{name: 'wiper', x: 20, y: -5, z: 0, rotate: 0},
	{name: 'leaves', x: -20, y: 15, z: -10, rotate: 180},
	{name: 'water', x: -40, y: -7, z: 0, rotate: 30},
];

Vue.component('scroll-bg', {
	template: `
    <div class="program_bg_wrapper" :style="style">
      <div v-for="icon in iconBlocks" :key="icon.name" :style="icon.style" class="program_icon">
        <div :class="icon.class"></div>
      </div>
    </div>
  `,
	props: {
		initIcons: Array,
		parallaxDepth: {
			type: Number,
			default: 5
		}
	},
	computed: {
		iconBlocks() {
			return this.icons.map(({name, x, y, z, rotate, ...icon}, index) => ({
				...icon,
				name: name + index,
				class: 'icon icon-' + name,
				style: {
					transform: `translate3d(${x}%, ${y}%, ${z}px) rotate(${rotate}deg)`,
				},
			}));
		},
		style() {
			return {
				transform: `translateY(${this.top}px)`,
			}
		},
	},
	data: function() {
		return {
			top: 0,
			timeout: null,
			delayPassed: true,
			icons: [...this.initIcons],
		};
	},
	methods: {
		updateIcons() {
			const top = window.scrollY;
			this.top = top/this.parallaxDepth;
			this.icons = this.icons.map((i, index) => {
				const icon = {...i};
				const dIcon = this.initIcons[index];
				icon.rotate = dIcon.rotate + (top/50 * (index%3 + 1) * (index%2 ? 1 : -1));
				icon.z = dIcon.z + top/500;
				return icon;
			});
		},
		handleScroll() {
			this.updateIcons();
		},
	},
	mounted() {
		this.$nextTick(() => {
			window.addEventListener('scroll', this.handleScroll);
		});
		this.handleScroll();
	},
});
Vue.component('program-bg', {
	template: `
    <scroll-bg :initIcons="defIcons"></scroll-bg>
  `,
	data() {
		return {
			defIcons: [...programIcons],
		}
	}
});
Vue.component('business-bg', {
	template: `
    <scroll-bg :initIcons="defIcons" :parallaxDepth="3"></scroll-bg>
  `,
	data() {
		return {
			defIcons: [...businessIcons],
		}
	}
});
