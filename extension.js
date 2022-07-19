const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const ShortcutMaker = Me.imports.shortcutMaker;
const AppDisplay = imports.ui.appDisplay;
const GObject = imports.gi.GObject;

// Saves the standard Menu globally to be able to reset it on disable
var parentIcon = null;

function init () {

}

function enable () {
    if (GObject.type_from_name("Gjs_add-to-desktop_tommimon_github_com_shortcutMaker_CustomIcon") == null) {
        parentIcon = AppDisplay.AppIcon;
        ShortcutMaker.editIconClass(parentIcon);
    }
}

function disable () {
    // Reset the menu to the standard one (without new item)
    AppDisplay.AppIcon = parentIcon;
}

