var handleDashboardGritterNotification = function() {
        $(window).on('load', function() {
            setTimeout(function() {
                $.gritter.add({
                    title: `Welcome back, Admin!`,
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus lacus ut lectus rutrum placerat.',
                    image: '/admin/img/user/user-2.jpg',
                    sticky: true,
                    time: '',
                    class_name: 'my-sticky-class'
                });
            }, 1000);
        });
    };
    
var Dashboard = function () {
        "use strict";
        return {
            //main function
            init: function () {
                handleDashboardGritterNotification();
        }
    };
}();
    
$(document).ready(function() {
        Dashboard.init();
        console.log('Working?')
});
