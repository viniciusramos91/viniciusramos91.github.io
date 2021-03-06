$(function() {
    if($(window).width() < 768) {
        var nav = $(".navbar-collapse");

        nav.on("click", "a:not([data-toggle])", null, function() {
            nav.collapse("hide")
        })
    }
});

function hideMenu() {
    $(".navbar-collapse").collapse("hide");
}

$(document).on("click", "a.page-scroll", function(c) {
    var d = $(this);
    $("html, body").stop().animate({
        scrollTop: ($(d.attr("href")).offset().top - 80)
    }, 1250, "easeInOutExpo");
    c.preventDefault();
    location.href = d.attr("href")
});
