/*global $:false, app:true, editor:false*/

// 'use strict';
 
$(document).ready(function() {
	app = {
	
		// Main elements
		leftColumn: $('#left-column'),
		rightColumn: $('#right-column'),
		markdownPreviewIframe: $('#preview-iframe'),

		// Navbar elements
		viewBtns: $('.view-btn'),
		editViewBtn: $('#edit-view-btn'),
		slidesViewBtn: $('#slides-view-btn'),
		presenterViewBtn: $('#presenter-view-btn'),
		nextSlideBtn: $('#next-slide-btn'),
		prevSlideBtn: $('#prev-slide-btn'),
		githubBtn: $('#github-btn'),
		helpBtn: $('#help-btn'),
		
		isMarkdownPreviewIframeLoaded: false,
		markdownPreviewIframeLoadEventCallbacks: $.Callbacks(),
	
		init: function() {
			editor.init();
			this.initBindings();
		},
	
		initBindings: function() {
			$(window).on('message', function(e) {
				app.receiveMessage(e.originalEvent);
			});
	
			// In the Chrome app, the preview panel requires to be in a sandboxed iframe, hence isn't loaded immediately with the rest of the document
			this.markdownPreviewIframe.on('load', function() {
				app.isMarkdownPreviewIframeLoaded = true;
				app.markdownPreviewIframeLoadEventCallbacks.fire();
			});

			this.viewBtns.on('click', function(e) {
				app.viewBtns.removeClass('active');

				var clickedBtn = $(this);
				clickedBtn.addClass('active');
			});

			this.editViewBtn.on('click', function(e) {
				app.leftColumn.show();
				app.leftColumn.width('50%');
				app.rightColumn.width('50%');
				app.postMessage({
					action: 'viewSlides',
				});
			});

			this.slidesViewBtn.on('click', function(e) {
				app.leftColumn.hide();
				app.rightColumn.width('100%');
				app.postMessage({
					action: 'viewSlides',
				});
			});

			this.presenterViewBtn.on('click', function(e) {
				app.leftColumn.hide();
				app.rightColumn.width('100%');
				app.postMessage({
					action: 'viewPresenter',
				});
			});

			this.nextSlideBtn.on('click', function(e) {
				app.postMessage({
					action: 'nextSlide',
				});
			});

			this.prevSlideBtn.on('click', function(e) {
				app.postMessage({
					action: 'previousSlide',
				});
			});

			this.githubBtn.on('click', function(e) {
				window.open('https://github.com/Muffo/remarkable');
			});



		},
	
		// Post messages to the iframe
		// Currently only used to transfer HTML from this window to the iframe for display
		postMessage: function(data) {
			this.markdownPreviewIframe[0].contentWindow.postMessage(data, '*');
		},
	
		// Receive messages sent to this window (from the iframe)
		receiveMessage: function(e) {
			if (e.data.hasOwnProperty('height')) {
				this.updateMarkdownPreviewIframeHeight(e.data.height);
			}
		},
	
		// Save a key/value pair in chrome.storage (either Markdown text or enabled features)
		save: function(key, value) {
			var items = {};
			items[key] = value;
			chrome.storage.local.set(items);
		},
	
		// Restore the editor's state from chrome.storage (saved Markdown and enabled features)
		restoreState: function(c) {
			// restoreState needs the preview panel to be loaded: if it isn't loaded when restoreState is called, call restoreState again as soon as it is
			if (!this.isMarkdownPreviewIframeLoaded) {
				this.markdownPreviewIframeLoadEventCallbacks.add(function() {
					app.restoreState(c);
				});
				return;
			}
	
			chrome.storage.local.get(['markdown', 'isFullscreen'], c);
		},
	
		// A timer is used to avoid a burst of requests
		updateTimeout: null,

		// Update the preview panel with new markdown
		updateMarkdownPreview: function(markdown, caretPosition) {

			// Remove the previous request of update
			if (this.updateTimeout !== null) {
				clearTimeout(this.updateTimeout)
			}
			var request = {
				action: 'updateMarkdownPreview',
				caretPosition: caretPosition,
				markdown: markdown
			}

			// Schedule the next update
			this.updateTimeout = setTimeout(function() {
				app.postMessage(request);
			}, 200);
		},
	
		updateMarkdownPreviewIframeHeight: function(height) {
			this.markdownPreviewIframe.css('height', height);
			editor.markdownPreview.trigger('updated.editor');
		}
	};

	app.init();

});


