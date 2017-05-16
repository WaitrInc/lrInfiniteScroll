(function (ng) {
    'use strict';
    var module = ng.module('lrInfiniteScroll', []);

    module.directive('lrInfiniteScroll', ['$timeout', function (timeout) {
        return{
            link: function (scope, element, attr) {
                var
                    lengthThreshold = attr.scrollThreshold || 50,
                    topLengthThreshold = attr.topScrollThreshold || 50,
                    timeThreshold = attr.timeThreshold || 400,
                    handler = scope.$eval(attr.lrInfiniteScroll),
                    handlerTop = scope.$eval(attr.lrInfiniteScrollTop),
                    promise = null,
                    lastRemaining = 9999,
                    lastTop = 0;

                lengthThreshold = parseInt(lengthThreshold, 10);
                timeThreshold = parseInt(timeThreshold, 10);

                if (!handler || !ng.isFunction(handler)) {
                    handler = ng.noop;
                }

                if (!handlerTop || !ng.isFunction(handlerTop)) {
                    handlerTop = ng.noop;
                }

                element.bind('scroll DOMMouseScroll mousewheel', function (event) {
                    var
                        remaining = element[0].scrollHeight - (element[0].clientHeight + element[0].scrollTop),
                        top = element[0].scrollTop;

                    //if we have reached the threshold and we scroll down
                    if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

                        //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                        if (promise !== null) {
                            timeout.cancel(promise);
                        }
                        promise = timeout(function () {
                            handler();
                            promise = null;
                        }, timeThreshold);
                    }

                    //if we have reached the threshold and we scroll up
                    if (top < topLengthThreshold && top < lastTop){
                        //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                        if (promise !== null) {
                            timeout.cancel(promise);
                        }
                        promise = timeout(function () {
                            handlerTop();
                            promise = null;
                        }, timeThreshold);

                        // If we scroll above the top we should reset back to just above 0
                        if(top <= 0){
                            element[0].scrollTop = 1;
                            event.stopPropagation();
                            event.preventDefault();
                            event.returnValue = false;
                        }
                    }

                    lastRemaining = remaining;
                    lastTop = top;
                    
                });
            }

        };
    }]);
})(angular);
