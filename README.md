# [![add-to-desktop-title][]][add-to-desktop-repo]

An easy way to create desktop app shortcuts in GNOME

## Overview

This simple extension tries to make easier the GNOME process to create a desktop
shortcut for apps.

The idea is simple: instead of searching for the `.desktop` files through multiple
folders let's use the application launcher that already groups all our apps.

This extension adds a new line to the app context menu in the application launcher,
the new entry ('Add to Desktop') if clicked automatically creates a desktop shortcut
to the app.

## Dependencies

This extension needs the [Desktop Icons](https://extensions.gnome.org/extension/1465/desktop-icons/)
extension (or any alternative to see Desktop icons) installed and enabled to work properly,
otherwise you will not be able to see the shortcuts you are creating.

## Installation

### Using Extension Manager (Suggested)

- Install [Extension Manager](https://github.com/mjakeman/extension-manager)
- Open Extension Manager
- Open `Browse` tab
- Search for `Add to Desktop`
- Click `Install`
- Click `Install` again
- Enjoy

### Manual Installation

- Download zip from the releases section
- Extract in a folder named `add-to-desktop@tommimon.github.com`
- Add the `add-to-desktop@tommimon.github.com` folder to GNOME extensions folder*
- Restart the GNOME shell**
- Open (or restart) the Extensions app (or Tweaks app)
- Enable 'Add to Desktop'
- Restart the GNOME shell again**
- Enjoy

\* Default folder should be `~/.local/share/gnome-shell/extensions/` for manually installed extensions
if there isn't this directory, create it.

\** Hit <kbd>Alt</kbd> + <kbd>F2</kbd> type `r` and hit <kbd>Enter</kbd>, if you prefer
you can log out instead.

## How does it work

What this extension actually do is creating on your Desktop folder a copy of the original
`.desktop` file used from the application launcher.

This approach has a downside: if your application gets updated the behavior of the `.desktop` file may change, I
experienced app icons changing path updating, this may make your shortcut no more
working properly, and you have to create a new one from zero.

[add-to-desktop-title]: https://github.com/Tommimon/add-to-desktop/blob/master/assets/title.png
[add-to-desktop-repo]: https://github.com/Tommimon/add-to-desktop
