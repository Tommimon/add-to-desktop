const AppDisplay = imports.ui.appDisplay;
const GLib = imports.gi.GLib;

const DESKTOP_DIRECTORY = GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_DESKTOP);

// Save the standard Menu globally to be able to reset it
var ParentMenu;

function myLog(text) {
    log("add-to-desktop: " + text);
}

function init () {
    ParentMenu = AppDisplay.AppIconMenu;
    myLog("init completed");
}

function insertCustomEntry(menu) {
    // Add the "Add to Desktop" entry to the menu
    menu._appendSeparator();
    let item = menu._appendMenuItem("Add to Desktop");
    item.connect('activate', () => {
        let appPath = menu._source.app.get_app_info().get_filename(); // get the .desktop file complete path
        myLog(appPath);
        // create a soft symbolic link on the desktop
        GLib.spawn_command_line_sync("ln -s " + appPath + " " + DESKTOP_DIRECTORY);
    });
}

function enable () {
    // AppIconMenu is the var which contains the class used to instantiate the context menu
    // Assigning my own custom menu that extends the standard menu so the custom will be used for instantiate
    AppDisplay.AppIconMenu = class customMenu extends ParentMenu {
        _rebuildMenu() {
            super._rebuildMenu();
            insertCustomEntry(this);
        }
    }

    myLog("DESKTOP_DIRECTORY = "  + DESKTOP_DIRECTORY);
    myLog("enable completed");
}

function disable () {
    // Reset the menu to the standard one (not customized)
    AppDisplay.AppIconMenu = ParentMenu;
    myLog("disable completed");
}