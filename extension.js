const AppDisplay = imports.ui.appDisplay;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

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
        let handler = new PermissionsHandler(appPath);
        handler.handlePermissions();
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

class PermissionsHandler {
    constructor(appPath) {
        this.appPath = appPath;
    }

    // requires authentication (if needed) and creates link
    handlePermissions() {
        if(true) {
            this.fixPermissions();
        }
        else {
            this.createLink();
        }
    }

    fixPermissions() {
        let args = ["chmod", "755", this.appPath];
        privelegedExec(args, (out, err) => {
            myLog("arrivato");
            this.chmodCompleted(out, err);
        });
    }

    chmodCompleted(out, err) {
        myLog("arrivatissimo");
        // if we have successfully changed the permissions we create the link
        if(err === undefined) {
            this.createLink(this.appPath);
        }
        else {
            myLog("Authentication failed");
        }
    }

    createLink() {
        // create a soft symbolic link on the desktop
        GLib.spawn_command_line_async("ln -s " + this.appPath + " " + DESKTOP_DIRECTORY);
    }

}

// executes command as root asking for authentication and pass the result to the function onFinish
function privelegedExec(args, onFinish) {
    try {
        let proc = Gio.Subprocess.new(
            ['pkexec'].concat(args),
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        );

        proc.communicate_utf8_async(null, null, (proc, res) => {
            let out, err;

            try {
                let [, stdout, stderr] = proc.communicate_utf8_finish(res);

                // Failure
                if (!proc.get_successful())
                    throw new Error(stderr);

                // Success
                out = stdout;
            } catch (e) {
                err = e;
            }

            onFinish(out, err); // the async errors and outputs are passed to another function
        });
    } catch (e) {
        return e; // the immediate errors are returned to caller
    }
    return null;
}
