const AppDisplay = imports.ui.appDisplay;
const Shell = imports.gi.Shell;

// Save the standard Menu globally to be able to reset it
var ParentMenu;

function init () {
    ParentMenu = AppDisplay.AppIconMenu;
    log("ollare: ready");
}

function enable () {
    // AppIconMenu is the var which contains the class used to instantiate the context menu
    // Assigning my own custom menu that extends the standard menu so the custom will be used for instantiate
    AppDisplay.AppIconMenu = class customMenu extends ParentMenu
    {
        _rebuildMenu()
        {
            super._rebuildMenu();

            // Add the "Add to Desktop" entry to the menu
            this._appendSeparator();
            let item = this._appendMenuItem("Add to Desktop");
            item.connect('activate', () => {
                log("OLLARE: premuto");
            });

            log(this._source.app.get_app_info().get_filename());

            log("OLLARE: override finita");
        }
    }
    var AppIconMenu = AppDisplay.AppIconMenu;
    log("ollare: funziona");
    log(AppIconMenu);

    log("ollare: attivata");
}

function disable () {
    // Reset the menu to the standard one (not customized)
    AppDisplay.AppIconMenu = ParentMenu;
    log("ollare: disattivata");
}