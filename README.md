# Luma4Creators — Minecraft launcher (0.2.0)

Windows desktop launcher built with Electron. Current real gameplay support: **Vanilla Minecraft release versions in offline mode** via `minecraft-launcher-core`. The launcher downloads the required game files on first launch, uses the selected RAM amount, and stores game files under the app's user-data folder. An account is an offline nickname only and does not authenticate ownership of Minecraft.

## Current features
- Launcher UI in Russian, three presets and custom HEX colors.
- Local offline nicknames.
- Launch Vanilla releases with selected memory.
- Open the launcher's game folder.
- Search Modrinth for mods, modpacks and plugins.
- Save launcher profiles and local server configuration cards.
- GitHub Actions workflow to build a Windows NSIS installer.

## Not implemented yet
Microsoft and Ely.by OAuth, Fabric/Forge/NeoForge/Quilt installation and launch, automatic mod/modpack installation, and actual server download/start/stop are not implemented in this version. The server section currently stores configuration profiles only. Modrinth is a third-party service; its search results are not bundled with the launcher.

## Build Windows installer
### GitHub Actions
1. Upload the entire folder contents to a GitHub repository, including `.github/workflows/build-windows.yml`.
2. Open **Actions** → **Build Luma4Creators for Windows** → **Run workflow**.
3. Download the `Luma4Creators-Windows-Installer` artifact from the completed run. The `.exe` installer is inside.

### Build on Windows
Install Node.js 22, open PowerShell in this folder, then run:

```powershell
npm install
npm run dist
```

The installer will be in `dist/`.

## Notes
- First game launch requires an internet connection to download Minecraft files and a compatible Java runtime. `minecraft-launcher-core` manages game version setup; if a runtime cannot be found for a particular version, install a compatible Java version and configure it in a future launcher release.
- Offline mode may not work on online-mode servers and is not a replacement for Microsoft authentication or a legitimate Minecraft account.
- Do not distribute Minecraft assets or credentials. Respect Mojang/Microsoft and Modrinth terms.
