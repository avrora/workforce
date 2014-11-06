Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true }, {fields: {'_id': 1, 'username': 1, 'status': 1, 'roles': 1, 'lastLocation': 1}});
});