const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const MyLog = Me.imports.myLog.MyLog;
const AsyncExec = Me.imports.asyncExec;

var CheckPermissions = class CheckPermissions {
    constructor(appPath, onFinishInit) {
        this.appPath = appPath;
        this.onFinishInit = onFinishInit; // function to execute when all the permissions are found
        this.info = null;
        this.current = null;
        this.owner = null;
        this.ownerExec = false; // execute permission for file owner
        this.otherExec = false;
    }

    // saves the result of ls -l
    initInfo() {
        var self = this;
        // is inside MyLog to print errors
        let error = AsyncExec.NormalExec(["ls", "-l", this.appPath], (out, err) => {
            self.info = out;
            self.findOwner();
            self.findPermissions();
            self.getCurrent();
        });
        if(error != null) {
            MyLog(error);
        }
    }

    getCurrent() {
        var self = this;
        let error = AsyncExec.NormalExec(["whoami"], (out, err) => {
            self.current = out.replace("\n", "");
            self.onFinishInit();
        });
        if(error != null) {
            MyLog(error);
        }
    }

    findOwner() {
        this.owner = this.info.split(" ")[2];
    }

    findPermissions() {
        let permissions = this.info.split(" ")[0];
        this.ownerExec = permissions.charAt(3) === "x";
        this.otherExec = permissions.charAt(9) === "x";
    }
}