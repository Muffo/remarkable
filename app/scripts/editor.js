/*global $:false, editor:true, app:false, samples:false*/

// 'use strict';
  
$(document).ready(function() {

	editor = {
		
		// Editor variables
		fitHeightElements: $('.full-height'),
		columns: $('#left-column, #right-column'),
		markdownTxt: $('#markdown'),
		markdownPreview: $('#preview'),
		markdownTargets: $('#preview'),
		markdownTargetsTriggers: $('.buttons-container .switch'),
		topPanel: $('.navbar'),
		isFullscreen: false,
		
		// Initiate editor
		init: function() {
			this.initBindings();
			this.fitHeight();
			this.restoreState(function() {
				editor.processMarkdown();
				editor.onloadEffect(1);
				this.fitHeight();
			});
		},

		// Handle events on several DOM elements
		initBindings: function() {
			$(window).on('resize', function() {
				editor.fitHeight();
			});
			this.markdownTxt.on({
				keydown: function(e) {
					if (e.keyCode === 9) {
						editor.handleTabKeyPress(e);
					}
				},
				'keydown keyup change click focus': function() {
					editor.markdownTxt.trigger('change.editor');
				},
				'cut paste drop': function() {
					setTimeout(function() {
						editor.markdownTxt.trigger('change.editor');
					}, 0);
				},
				'change.editor': function() {
					editor.processMarkdown();
					editor.save('markdown', editor.markdownTxt.val());
				},
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
					editor.markdownTxt.val(restoredItems.markdown);
				}
				else {
					editor.markdownTxt.val(samples.remarkPresentation);
				}
				if (restoredItems.isFullscreen === 'y') {
					editor.toggleFeature('fullscreen');
				}
				c();
			});
		},

		setMarkdown: function(markdown) {
			this.markdownTxt.val(markdown);
			this.processMarkdown();
		},

		// Keep track of the markdown that is currently shown in the preview
		markdownSourcePreview: null,

		// Process the Markdown code and update the preview
		processMarkdown: function() {
			var markdown = this.markdownTxt.val();
			var caretPosition = editor.markdownTxt.caret();
			var markdownHasChanged = (markdown !== this.markdownSourcePreview);
			
			this.markdownSourcePreview = markdown;
			app.updateMarkdownPreview(markdown, caretPosition, markdownHasChanged);
			this.markdownPreview.trigger('updated.editor');
		},

		// Programmatically add Markdown text to the textarea
		// position = { start: Number, end: Number }
		addToMarkdownTxt: function(markdown, position) {
			var markdownTxtValue = this.markdownTxt.val();
			var newMarkdownTxtValue = null;
			if (typeof(position) === 'undefined') { // Add text at the end
				newMarkdownTxtValue =
					(markdownTxtValue.length? markdownTxtValue + '\n\n' : '') +
					markdown;
			} else { // Add text at a given position
				newMarkdownTxtValue =
					markdownTxtValue.substring(0, position.start) +
					markdown +
					markdownTxtValue.substring(position.end);
			}
			this.markdownTxt
				.val(newMarkdownTxtValue)
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
			var markdownTxtElement = this.markdownTxt[0],
				tabInsertPosition = {
					start: markdownTxtElement.selectionStart,
					end: markdownTxtElement.selectionEnd
				};
			if (typeof(tabInsertPosition.start) === 'number' && typeof(tabInsertPosition.end) === 'number') {
				e.preventDefault();
				this.addToMarkdownTxt('\t', tabInsertPosition);
				var cursorPosition = tabInsertPosition.start + 1;
				markdownTxtElement.setSelectionRange(cursorPosition, cursorPosition);
			}
		},

	};
	
});