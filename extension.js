const AppDisplay = imports.ui.appDisplay;
const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const PermissionsHandler = Me.imports.permissionsHandler;
const MyLog = Me.imports.myLog.MyLog;

// var because accessed elsewhere
var DESKTOP_DIRECTORY = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DESKTOP);

// Save the standard Menu globally to be able to reset it
var ParentMenu;

function init () {
    ParentMenu = AppDisplay.AppIconMenu;
    MyLog("init completed");
}

function insertCustomEntry(menu) {
    // Add the "Add to Desktop" entry to the menu
    menu._appendSeparator();
    let item = menu._appendMenuItem("Add to Desktop");
    item.connect('activate', () => {
        let appPath = menu._source.app.get_app_info().get_filename(); // get the .desktop file complete path
        MyLog(appPath);
        let handler = new PermissionsHandler.PermissionsHandler(appPath);
        handler.start();
    });
}

function enable () {
    // AppIconMenu is the var which contains the class used to instantiate the context menu
    // Assigning my own custom menu that extends the standard menu so the custom will be used for instantiate
    AppDisplay.AppIconMenu = class customMenu extends ParentMenu {
        _redisplay() {
            super._redisplay();
            insertCustomEntry(this);
        }
    }

    MyLog("DESKTOP_DIRECTORY = "  + DESKTOP_DIRECTORY);
    MyLog("enable completed");
}

function disable () {
    // Reset the menu to the standard one (not customized)
    AppDisplay.AppIconMenu = ParentMenu;
    MyLog("disable completed");
}
