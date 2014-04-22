//Generate elements for demo.

var colors = [
      "#FFD1DC",
      "#FFC0CB",
      "#FFB7C5",
      "#FC8EAC",
      "#E75480",
      "#DE5D83",
      "#DE3163",
      "#E30B5D",
      "#E0115F",
      "#C32148"
    ]
	var countries = '';

	for (var h = 0; h < 5; h++) {
		var country = '<div class="floatable country">';
		country += '<div class="country-label">Country '+h+'</div>'

		for (var i = 0; i < 5; i++) {
			var state = '<div class="floatable state">';
				state += '<div class="state-label">State '+i+'</div>'
			for (var j = 0; j < 5; j++) {
				var county = '<div class="floatable county">';
				county += '<div class="county-label">County '+j+'</div>'
				var color = colors[rand(10)];
				for (var k = 0; k < 4; k++) {
					var city = '<div class="floatable city" style="height:60px; width:60px; background-color:'+color+'">' + k + '</div>';
					county += city;		
				}
				county += '</div>';
				state += county;
			}
			state += '</div>';
			country += state;
		}
		country += '</div>';

		countries += country;
	}

window.onresize = function(event) {
	var world = document.getElementById('world');
	traverse(world, document.body.offsetHeight);
}


var world = document.getElementById('world');
world.innerHTML = countries;
traverse(world, document.body.offsetHeight);


function traverse(world, h) {

	//start with innermost nessted container so that you can set 
	//the parent container's width and height

	var countries = world.getElementsByClassName('country');
	var states = world.getElementsByClassName('state');
	var counties = world.getElementsByClassName('county');

	for (var i = 0; i < counties.length; i++) {
		this.process(counties[i], false, 2, {top: 16, left: 16}, 152, 98);
	}
	for (var i = 0; i < states.length; i++) {
		this.process(states[i], true, h-30, {top: 16, left: 16}, 168, 144);
	}
	for (var i = 0; i < countries.length; i++) {
		this.process(countries[i], true, h-30, {top: 16, left: 16}, 184, 190);
	}
	this.process(world, true, h-30, {top: 16, left: 16}, 84, h);

	return world;
}

function rand(max) {
	return Math.floor(Math.random() * max);
}

var options = {
	cursor: 'move',
	scrollSensitivity: 40,
	appendTo: document.body,
}

options.start = function(e, ui) {
	ui.item.addClass('sorting');
	ui.helper[0].style.transition = 'none';
	ui.helper[0].style.webkitTransform = 'translate3d(0,0,0)';
}


options.sort = function(e, ui) {
	var world = document.getElementById('world');
	traverse(world, document.body.offsetHeight);
}

options.stop = function(e, ui) {
	ui.item.removeClass('sorting');
	var world = document.getElementById('world');
	traverse(world, document.body.offsetHeight);

	setTimeout(function() {
		ui.item[0].style.transition = 'all 0.3s ease';
	});
}


var countyOpts = options;
countyOpts.connectWith = '.county';
countyOpts.items = '.city';
countyOpts.helper = 'clone';
$('.county').sortable(countyOpts);

var stateOpts = options;
stateOpts.connectWith = '.state';
stateOpts.items = '.county';
stateOpts.helper = 'clone';
stateOpts.handle = '.county-label';
$('.state').sortable(stateOpts);

var countryOpts = options;
countryOpts.connectWith = '.country';
countryOpts.items = '.state';
countryOpts.helper = 'clone';
countryOpts.handle = '.state-label';
$('.country').sortable(countryOpts);
