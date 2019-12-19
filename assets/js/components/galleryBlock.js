Vue.component('gallery-block', {
	template:
		`<div class="object_gallery">
      <div class="object_gallery_selected_image" @click="openImage(0)"><img :src="mainImage" alt=""></div>
       <ul class="ul_custom object_gallery_thumbnails">
        <li v-for="image in thumbs" :key="image.index" :class="{'object_gallery_thumbnail-blurred': !!image.plus}" class="object_gallery_thumbnail" @click="openImage(image.index)">
          <img :src="image.thumb" alt="">
          <span v-if="!!image.plus" class="object_gallery_thumbnail_info">+{{image.plus}}</span>
        </li>
      </ul>
      <LightBox :images="images" :showLightBox="false" ref="modalRef"/>
    </div>`,
	components: {
		LightBox: Lightbox.default,
	},
	computed: {
		modal() {
			return this.$refs.modalRef;
		},
		mainImage() {
			return this.images[0] ? this.images[0].src : null;
		},
		thumbs() {
			return this.images.slice(1, 5).map((image, index) => ({...image, index:index+1, plus: (index===3) ? this.images.length - 4 : null}));
		},
	},
	data() {
		return {
			images: [
				{src: './assets/images/gallery/1.jpg', thumb: './assets/images/gallery/1_tn.jpg'},
				{src: './assets/images/gallery/2.jpg', thumb: './assets/images/gallery/2_tn.jpg'},
				{src: './assets/images/gallery/3.jpg', thumb: './assets/images/gallery/3_tn.jpg'},
				{src: './assets/images/gallery/4.jpg', thumb: './assets/images/gallery/4_tn.jpg'},
				{src: './assets/images/gallery/5.jpg', thumb: './assets/images/gallery/5_tn.jpg'},
				{src: './assets/images/gallery/7.jpg', thumb: './assets/images/gallery/7_tn.jpg'},
				{src: './assets/images/gallery/8.jpg', thumb: './assets/images/gallery/8_tn.jpg'},
			]
		}
	},
	methods: {
		openImage(index) {
			this.modal.showImage(index);
		}
	}
});