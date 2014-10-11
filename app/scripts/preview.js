/*global $:false, remark:false*/

'use strict';

$(window).on('load', function() {
    
    var body = $(document.body),

    slideshow = null,

    postMessage = function(data) {
        window.parent.postMessage(data, '*');
    },

    // Send the iframe's height to the parent window
    postHeight = function() {
        postMessage({ height: body.height() });
    },

    // Send the iframe's height and text to the parent window
    postResponse = function() {
        postMessage({
            height: body.height()
        });
    },

    // Remove the current preview
    removePreview = function() {
        $('.remark-container').removeClass('remark-container');
        $('div[class|="remark"]').remove();
    };
    
    $(window).on({
        resize: postHeight,

        // Listen to messages coming from the parent window
        // Currently only used to transfer HTML from the parent window to the iframe for display
        message: function(e) {

            var source = e.originalEvent.data;
            removePreview();

            slideshow = remark.create({
                source: source
            });
        }
    });
    
    body.on('click', 'a', function(e) {
        e.preventDefault();
        open($(e.target).attr('href'), 'MME_external_link');
    });
    
});