/**
 * Applies a parallax animation to elements on the page.
 * 
 * Use the 'parallax-section' class to define a parallax frame.
 * Use the 'parallax' class to define an object you would like to animate.
 * 	Use data-start-x and data-end-x to define the x coordinates to animate over (optional)
 * 	Use data-start-y and data-end-y to define the y coordinate to animate over (optional)
 * 	User data-start to define the animation start period (0 to 1, ex: .3 starts at 30%)
 * 	Use data-end to define the animation end period
 * 	Use data-easing to define any of the following: InQuad, OutQuad, InOutQuad, SlowMiddle, or Linear (linear is defalt)
 * 
 * @version 0.0.1
 * @author Caleb Brewer (dayoftheduck.com)
 */

///////////// QUADRATIC EASING ////////////////////////
//// Robert Penner - Sept. 2001 - robertpenner.com ////
// get more at gizma.com/easing
// quadratic easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in value, d: duration
// t and d can be frames or seconds/milliseconds
Math.easeInQuad = function (t, b, c, d) {
	return c*t*t/(d*d) + b;
}

// quadratic easing out - decelerating to zero velocity
Math.easeOutQuad = function (t, b, c, d) {
	return -c*t*t/(d*d) + 2*c*t/d + b;
}

// quadratic easing in/out - acceleration until halfway, then deceleration
Math.easeInOutQuad = function (t, b, c, d) {
	if (t < d/2) return 2*c*t*t/(d*d) + b;
	var ts = t - d/2;
	return -2*c*ts*ts/(d*d) + 2*c*ts/d + c/2 + b;
}
//custom easing, thanks ximi on stackoverflow
function sinh(aValue) {
    var myTerm1 = Math.pow(Math.E, aValue);
    var myTerm2 = Math.pow(Math.E, -aValue);
    return (myTerm1-myTerm2)/2;
} 
Math.easeCustom = function(x, t, b, c, d) {
    return (sinh((x - 0.5) * 5) + sinh(-(x - 0.5)) + (sinh(2.5) + Math.sin(-2.5))) / (sinh(2.5) * 1.82);
}; 

/**
 *	Applies a parallax animation to all contained objects. 
 * @param {Object} container 
 */
function parallax( container ) {
	$ = jQuery;
	//cache the money
	$(".parallax").each(function(){
		var start_x = $(this).attr('data-start-x');
		if( start_x ) {
			if( start_x.indexOf( '%' )!=-1 ) {
				$(this).data('x-unit', '%');
			} else {
				$(this).data('x-unit', 'px');
			}
			$(this).data('start-x', parseInt(start_x));
			$(this).data('end-x', parseInt($(this).attr('data-end-x')));
		}
		var start_y = $(this).attr('data-start-y');
		if( start_y ) {
			if( start_y.indexOf( '%' )!=-1 ) {
				$(this).data('y-unit', '%');
			} else {
				$(this).data('y-unit', 'px');
			}
			$(this).data('start-y', parseInt(start_y));
			$(this).data('end-y', parseInt($(this).attr('data-end-y')));
		}
		var start = $(this).attr('data-start');
		if( !start ) {
			$(this).data('start', 0);
		} else {
			$(this).data('start', start);
		}
		var end = $(this).attr('data-end');
		if( !end ) {
			$(this).data('end', 1);
		} else {
			$(this).data('end', end);
		}
		$(this).data('easing', $(this).attr('data-easing'));
	});
	//define the scroll
	function parallax_scroll(container){
		var window_top = $(window).scrollTop(),
			window_bottom = window_top + window.innerHeight;
		$(".parallax-section").each(function() {
			var top = $(this).offset().top;
			var bottom = top + $(this).height();
			//we only want to animate stuff that is currently visible, anything else is a WASTE!
			if( ( top > window_top && top < window_bottom ) || ( bottom < window_bottom && bottom > window_top ) || ( top < window_top && bottom > window_bottom ) ) {
				//get range of this objects visibility
				var range_top = top - window.innerHeight;
				var range_bottom = bottom;
				if( range_top < 0 ) {
					range_top = 0;
				}
				if( range_bottom > $(container).height() - window.innerHeight ) {
					range_bottom = $(container).height() - window.innerHeight;
				}
				var current_position = ( $(window).scrollTop() - range_top ) / ( range_bottom - range_top );
				$(this).find('.parallax').each(function(){
					var start_x = $(this).data('start-x'),
						end_x = $(this).data('end-x'),
						x_unit = $(this).data('x-unit'),
						start_y = $(this).data('start-y'),
						end_y = $(this).data('end-y'),
						y_unit = $(this).data('y-unit'),
						start = $(this).data('start'),
						end = $(this).data('end'),
						easing = $(this).data('easing'),
						current_x,
						current_y,
						mod_position;
					if( current_position < start ) {
						mod_position = 0;
					} else if( current_position > end ) {
						mod_position = 1;
					} else {
						mod_position = (current_position-start)/(end-start);
					}
					if( start_x ) {
						switch(easing) {
							case 'InQuad':
								current_x = Math.easeInQuad(mod_position, start_x, end_x - start_x, 1);
								break;
							case 'OutQuad':
								current_x = Math.easeOutQuad(mod_position, start_x, end_x - start_x, 1);
								break;
							case 'InOutQuad':
								current_x = Math.easeInOutQuad(mod_position, start_x, end_x - start_x, 1);
								break;
							case 'custom':
								mod_position = Math.abs(Math.easeCustom(mod_position, mod_position, start_x, end_x - start_x, 1));
							default:
								current_x = start_x + Math.round(( end_x - start_x ) * mod_position);
								break;
						}
						$(this).css({
							left: current_x+x_unit
						});	
					}
					if( start_y ) {
						switch(easing) {
							case 'InQuad':
								current_y = Math.easeInQuad(mod_position, start_y, end_y - start_y, 1);
								break;
							case 'OutQuad':
								current_y = Math.easeOutQuad(mod_position, start_y, end_y - start_y, 1);
								break;
							case 'InOutQuad':
								current_y = Math.easeInOutQuad(mod_position, start_y, end_y - start_y, 1);
								break;
							case 'SlowMiddle':
								mod_position = Math.easeCustom(mod_position, mod_position, start_y, end_y - start_y, 1);
							default:
								current_y = start_y + Math.round(( end_y - start_y ) * mod_position);
								break;
						}
						$(this).css({
							top: current_y+y_unit
						});	
					}
				});
			}
		});		
	}
	parallax_scroll(container);
	$(window).scroll(function(){
		parallax_scroll(container);
	});
}