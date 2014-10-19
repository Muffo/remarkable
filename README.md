# Remarkable

Remarkable is a **Markdown slideshow editor** based on [Remark](http://remarkjs.com/).

![Remarkable screenshot](https://raw.githubusercontent.com/Muffo/remarkable/develop/assets/screenshot.png)

## Features

- [x] **Live preview**: edit the markdown and see a preview of your slideshow in real-time
- [x] **Auto scroll**: the preview always displays the slide that you are modifying
- [x] **Offline**: internet access is not required
- [ ] **Themes**: customize your slideshow with new themes
- [ ] **Local/Cloud Storage**: save and load your slideshow from disk or Google Drive
- [ ] **Export**: export the slideshow in a single html file that contains everything
- [ ] **Presenter mode**: one window shows the slideshow for the audience and the other the comments and the next slide for the presenter

Remarkable is still under development. Stay tuned!

## Getting started

Remarkable is not yet available on the Chrome webstore and must be installed manually,

The latest version can be found in the [Releases page](https://github.com/Muffo/remarkable/releases).

### Creating your slideshow

The slideshow is written using the regular [Markdown](http://daringfireball.net/projects/markdown/) with a single exception: a line containing three dashes represents a slide separator (not a horizontal rule `<hr />`) 

The following Markdown text represents a slideshow with two slides:

```
# Slide 1
This is slide 1
---
# Slide 2
This is slide 2 
```

The wiki of Remark contains two guides about [Formatting](https://github.com/gnab/remark/wiki/Formatting) your slideshow and using the [Markdown](https://github.com/gnab/remark/wiki/Markdown) syntax.


### Sample slideshow

Click on the Remarkable button (top left corner of the window) to show the start page and open a sample slideshow.

### Known issues

The application is still in alpha. Here is a list of known problems:

* The preview sometime doesn't update. Try to resize the window or to edit the markdown to fix it.
* Presenter view doesn't work
* The last slide is shown when you open a new slideshow instead of the first one
* I have tested it only under Mac OSX, so I can expect some error with Windows / Linux


### Developers

Fork and checkout the repository. You can follow [this guide](http://minimul.com/developing-a-chrome-extension-with-yeoman.html) to get up to speed!

Here is a todo list:

- [ ] Solve all the issues with jshint
- [ ] Find a way to include the images stored inside `bower_components` (e.g. Fontawesome icons) in the package generated with `grunt build`
- [ ] Draw a nicer icon
- [ ] Open a second window when *Presenter view* is selected
- [ ] Add local storage functionalities: open/save the markdown slideshow from/to disk
- [ ] The design of the Start Page is very basic and needs to be improved


## License

Remarkable is licensed under the [MIT License](https://github.com/Muffo/remarkable/blob/master/LICENSE)

Opensource procjects that made Remarkable possible:

* [Remark](http://remarkjs.com/)  - [Github repository](https://github.com/gnab/remark)
* [Minimalist Markdown Editor](https://chrome.google.com/webstore/detail/minimalist-markdown-edito/pghodfjepegmciihfhdipmimghiakcjf) - [Github repository](https://github.com/pioul/Minimalist-Markdown-Editor-for-Chrome)
* [Fontawesome](http://fontawesome.io/)
* [ChardinJS](http://heelhook.github.io/chardin.js/)

