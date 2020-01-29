Vue.use(VueLazyLoad());
Vue.use(vueView());
Vue.use(VueTheMask);

(function () {
  new Vue({
    el: '#app',
    directives: {mask: VueTheMask.mask},
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
      windowScrollTop: window.scrollY,
      selectedLang: 'ru',
      languages: ['ru', 'kz', 'en'],
      isLanguagesSelecting: false,
      isMenuOpened: false,
      selectedProgram: null,
      videoPlayed: false,
      smallVideoPlayed: false,
      showScroll: false,
      calcValues: null,
      isCalcFixed: false,
      isCalcRequiresFixed: false,
      showCalcModal: false,
      name: '',
      phone: '',
      email: '',
      showSuccess: false,
      request: 'clean',
    },
    computed: {
      fixCalcResults() {
        return this.isCalcFixed && !!this.calcValues;
      },
      conceptsLength() {
        return document.querySelectorAll('.concept_radio').length;
      },
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
      calcResultBound() {
        return this.$refs['calcResultBoundRef'];
      }
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
        this.handleIsCalcFixed(to);
      },
      windowScrollTop(to) {
        this.showScroll = to > 800;
      },
      calcValues(to, from) {
        if (!!to && !from && this.isCalcRequiresFixed) {
          window.scrollTo(0, window.scrollY + 100);
        }
      }
    },
    methods: {
      scrollToCalc() {
        if (this.fixCalcResults && this.calcResultBound) {
          var top = this.calcResultBound.offsetTop;
          window.scrollTo(0, top - 120);
        }
      },
      openCalcModal() {
        this.showCalcModal = true;
        document.body.style.overflow = 'hidden';
      },
      closeCalcModal() {
        this.showCalcModal = false;
        document.body.style.overflow = null;
      },
      handleIsCalcFixed(width = this.windowWidth) {
        this.isCalcRequiresFixed = width < calculatorBreakpoint;
        if (!this.isCalcRequiresFixed) {
          this.isCalcFixed = false;
        }
      },
      handleCalcView(options) {
        if (this.isCalcRequiresFixed) {
          if (options.type === 'enter') {
            this.isCalcFixed = false;
          }
          if (options.type === 'exit' && options.percentTop >= 0) {
            this.isCalcFixed = true;
          }
        }
      },
      setCalcValues(e) {
        this.calcValues = {...e};
      },
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
        this.handleIsCalcFixed();
      },
      closeModal() {
        this.showModal = false;
        document.body.style.overflow = null;
      },
      openModal() {
        this.showModal = true;
        document.body.style.overflow = 'hidden';
      },
      closeSuccessModal() {
        this.showSuccess = false;
        this.request = 'clean';
        document.body.style.overflow = null;
      },
      openSuccessModal() {
        this.showSuccess = true;
        document.body.style.overflow = 'hidden';
      },
      getWindowScrollTop() {
        this.windowScrollTop = window.scrollY;
      },
      sendMail(form='', name='', phone='', email='', data='') {
        return new Promise((resolve, reject) => {
          var date = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString();
          var url = '/sendform.php';
          function generateGETData(obj) {
            var arr = Object.keys(obj).map(key => ({key, val: obj[key]}));
            return arr.reduce((acc, {key, val}) => {
              return acc + `${key}=${encodeURI(val)}&`;
            }, '?')
          }
          var sending = {
            form: form,
            name: name,
            phone: phone,
            email: email,
            data: data,
            date: date,
            lang: this.selectedLang,
          };
          url += generateGETData(sending);
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send();
          xhr.onload = (res) => {
            resolve(res);
          };
          xhr.onerror = (err) => {
            console.error(err);
            reject(err);
          }
        });
      },
      handleSubmit(formName) {
        var data = JSON.stringify(this.calcValues);
        if (!this.name || this.phone.length !== 16) {
          alert('Пожалуйста, заполните все поля формы');
          return;
        }
        if (formName === 'form calculator' && !this.email) {
          alert('Пожалуйста, заполните все поля формы');
          return;
        }
        this.closeCalcModal();
        this.closeModal();
        this.openSuccessModal();
        this.request = 'loading';
        this.sendMail(formName, this.name, this.phone, this.email, data).then(() => {
          this.request = 'error';
        }).catch(() => {
          this.request = 'error';
        });
      }
    },
    mounted() {
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);
        window.addEventListener('scroll', this.getWindowScrollTop);
      });
      this.getWindowWidth();
      this.setDefaultIndexes();
    },
  });
})();
