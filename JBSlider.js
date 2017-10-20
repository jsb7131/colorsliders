var JBSlider = function(opts) {

	this.opts				= opts;

	this.id					= opts.id;

	this.color 				= opts.color;

	this.container 				= $('#'+this.id);

	this.j_window 				= $(window);

	setup_slider.apply(this,[this.color]);

	bind_events.apply(this);

	this.jb_slider_handle 			= $('.jbslider-handle-'+this.color+'');

}

function setup_slider(color) {

	this.handle_id   = this.id + "-jbslider-handle-"+color+"";

	var slider_html  = "";
	    slider_html += this.opts.background_content;
	    slider_html += "<div id='"+this.handle_id+"' class='jbslider-handle-"+color+"'>";
	    slider_html += this.opts.handle_content;
	    slider_html += "</div>";

	this.container.html(slider_html);

}

function bind_events() {

	this.container.on("mousedown touchstart", startSlideRed.bind(this));
	this.j_window.on("mousemove touchmove", moveSlideRed.bind(this));
	this.j_window.on("mouseup touchend", stopSlideRed.bind(this));

}

function startSlideRed(event) {

	event.preventDefault();
	event.stopPropagation();

	this.mouse_is_down = true;

	setValues(event, this);
	
}

function moveSlideRed(event) {

	event.preventDefault();
	event.stopPropagation();

	if (this.mouse_is_down) {

		setValues(event, this);

	};

}

function stopSlideRed(event) {

	if (this.mouse_is_down) {

		this.mouse_is_down = false;

		setValues(event, this);

	};
}

function setValues(event, slider) {

	var set_perc;

	if (event.originalEvent.touches) {

		set_perc  = ((((event.originalEvent.touches[0].clientX - slider.container.offset().left) / slider.container.width())).toFixed(2));

	} else {

		set_perc  = ((((event.clientX - slider.container.offset().left) / slider.container.width())).toFixed(2));
	};

	var intensity = (55.2 * Math.log((set_perc * 100)+1));

	var max_color_value;
	var dyn_color_value;
	var label_selector;
	var label_name;

	if (slider.color === "red") {
		max_color_value = 'rgba(255,0,0,1)';
		dyn_color_value = 'rgba(' + intensity.toFixed() + ',0,0,1)';
		label_selector  = $('#info-red');
		label_name      = "Red";
	};

	if (slider.color === "green") {
		max_color_value = 'rgba(0,255,0,1)';
		dyn_color_value = 'rgba(0,' + intensity.toFixed() + ',0,1)';
		label_selector  = $('#info-green');
		label_name      = "Green";
	};

	if (slider.color === "blue") {
		max_color_value = 'rgba(0,0,255,1)';
		dyn_color_value = 'rgba(0,0,' + intensity.toFixed() + ',1)';
		label_selector  = $('#info-blue');
		label_name      = "Blue";
	};

	if (set_perc < 0) {

		slider.jb_slider_handle.css('left', '-4%');

		slider.jb_slider_handle.css('background-color', 'rgba(0,0,0,1)');

		label_selector.html('Logarithmic '+label_name+' Channel: ' + 0);
		
		setBackground(slider, 0);

	} else if (set_perc > 1) {

		slider.jb_slider_handle.css('left', '96%');

		slider.jb_slider_handle.css('background-color', max_color_value);

		label_selector.html('Logarithmic '+label_name+' Channel: ' + 255);
		
		setBackground(slider, 255);

	} else {

		slider.jb_slider_handle.css('left', ((set_perc * 100) - 4) + '%');

		slider.jb_slider_handle.css('background-color', dyn_color_value);

		label_selector.html('Logarithmic '+label_name+' Channel: ' + intensity.toFixed());
		
		setBackground(slider, intensity.toFixed());

	};
}

function setBackground(slider, val) {

	var background    = $('#wrapper');

	var current_value = background.css('background-color');
	var comma_split   = current_value.split(', ');
	var blue_split    = comma_split[2].split(')');

	var current_red   = comma_split[0].slice(4);
	var current_green = comma_split[1];
	var current_blue  = blue_split[0];

	if (slider.color === "red") {
		background.css('background-color','rgba(' + val + ',' + current_green + ',' + current_blue + ',1)');
	};

	if (slider.color === "green") {
		background.css('background-color','rgba(' + current_red + ',' + val + ',' + current_blue + ',1)');
	};

	if (slider.color === "blue") {
		background.css('background-color','rgba(' + current_red + ',' + current_green + ',' + val + ',1)');
	};
	
}

window.JBSlider = JBSlider;
