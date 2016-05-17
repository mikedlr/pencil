function FontEditor() {
    PropertyEditor.call(this);
}
__extend(PropertyEditor, FontEditor);

FontEditor._setupFontCombo = function (fontCombo, changeEvent, withNullValue) {
    fontCombo.renderer = function (font) {
        return font ? font.family : "Font";
    };
    fontCombo.comparer = function (a, b) {
        if (!a) return !b;
        if (!b) return false;
        return a.family == b.family;
    };

    fontCombo.decorator = function (node, font) {
        if (font) {
            node.style.fontFamily = "'" + font.family + "'";
            if (font._type) {
                node.style.color = "red";
            }
        }
    };

    FontEditor._loadFontItems(fontCombo, withNullValue);
    // var localFonts = Local.getInstalledFonts();
    // var items = localFonts;
    // if (withNullValue) items.unshift("");
    // fontCombo.setItems(items);
    fontCombo.addEventListener("p:ItemSelected", function(event) {
        // if (OnScreenTextEditor.isEditing) return;
        changeEvent();
    }, false);
};
FontEditor._loadFontItems = function (fontCombo, withNullValue) {
    var localFonts = Local.getInstalledFonts();
    var items = localFonts;
    if (withNullValue) items.unshift("");
    fontCombo.setItems(items);
};
FontEditor.prototype.setup = function () {
    //grab control references
    /*this.underlineButton = document.getElementById("edUnderlineButton");
    this.strikeButton = document.getElementById("edStrikeButton");*/

    // this.fontCombo.renderer = function (font) {
    //     return font;
    // };
    // this.fontCombo.decorator = function (node, font) {
    //     node.style.fontFamily = "'" + font + "'";
    // };
    //
    // var localFonts = Local.getInstalledFonts();
    // var items = localFonts;
    // this.fontCombo.setItems(items);
    //
    // var thiz = this;
    // this.fontCombo.addEventListener("p:ItemSelected", function(event) {
    //     if (!thiz.font || OnScreenTextEditor.isEditing) return;
    //     thiz.fireChangeEvent();
    // }, false);
    var thiz = this;
    FontEditor._setupFontCombo(this.fontCombo, function () {
        thiz.fireChangeEvent();
    });

    this.pixelFontSize.addEventListener("click", function(event) {
        if (!thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.fireChangeEvent();
    }, false);
    this.pixelFontSize.addEventListener("keyup", function(event) {
        if (event.keyCode == 13 || event.keyCode == 10) {
            if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
            thiz.fireChangeEvent();
        }
    }, false);

    this.boldButton.addEventListener("click", function(event) {
        if (!thiz.font || OnScreenTextEditor.isEditing) return;
        var checked = false;
        if (thiz.boldButton.hasAttribute("checked") && thiz.boldButton.getAttribute("checked") == "true") {
            thiz.boldButton.removeAttribute("checked");
        } else {
            thiz.boldButton.setAttribute("checked", "true");
            checked = true;
        }
        thiz.fireChangeEvent();
    }, false);

    this.italicButton.addEventListener("click", function(event) {
        if (!thiz.font || OnScreenTextEditor.isEditing) return;
        var checked = false;
        if (thiz.italicButton.hasAttribute("checked") && thiz.italicButton.getAttribute("checked") == "true") {
            thiz.italicButton.removeAttribute("checked");
        } else {
            thiz.italicButton.setAttribute("checked", "true");
            checked = true;
        }

        thiz.fireChangeEvent();
    }, false);


    /*
    this.underlineButton.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.decor = thiz.underlineButton.checked ? "underline" : "none";
        thiz.fireEvent();
    }, false);

    this.strikeButton.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.strike = thiz.strikeButton.checked ? "strikethrough" : "none";
        thiz.fireEvent();
    }, false);*/

};



FontEditor.prototype.setValue = function (font) {
    if (!font) return;
    this.font = font;
    if (Local.isFontExisting(this.font.family)) {
        this.fontCombo.selectItem(font);
    } else {
        var families = this.font.getFamilies();
        for (var i = 0; i < families.length; i ++) {
            var f = families[i];
            if (Local.isFontExisting(f)) {
                this.fontCombo.selectItem({family: f});
                break;
            }
        }
    }
    //
    if (this.font.size.match(/^([0-9]+)[^0-9]*$/)) {
        this.pixelFontSize.value = RegExp.$1;
    }

    if (this.font.weight == "bold") {
        this.boldButton.setAttribute("checked", "true");
    } else {
        this.boldButton.removeAttribute("checked");
    }

    if (this.font.style == "italic") {
        this.italicButton.setAttribute("checked", "true");
    } else {
        this.italicButton.removeAttribute("checked");
    }
};

FontEditor.prototype.getValue = function () {
    var font = new Font();
    font.family = this.fontCombo.getSelectedItem().family;
    font.size = this.pixelFontSize.value + "px";
    font.weight = (this.boldButton.getAttribute("checked") == "true") ? "bold" : "normal";
    font.style = (this.italicButton.getAttribute("checked") == "true") ? "italic" : "normal";

    return font;
};
