/**
 * Created by alex on 05/11/14.
 */
Meteor.users.allow({
    insert: function () {
        return false;
    },
    update: function (userId, doc, fieldNames, modifier) {
        if (userId == doc._id && fieldNames.length == 1) {
            if (fieldNames[0] == 'lastLocation') {
                return true;
            }
        }
        return false;
    },
    remove: function () {
        return false;
    }
});
