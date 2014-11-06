Meteor.publish('Command', function () {
  return Command.find();
});
