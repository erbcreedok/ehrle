var factorBreakpoint = 795;
var conceptsBreakpoint = 920;
var productsBreakpoint = 776;
Vue.use(vueView());

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
       <circle cx="95" cy="95" r="85" stroke="#ECF0F1" stroke-width="8"/>
       <circle stroke="#D83139" stroke-width="8" cx="95" cy="95" r="85" transform="rotate(-90) translate(-190 0)" stroke-dasharray="534" :stroke-dashoffset="strokeDashOffset"/>
       <g transform="translate(95 95) rotate(-135)">
         <circle cx="60" cy="60" r="10" fill="#D83139" :transform="rotate"/>
        </g>
      </g>
    </svg>`,
});

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

(function () {
  new Vue({
    el: '#app',
    data: {
      showModal: false,
      productActiveIndex: null,
      productGoing: '',
      conceptActiveIndex: null,
      conceptGoing: '',
      selectedFactor: 0,
      selectedNumber: 0,
      selectedAward: 0,
      windowWidth: window.innerWidth,
      selectedLang: 'ru',
      languages: ['ru', 'kz', 'en'],
      isLanguagesSelecting: false,
      isMenuOpened: false,
      selectedProgram: null,
      videoPlayed: false,
    },
    computed: {
      factorElements() {
        return document.querySelectorAll('.factor_item');
      },
      factorsLength() {
        return this.factorElements.length;
      },
      numberElements() {
        return document.querySelectorAll('.number_item');
      },
      numbersLength() {
        return this.numberElements.length;
      },
      awardElements() {
        return document.querySelectorAll('.award_item');
      },
      awardsLength() {
        return this.awardElements.length;
      },
      isFactorSlide() {
        return this.windowWidth <= factorBreakpoint;
      },
      isNumberSlide() {
        return this.windowWidth <= 601;
      },
      isAwardSlide() {
        return this.windowWidth <= 660;
      },
      numberContainerWidth() {
        return document.querySelector('.number_container').clientWidth;
      },
      awardContainerWidth() {
        return document.querySelector('.award_container').clientWidth;
      },
    },
    watch: {
      isFactorSlide() {
        this.selectedFactor = 0;
      },
      isNumberSlide() {
        this.selectedNumber = 0;
      },
      isAwardSlide() {
        this.selectedAward = 0;
      },
      windowWidth(to) {
        this.setDefaultIndexes(to);
      },
    },
    methods: {
      setProgram(value) {
        if (value === this.selectedProgram) {
          this.selectedProgram = null;
        } else {
          this.selectedProgram = value;
        }
      },
      toggleMenu() {
        if (this.isMenuOpened) {
          this.closeMenu();
        } else {
          this.openMenu();
        }
      },
      openMenu() {
        this.isMenuOpened = true;
        document.body.style.overflow = 'hidden';
      },
      closeMenu() {
        this.isMenuOpened = false;
        document.body.style.overflow = null;
      },
      langButtonPressed(lang) {
        if (this.selectedLang === lang) {
          this.isLanguagesSelecting = !this.isLanguagesSelecting;
        } else {
          this.selectedLang = lang;
          this.isLanguagesSelecting = false;
        }
      },
      setDefaultIndexes(width = this.windowWidth) {
        if (width >= productsBreakpoint && this.productActiveIndex===null) {
          this.productActiveIndex = 0;
        }
        if (width >= conceptsBreakpoint && this.conceptActiveIndex===null) {
          this.conceptActiveIndex = 0;
        }
      },
      nextFactor() {
        this.selectedFactor += 1;
        this.selectedFactor %= this.factorsLength;
      },
      prevFactor() {
        this.selectedFactor -= 1;
        if (this.selectedFactor < 0) {
          this.selectedFactor = this.factorsLength - 1;
        }
      },
      setProduct(value) {
        if (this.productActiveIndex !== value ) {
          this.productGoing = this.productActiveIndex > value ? 'right' : 'left';
          this.productActiveIndex = value;
        } else if (this.windowWidth < productsBreakpoint) {
          this.productActiveIndex = null;
        }
      },
      setConcept(value) {
        if (this.conceptActiveIndex !== value) {
          this.conceptGoing = this.conceptActiveIndex > value ? 'right' : 'left';
          this.conceptActiveIndex = value;
        } else if (this.windowWidth < conceptsBreakpoint){
          this.conceptActiveIndex = null;
        }
      },
      nextNumber() {
        this.selectedNumber += 1;
        this.selectedNumber %= this.numbersLength;
      },
      prevNumber() {
        this.selectedNumber -= 1;
        if (this.selectedNumber < 0) {
          this.selectedNumber = this.numbersLength - 1;
        }
      },
      nextAward() {
        this.selectedAward += 1;
        this.selectedAward %= this.awardsLength;
      },
      prevAward() {
        this.selectedAward -= 1;
        if (this.selectedAward < 0) {
          this.selectedAward = this.awardsLength - 1;
        }
      },
      getWindowWidth() {
        this.windowWidth = window.innerWidth;
      },
      closeModal() {
        this.showModal = false;
        document.body.style.overflow = null;
      },
      openModal() {
        this.showModal = true;
        document.body.style.overflow = 'hidden';
      },
    },
    mounted() {
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);
      });
      this.getWindowWidth();
      this.setDefaultIndexes();
    },
  });
})();