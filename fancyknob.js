(function($) {
    $.fn.fancyknob = function(options) {
        return this.each(function() {
            $(this).hide()
            $('<div class="knob-surround"><div class="knob"></div><div class="ticks"><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div><div class="tick"></div></div></div>').insertAfter($(this));
            var angle = 0,
                minangle = 0,
                maxangle = 280,
                minval = $(this).prop('min'),
                maxval = $(this).prop('max'),
                knob = $(this).next().find('.knob'),
                doc = $(document),
                a, b, deg, tmp,
                rad2deg = 180 / Math.PI,
                startDeg = -1,
                currentDeg = 0,
                rotation = 0,
                lastDeg = 0;

            $(this).on("input change", function() {
                if (minval < 0) {
                    if (parseInt($(this).val()) < 0) {
                        var i = Math.abs(minval) + parseInt($(this).val());
                        angle = Math.round((i / maxval) * 280) / 2;
                    } else {
                        var i = parseInt($(this).val());
                        angle = 140 + (Math.round((i / maxval) * 280) / 2);
                    }
                } else {
                    angle = Math.round(($(this).val() / maxval) * 280);
                }
                setAngle($(this).next(), false)
            });

            function moveKnob(direction, elem, mode) {
                if (direction == 'up') {
                    if (angle <= maxangle) {
                        if (mode) {
                            angle = angle + 10
                        } else {
                            angle = angle + 1;
                        }
                        if (angle >= maxangle) {
                            angle = maxangle;
                        }
                    }
                    setAngle(elem, true);
                } else if (direction == 'down') {
                    if ((angle) >= minangle) {
                        if (mode) {
                            angle = angle - 10;
                        } else {
                            angle = angle - 1;
                        }
                        if (angle <= minangle) {
                            angle = minangle;
                        }
                    }
                }
                setAngle(elem, true);
            }
            $(this).next().bind('DOMMouseScroll', function(e) {

                if (e.originalEvent.detail > 0) {
                    moveKnob('down', $(this), false);
                } else {
                    moveKnob('up', $(this), false);
                }
                return false;
            });
            $(this).next().bind('mousewheel', function(e) {
                if (e.originalEvent.wheelDelta < 0) {
                    moveKnob('down', $(this));
                } else {
                    moveKnob('up', $(this));
                }
                return false;
            });
            knob.on('mousedown', function(e) {

                e.preventDefault();

                var offset = $(this).offset();
                var center = {
                    y: offset.top + knob.height() / 2,
                    x: offset.left + knob.width() / 2
                };
                var a, b, deg, tmp,
                    rad2deg = 180 / Math.PI;
                doc.on('mousemove.rem ', function(e) {
                    a = center.y - e.pageY ;
                    b = center.x - e.pageX;
                    deg = Math.atan2(a, b) * rad2deg;
                    if (deg < 0) {
                        deg = 360 + deg;
                    }
                    if (startDeg == -1) {
                        startDeg = deg;
                    }
                    tmp = Math.floor((deg - startDeg) + rotation);
                    if (tmp < 0) {
                        tmp = 360 + tmp;
                    } else if (tmp > 280) {
                        tmp = tmp % 360;
                    }
                    if (Math.abs(tmp - lastDeg) > 180) {
                        return false;
                    }
                    angle = tmp;
                    if (angle > maxangle) {
                        angle = maxangle
                    }
                    setAngle(knob.parent(), true)
                    lastDeg = tmp;
                });
                doc.on('mouseup.rem', function() {
                    knob.off('.rem');
                    doc.off('.rem');
                    rotation = currentDeg;
                    startDeg = -1;
                });
            });
            knob.on('touchstart', function(e) {

                e.preventDefault();

                var offset = $(this).offset();
                var center = {
                    y: offset.top + knob.height() / 2,
                    x: offset.left + knob.width() / 2
                };
                var a, b, deg, tmp,
                    rad2deg = 180 / Math.PI;
                doc.on('touchmove.rem ', function(e) {
                    a = center.y - e.originalEvent.touches[0].pageY ;
                    b = center.x - e.originalEvent.touches[0].pageX;
                    deg = Math.atan2(a, b) * rad2deg;
                    if (deg < 0) {
                        deg = 360 + deg;
                    }
                    if (startDeg == -1) {
                        startDeg = deg;
                    }
                    tmp = Math.floor((deg - startDeg) + rotation);
                    if (tmp < 0) {
                        tmp = 360 + tmp;
                    } else if (tmp > 280) {
                        tmp = tmp % 360;
                    }
                    if (Math.abs(tmp - lastDeg) > 180) {
                        return false;
                    }
                    angle = tmp;
                    if (angle > maxangle) {
                        angle = maxangle
                    }
                    setAngle(knob.parent(), true)
                    lastDeg = tmp;
                });
                doc.on('touchend.rem', function() {
                    knob.off('.rem');
                    doc.off('.rem');
                    rotation = currentDeg;
                    startDeg = -1;
                });
            });
            function setAngle(elem, mode) {
                elem.find('.knob').css({
                    '-moz-transform': 'rotate(' + angle + 'deg)',
                    '-webkit-transform': 'rotate(' + angle + 'deg)',
                    '-o-transform': 'rotate(' + angle + 'deg)',
                    '-ms-transform': 'rotate(' + angle + 'deg)',
                    'transform': 'rotate(' + angle + 'deg)'
                });
                if (minval < 0) {
                    var index = elem.find('.tick').length;
                    if (angle < 135) {
                        var anglepos = (Math.round(angle / 10));
                        var activeTicks = Math.abs(anglepos - 14);
                        elem.find('.tick').removeClass('activetick');
                        for (var i = 0; i <= activeTicks; i++) {
                            elem.find('.tick:eq(' + Math.round(14 + i) + ')').removeClass('activetick');
                            elem.find('.tick:eq(' + Math.round(14 - i) + ')').addClass('activetick');
                        }
                    } else if (angle > 145) {
                        var anglepos = (Math.round(angle / 10));
                        var activeTicks = anglepos - 14;
                        elem.find('.tick').removeClass('activetick');
                        for (var i = 0; i <= activeTicks; i++) {
                            elem.find('.tick:eq(' + Math.round(14 - i) + ')').removeClass('activetick');
                            elem.find('.tick:eq(' + Math.round(14 + i) + ')').addClass('activetick');
                        }

                    } else {
                        elem.find('.tick').removeClass('activetick');
                        elem.find('.tick:eq(' + Math.round(14) + ')').addClass('activetick');
                    }
                } else {
                    var activeTicks = (Math.round(angle / 10) + 1);
                    elem.find('.tick').removeClass('activetick');
                    elem.find('.tick').slice(0, activeTicks).addClass('activetick');
                    if (angle == 0) {
                        elem.find('.tick').removeClass('activetick');
                    }
                }
                var pc;
                if (mode) {
                    if (minval < 0) {
                        if (angle < 140) {
                            pc = Math.round((angle / 140) * Math.abs(minval));
                            pc = parseInt(minval) + Math.abs(pc)
                        } else if (angle > 140) {
                            pc = (Math.round((angle / 140) * maxval) - parseInt(maxval));
                        } else {
                            pc = 0;
                        }
                    } else {
                        pc = Math.round((angle / 280) * maxval);
                    }
                    elem.prev().val(pc);
                }
            }
            $(this).trigger('change')
        })
    };
}(jQuery));
