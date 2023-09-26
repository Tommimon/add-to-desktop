import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';
import GObject from 'gi://GObject';
import * as AppDisplay from 'resource:///org/gnome/shell/ui/appDisplay.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import Gettext from 'gettext';
const shell_gettext = Gettext.gettext;
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

var DEFAULT_AND_UEXEC = 0o00764;

// edit the icon popupMenu method to add the new item
export function editIconClass(oldPopupMenu) {
    AppDisplay.AppIcon.prototype._preAddToDesktopPopupMenu = oldPopupMenu;
    AppDisplay.AppIcon.prototype.popupMenu = function(side = St.Side.LEFT) {
        let firstCall = !this._menu;  // if _menu is not defined is the first call to this function
        let res =  this._preAddToDesktopPopupMenu(side);
        if (firstCall) {
            insertAddToDesktopButton(this._menu);
        }
        return res;
    };
}

function insertAddToDesktopButton(menu) {
    let nameArray = ['Pin to Dash', 'Unpin'];
    nameArray.forEach(name => {
        nameArray.push(shell_gettext(name));  // look for both english and translated
    });
    let itemsArray = menu._getMenuItems();
    let pos = -1;
    for (let i = itemsArray.length-1; i >= 0; i--) {
        let item = itemsArray[i];
        // check class because there are also separators or other things
        if (item instanceof PopupMenu.PopupMenuItem) {
            let label = item.label.get_text();
            if (nameArray.includes(label)) {
                pos = i;
            }
        }
    }

    let label = _('Add to Desktop');
    let item = new PopupMenu.PopupMenuItem(label);
    if (pos === -1) {
        menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        menu.addMenuItem(item); // add at the end
    }
    else {
        menu.addMenuItem(item, pos+1); // insert at specific position
    }

    item.connect('activate', () => {
        let appPath = menu._app.get_app_info().get_filename(); // get the .desktop file complete path
        let shortcutMaker = new ShortcutMaker();
        shortcutMaker.makeShortcut(appPath);
    });
}


var ShortcutMaker = class ShortcutMaker {
    constructor() {
        this._desktop = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DESKTOP);
        this._appPath = null;
        this._appFile = null;
        this._copyPath = null;
        this._shortcutFile = null;
    }

    // calculates the copy path from the desktop path
    getCopyPath() {
        let array = this._appPath.split('/');
        let name = array.pop();
        return this._desktop + '/' + name;
    }

    makeShortcut(appPath) {
        this._appPath = appPath;
        this._appFile = Gio.File.new_for_path(this._appPath);
        this._copyPath = this.getCopyPath();
        this._shortcutFile = Gio.File.new_for_path(this._copyPath);
        this._createCopy();
    }

    _createCopy() {
        this._appFile.copy_async(
            this._shortcutFile,
            Gio.FileCopyFlags.OVERWRITE | Gio.FileCopyFlags.TARGET_DEFAULT_PERMS,
            GLib.PRIORITY_DEFAULT,
            null,
            null,
            (source, result) => {
                try {
                    source.copy_finish(result);
                    this._setMetadata();
                } catch(e) {
                    log(`Failed to create shortcut file: ${e.message}`);
                }
            });
    }

    // mark as trusted to allow launching
    _setMetadata() {
        let proc = new Gio.Subprocess({argv: ['gio', 'set', this._copyPath, 'metadata::trusted', 'true']});
        proc.init(null);
        proc.wait_check_async(null,
            (source, result) => {
                try {
                    source.wait_check_finish(result);
                    this._setExecutableBit();
                } catch(e) {
                    log(`Failed to allow launching: ${e.message}`);
                }
            });
    }

    // set executable bit last because this call refresh in desktop icon extension
    _setExecutableBit() {
        let new_info = new Gio.FileInfo();
        new_info.set_attribute_uint32(Gio.FILE_ATTRIBUTE_UNIX_MODE, DEFAULT_AND_UEXEC);
        this._shortcutFile.set_attributes_async(new_info,
            Gio.FileQueryInfoFlags.NONE,
            GLib.PRIORITY_LOW,
            null,
            (source, result) => {
                try {
                    source.set_attributes_finish (result);
                    log('Shortcut created successfully');
                } catch(e) {
                    log(`Failed to set unix mode: ${e.message}`);
                }
            });
    }
}
