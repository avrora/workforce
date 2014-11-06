var map,
    selfMarker,
    destination,
    legs,
    legsIdx = 0,
    stepIdx = 0,
    pathIdx = 0,
    intervalID;


Template['view'].helpers({
    commands: function () {
        return Command.find().fetch();
    }
});

Template['view'].rendered = function () {
    var directionsDisplay,
        directionsService;
    GoogleMaps.init({
            'sensor': false, //optional
            'language': 'en', //optional,
            'libraries': 'geometry'
        },
        function(){
            var location = new google.maps.LatLng( 40.416906, -3.703625 );
            var origin = location;
            var mapOptions = {
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            map.setCenter(location);

            selfMarker = new google.maps.Marker({
                position: location,
                map: map,
                title: Meteor.user().username
            });



            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);

            directionsService = new google.maps.DirectionsService();


            Meteor.users.update(Meteor.user()._id, {$set: {'lastLocation': {lat: location.lat(), lng: location.lng()}}});

            Tracker.autorun(function () {
                Meteor.subscribe('Command');
                console.log('Change');
                var destCommand = Command.findOne({targetUser: Meteor.user()._id, command: 'destination'});
                var waypointsCommands = Command.find({targetUser: Meteor.user()._id, command: 'waypoint'});

                if (destCommand) {
                    console.log(destCommand.geo.lat + ',' + destCommand.geo.lng);
                    destination = new google.maps.LatLng(destCommand.geo.lat, destCommand.geo.lng);
                    var wayPoints = [];
                    waypointsCommands.forEach(function(aCommand){
                        console.log(aCommand.geo.lat + ',' + aCommand.geo.lng);
                        var wayPointLatLng = new google.maps.LatLng(aCommand.geo.lat, aCommand.geo.lng);
                        wayPoints.push({location: wayPointLatLng, stopover: true});
                    });
                    var request = {
                        origin: origin,
                        destination: destination,
                        waypoints: wayPoints,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    directionsService.route(request, function(response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            legs = response.routes[0].legs;
                            followPath();
                            directionsDisplay.setDirections(response);
                        }
                    });
                }
            });
        }
    );
};

function followPath() {
    intervalID = setInterval(incrementStep, 4000);
}

function incrementStep() {
    if (pathIdx == legs[legsIdx].steps[stepIdx].path.length) {
        pathIdx = 0;
        if (stepIdx == legs[legsIdx].steps[stepIdx].length) {
            stepIdx = 0;
            if (legsIdx == legs.length) {
                clearInterval(intervalID);
                return;
            } else {
                legsIdx++;
            }
        } else {
            stepIdx++;
        }
    } else {
        pathIdx++;
    }

    console.log(legsIdx, stepIdx, pathIdx);
    console.log(legs.length, legs[legsIdx].steps.length, legs[legsIdx].steps[stepIdx].path.length);
    var pathLocation = legs[legsIdx].steps[stepIdx].path[pathIdx];
    if(pathLocation) {
        Meteor.users.update(Meteor.user()._id, {$set: {'lastLocation': {lat: pathLocation.lat(), lng: pathLocation.lng()}}});
        console.log('Updating location to ' + pathLocation.lat() + ',' + pathLocation.lng());
        selfMarker.setPosition(pathLocation);
    }
}


