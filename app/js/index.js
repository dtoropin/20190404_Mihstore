(function () {

	var init = function () {
		_getProductJSON();
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
		$('body,html').animate({ scrollTop: 0 }, 500);
	};

	var _getProductJSON = function () {
		$.getJSON('../data/products.json').done(function (response) {
			_showProducts(response);
		});
	};

	var _showProducts = function (data) {
		var template = $('#templateProduct').html(),
			tag = $('#product'),
			html = '';
		$.each(data, function (i, product) {
			var prod = {
				img: product.img,
				name: product.name,
				price: Number(product.price).toFixed(2),
				discont: product.discont !== 'false' ? 'product-card--' + product.discont : ''
			};
			return html += templayed(template)(prod);
		});
		tag.append(html);
	};

	return init();
})();