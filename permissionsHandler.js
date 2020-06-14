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
            self.handlePermissions(); // I'm setting the action to do after initInfo()
        });
        var self = this;
    }

    // starts the whole process
    start() {
        this.permissions.initInfo(); // get permission info and than start working on them
    }

    // requires authentication (if needed) and creates link
    handlePermissions() {
        MyLog("current = " + this.permissions.current);
        MyLog("owner = " + this.permissions.owner);
        MyLog("owner_can = " + this.permissions.ownerExec);
        MyLog("other_can = " + this.permissions.otherExec);

        if(this.permissions.otherExec) {
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
        // adding to all instead to other is preferred because it makes more sense
        let args = ["chmod", "u+x", this.appPath];
        AsyncExec.NormalExec(args, (out, err) => {
            this.createLink();
        });
    }

    sudoFixPermissions() {
        let args = ["chmod", "a+x", this.appPath];
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
