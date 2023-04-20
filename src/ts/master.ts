import Lazy from 'vanilla-lazyload';
import Swiper, {Navigation, Pagination, Controller, EffectFade} from 'swiper';
import Zoomer from './lib/zoomer';
import * as M from 'materialize-css';
import IMask from 'imask';

(window as any).JQ = jQuery;

enum responseType{
	'success',
	'error'
}

interface IResponse{
	type: responseType,
	message: string
}

Swiper.use([Navigation, Pagination, Controller, EffectFade]);
let lazy = new Lazy(null, document.querySelectorAll('.lazy'));
let serviceSlider:Swiper;
let mainGallery:Swiper;
let sidenav = M.Sidenav.init(document.querySelector('.sidenav'));
declare const ymaps:any;

let tooltip = M.Tooltip.init(document.querySelectorAll('.tooltipped'));

let elements = document.querySelectorAll('[type=tel]');
elements.forEach(el => {

	let mask = IMask(<HTMLInputElement>el, {
		mask: '+7 (000) 000-0000',
		lazy: false,
		placeholderChar: '_'
	});
})

if( $('#works-slider').length && $('#works-slider .swiper-slide').length > 1 )
{
	let worksSwiper = new Swiper('#works-slider', {
		spaceBetween: 30,
		centeredSlides: true,
		loop: true,
		loopedSlides: 7,
		slideToClickedSlide: true,
		navigation: {
			prevEl: '.prev',
			nextEl: '.next'
		},
		pagination: {
			type: 'bullets',
			el: '.works-pagination',
			clickable: true,
			dynamicBullets: true,
			dynamicMainBullets: 5
		},
		breakpoints: {
			400: {
				slidesPerView: 1
			},
			800: {
				slidesPerView: 3
			},
			1600: {
				slidesPerView: 5
			}
		}
	});

	worksSwiper.on('slideChange', () => {
		lazy = new Lazy(null, document.querySelectorAll('.lazy'));
	});
	worksSwiper.on('init', () => {
		setTimeout(() => {
			lazy = new Lazy(null, document.querySelectorAll('.lazy'));
			alert('done');
		}, 80);
	});
}

if($('#clients-slider').length && $('#clients-slider .swiper-slide').length > 1){
	let clientsSlider = new Swiper('#clients-slider', {
		loop: true,
		breakpoints: {
			400: {
				slidesPerView: 1
			},
			800: {
				slidesPerView: 2
			},
			1000: {
				slidesPerView: 3
			},
			1400: {
				slidesPerView: 4
			},
			1700: {
				slidesPerView: 5
			}
		},
		spaceBetween: 60,
		on:{
			'slideChange': () => {
				lazy = new Lazy(null, document.querySelectorAll('.lazy'));
			}
		},
		pagination: {
			el: '.clients-pagination',
			type: 'bullets',
			clickable: true
		}
	});
}

if($('#service-slider').length && $('#service-slider .swiper-slide').length > 1){
	serviceSlider = new Swiper('#service-slider', {
		navigation: {
			prevEl: '.service-prev',
			nextEl: '.service-next'
		},
		on: {
			'slideChange': (slider:Swiper) => {
				let lazy = new Lazy(null, document.querySelectorAll('.lazy'));
				let index = slider.realIndex;
				$('[data-slide]').removeClass('active');
				$('[data-slide='+(index + 1)+']').addClass('active');
			}
		}
	});
	let serviceZoomer = new Zoomer('.zoomer-service', 'bg', true);
};

$('body').on('click', '[data-slide]', (e:JQuery.ClickEvent) => {
	
	$('[data-slide]').removeClass('active');
	let el = e.currentTarget;
	let slideIndex = parseInt(el.dataset['slide']);
	$(el).addClass('active');
	serviceSlider?.slideTo(slideIndex - 1);
	e.stopImmediatePropagation();
	mainGallery?.slideTo(slideIndex)
});

