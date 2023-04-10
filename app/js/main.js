
const 
	body = document.querySelector('body'),
	html = document.querySelector('html'),
	header = document.querySelector('.header');



function Popup(arg) {

	let body = document.querySelector('body'),
		html = document.querySelector('html'),
		saveHref = (typeof arg == 'object') ? (arg['saveHref']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			let popup = document.querySelector(id);

			if (popup) {

				body.classList.remove('_popup-active');
				html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
				body.classList.add('_popup-active');

				if (saveHref) history.pushState('', "", id);

				setTimeout(() => {
					if (!initStart) {
						popup.classList.add('_active');
						function openFunc() {
							popupCheck = true;
							popup.removeEventListener('transitionend', openFunc);
						}
						popup.addEventListener('transitionend', openFunc)
					} else {
						popup.classList.add('_transition-none');
						popup.classList.add('_active');
						popupCheck = true;
					}

				}, 0)

			} else {
				return new Error(`Not found "${id}"`)
			}
		}
	}

	const close = function (popupClose) {
		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('_transition-none')) popup.classList.remove('_transition-none')

			setTimeout(() => {
				popup.classList.remove('_active');
				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup._active');

					if (activePopups.length < 1) {
						body.classList.remove('_popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveHref) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					popup.removeEventListener('transitionend', closeFunc)
				}

				popup.addEventListener('transitionend', closeFunc)

			}, 0)

		}
	}

	return {

		open: function (id) {
			open(id);
		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.popup-close');
				if (popupClose) {
					close(popupClose)
				}

			});

			if (saveHref) {
				let url = new URL(window.location);
				if (url.hash) {
					open(url.hash, true);
				}
			}
		},

	}
}

const popup = new Popup({
	saveHref: true, // false
});

popup.init()


// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-

body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	
	// =-=-=-=-=-=-=-=-=-=-=-=- <scroll on click to section> -=-=-=-=-=-=-=-=-=-=-=-=
	
	let btnToScroll = $('.btn-to-scroll');
	if(btnToScroll) {
		event.preventDefault();
		let section;
	
		section = document.querySelector(btnToScroll.getAttribute('href'));
	
		window.scroll({
			left: 0,
			top: (section) ? section.offsetTop : 0,
			behavior: 'smooth'
		})
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </scroll on click to section> -=-=-=-=-=-=-=-=-=-=-=-=



	// =-=-=-=-=-=-=-=-=-=-=-=- <click> -=-=-=-=-=-=-=-=-=-=-=-=
	
	const whyNavBtn = $(".why__nav--btn")
	if(whyNavBtn) {
	
		whySlider.autoplay.start();
	
	}
	
	// =-=-=-=-=-=-=-=-=-=-=-=- </click> -=-=-=-=-=-=-=-=-=-=-=-=

})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-







// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=


let sliderProductsNav;


let productsSlider;

let whyNav = new Swiper('.why__nav', {
			
	spaceBetween: 0,
	slidesPerView: "auto",

});


let whySlider = new Swiper('.why__slider', {

	spaceBetween: 0,
	slidesPerView: 1,

	speed: 500,

	autoplay: {
		delay: 3000,
		pauseOnMouseEnter: true,
	},

	loop: true,
	autoHeight: true,

	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},

	thumbs: {
		swiper: whyNav,
	},
	/* pagination: {
		el: '.swiper-pagination',
		clickable: true,
	}, */

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},


});

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

let resizeCheck = {}, windowSize;

