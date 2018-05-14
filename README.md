Procédure d'installation
- npm -g install npm@next
- npm install -g gulp dans une console administrateur
- Installer Visual Studio 2015 Community avec le module C++ uniquement
- npm install dans le répertoire du projet
- Installer PICVIDEO.EXE
- Copier pvmjpgx40.dll dans C:\Program Files\Common Files\Pegasus Imaging
- Installer les drivers 3DConnexion
- Copier win_delay_load_hook.cc dans C:\Users\Eric\AppData\Roaming\npm\node_modules\npm\node_modules\node-gyp\src
 et dans C:\Users\Eric\AppData\Roaming\npm\node_modules\node-gyp\src

Serialport:
-npm uninstall
-Install latest node version
-npm -g install node-gyp@latest
-copy win_delay_load_hook.cc C:\Users\USERNAME\AppData\Roaming\npm\node_modules\node-gyp\src
-cd node_modules\serialport\
-node-gyp rebuild


CouchDB:
-Configure single-node (IP adress = 192.168.1.1 for bubblot1, 192.168.2.1 for bubblot2,...)
-Then 192.168.1.1 is accessible from bubblot 2
-Create bubblot dataBase on bubblot 1
-Create winder dataBase on bubblot 1 with user document
 