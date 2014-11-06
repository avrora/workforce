Router.configure({
  layoutTemplate: 'basicLayout',
  notFoundTemplate: 'notFound'
});

Router.map(function (){
  this.route('control', {
    path: '/control',
    template: 'control',

    onBeforeAction: function () {

      var user = Meteor.user();
      if (user) {
        if(!Roles.userIsInRole(user, ['admin'])) {
          Router.go('/');
        }
      } else {
        Router.go('/');
      }
      this.next();
    }
  });

  this.route('view', {
    path: '/view',
    template: 'view'

    //onBeforeAction: function () {
    //  var user = Meteor.user();
    //  if (user) {
    //    if(!Roles.userIsInRole(user, ['user'])) {
    //      Router.go('/');
    //    }
    //  } else {
    //    Router.go('/');
    //  }
    //  this.next();
    //}
  });

//  this.route('home', {
//    path: '/',
//    template: 'home',
//
//    onAfterAction: function () {
//      var user = Meteor.user();
//      if (user) {
//        if(Roles.userIsInRole(user, ['admin'])) {
//          Router.go('/control');
//        } else if(Roles.userIsInRole(user, ['admin'])) {
//          Route.go('/view');
//        }
//      } else {
//        Router.go('/');
//      }
//      this.next();
//    }
//  });
});