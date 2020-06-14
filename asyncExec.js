const Gio = imports.gi.Gio;

// executes command as root asking for authentication and pass the result to the function onFinish
var PrivilegedExec = function privilegedExec(cmd, onFinish) {
    return NormalExec("pkexec " + cmd, onFinish);
}

// executes command and pass the result to the function onFinish
var NormalExec = function normalExec(cmd, onFinish) {
    args = cmd.split(" ");

    try {
        let proc = Gio.Subprocess.new(
            args,
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
