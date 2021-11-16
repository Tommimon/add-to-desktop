const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const ShortcutMaker = Me.imports.shortcutMaker;
const AppDisplay = imports.ui.appDisplay;

// Saves the standard Menu globally to be able to reset it on disable
var parentIcon = null;

function init () {

}

function enable () {
    parentIcon = AppDisplay.AppIcon;
    ShortcutMaker.editIconClass(parentIcon);
}

function disable () {
    // Reset the menu to the standard one (without new item)
    AppDisplay.AppIcon = parentIcon;
}

