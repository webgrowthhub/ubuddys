var AplCss, targetSection, tar, classname;
! function($) {
    "use strict";
    jQuery(window).on("load", function() {
        jQuery("#status").fadeOut(), jQuery("#preloader").delay(200).fadeOut("slow")
    }), jQuery(document).ready(function($) {
        var $this = $(window),
            window_height = window.innerHeight;
        $(".vultur_loadmore").slice(0, 3).show(), $("#loadMore").on("click", function(e) {
            e.preventDefault(), $(".vultur_loadmore:hidden").slice(0, 5).slideDown(), 0 == $(".vultur_loadmore:hidden").length && $("#load").fadeOut("slow")
        }), $(".timer").appear(function() {
            $(this).countTo()
        }), $(".popup-gallery").magnificPopup({
            delegate: "a.imageopen",
            type: "image",
            tLoading: "Loading image #%curr%...",
            mainClass: "mfp-img-mobile",
            gallery: {
                enabled: !0,
                navigateByImgClick: !0,
                preload: [0, 1]
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(e) {
                    return e.el.attr("title") + "<small></small>"
                }
            }
        }), $("a.popup-youtube").magnificPopup({
            disableOn: 0,
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: !1,
            fixedContentPos: !1
        }), $("div.vultur_img_click").on("click", function() {
            if (!$(this).hasClass("active")) {
                $("div.vultur_services_slider_imgs img").removeClass("active");
                var e = $("div.vultur_services_slider_imgs .img_" + $(this).attr("id")),
                    t = e[0].outerHTML;
                e.remove(), $("div.vultur_services_slider_imgs").prepend(t), $("div.vultur_services_slider_imgs img:first").addClass("active"), $("div.vultur_services_slider_box .vultur_img_click").removeClass("active"), $(this).addClass("active")
            }
        });


        // Scroll to top button
        jQuery(document).ready(function($) {
            // Cursor Start
            const cursor = document.querySelector('.cursor');
            const cursorFollower = document.querySelector('.cursor2');

            let smallSpeed = 0.2;
            let largeSpeed = 0.12;

            let data = {
                x: 0.,
                y: 0.,
                largeX: 0,
                largeY: 0,
                targetX: 0,
                targetY: 0,
            }


            document.addEventListener('mousemove', e => {
                data.targetX = e.pageX;
                data.targetY = e.pageY;
            });

            const applyStyles = ()=>{
                cursor.style.transform =
                    `translate(${data.x - 5}px, ${data.y - 5}px) `
                cursorFollower.style.transform =
                    `translate(${data.largeX - 25}px, ${data.largeY - 25}px)`
            }

            const tick = ()=>{
                // Get distance to Target => targetX - x
                // Get 10% of that distance => ^^^ * smallSpeed
                // Add it to the circle => data.x += ^^^
                data.x += (data.targetX - data.x) * smallSpeed;
                // Repeat your Y-coord
                data.y += (data.targetY - data.y) * smallSpeed;

                data.largeX += (data.targetX - data.largeX) * largeSpeed;
                data.largeY += (data.targetY - data.largeY) * largeSpeed;

                applyStyles()
                requestAnimationFrame(tick);
            }
            tick();
            // Cursor End


            // Mobile Menu Show Hide Submenu
            $('#header .navbar-default .navbar-nav > li.menu-item-has-children ul').after('<div class="nav__expand"><i class="fas fa-chevron-down"></i></div>');

            $('#header .navbar-default .navbar-nav li .nav__expand').toggle( function() {
                jQuery(this).prev('ul').show(500);
                $(this).find('.fas.fa-chevron-down').removeClass('fa-chevron-down').addClass('fa-chevron-up');


            }, function() {
                $(this).find('.fas.fa-chevron-up').removeClass('fa-chevron-up').addClass('fa-chevron-down');
                jQuery(this).prev('ul').hide('show-sub-menu');
            });
            // End Submenu mobile




            // browser window scroll (in pixels) after which the "back to top" link is shown
            var offset = 300,
                //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
                offset_opacity = 1200,
                //duration of the top scrolling animation (in ms)
                scroll_top_duration = 700,
                //grab the "back to top" link
                $back_to_top = $('.cd-top');

            //hide or show the "back to top" link
            $(window).scroll(function() {
                ($(this).scrollTop() > offset) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
                if ($(this).scrollTop() > offset_opacity) {
                    $back_to_top.addClass('cd-fade-out');
                }
            });

            //smooth scroll to top
            $back_to_top.on('click', function(event) {
                event.preventDefault();
                $('body,html').animate({
                        scrollTop: 0,
                    }, scroll_top_duration
                );
            });

        });
        // End Scroll to top
        // Navigation menu scrollspy to anchor section //
        $('body').scrollspy({
            target: '#navigation .navbar-collapse',
            offset: parseInt($('#navigation').height(), 0)
        });
        // End navigation menu scrollspy to anchor section //

        // sticky-menu on scroll
        $(window).on('scroll', function () {
            var scroll = $(window).scrollTop();
            if (scroll < 245) {
                $("#header").removeClass("sticky-menu");
                $(".space-stick").removeClass("sticky-menu");
            } else {
                $("#header").addClass("sticky-menu");
                $(".space-stick").addClass("sticky-menu");
            }
        });
        // End sticky-menu on scroll

        /* magnificPopup image view */
        $('.popup-image').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
        /* End magnificPopup image view */

        /* magnificPopup video view */

        jQuery("a.popup-video").magnificPopup({
            disableOn: 0,
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: !1,
            fixedContentPos: !1
        }),
        /* End magnificPopup video view */

        // jQuery tooltips //
        $('.btn-tooltip').tooltip();
        $('.btn-popover').popover();
        // End jQuery tooltips //

        $('.owl-carousel').owlCarousel({
            loop:false,
            slidesToShow: 1,
            slidesToScroll: 1,
            margin:0,
            nav:false,
            touchDrag:true,
            mouseDrag:true,
            autoplay:true,
            autoplayTimeout:5000,
            smartSpeed: 1000,
            autoplayHoverPause:true,
            responsive:{
                0:{
                    items:1
                }
            }
        });
        // Team Slider Slick
        $('.carousel-slider.gallery-slider').slick({
            arrows: false,
            dots: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            draggable: true,

            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        draggable: true
                    }
                },
                {
                    breakpoint: 990,
                    settings: {
                        slidesToShow: 2,
                        draggable: true
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        draggable: true
                    }

                }
            ]
        });
        // End Team Slider Slick
        // LMS Slider Slick
        $('.carousel-slider.lms-slider').slick({
            arrows: false,
            dots: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            draggable: true,

            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 4,
                        draggable: true
                    }
                },
                {
                    breakpoint: 990,
                    settings: {
                        slidesToShow: 2,
                        draggable: true
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        draggable: true
                    }

                }
            ]
        });
        // End LMS Slider Slick
        // Sponsor Slider Slick
        $('.carousel-slider.sponsor-slider').slick({
            arrows: false,
            dots: false,
            slidesToShow: 6,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2500,
            draggable: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 6,
                        draggable: true
                    }
                },
                {
                    breakpoint: 990,
                    settings: {
                        slidesToShow: 4,
                        draggable: true
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 3,
                        draggable: true
                    }

                }
            ]
        });
        // End Sponsor Slider Slick
        // Students Review Slider Slick
        $('.carousel-slider.general-slider').each(function() {
            $(this).slick({
                arrows: true,
                dots: true,
                prevArrow: $('.prev'),
                nextArrow: $('.next'),
                margin:0,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 5000,
                draggable: true,
                responsive: [{
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        draggable: true
                    }
                }]
            });
        });
        // End Students Review Slider Slick

        var movementStrength = 25;
        var height = movementStrength / $(window).height();
        var width = movementStrength / $(window).width();
        $("#instructor").mousemove(function(e){
            var pageX = e.pageX - ($(window).width() / 2);
            var pageY = e.pageY - ($(window).height() / 2);
            var newvalueX = width * pageX * -1 - 25;
            var newvalueY = height * pageY * -1 - 50;
            $('#top-image').css("background-position", newvalueX+"px     "+newvalueY+"px");
        });

        // Preview images popup gallery with Fancybox //
        $('.fancybox').fancybox({
            loop: false
        });
        // End Preview images popup gallery with Fancybox //
        // Counter animation //
        // $('.themeioan_counter > h4').counterUp ({
        //     delay: 10,
        //     time: 3000
        // });
        // End Counter animation //
        // Navigation Burger animation //
        $('.burger-icon').on('click touchstart', function(e) {
            $(this).toggleClass('change');
            $("#navbarCollapse").slideToggle();
            e.preventDefault();
        });
        // END Navigation Burger animation //
        function checkRequire(formId, targetResp) {
            targetResp.html("");
            var email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                url = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,
                image = /\.(jpe?g|gif|png|PNG|JPE?G)$/,
                mobile = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/,
                facebook = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/,
                twitter = /^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/,
                instagram = /^(https?:\/\/)?(www\.)?plus.google.com\/[a-zA-Z0-9(\.\?)?]/,
                check = 0;
            $("#er_msg").remove();
            var target = $("object" == typeof formId ? formId : "#" + formId);
            return target.find("input , textarea , select").each(function() {
                if ($(this).hasClass("require")) {
                    if ("" == $(this).val().trim()) return check = 1, $(this).focus(), targetResp.html("You missed out some fields."), $(this).addClass("error"), !1;
                    $(this).removeClass("error")
                }
                if ("" != $(this).val().trim()) {
                    var valid = $(this).attr("data-valid");
                    if (void 0 !== valid) {
                        if (!eval(valid).test($(this).val().trim())) return $(this).addClass("error"), $(this).focus(), check = 1, targetResp.html($(this).attr("data-error")), !1;
                        $(this).removeClass("error")
                    }
                }
            }), check
        }
    }), jQuery(".vultur_btn").on("click", function() {
        jQuery(".vultur_loader").show();
        var e = jQuery(".ajx_auto_incriment").val(),
            t = +jQuery(".ajx_prot_number").val() + +(jQuery(".ajx_prot_showmore").val() * e);
        e++, jQuery(".ajx_auto_incriment").val(e);
        var r = "click_value=" + t;
        r += "&action=vultur_load_portfolio", jQuery.ajax({
            type: "post",
            url: jQuery("#ajaxurl").val(),
            data: r,
            success: function(e) {
                jQuery("#ajax_portplio_shortcode").html(e), jQuery(".vultur_loader").hide(), jQuery(".popup-gallery").magnificPopup({
                    delegate: "a.imageopen",
                    type: "image",
                    tLoading: "Loading image #%curr%...",
                    mainClass: "mfp-img-mobile",
                    gallery: {
                        enabled: !0,
                        navigateByImgClick: !0,
                        preload: [0, 1]
                    },
                    image: {
                        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                        titleSrc: function(e) {
                            return e.el.attr("title") + "<small></small>"
                        }
                    }
                }), jQuery("a.popup-youtube").magnificPopup({
                    disableOn: 0,
                    type: "iframe",
                    mainClass: "mfp-fade",
                    removalDelay: 160,
                    preloader: !1,
                    fixedContentPos: !1
                })
            }
        })
    }), jQuery(".related.products .owl-carousel").owlCarousel({
        delay: 9e3,
        loop: !0,
        margin: 30,
        nav: !1,
        dots: !0,
        autoplay: !0,
        autoplayHoverPause: !0,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1e3: {
                items: 3
            }
        }
    }), jQuery(".self_service_detail").addClass("animated zoomIn"), jQuery(".flex-control-thumbs li img").on("click", function() {
        var e = jQuery(this).attr("src");
        jQuery(".sl_product_img_target").attr("src", e)
    })
}();