$('body').on('input', 'textarea', (e:JQuery.TriggeredEvent) => {
	let el = <HTMLTextAreaElement>e.currentTarget;
	let width = el.clientWidth;

	let createdSizer = document.querySelector('#sizer');
	let sizer;

	if(!createdSizer){
		sizer = document.createElement('pre');
		sizer.id = "sizer";
	}else{
		sizer = createdSizer;
	}

	if((e.originalEvent as any).inputType == 'insertLineBreak' || (e.originalEvent as any).inputType == 'deleteContentBackward'){
		(<HTMLPreElement>sizer).textContent = el.value + "1";
	}else{
		(<HTMLPreElement>sizer).textContent = el.value;
	}

	if(!createdSizer){
		document.body.appendChild(sizer);
	}

	let height = sizer.clientHeight;
	el.style.height = (height + 23) + "px";
	document.body.removeChild(sizer);
});

if($('#map').length){
	loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU", () => {
		// let coords = [45.011765, 38.992372];
		// let zoom = 17
		let lon = parseFloat($('#map').data('lon'));
		let lat = parseFloat($('#map').data('lat'));
		let zoom = $('#map').data('zoom');
		let coords = [lon, lat];
		ymaps.ready(function(){
			initMap(null, coords, zoom);
		});
	})
}

if($('#main-gallery').length && $('#background-gallery').length){
	
	mainGallery = new Swiper('#main-gallery', {
		loop: true,
		navigation: {
			prevEl: '.main-prev',
			nextEl: '.main-next'
		},
		on:{
			'slideChange': (slider) => {
				let lazy = new Lazy(null, document.querySelectorAll('.lazy'));
				let index = slider.realIndex;
				$('.thumb-wrapper').removeClass('active');
				$('.thumb-wrapper[data-slide='+(index + 1)+']').addClass('active');

				let slide = $('.thumb-wrapper[data-slide="' + (index + 1) + '"]');
				let slides = slider.slides.length - (slider.loopedSlides * 2) - 1;
				let startupText = $(slide).data('title');
				let startupDesc = $(slide).data('description');
			
				$('#slide-name').text(startupText);
				$('#slide-description').text(startupDesc);

				$('.nav .current').text(index + 1);
				$('.nav .total').text(slides + 1);
			}
		}
	});
	let backgroundGallery = new Swiper('#background-gallery', {
		effect: 'fade',
		loop: true,
		fadeEffect: {
			crossFade: true
		}
	});
	mainGallery.controller.control = backgroundGallery;
	let galleryZoomer = new Zoomer('.zoomer-gallery', 'src', true);

}

$('body').on('click', '[href="#contactus"]', (e:JQuery.ClickEvent) => {
	e.preventDefault();
	let blockPos = $('#contacts').offset()?.top;
	sidenav.close();
	$('html, body').animate({
		scrollTop: blockPos
	}, 400);
});

$('body').on('click', '.send-message', (e:JQuery.ClickEvent) => {

	e.preventDefault();
	let el = e.target;
	let form = $(el).parents('form');
	let data = form.serialize();

	$.ajax({
		url:'/assets/classes/sender.php',
		type: 'POST',
		dataType: 'json',
		data: data,
		cache: false,
		success: (response:IResponse) => {
			switch (response.type){
				case responseType.success:
					M.toast({html: response.message, classes: 'quad-toast success'});
					form.get(0).reset();
					break;
				case responseType.error:
					M.toast({html: response.message, classes: 'quad-toast error'});
					break;
			}
		},
		error: (response) => {
			console.error(response);
		}
	});
})

$('.thumb-wrapper:first-of-type').addClass('active');
$($('.gallery-wrapper .wrapper')[0]).addClass('active');

// Загрузка внешних скриптов
function loadScript(url:string, callback:() => void){

	var script = <any>document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState){  //IE
		script.onreadystatechange = function(){
			if (script.readyState == "loaded" ||
					script.readyState == "complete"){
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {  //Others
		script.onload = function(){
			callback();
		};
	}

	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

// Инициализация карты
function initMap(e:Event = null, center:number[], zoom:number){

	let map = new ymaps.Map('map', {
		center: center,
		zoom: zoom,
		controls: ['smallMapDefaultSet']
	});

	map.behaviors.disable('scrollZoom');

	let placemark = new ymaps.Placemark(center, {}, {iconColor: 'red'});
	map.geoObjects.add(placemark);

	placemark.events.add('click', () => {
		let addr = "https://yandex.ru/maps/-/CCU0nRx1pB";
		window.open(addr, "_blank");
	})

	map.behaviors.disable('scrollZoom');
}