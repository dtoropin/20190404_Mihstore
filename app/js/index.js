(function () {

	var init = function () {
		console.log('It is myModule other!');
		_setUpListners();
		$('.slider').slick({
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: false
		});
	};

	var _setUpListners = function () {
		$('.footer__top-link').on('click', _scrollToTop);
	};

	var _scrollToTop = function () {
		$('body,html').animate({scrollTop: 0}, 500);
	};

	return init();
})();