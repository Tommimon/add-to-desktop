const AppDisplay = imports.ui.appDisplay;
const GLib = imports.gi.GLib;

const DESKTOP_DIRECTORY = "/home/user/Desktop";

// Save the standard Menu globally to be able to reset it
var ParentMenu;

function myLog(text) {
    log("add-to-desktop: " + text);
}

function init () {
    ParentMenu = AppDisplay.AppIconMenu;
    myLog("init completed");
}

function enable () {
    // AppIconMenu is the var which contains the class used to instantiate the context menu
    // Assigning my own custom menu that extends the standard menu so the custom will be used for instantiate
    AppDisplay.AppIconMenu = class customMenu extends ParentMenu {
        _rebuildMenu() {
            super._rebuildMenu();

            // Add the "Add to Desktop" entry to the menu
            this._appendSeparator();
            let item = this._appendMenuItem("Add to Desktop");
            item.connect('activate', () => {
                let appPath = this._source.app.get_app_info().get_filename(); // get the .desktop file complete path
                myLog(appPath);
                // create a soft symbolic link on the desktop
                GLib.spawn_command_line_sync("ln -s " + appPath + " " + DESKTOP_DIRECTORY);
            });
        }
    }

    myLog("enable completed");
}

function disable () {
    // Reset the menu to the standard one (not customized)
    AppDisplay.AppIconMenu = ParentMenu;
    myLog("disable completed");
}