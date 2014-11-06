Meteor.startup(function(){
    AccountsTemplates.configureRoute('signIn', {
        redirect: function(){
            var user = Meteor.user();
            if (Roles.userIsInRole(user, ['admin'])) {
                Router.go('/control');
            } else if (Roles.userIsInRole(user, ['admin'])) {
                Route.go('/view');
            }
        }
    });

    AccountsTemplates.init();
});