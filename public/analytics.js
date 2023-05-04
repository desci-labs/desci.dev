(function () {
	const mid = 'G-02ECH7KGWR';
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', mid);
	window.addEventListener('load', function () {
		const element = window.document.createElement('script');
		element.src = 'https://www.googletagmanager.com/gtag/js?id=' + mid;
		window.document.body.append(element);
	});
})();
