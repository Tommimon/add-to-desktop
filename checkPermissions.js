const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const MyLog = Me.imports.myLog.MyLog;
const AsyncExec = Me.imports.asyncExec;

var CheckPermissions = class CheckPermissions {
    constructor(appPath, onFinishInit) {
        this.appPath = appPath;
        this.onFinishInit = onFinishInit; // function to execute when all the permissions are found
        this.info = null;
        this.owner = null;
        this.ownerExec = false; // execute permission for file owner
        this.everyoneExec = false;
        this.getInfo(); // perform the commands to get the infos and fills the variables
    }

    // saves the result of ls -l
    getInfo() {
        MyLog("oh");
        MyLog(AsyncExec.NormalExec(["ls", "-l", this.appPath], (out, err) => {
            this.info = out;
            this.findOwner();
            this.findPermissions();
            this.onFinishInit();
        }));
    }

    findOwner() {
        this.owner = ths.info.split(" ")[2];
    }

    findPermissions() {
        let permissions = this.info.split(" ")[0];
        this.ownerExec = permissions.charAt(3) === "x";
        this.everyoneExec = permissions.charAt(9) === "x";
    }
}