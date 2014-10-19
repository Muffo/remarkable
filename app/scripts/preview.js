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
    },

    calcSlideNumber = function(markdown, caretPosition) {
        // Consider the text before the caret
        markdown = markdown.substring(0, caretPosition);

        // Remove all the code
        markdown = markdown.replace(/```[^`]*```/g, "");

        // Slide numeration start from 1
        var slideNumber = 1;

        // Look for separators '---' and incremental separators '--'
        var separators = markdown.match(/\n---?\n/g);
        if (separators) {
            slideNumber += separators.length;
        }

        // Remove layout slides
        var layouSlides = markdown.match(/\nlayout: true/g);
        if (layouSlides) {
            slideNumber -= layouSlides.length;
        }

        return slideNumber;
    };
    
    $(window).on({
        resize: postHeight,

        // Listen to messages coming from the parent window
        message: function(e) {
            var request = e.originalEvent.data;
            if (request.hasOwnProperty('action')) {
                if (request.action === 'updateMarkdownPreview') {

                    var markdown = request.markdown;
                    var caretPosition = request.caretPosition;
                    var createSlideshow = request.createSlideshow;
                    var slideNumber = calcSlideNumber(markdown, caretPosition);
                   
                    if (createSlideshow) {
                        removePreview();
                        slideshow = remark.create({
                            source: markdown
                        });
                    } 
                    slideshow.gotoSlide(slideNumber);
                }
                else if (request.action === 'firstSlide') {
                    slideshow.gotoFirstSlide();
                }
                else if (request.action === 'previousSlide') {
                    slideshow.gotoPreviousSlide();
                }
                else if (request.action === 'nextSlide') {
                    slideshow.gotoNextSlide();
                }
                else if (request.action === 'viewSlides') {
                    if (body.hasClass('remark-presenter-mode')) {
                        slideshow.togglePresenterMode();
                    }
                }
                else if (request.action === 'viewPresenter') {
                    if (!body.hasClass('remark-presenter-mode')) {
                        slideshow.togglePresenterMode();
                    }
                }
                else {
                    throw new "Invalid request";
                }   
            }            
        }
    });
    
    body.on('click', 'a', function(e) {
        e.preventDefault();
        open($(e.target).attr('href'), 'MME_external_link');
    });
    
});