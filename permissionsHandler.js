const GLib = imports.gi.GLib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const MyLog = Me.imports.myLog.MyLog;
const AsyncExec = Me.imports.asyncExec;
const Extension = Me.imports.extension;
const CheckPermissions = Me.imports.checkPermissions;

var PermissionsHandler = class PermissionsHandler {
    constructor(appPath) {
        this.appPath = appPath;
        this.permissions = new CheckPermissions.CheckPermissions(this.appPath, () => {
            this.handlePermissions();
        });
    }

    // requires authentication (if needed) and creates link
    handlePermissions() {
        MyLog(this.permissions.current);
        MyLog(this.permissions.owner);
        MyLog(this.permissions.ownerExec);
        MyLog(this.permissions.everyoneExec);

        if(this.permissions.everyoneExec) {
            MyLog("No extra permissions needed");
            this.createLink();
        }
        else {
            if(this.permissions.current === this.permissions.owner) {
                if(this.permissions.ownerExec) {
                    MyLog("No extra permissions needed");
                    this.createLink();
                }
                else {
                    MyLog("Adding execute permission for this user");
                    this.fixPermissions();
                }
            }
            else {
                MyLog("Protected file, adding execute permission for every user");
                this.sudoFixPermissions();
            }
        }
    }

    fixPermissions() {
        let args = ["chmod", "744", this.appPath];
        AsyncExec.NormalExec(args, (out, err) => {
            this.createLink();
        });
    }

    sudoFixPermissions() {
        let args = ["chmod", "755", this.appPath];
        AsyncExec.PrivilegedExec(args, (out, err) => {
            this.chmodCompleted(out, err);
        });
    }

    chmodCompleted(out, err) {
        // if we have successfully changed the permissions we create the link
        if(err === undefined) {
            MyLog("Authenticated");
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
