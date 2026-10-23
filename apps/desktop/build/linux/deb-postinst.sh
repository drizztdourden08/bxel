#!/bin/sh
# @layer tooling-scripts @kind build
# Managed by brock sync: the .deb post-install hook, run as root by dpkg -i.
# Module udev rules come first, then the mime and desktop databases when the
# product opens links or files, then the app's own build/linux/after-install.sh.
set -e


if command -v update-mime-database >/dev/null 2>&1; then
  update-mime-database /usr/share/mime || true
fi

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database /usr/share/applications || true
fi


exit 0
