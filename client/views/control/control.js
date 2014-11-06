var map,
    markers = {};

Template['control'].helpers({
    usersOnline: function () {
        return Meteor.users.find({'status.online': true, '_id': {$nin: [Meteor.userId()]}, 'roles': {$all: ['user']} });
    }
});

Template['control'].rendered = function () {
    GoogleMaps.init({
            'sensor': false, //optional
            'language': 'en', //optional,
            'libraries': 'geometry'
        },
        function(){
            var mapOptions = {
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            map.setCenter(new google.maps.LatLng( 40.416906, -3.703625 ));

            Tracker.autorun(function () {
                Meteor.subscribe("userStatus");
                Meteor.users.find({
                    'status.online': true,
                    '_id': {$nin: [Meteor.userId()]}, 'roles': {$all: ['user']}
                }).forEach(function(user) {
                    if(!markers[user._id]) {
                        markers[user._id] = new google.maps.Marker();
                    }
                    if (user.lastLocation) {
                        markers[user._id].setPosition(new google.maps.LatLng(user.lastLocation.lat, user.lastLocation.lng));
                        markers[user._id].setMap(map);
                        markers[user._id].setTitle(Meteor.user().username);
                    }
                })
            });

            Meteor.users.find({ "status.online": true }).observe({
                added: function(id) {
                    console.log('Added');
                },
                removed: function(id) {
                    console.log('Removed');
                    delete markers[id];
                }
            });
        }
    );
};

var lastDestinationTemplate,
    lastWaypointTemplate;

Template['control'].events({
    'click .button#destination-button': function(event) {
        console.log('show');
        event.preventDefault();
        var target = event.currentTarget;
        var username = $(target).closest('td').siblings().get(0).innerHTML;
        if (lastDestinationTemplate) {
            Blaze.remove(lastDestinationTemplate);
        }
        console.log(username);
        lastDestinationTemplate = Blaze.renderWithData(Template.destinationModalForm, {'targetUserName': username}, document.getElementById('destination-container'));
        $('#destination-container').modal('show');
    },
   'click .button#waypoint-button': function(event) {
       console.log('show');
       event.preventDefault();
       var target = event.currentTarget;
       var username = $(target).closest('td').siblings().get(0).innerHTML;
       if (lastWaypointTemplate) {
           Blaze.remove(lastWaypointTemplate);
       }
       console.log(username);
       lastWaypointTemplate = Blaze.renderWithData(Template.waypointModalForm, {'targetUserName': username}, document.getElementById('waypoint-container'));
       $('#waypoint-container').modal('show');
   }
});

Template['destinationModalForm'].events({
    'click .submit' : function(event) {
        event.preventDefault(); //prevent page refresh
        var form = {};
        $.each($('#destinationLatLngForm').serializeArray(), function() {
            form[this.name] = this.value;
        });
        console.log('Destination ' + form.lat + ',' + form.lng + ' ');
        $('#destination-container').modal('hide');
        var userID = Meteor.users.findOne({'username': this.targetUserName})._id;
        var command = {command: 'destination', geo: {lat: form.lat, lng: form.lng}, targetUser: userID};
        Command.insert(command);
    },
    'click .red.button' : function (event) {
        console.log('close');
        event.preventDefault();
        $('#destination-container').modal('hide');

    }
});

Template['waypointModalForm'].events({
    'click .submit' : function(event) {
        event.preventDefault(); //prevent page refresh
        var form = {};
        $.each($('#waypointLatLngForm').serializeArray(), function() {
            form[this.name] = this.value;
        });
        console.log('Waypoint ' + form.lat + ',' + form.lng + ' ');
        $('#waypoint-container').modal('hide');
        var userID = Meteor.users.findOne({'username': this.targetUserName})._id;
        var command = {command: 'waypoint', geo: {lat: form.lat, lng: form.lng}, targetUser: userID};
        Command.insert(command);
    },
    'click .red.button' : function (event) {
        console.log('close');
        event.preventDefault();
        $('#waypoint-container').modal('hide');

    }
});

