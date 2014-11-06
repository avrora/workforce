Meteor.publish('Location', function () {
  return Location.find();
});
