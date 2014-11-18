var myLat = 0;
var myLng = 0;
var xhr = new XMLHttpRequest();
var me;
var myOptions = {
	zoom: 13,
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var dis_array = []; 
var char_icons = {
	'snape' : 'images/snape.png',
	'nr' : 'images/nr.png',
	'batman' : 'images/batman.png',
	'carmen' : 'images/carmen.png',
	'waldo' : 'images/waldo.png',
	'hescott' : 'images/hescott.png'
};
var map;
var characters;
var students;

function getLoc() 
{
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	} else {
		myLat = 42.4069;			// Defaults to Tufts 
		myLng = -71.1198;		
	}
}

function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);
	map.panTo(me);
	mark(me, "Freckles", "images/wing.jpg", "I'm HERE!");
	post_to_chicken();
}
function mark(location, name, image, message)
{
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		title: name,
		icon: image
	});
	add_infoWindow(marker, message);
	marker.setMap(map);
}

function add_infoWindow(marker, message)
{
	var infoWindow = new google.maps.InfoWindow({
		content: message
	});
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map, marker);
	});
}

function post_to_chicken()
{
	xhr.open("POST","http://chickenofthesea.herokuapp.com/sendLocation", true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() 
	{
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			people = JSON.parse(xhr.responseText);
			characters = people['characters'];
			students = people['students'];
			render_icons_and_lines(characters);
			render_students(students);
		}
	}
	xhr.send("login=Freckles&lat="+myLat+"&lng="+myLng);

}

function render_icons_and_lines(characters)
{
	//just print names as a test 
	for (var i = characters.length - 1; i >= 0; i--) {
		render_icons(characters[i]);
	}
	print_distances();

}
function render_students(students)
{
	for (var i = students.length - 1; i >= 0; i--) {
		render_markers(students[i]);
	}
}
function render_markers(students)
{
	var login = students['login'];
	var stud_lat = students['lat'];
	var stud_lng = students['lng'];
	var stud_loc = new google.maps.LatLng(stud_lat, stud_lng);
	var message = get_info_string_stud(login, stud_lat, stud_lng, students['created_at'])
	mark(stud_loc, name, '', message);
}

function render_icons(character)
{
	var name = character['name']
	var char_lat = character['loc']['latitude'];
	var char_lng = character['loc']['longitude'];
	var char_loc = new google.maps.LatLng(char_lat, char_lng);
	render_polyline(char_loc);
	var dist = calc_dist(char_lat, char_lng);
	dis_array.push({id: name, distance: dist});
	var message = get_info_string_char(name, char_lat, char_lng, character['loc']['note']);
	mark(char_loc, name, char_icons[name], message);
}

function compare(a, b)
{
	if (a.dist < b.dist )
			return -1;
	if (a.dist > b.dist )
			return 1;
	return 0;
}

function print_distances()
{
	var x;
	var message;
	dis_array.sort(compare);

	while (dis_array.length > 0) {
		x = dis_array.pop();
		message = 'Distance between you and '+x['id']+': '+x['distance']+' miles</br>';
		document.getElementById("dis_list").innerHTML = message + document.getElementById("dis_list").innerHTML;
	}
}
function toRad(degree)
{
	return degree * Math.PI / 180;
}
function calc_dist(lat, lng)
{
	var R = 3959 					// earth radius in miles 
	var phi_1 = toRad(lat);
	var phi_2 = toRad(myLat);
	var delt_phi = toRad(myLat - lat);
	var delt_lamb = toRad(myLng - lng);
	var a = Math.sin(delt_phi/2) * Math.sin(delt_phi/2) +
			Math.cos(phi_1) * Math.cos(phi_2) *
			Math.sin(delt_lamb/2) * Math.sin(delt_lamb/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return (R * c).toFixed(4);
}
function render_polyline(char_loc)
{
	var char_2_me = [char_loc, me];
	var line = new google.maps.Polyline({
		path: char_2_me,
		    geodesic: true,
		    strokeColor: '#FF0000',
		    strokeOpacity: 1.0,
		    strokeWeight: 2
	});
	line.setMap(map);
}
function get_info_string_stud(name, lat, lng, timestamp)
{
	message = 'Login: '+name+'</br>Latitude: '+lat+'</br>Longitude: '+lng+'</br>Timestamp: '+timestamp;
	return message;
}
function get_info_string_char(name, lat, lng, note)
{
	message = 'Name: '+name+'</br>Latitude: '+lat+'</br>Longitude: '+lng+'</br>Note: '+note;
	return message;
}

function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    getLoc();
}