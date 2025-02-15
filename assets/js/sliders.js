function navToSlide( index ) {
    Reveal.slide( index );
}

new Vivus('left-arrow', {
    duration: 80,
    type: 'delayed' // [delayed, sync, oneByOne, script, scenario, scenario-sync]
});

new Vivus('right-arrow', {
    duration: 80,
    type: 'delayed' // [delayed, sync, oneByOne, script, scenario, scenario-sync]
});

// More info https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    slideNumber: false,

    transition: 'slide', // none/fade/slide/convex/concave/zoom

    // More info https://github.com/hakimel/reveal.js#dependencies
    dependencies: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/markdown/markdown.min.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        // { src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/highlight/highlight.min.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        //{ src: 'plugin/search/search.js', async: true },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/zoom-js/zoom.min.js', async: true },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/math/math.min.js', async: true }
    ]
});

// Variables
var $affix = $('.social-media-affix'),
    $container = $("#container"),
    $controls = $("#slider-control"),
    $leftArrow = $("#left-arrow"),
    $rightArrow = $("#right-arrow");

$affix.affix({
    offset: {
        top: $container.height()*2/3,
        bottom: function () {
            return (this.bottom = $('#footer').outerHeight(true))
        }
    }
});

// Hide menu
function hideMenu() {
    $(".navbar-collapse").collapse("hide");
    $controls.animate({ 'left': '0' }, 150);
    $affix.animate({ 'left': '0' }, 150);

    $affix.removeClass('hidden');
    $controls.removeClass('hidden');
};

// Show menu
function showMenu() {
    if ($affix.hasClass('hidden')) {
        $affix.animate({ 'left': '0' }, 150);
        $affix.removeClass('hidden');
    } else {
        $affix.animate({ 'left': '9999px' }, 150);
        $affix.addClass('hidden');
    }

    if ($controls.hasClass('hidden')) {
        $controls.animate({ 'left': '0px' }, 150);
        $controls.removeClass('hidden');
    } else {                    
        $controls.animate({ 'left': '9999px' }, 150);
        $controls.addClass('hidden');                    
    }

    // $affix.toggle('hidden');
    // $controls.addClass('hidden');
};

function next() {
    Reveal.next();
}

function previous() {
    Reveal.prev();

}

Reveal.addEventListener( 'slidechanged', function( event ) {
    if (Reveal.isLastSlide()) {
        $rightArrow.addClass("hidden");                
    } else {
        $rightArrow.removeClass("hidden");                
    }

    if (Reveal.isFirstSlide()) {
        $leftArrow.addClass("hidden");                
    } else {
        $leftArrow.removeClass("hidden");                
    }
} );

// Animate on Scroll
AOS.init({
    duration: 1200
});

// Show signup modal on mouse leave event
$( document ).ready(function() {
    $("body").bind("mouseleave",function(){
        if(!Cookies.get('pythonacademy_popup')) {

            $('#signup-modal').modal('show');

            /* Set cookie so this does not repeat */
            Cookies.set('pythonacademy_popup', '1', { expires: 1, path: '{{ site.url }}{{ page.url }}' });
        }
    });
});