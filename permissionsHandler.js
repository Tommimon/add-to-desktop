const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const MyLog = Me.imports.myLog.MyLog;
const PrivilegedExec = Me.imports.privilegedExec.PrivilegedExec;
const Extension = Me.imports.extension;

var PermissionsHandler = class PermissionsHandler {
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
        PrivilegedExec(args, (out, err) => {
            this.chmodCompleted(out, err);
        });
    }

    chmodCompleted(out, err) {
        // if we have successfully changed the permissions we create the link
        if(err === undefined) {
            this.createLink(this.appPath);
        }
        else {
            MyLog("Authentication failed");
        }
    }

    createLink() {
        // create a soft symbolic link on the desktop
        GLib.spawn_command_line_async("ln -s " + this.appPath + " " + Extension.DESKTOP_DIRECTORY);
    }

}
