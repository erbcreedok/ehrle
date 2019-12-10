Vue.component('percent-svg', {
	props: ['percent'],
	computed: {
		strokeDashOffset() {
			var hundred = 534;
			var part = this.percent / 100;
			return hundred - hundred*part;
		},
		degree() {
			return 360 * this.percent / 100;
		},
		rotate() {
			return `rotate(${this.degree})`;
		}
	},
	template:
		`<svg xmlns="http://www.w3.org/2000/svg" width="190" height="190" viewBox="0 0 190 190">
      <g fill="none" fill-rule="evenodd">
       <circle cx="95" cy="95" r="85" stroke="#ecf0f1" stroke-width="8"/>
       <circle stroke="#D83139" stroke-width="8" cx="95" cy="95" r="85" transform="rotate(-90) translate(-190 0)" stroke-dasharray="534" :stroke-dashoffset="strokeDashOffset"/>
       <g transform="translate(95 95) rotate(-135)">
         <circle cx="60" cy="60" r="10" fill="#D83139" :transform="rotate"/>
        </g>
      </g>
    </svg>`,
});