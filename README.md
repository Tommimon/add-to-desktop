# Add to Desktop
An easy way to create desktop app shortcut in gnome

## Overview
This simple extension tries to make easier the gnome process to create a desktop
shortcut for apps.

The idea is simple: instead of searching for the .desktop files throw multiple
folders let's use the gnome application launcher that already groups all our apps.

This extension adds a new line to the app context menu in the application launcher,
the new entry (`Add to Desktop`) if clicked automatically creates a desktop shortcut
to the app.

When you have your shortcut on the desktop you still have to enable it with
right-click and `Allow Launching` as if you create the shortcut manually.

## Installation
- Download `name` from the releases section
- Extract
- Add the `add-to-desktop@tommimon` folder to gnome extensions folder*
- Restart the Gnome-Shell**
- Open the Extensions app
- Enable `Add to Desktop`
- Enjoy

## How does it work
What this extension actually do is creating soft symbolic links pointing to the
`.desktop` file used from the application launcher. This is as near as you
can gat ti the window concept of shortcut.

Many people copy the .desktop file to the desktop instead of creating a soft link.
I encourage using links because this fixes many issues with application updates:
if your application gets updated de behaviour of the `.desktop` file may change, I
experienced app icons changing path upgrading, this may make your shortcut no more
working properly, and you have to create a new shortcut. With soft links this should
not happen as long as the `.desktop` file used by the application launcher stay in the
same place which usually is the case.

This approach has a dow side: permission issue. since applications launchers files
should be readable from everyone you can copy them, but you need execution permission
in order to have a working link and sometimes for preinstalled applications those
aren't granted to everyone.

I prefer to work a bit harder once and then have a more reliable solution.

## Permissions Issue
If you succeed creating the link, but you cannot enable launching it may be to permissions
issue: the file your link points to is not executable. For now to fix this you have
to do it yourself from the terminal, but the shortcut may be still useful.

### Grant Permissions
- Open the terminal in your Desktop and run `ll`
- You will get the list of your Desktop files, look for something like:
    `org.gnome.Extensions.desktop -> /usr/share/applications/org.gnome.Extensions.desktop`
- run `sudo chmod 755 /usr/share/applications/org.gnome.Extensions.desktop` to enable execution for everyone
- try enabling launching now

**Tip: if you know what are you doing you can enable execution for every file in that folder:**

`chmod 775 /usr/share/applications/*`

**Be careful, not every file should be executed from common users**