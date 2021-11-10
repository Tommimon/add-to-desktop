const AppMenu = imports.ui.appMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const ShortcutMaker = Me.imports.shortcutMaker;

// Saves the standard Menu globally to be able to reset it on disable
var parentMenu = null;

function init () {

}

function enable () {
    parentMenu = AppMenu.AppMenu;
    ShortcutMaker.editMenuClass(parentMenu);
}

function disable () {
    // Reset the menu to the standard one (without new item)
    AppMenu.AppMenu = parentMenu;
}
