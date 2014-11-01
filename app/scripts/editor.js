/*global $:false, editor:true, app:false, samples:false, CodeMirror:false*/

// 'use strict';
  
$(document).ready(function() {

	editor = {
		
		// Editor variables
		fitHeightElements: $('.full-height'),
		columns: $('#left-column, #right-column'),
		markdownTxt: $('#markdown'),
		markdownPreview: $('#preview'),
		topPanel: $('.navbar'),
		isFullscreen: false,
		codemirror: null,
		
		// Initiate editor
		init: function() {
			this.codemirror = CodeMirror.fromTextArea(
				document.getElementById('markdown'), {
      			mode: 'markdown',
				lineNumbers: true,
				matchBrackets: true,
				lineWrapping: true,
				theme: '3024-day',
				extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    		});

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

			/* The events can be optimized */
			this.codemirror.on('change', function() {
				editor.processMarkdown();
				editor.save('markdown', editor.codemirror.getValue());
			});

			this.codemirror.on('cursorActivity', function() {
				editor.processMarkdown();
				editor.save('markdown', editor.codemirror.getValue());
			});
		},

		// Resize some elements to make the editor fit inside the window
		fitHeight: function() {
			var newHeight = $(window).height() - this.topPanel.outerHeight();
			this.fitHeightElements.each(function() {
				var t = $(this);
				t.css({ height: newHeight +'px' });
			});
			this.codemirror.setSize(null, newHeight);
		},

		// Save a key/value pair in the app storage (either Markdown text or enabled features)
		save: function(key, value) {
			app.save(key, value);
		},

		// Restore the editor's state
		restoreState: function(c) {
			app.restoreState(function(restoredItems) {
				if (restoredItems.markdown) {
					editor.codemirror.setValue(restoredItems.markdown);
				}
				else {
					editor.codemirror.setValue(samples.remarkPresentation);
				}
				if (restoredItems.isFullscreen === 'y') {
					editor.toggleFeature('fullscreen');
				}
				c();
			});
		},

		setMarkdown: function(markdown) {
			this.codemirror.setValue(markdown);
			this.processMarkdown();
		},

		// Keep track of the markdown that is currently shown in the preview
		markdownSourcePreview: null,

		// Process the Markdown code and update the preview
		processMarkdown: function() {
			var markdown = this.codemirror.getValue();
			var cursorPosition = this.codemirror.getCursor()
			var cursorIndex = this.codemirror.indexFromPos(cursorPosition);
			var markdownHasChanged = (markdown !== this.markdownSourcePreview);
			
			this.markdownSourcePreview = markdown;
			app.updateMarkdownPreview(markdown, cursorIndex, markdownHasChanged);
			this.markdownPreview.trigger('updated.editor');
		},

		// Programmatically add Markdown text to the textarea
		// position = { start: Number, end: Number }
		addToMarkdownTxt: function(markdown, position) {
			var markdownTxtValue = this.codemirror.getValue();
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
	};
});