$(document).ready(function(){
	$('section#screenshots a').on('click',function(){
		$('div#modal img').attr('src',$(this).attr('data-image-url') );

	});

	var nav = $('.navbar-fixed-top');

	var distance = $('.navbar-fixed-top').offset();

	if(distance.top >= 300){
	nav.addClass('effect');

	}

	$(window).scroll(function(){
		var scroll = $(window).scrollTop();
		if(scroll >= 300){
			nav.addClass('effect');

		}else{
			nav.removeClass('effect');
		}
	});
	

	$('#about .blue-circle').waypoint(function(){
		$('#about .blue-circle').addClass('animated fadeInUp');
	},{
		offset:'50%'
	});

		$('#features .blue-circle').waypoint(function(){
		$(this.element).addClass('animated fadeInUp');
	},{
		offset:'50%'
	});



	$('.features-image img').waypoint(function(){
		$('.features-image img').addClass('animated fadeInUp');
	},{
		offset:'50%'
	});

	$('#screenshots .col-sm-4').waypoint(function(){
	$(this.element).addClass('animated zoomIn');
	$(this.element).css({"opacity":1});
	},{
		offset:'50%'
	});

	$('#download div.phone img').waypoint(function(){
	$(this.element).addClass('animated fadeInRight');
	},{
		offset:'50%'
	});

	$('#download .platforms > div').waypoint(function(){
	$(this.element).addClass('animated fadeInUp');
	},{
		offset:'50%'
	});
	

});

smoothScroll.init({
	speed: 1000,
	easing: 'easeInOutQuad',
	updateURL: false,
	offset:0
});

