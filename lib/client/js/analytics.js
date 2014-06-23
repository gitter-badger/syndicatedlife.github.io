'use strict';

/*jshint unused:false */

(function (i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
    };
    i[r].l = 1 * new Date();
    a = s.createElement(o);
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-28183147-4', 'syndicatedlife.com');
ga('require', 'displayfeatures');
ga('send', 'pageview');

var TimingTracker = function (category, variable, optionalLabel) {
    return {
        Category: category,
        Variable: variable,
        Label: optionalLabel ? optionalLabel : undefined,
        StartTime: new Date().getTime(),
        EndTime: null,
        Send: function () {
            var $this = this;
            $this.EndTime = new Date().getTime();
            var timeSpent = $this.EndTime - $this.StartTime;
            if (0 < timeSpent && timeSpent < (1000 * 60 * 60)) {
                window.ga('send', 'event', $this.Category, $this.Variable, $this.Label, timeSpent);
            }
        },
        WrapFunction: function (action) {
            var $this = this;
            action();
            $this.Send();
        }
    };
};

(function ($) {
    $(document).ready(function () {
        //var filetypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
        var filetypes = /\.(ice)$/i;
        var baseHref = '';
        if ($('base').attr('href') !== undefined) {
            baseHref = $('base').attr('href');
        }
        $('a').on('click', function () {
            var element = $(this);
            var track = true;
            var href = (typeof (element.attr('href')) !== 'undefined') ? element.attr('href') : '';
            var isThisDomain = href.match(document.domain.split('.').reverse()[1] + '.' + document.domain.split('.').reverse()[0]);
            if (!href.match(/^javascript:/i)) {
                var eventItem = [];
                eventItem.value = 0;
                eventItem.non_i = false;
                if (href.match(/^mailto\:/i)) {
                    eventItem.category = 'Email';
                    eventItem.action = 'Click';
                    eventItem.label = href.replace(/^mailto\:/i, '');
                    eventItem.loc = href;
                }
                else {
                    if (href.match(filetypes)) {
                        var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
                        eventItem.category = 'Download';
                        eventItem.action = 'Click-' + extension[0];
                        eventItem.label = href.replace(/ /g, '-');
                        eventItem.loc = baseHref + href;
                    }
                    else {
                        if (href.match(/^https?\:/i) && !isThisDomain) {
                            eventItem.category = 'External';
                            eventItem.action = 'Click';
                            eventItem.label = href.replace(/^https?\:\/\//i, '');
                            eventItem.non_i = true;
                            eventItem.loc = href;
                        }
                        else {
                            if (href.match(/^tel\:/i)) {
                                eventItem.category = 'Telephone';
                                eventItem.action = 'Click';
                                eventItem.label = href.replace(/^tel\:/i, '');
                                eventItem.loc = href;
                            }
                            else {
                                track = false;
                            }
                        }
                    }
                }
                if (track) {
                    window.ga('send', 'event', eventItem.category, eventItem.action, eventItem.label, eventItem.value, {
                        'nonInteraction': 1
                    });
                    if (element.attr('target') === undefined || element.attr('target').toLowerCase() !== '_blank') {
                        setTimeout(function () {
                            location.href = eventItem.loc;
                        }, 400);
                        return false;
                    }
                }
            }
        });
    });
})(jQuery);