# Add to Desktop
An easy way to create desktop app shortcut in gnome

## Overview
This simple extension tries to make easier the gnome process to create a desktop
shortcut for apps.

The idea is simple: instead of searching for the .desktop files throw multiple
folders let's use the gnome application launcher that already groups all our apps.

This extension adds a new line to the app context menu in the application launcher,
the new entry (`Add to Desktop`) if clicked automatically creates a desktop shortcut
to the app. This step may require your root password.

When you have your shortcut on the desktop you still have to enable it with
right-click and `Allow Launching` as if you create the shortcut manually.

## Dependences
This extension needs the `desktop-icons` extension installed and enabled to work properly.
https://extensions.gnome.org/extension/1465/desktop-icons/

## Installation
- Download `add-to-desktop@tommimon.tar.xz` from the releases section
- Extract
- Add the `add-to-desktop@tommimon` folder to gnome extensions folder*
- Restart the Gnome-Shell**
- Open (or restart) the Extensions app
- Enable `Add to Desktop`
- Enjoy

\* Default folder should be `~/.local/share/gnome-shell/extensions/` for manually installed extensions
if there isn't this directory create it.

\** Hit <kbd>Alt</kbd> + <kbd>F2</kbd> type `r` and hit <kbd>Enter</kbd>, if you prefer 
you can log out instead.

## How does it work
What this extension actually do is creating soft symbolic links pointing to the
`.desktop` file used from the application launcher. This is as near as you
can get to the windows concept of shortcut.

Many people copy the .desktop file to the desktop instead of creating a soft link.
I encourage using links because this fixes many issues with application updates:
if your application gets updated the behaviour of the `.desktop` file may change, I
experienced app icons changing path upgrading, this may make your shortcut no more
working properly, and you have to create a new one from zero. With soft links this shouldn't
happen as long as the `.desktop` file used by the application launcher stay in the
same place which usually is the case.

This approach has a dow side: permission issues but now this extensions takes care automatically
of those problems and changes the launcher file permissions adding the executable
permission if and only when needed. This operation may require root authentication
if the file is owned from another user.
