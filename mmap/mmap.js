/* initialize as Tufts Coordinates */
var myLat = 42.4069;
var myLng = -71.1198;

var me;
var myOptions;
var map;

function getLoc() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
		});
	} 
}

function init()
{
	me = new google.maps.LatLng(myLat, myLng); 
	myOptions = {
		zoom: 13,
		center: me,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

}