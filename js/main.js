$(document).ready(function(){

    var s = skrollr.init({
        smoothScrolling: false
    });

    recalculate();

    //countdown clock
    if($('#countdown').length){
        //localize countdowm plugin
//        $.countdown.regionalOptions.ru = {
//            labels: ['Лет','Месяцев','Недель','Дней','Часов','Минут','Секунд'],
//            labels1: ['Год','Месяц','Неделя','День','Час','Минута','Секунда'],
//            labels2: ['Года','Месяца','Недели','Дня','Часа','Минуты','Секунды'],
//            compactLabels: ['л','м','н','д'],
//            compactLabels1: ['г','м','н','д'],
//            whichLabels: function(amount) {
//                var units = amount % 10;
//                var tens = Math.floor((amount % 100) / 10);
//                return (amount === 1 ? 1 : (units >= 2 && units <= 4 && tens !== 1 ? 2 :
//                                            (units === 1 && tens !== 1 ? 1 : 0)));
//            },
//            digits: ['0','1','2','3','4','5','6','7','8','9'],
//            timeSeparator: ':',
//            isRTL: false
//        };
//        $.countdown.setDefaults($.countdown.regionalOptions.ru);

        var dateString = $('#countdown').data('date'),
            dateParts = dateString.split('.');
        dateParts[2] = "20" + dateParts[2];
        var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        var timerSet = dateObject;
        //init
        $('#countdown').countdown({
            until: timerSet,
            format: 'DHMS',
            layout: '{o<}<div><span>{on}</span> <small>{ol}</small></div>{o>}' + '{d<}<div><span>{dnn}</span> <small>{dl}</small></div>{d>}{h<}<div><span>{hnn}</span> <small>{hl}</small></div>{h>}' + '{m<}<div><span>{mnn}</span> <small>{ml}</small></div>{m>}{s<}<div><span>{snn}</span> <small>{sl}</small></div>{s>}'
        });
    }

    if($('.s_main').length){
        //header fixed color
        if($(window).scrollTop() > 50){
            $('.header').addClass('_white');
        }else{
            $('.header').removeClass('_white');
        }
        $(window).scroll(function(e){
            if($(this).scrollTop() > 50){
                $('.header').addClass('_white');
            }else{
                $('.header').removeClass('_white');
            }
            if($(this).scrollTop() > 1500){
                $('.up').removeClass('_hidden');
            }else{
                $('.up').addClass('_hidden');
            }
        });
    }

    //header more submenu
	$('.header__sub_head').click(function(){
        $(this).closest('.header__sub').toggleClass('_active');
        $('.header__lang').removeClass('_active');
    });
    //header lang submenu
    $('.header__lang_head').click(function(){
        $(this).closest('.header__lang').toggleClass('_active');
        $('.header__sub').removeClass('_active');
    });
    //prevent
    $('.header__lang, .header__sub').click(function(e){
        e.preventDefault();
        e.stopPropagation();
    });
    $(window).click(function(){
        $('.header__sub, .header__lang').removeClass('_active');
    });

    //video preview
    $('.s_main__info_right').on('mouseenter', function(){
        players['playerPrew'].mute().setPlaybackQuality('small').setPlaybackRate(1.5);
        players['playerPrew'].playVideo();
    }).on('mouseleave', function(){
        players['playerPrew'].stopVideo();
    });

    $('.g_tabs__head a').click(function(e){
        var el = $(this),
            n = el.index(),
            wrp = el.closest('.g_tabs');
        e.preventDefault();
        el.addClass('_current').siblings().removeClass('_current');
        wrp.find('.g_tabs__item').eq(n).addClass('_current').siblings().removeClass('_current');
    });

    //popups
    $('._open_pop').click(function(e){
        e.preventDefault();
        var visible = $('.popup._visible');

        var name = $(this).data('name'),
            popup = $('.popup_'+name),
            popup_h = popup.outerHeight(),
            popup_w = popup.outerWidth(),
            h = $(window).height(),
            px = h/2 - popup_h/2;
        popup.css({
            'top': px+'px',
            'margin-left': '-'+ popup_w/2 +'px',
        });
        if(name=="video"){
            players['playerPrew'].stopVideo();
            var link = $(this).data('src'),
                src = link.split('/');
                players['player'].loadVideoById(src[src.length-1]);
        }
        popup.find('form').trigger( 'reset' );
        $('.popup.popup_'+name+', .overlay').addClass('_visible');
    });
    $('.overlay, ._close_pop').click(function(e){
        e.preventDefault();
        var visiblePopup = $('.popup._visible');
        $('.overlay').removeClass('_visible');
        visiblePopup.addClass('_back');
        if(visiblePopup.hasClass('popup_video')){
            players['player'].stopVideo();
        }
        setTimeout(function(){
            visiblePopup.removeClass('_visible _back');
        },450);
    });

    //hamb
    $('.header__hamb').click(function(e){
        $('.header__nav').addClass('_active');
    });
    $('.header__close').click(function(e){
        $('.header__nav').removeClass('_active');
    });


    $(window).resize(function(){
        recalculate();
    });
    function recalculate(){
        $('.popup').each(function(){
            var popup = $(this),
                popup_h = popup.outerHeight(),
                popup_w = popup.outerWidth(),
                h = $(window).height(),
                px = h/2 - popup_h/2;
            popup.css({
                'top': px+'px',
                'margin-left': '-'+ popup_w/2 +'px',
            });
        });
        //mobile
        if(Modernizr.mq('only screen and (max-width: 700px)')){
            if($('.s_main').length){
                $('.header__logo').insertBefore('.s_main__body');
            }else{
                $('.header__logo').css({
                    'position': 'absolute',
                    'pointer-events':'none',
                    'opacity': 0
                });
            }

        }else{
            if($('.s_main').length){
                $('.header__logo').insertBefore('.header__hamb');
            }else{
                $('.header__logo').css({
                    'position': 'relative',
                    'pointer-events':'all',
                    'opacity': 1
                });
            }

        }
    }

    if(Modernizr.mq('only screen and (max-width: 700px)')){
        //see more mobile
        var body = $('.s_team .g_wrp').last().find('.s_team__body'),
            items = body.find('.s_team__item'),
            n = items.length;
        if(n>5){
            body.append('<div class="s_team__body_wrp" />')
                .append('<a href="#" class="s_team__more g_btn_outline"><span>see more<span></a>');
            for(var i = n-1; i>5;i--){
                $('.s_team__body_wrp').append(items.eq(i));
            }
            $('.s_team__more').click(function(e){
                e.preventDefault();
                $('.s_team__body_wrp').css({
                    'max-height': Math.abs(n*$('.s_team__item').outerHeight()) + 'px'
                }).addClass('_active');
                $('.s_team__more').remove();
            });
        }

        var body2 = $('.s_video .s_video__body'),
            items2 = body2.find('.s_video__item'),
            n2 = items2.length;
        if(n2>3){
            body2.append('<div class="s_video__body_wrp" />')
                .append('<a href="#" class="s_video__more g_btn_outline"><span>see more<span></a>');
            for(var i = n2-1; i>3;i--){
                $('.s_video__body_wrp').append(items2.eq(i));
            }
            $('.s_video__more').click(function(e){
                e.preventDefault();
                $('.s_video__body_wrp').css({
                    'max-height': Math.abs(n2*$('.s_video__item').outerHeight()) + 'px'
                }).addClass('_active');
                $('.s_video__more').remove();
            });
        }

        //team popup
        $('.s_team__item').click(function(e){
            e.preventDefault();
            var content = $(this).html();
            $('.popup_team__item').html(content);
            var popup = $('.popup_team'),
                popup_h = popup.outerHeight(),
                popup_w = popup.outerWidth(),
                h = $(window).height(),
                px = h/2 - popup_h/2;


            popup.css({
                'top': px+'px',
                'margin-left': '-'+ popup_w/2 +'px',
            });

            $('.popup.popup_team, .overlay').addClass('_visible');
        });
    }


    $('.header__logo').on('mouseenter', function(){
        anime({
            targets: '#motionEl1',
            translateX: path('x'),
            translateY: path('y'),
            easing: 'easeOutQuad',
            duration: 2000
        });
        anime({
            targets: '#motionEl2',
            translateX: path2('x'),
            translateY: path2('y'),
            easing: 'easeOutQuad',
            duration: 2000
        });
    });

    var path = anime.path('#motion1');
    anime({
        targets: '#motionEl1',
        translateX: path('x'),
        translateY: path('y'),
        duration: 0
    });
    var path2 = anime.path('#motion2');
    anime({
        targets: '#motionEl2',
        translateX: path2('x'),
        translateY: path2('y'),
        duration: 0
    });

    //anchors
    $('._anchor').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var el = $(this).attr('href'),px;
        if(el==0){
            px = 0;
        }else{
            px = $('.'+el).offset().top;
        }
        $('body,html').stop().animate({scrollTop:px},500);
    });

    //g_txt
    if($('.g_txt table').length){
        $('.g_txt table').wrap('<div class="g_txt__table"></div>');
    }


    var ClassicalNoise = function(r) { // Classic Perlin noise in 3D, for comparison
        if (r == undefined) r = Math;
        this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
        this.p = [];
        for (var i=0; i<256; i++) {
            this.p[i] = Math.floor(r.random()*256);
        }
        // To remove the need for index wrapping, double the permutation table length
        this.perm = [];
        for(var i=0; i<512; i++) {
            this.perm[i]=this.p[i & 255];
        }
    };

    ClassicalNoise.prototype.dot = function(g, x, y, z) {
        return g[0]*x + g[1]*y + g[2]*z;
    };

    ClassicalNoise.prototype.mix = function(a, b, t) {
        return (1.0-t)*a + t*b;
    };

    ClassicalNoise.prototype.fade = function(t) {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
    };

    // Classic Perlin noise, 3D version
    ClassicalNoise.prototype.noise = function(x, y, z) {
        // Find unit grid cell containing point
        var X = Math.floor(x);
        var Y = Math.floor(y);
        var Z = Math.floor(z);

        // Get relative xyz coordinates of point within that cell
        x = x - X;
        y = y - Y;
        z = z - Z;

        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;
        Z = Z & 255;

        // Calculate a set of eight hashed gradient indices
        var gi000 = this.perm[X+this.perm[Y+this.perm[Z]]] % 12;
        var gi001 = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12;
        var gi010 = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12;
        var gi011 = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12;
        var gi100 = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12;
        var gi101 = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12;
        var gi110 = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12;
        var gi111 = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12;

        // The gradients of each corner are now:
        // g000 = grad3[gi000];
        // g001 = grad3[gi001];
        // g010 = grad3[gi010];
        // g011 = grad3[gi011];
        // g100 = grad3[gi100];
        // g101 = grad3[gi101];
        // g110 = grad3[gi110];
        // g111 = grad3[gi111];
        // Calculate noise contributions from each of the eight corners
        var n000= this.dot(this.grad3[gi000], x, y, z);
        var n100= this.dot(this.grad3[gi100], x-1, y, z);
        var n010= this.dot(this.grad3[gi010], x, y-1, z);
        var n110= this.dot(this.grad3[gi110], x-1, y-1, z);
        var n001= this.dot(this.grad3[gi001], x, y, z-1);
        var n101= this.dot(this.grad3[gi101], x-1, y, z-1);
        var n011= this.dot(this.grad3[gi011], x, y-1, z-1);
        var n111= this.dot(this.grad3[gi111], x-1, y-1, z-1);
        // Compute the fade curve value for each of x, y, z
        var u = this.fade(x);
        var v = this.fade(y);
        var w = this.fade(z);
        // Interpolate along x the contributions from each of the corners
        var nx00 = this.mix(n000, n100, u);
        var nx01 = this.mix(n001, n101, u);
        var nx10 = this.mix(n010, n110, u);
        var nx11 = this.mix(n011, n111, u);
        // Interpolate the four results along y
        var nxy0 = this.mix(nx00, nx10, v);
        var nxy1 = this.mix(nx01, nx11, v);
        // Interpolate the two last results along z
        var nxyz = this.mix(nxy0, nxy1, w);

        return nxyz;
    };


    var canvas    = document.getElementById('canvas'),
        ctx       = canvas.getContext('2d'),
        perlin    = new ClassicalNoise(),
        variation = .003,
        amp       = 300,
        variators = [],
        max_lines = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? 25 : 30,
        canvasWidth,
        canvasHeight,
        start_y;

    for (var i = 0, u = 0; i < max_lines; i++, u+=.02) {
        variators[i] = u;
    }

    function draw(){
        ctx.shadowColor = "rgba(43, 205, 255, 1)";
        ctx.shadowBlur = 0;

        for (var i = 0; i <= max_lines; i++){
            ctx.beginPath();
            ctx.moveTo(0, start_y);
            for (var x = 0; x <= canvasWidth; x++) {
                var y = perlin.noise(x*variation+variators[i], x*variation, 0);
                ctx.lineTo(x, start_y + amp*y);
            }
            var color = Math.floor(150*Math.abs(y));
            var alpha = Math.min(Math.abs(y), .8)+.1;
            ctx.strokeStyle = "rgba(89, 222, 168,"+alpha+")";
            ctx.stroke();
            ctx.closePath();

            variators[i] += .005;
        }
    }

    (function init() {
        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);
    })();

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        draw();
        requestAnimationFrame(animate);
    }

    function resizeCanvas(){
        canvasWidth = document.documentElement.clientWidth,
            canvasHeight = document.documentElement.clientHeight;

        canvas.setAttribute("width", canvasWidth);
        canvas.setAttribute("height", canvasHeight);

        start_y = canvasHeight/2;
    }
});

//load youtube iframe api
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = {};

function onYouTubePlayerAPIReady() {
    $(document).ready(function() {
        $('._video').each(function(event) {
            var iframeID = $(this).attr('id');
            players[iframeID] = new YT.Player(iframeID);
        });
    });
}

//mobile hover disable
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return null;
}

if (getMobileOperatingSystem()) {
    try {
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];
            if (!styleSheet.rules) continue;

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue;

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri);
                }
            }
        }
    } catch (ex) {}
}





//preloader
function preloader(){
    setTimeout(function(){
        $('.g_preloader').addClass('_hide');
        $('body,html').css({'overflow-y':'visible'});
        setTimeout(function(){
            $('.g_preloader').remove();
        },1500);
    },1000);
}
//onload event
window.addEventListener ?
    window.addEventListener("load",preloader,false)
:
window.attachEvent && window.attachEvent("onload",preloader);
