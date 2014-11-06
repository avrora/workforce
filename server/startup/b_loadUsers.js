function loadUser(user) {
  var userAlreadyExists = typeof Meteor.users.findOne({ username : user.username }) === 'object';

  if (!userAlreadyExists) {
    var userID = Accounts.createUser(user);

    switch (user.username) {
      case 'admin':
        Roles.addUsersToRoles(userID, ['admin']);
        break;
      case 'admin2':
        Roles.addUsersToRoles(userID, ['admin']);
        break;
      case 'test':
        Roles.addUsersToRoles(userID, ['user']);
        break;
    }
  }
}

Meteor.startup(function () {
  var users = YAML.eval(Assets.getText('users.yml'));
  for (key in users) if (users.hasOwnProperty(key)) {
    loadUser(users[key]);
  }
});