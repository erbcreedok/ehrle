doAfterRender.push((function () {
  var app = new Vue({
    el: '#app',
    data: {
      showModal: false,
      productActiveIndex: 0,
      conceptActiveIndex: 0,
      selectedFactor: 0,
      selectedNumber: 0,
      selectedAward: 0,
      windowWidth: 0,
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
        return this.windowWidth <= 795;
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
    },
    methods: {
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
      },
      openModal() {
        this.showModal = true;
      },
    },
    mounted() {
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);
      });
      this.getWindowWidth();
    },
  });
}));
