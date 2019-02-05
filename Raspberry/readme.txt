###Connect RD wifi###
-sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
-Edit file as such:
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=CH
ap_scan=1

network={
    scan_ssid=1
    ssid="RD"
    psk="wifi4RND"
}

-sudo reboot
######

###Install VirutalUSB###
-Download https://urldefense.proofpoint.com/v2/url?u=http-3A__virtualhere.com_sites_default_files_usbserver_vhusbdarmpi3&d=DwIBaQ&c=uSEuY5DFUpK1tHJgduTViA&r=zrRO3e5H_zWHxPaqxVR6AiITzPd4iGSsg72uR38ALac&m=u7euefJ9PNf6kUQK830HQkL46dxb4Y6miNIhNlEBYwA&s=vv_rIMFvIPjNw-mV_uO8OqlRWrO2mJXzdNMWy-B5ufY&e=
-sudo chmod +x ./vhusbdarmpi3
-sudo nano crontab -e
-add the following line: @reboot sudo /home/pi/Desktop/Raspberry/vhusbdarmpi3 -b
######

###Launch chromium at boot + refresh web page + fix ip###
-sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
-Add:
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --app=http:/IP_PC:8080 --start-fullscreen
-sudo apt-get install xdotool
-copy refresh.sh in /home/pi/Desktop
-sudo chmod +x refresh.sh
-enable ssh on the pi
-change password to "bubblot"
-sudo nano /etc/dhcpcd.conf
-add the following lines:
interface eth0

static ip_address=192.168.1.3/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1

interface wlan0

static ip_address=192.168.1.3/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1
######

###Disable sleep mode + fix boot issue###
-sudo nano /boot/config.txt
-Add this line: 
hdmi_blanking=1
-sudo nano ~/.config/lxsession/LXDE-pi/autostart
-Add this lines:
@xset s 0 0
@xset s noblank
@xset s noexpose
@xset dpms 0 0 0
-sudo reboot

-sudo nano /boot/cmdline.txt
-Add this line:
fsck.repair=yes
######

###Install LCD-Touchscreen drivers###
-sudo nano /boot/config.txt
-Append the following lines at the bottom:

#Uncomment to set LCD screen set up
hdmi_group=2
hdmi_mode=1
hdmi_mode=87
hdmi_cvt 800 480 60 6 0 0 0

-Navigate in the terminal to the folder where the LCD-Touchscreen drivers are located
-Install the drivers with the following commands:

tar xzvf joy-IT-lcd5-driver.tar.gz (if the LCD-show folder has not been decompressed yet)
cd LCD-show/
sudo bash ./LCD5-show

-reboot with the LCD-Touchscreen plugged 
######


