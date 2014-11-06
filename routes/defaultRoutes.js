// Home Route
Router.route('/', function () {

  this.render('home');
  SEO.set({ title: 'Home -' + Meteor.App.NAME });

  var user = Meteor.user();
  if (user) {
    if(Roles.userIsInRole(user, ['admin'])) {
      Router.go('/control');
    } else {
      Router.go('/view');
    }
  }

});
