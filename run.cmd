@echo off
taskkill /IM nw.exe
taskkill /IM bubblot.exe
taskkill /IM VirtualHub.exe
start /MIN virtualhub\VirtualHub.exe 
start /B nw-release\nw.exe .
start /B bubblot.exe
timeout 5
wmic process where name="bubblot.exe" CALL setpriority "high priority"