function resizeCheckFunc(size, minWidth, maxWidth) {
	if (windowSize <= size && (resizeCheck[String(size)] == true || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != false) {
		resizeCheck[String(size)] = false;
		maxWidth(); // < size
	}

	if (windowSize >= size && (resizeCheck[String(size)] == false || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != true) {
		resizeCheck[String(size)] = true;
		minWidth(); // > size
	}
}


function resize() {

	windowSize = window.innerWidth;

	html.style.setProperty("--height-screen", window.innerHeight + "px")
	html.style.setProperty("--height-header", header.offsetHeight + "px")

	resizeCheckFunc(992,
		function () {  // screen > 992px

			if(productsSlider) productsSlider.destroy(true, true);
			if(sliderProductsNav) sliderProductsNav.destroy(true, true);
			//if(whyNav) whyNav.destroy(true,true);

			sliderProductsNav = new Swiper('.products__nav', {

				spaceBetween: 0,
				slidesPerView: 2,
			
			});

			productsSlider = new Swiper('.products__slider', {

				spaceBetween: 0,
				slidesPerView: 1,
			
				effect: 'fade',
				fadeEffect: {
					crossFade: true
				},
			
				thumbs: {
					swiper: sliderProductsNav,
				},
			
			});


		},
		function () {  // screen < 992px

			if(productsSlider) productsSlider.destroy(true, true);
			if(sliderProductsNav) sliderProductsNav.destroy(true, true);

			sliderProductsNav = new Swiper('.products__nav', {

				spaceBetween: 0,
				slidesPerView: 2,
			
			});

			productsSlider = new Swiper('.products__slider', {

				spaceBetween: 31,
				slidesPerView: 1,
			
				effect: 'slide',
				fadeEffect: {
					crossFade: true
				},

				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
			
			});

		}
	);

}

resize();

window.onresize = resize;

// =-=-=-=-=-=-=-=-=-=-=-=- </resize> -=-=-=-=-=-=-=-=-=-=-=-=


const whySlideContentWrapperCanvas = document.querySelectorAll('.why__slide--content-wrapper canvas');

whySlideContentWrapperCanvas.forEach(whySlideContentWrapperCanvas => {
	//console.log(whySlideContentWrapperCanvas)
	let width = 0, height = 0;
	function dashedLineDraw() {
		if(whySlideContentWrapperCanvas.offsetWidth != width || whySlideContentWrapperCanvas.offsetHeight != height) {
			width = whySlideContentWrapperCanvas.offsetWidth;
			height = whySlideContentWrapperCanvas.offsetHeight;
			draw({
				canvas: whySlideContentWrapperCanvas,
				angleSize: (window.innerWidth >= 768) ? 100 : 70,
				lineWidth: (window.innerWidth >= 768) ? 68 : 30,
			});
		}
	}
	setInterval(dashedLineDraw,100)
})


function getRadians(degrees) {
	return (Math.PI / 180) * degrees;
}

function draw(arg) {
	let canvas = arg['canvas'];
	
	if (canvas.getContext) {

		let width = canvas.offsetWidth,
			height = canvas.offsetHeight;

		let ctx = canvas.getContext('2d');
		
		ctx.canvas.width  = canvas.offsetWidth;
  		ctx.canvas.height = canvas.offsetHeight;
		
		let lineWidth = (arg.lineWidth) ? arg.lineWidth : 40, 
		angleSize = (arg.angleSize) ? arg.angleSize : 55;

		let halflw = lineWidth/2;

		//lastLine = lastLine / 100 * canvas.offsetHeight;
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = "#ffcce3";
		ctx.beginPath();

		if(window.innerWidth >= 768) {
			ctx.moveTo(width - lineWidth, height - halflw);
		} else {
			ctx.moveTo(width - halflw, height - halflw);
		}
		ctx.lineTo(angleSize + halflw, height - halflw);
		ctx.arc(angleSize + halflw, height - halflw - angleSize - 0, angleSize, getRadians(90), getRadians(180), false);
		ctx.lineTo(halflw, halflw + angleSize);
		ctx.arc(angleSize + halflw, angleSize + halflw, angleSize, getRadians(180), getRadians(270), false);
		ctx.lineTo(width - lineWidth - angleSize - (lineWidth*2), halflw);
		ctx.arc(width - lineWidth - (lineWidth*2) - angleSize, halflw + angleSize, angleSize, getRadians(270), getRadians(360), false);
		ctx.lineTo(width - lineWidth - (lineWidth*2), height - (lineWidth * 2) - (angleSize*2));
		if(window.innerWidth >= 768) {
			ctx.arc(width - angleSize - 4, height - lineWidth - (angleSize*2), angleSize, getRadians(180), getRadians(90), true);
			ctx.lineTo(width - lineWidth, height - angleSize - lineWidth);
		} else {
			ctx.arc(width - angleSize + lineWidth + halflw + 6, height - lineWidth - (angleSize*2), angleSize, getRadians(180), getRadians(90), true);
		}
		
		
		ctx.moveTo(width - lineWidth, height - lineWidth);
		

		ctx.stroke();

		ctx.lineWidth = 0;
		ctx.strokeStyle = "transparent";
		ctx.fillStyle = "#ffcce3"; //ffcce3
		
		ctx.beginPath();
		/* ctx.arc(width - lineWidth, height - lineWidth - angleSize, halflw, getRadians(0), getRadians(360), true);
		ctx.arc(width - lineWidth, height - halflw - 1, halflw, getRadians(0), getRadians(360), true); */
		//ctx.roundRect(width - lineWidth, height - lineWidth, lineWidth, lineWidth, [0, halflw, halflw, 0]);
		if(window.innerWidth >= 768) {
			ctx.arc(width - lineWidth, height - lineWidth - angleSize, halflw, getRadians(0), getRadians(360), true);
			ctx.arc(width - lineWidth, height - halflw - 1, halflw, getRadians(0), getRadians(360), true);
		} else {
			ctx.arc(width - halflw, height - lineWidth - angleSize, halflw, getRadians(0), getRadians(360), true);
			ctx.arc(width - halflw, height - halflw, halflw, getRadians(0), getRadians(360), true);
			//ctx.roundRect(width - lineWidth - 2, height - (lineWidth*3) - 25, lineWidth, lineWidth, [0, halflw, halflw, 0]);
		}
		
		ctx.fill();
		ctx.stroke();
		/* ctx.arc(width - angleSize - outerCircleSize - lineWidth, height - (angleSize * 2) - lastLine, angleSize, getRadians(0), Math.PI / 2, false);
		ctx.lineTo(angleSize * 2, height - angleSize - lastLine);
		ctx.arc(angleSize + outerCircleSize, height - lastLine, angleSize, getRadians(-90), getRadians(180), true);
		ctx.lineTo(outerCircleSize+lineWidth, height+lastLine); */

		/* if(arg.reverse == true) {
			ctx.moveTo(outerCircleSize, outerCircleSize * 3);
			if(arg.disableAngle == true) {
				ctx.lineTo(outerCircleSize, height - (angleSize * 2) - lastLine);
				ctx.arc(angleSize + outerCircleSize, height - angleSize - outerCircleSize - (lineWidth/2), angleSize, getRadians(-180), Math.PI / 2, true);
				ctx.lineTo(width - outerCircleSize*3, height - (lineWidth/2) - outerCircleSize);
			} else {
				ctx.lineTo(outerCircleSize, height - (angleSize * 2) - lastLine);
				ctx.arc(angleSize + outerCircleSize, height - (angleSize * 2) - lastLine, angleSize, getRadians(-180), Math.PI / 2, true);
				ctx.lineTo(width - (angleSize * 2), height - angleSize - lastLine);
				ctx.arc(width - angleSize - lineWidth - (outerCircleSize), height - lastLine, angleSize, getRadians(-90), getRadians(0), false);
				ctx.lineTo(width - lineWidth - outerCircleSize, height - (outerCircleSize*2.5));
			}
		} else {

			ctx.moveTo(width - lineWidth - outerCircleSize, outerCircleSize * 3);
			if(arg.disableAngle == true) {
				ctx.lineTo(width - lineWidth - outerCircleSize, height - angleSize - outerCircleSize);
				ctx.arc(width - angleSize - outerCircleSize - lineWidth, height - angleSize - (lineWidth/2) - outerCircleSize, angleSize, getRadians(0), Math.PI / 2, false);
				ctx.lineTo((outerCircleSize*2.5) + lineWidth, height - (lineWidth/2) - outerCircleSize);
			} else {
				ctx.lineTo(width - lineWidth - outerCircleSize, height - (angleSize * 2) - lastLine);
				ctx.arc(width - angleSize - outerCircleSize - lineWidth, height - (angleSize * 2) - lastLine, angleSize, getRadians(0), Math.PI / 2, false);
				ctx.lineTo(angleSize * 2, height - angleSize - lastLine);
				ctx.arc(angleSize + outerCircleSize, height - lastLine, angleSize, getRadians(-90), getRadians(180), true);
				ctx.lineTo(outerCircleSize+lineWidth, height+lastLine);
			}
			
		} */

		

		/* ctx.beginPath();
		ctx.setLineDash([]);
		ctx.fillStyle = '#1E1E1E';
		ctx.lineWidth = 0;
		ctx.strokeStyle = "transparent";

		if(arg.reverse == true) {
			ctx.arc(outerCircleSize, outerCircleSize, outerCircleSize, 0, Math.PI * 2, true);
			ctx.arc(width - outerCircleSize*1.2, height - outerCircleSize-1, outerCircleSize, 0, Math.PI * 2, true);
			
		} else {
			ctx.arc(outerCircleSize, height - outerCircleSize-1, outerCircleSize, 0, Math.PI * 2, true);
			ctx.arc(width - outerCircleSize*1.2, outerCircleSize, outerCircleSize, 0, Math.PI * 2, true);
		}
		
		ctx.fill();
		ctx.stroke(); */
	}
}

/* setTimeout(() => {
	draw();
}, 100); */






/* 
// =-=-=-=-=-=-=-=-=-=-=-=- <animation> -=-=-=-=-=-=-=-=-=-=-=-=

AOS.init({
	disable: "mobile",
});

// =-=-=-=-=-=-=-=-=-=-=-=- </animation> -=-=-=-=-=-=-=-=-=-=-=-=

*/
