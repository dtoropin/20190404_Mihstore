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
		// прослушка событий
	};

	return init();
})();