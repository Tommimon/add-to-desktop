import * as ShortcutMaker from './shortcutMaker.js';
import * as AppDisplay from 'resource:///org/gnome/shell/ui/appDisplay.js';
import GObject from 'gi://GObject';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

// Saves the standard Menu globally to be able to reset it on disable
var oldPopupMenu = null;

export default class AddToDesktop extends Extension {
    init () {
    }

    enable () {
        if (GObject.type_from_name("Gjs_add-to-desktop_tommimon_github_com_shortcutMaker_CustomIcon") == null) {
            oldPopupMenu = AppDisplay.AppIcon.prototype.popupMenu;
            ShortcutMaker.editIconClass(oldPopupMenu);
        }
    }

    disable () {
        // Reset the menu to the standard one (without new item)
        AppDisplay.AppIcon.prototype.popupMenu = oldPopupMenu;
    }
}
