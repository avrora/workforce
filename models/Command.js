
Command = new Mongo.Collection('Command', {
  schema: new SimpleSchema({
    command: {
      type: String,
      denyUpdate: true,
      allowedValues: ['waypoint', 'destination']
    },
    geo: {
      type: [GeoLocationSchema],
      denyUpdate: true
    },
    targetUser: {
      type : [referenceType]
    },
    createdAt: {
      type: Date,
      denyUpdate: true,
      defaultValue: new Date()
    }
  })
});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Command.allow({
    insert : function () {
      return true;
    },
    update : function () {
      return true;
    },
    remove : function () {
      return true;
    }
  });
}

if (Meteor.isClient) {
  Command.allow({
    insert : function () {
      return true;
    },
    remove : function () {
      return true;
    }
  });
}