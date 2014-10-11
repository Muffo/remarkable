/*global $:false, editor:true, app:false*/

// 'use strict';
  
$(document).ready(function() {

	editor = {
		
		// Editor variables
		fitHeightElements: $('.full-height'),
		// wrappersMargin: $('#left-column > .wrapper:first').outerHeight(true) - $('#left-column > .wrapper:first').height(),
		// markdownConverter: new Showdown.converter(),
		columns: $('#left-column, #right-column'),
		markdownSource: $('#markdown'),
		markdownPreview: $('#preview'),
		markdownTargets: $('#preview'),
		markdownTargetsTriggers: $('.buttons-container .switch'),
		topPanel: $('.navbar'),
		//topPanelsTriggers: $('#left-column .buttons-container .toppanel'),
		//quickReferencePreText: $('#quick-reference pre'),
		//featuresTriggers: $('.buttons-container .feature'),
		//wordCountContainers: $('.word-count'),
		//isAutoScrolling: false,
		isFullscreen: false,
		
		// Initiate editor
		init: function() {
			this.initBindings();
			this.fitHeight();
			this.restoreState(function() {
				editor.convertMarkdown();
				editor.onloadEffect(1);
				this.fitHeight();
			});
		},

		// Handle events on several DOM elements
		initBindings: function() {
			$(window).on('resize', function() {
				editor.fitHeight();
			});
			this.markdownSource.on({
				keydown: function(e) {
					if (e.keyCode === 9) {
						editor.handleTabKeyPress(e);
					}
				},
				'keyup change': function() {
					editor.markdownSource.trigger('change.editor');
				},
				'cut paste drop': function() {
					setTimeout(function() {
						editor.markdownSource.trigger('change.editor');
					}, 0);
				},
				'change.editor': function() {
					editor.save('markdown', editor.markdownSource.val());
					editor.convertMarkdown();
				}
			});
			this.markdownTargetsTriggers.on('click', function(e) {
				e.preventDefault();
				editor.switchToPanel($(this).data('switchto'));
			});
		},

		// Resize some elements to make the editor fit inside the window
		fitHeight: function() {
			var newHeight = $(window).height() - this.topPanel.outerHeight();
			this.fitHeightElements.each(function() {
				var t = $(this);
				t.css({ height: newHeight +'px' });
			});
		},

		// Save a key/value pair in the app storage (either Markdown text or enabled features)
		save: function(key, value) {
			app.save(key, value);
		},

		// Restore the editor's state
		restoreState: function(c) {
			app.restoreState(function(restoredItems) {
				if (restoredItems.markdown) {
					editor.markdownSource.val(restoredItems.markdown);
				}
				if (restoredItems.isFullscreen === 'y') {
					editor.toggleFeature('fullscreen');
				}
				c();
			});
		},

		// Convert Markdown to HTML using showdown.js
		convertMarkdown: function() {
			var markdown = this.markdownSource.val();
			app.updateMarkdownPreview(markdown);
			this.markdownPreview.trigger('updated.editor');
		},

		// Programmatically add Markdown text to the textarea
		// position = { start: Number, end: Number }
		addToMarkdownSource: function(markdown, position) {
			var markdownSourceValue = this.markdownSource.val();
			var newMarkdownSourceValue = null;
			if (typeof(position) === 'undefined') { // Add text at the end
				newMarkdownSourceValue =
					(markdownSourceValue.length? markdownSourceValue + '\n\n' : '') +
					markdown;
			} else { // Add text at a given position
				newMarkdownSourceValue =
					markdownSourceValue.substring(0, position.start) +
					markdown +
					markdownSourceValue.substring(position.end);
			}
			this.markdownSource
				.val(newMarkdownSourceValue)
				.trigger('change.editor');
		},

		// Toggle editor feature
		toggleFeature: function(which, featureData) {
			var featureTrigger = this.featuresTriggers.filter('[data-feature='+ which +']');
			switch (which) {
				case 'auto-scroll':
					this.toggleAutoScroll();
					break;
				case 'fullscreen':
					this.toggleFullscreen(featureData);
					break;
			}
			featureTrigger.toggleClass('active');
		},


		toggleFullscreen: function(featureData) {
			var toFocus = featureData && featureData.tofocus;
			this.isFullscreen = !this.isFullscreen;
			$(document.body).toggleClass('fullscreen');
			if (toFocus) {
				this.switchToPanel(toFocus);
			}
			// Exit fullscreen
			if (!this.isFullscreen) {
				this.columns.show(); // Make sure all columns are visible when exiting fullscreen
				var activeMarkdownTargetsTriggersSwichtoValue = this.markdownTargetsTriggers.filter('.active').first().data('switchto');
				// Force one of the right panel's elements to be active if not already when exiting fullscreen
				if (activeMarkdownTargetsTriggersSwichtoValue === 'markdown') {
					this.switchToPanel('preview');
				}
				// Auto-scroll when exiting fullscreen and 'preview' is already active since it changes width
				if (this.isAutoScrolling && activeMarkdownTargetsTriggersSwichtoValue === 'preview') {
					this.markdownPreview.trigger('updated.editor');
				}
				$(document).off('keyup.fullscreen');
			// Enter fullscreen
			} else {
				this.closeTopPanels();
				$(document).on('keyup.fullscreen', function(e) { // Exit fullscreen when the escape key is pressed
					if (e.keyCode === 27) {
						editor.featuresTriggers.filter('[data-feature=fullscreen]').last().trigger('click');
					}
				});
			}
			this.save('isFullscreen', this.isFullscreen? 'y' : 'n');
		},

		// Insert a tab character when the tab key is pressed (instead of focusing the next form element)
		// Doesn't work in IE<9
		handleTabKeyPress: function(e) {
			var markdownSourceElement = this.markdownSource[0],
				tabInsertPosition = {
					start: markdownSourceElement.selectionStart,
					end: markdownSourceElement.selectionEnd
				};
			if (typeof(tabInsertPosition.start) === 'number' && typeof(tabInsertPosition.end) === 'number') {
				e.preventDefault();
				this.addToMarkdownSource('\t', tabInsertPosition);
				var cursorPosition = tabInsertPosition.start + 1;
				markdownSourceElement.setSelectionRange(cursorPosition, cursorPosition);
			}
		},

	};
	
});