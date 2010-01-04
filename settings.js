<!--//
////////////////////////////////////////////////////////////////////////////////
//
//  Copyright © 2009 addgadget.com  All rights reserved.
//
//  http://addgadget.com/
//
////////////////////////////////////////////////////////////////////////////////
//-->
System.Gadget.onSettingsClosing = SettingsClosing;

function onLoad()
{
    initSettings();
}

function onUnload()
{
}

function SettingsClosing(event)
{
	if (event.closeAction == event.Action.commit) 
		saveSettings();
	event.cancel = false;
}

function initSettings()
{
    loadSettings();
}

function loadSettings()
{
    userName.value = System.Gadget.Settings.readString("userName");
    userPassword.value = System.Gadget.Settings.readString("userPassword");
}

function saveSettings()
{
    System.Gadget.Settings.writeString("userName", userName.value);
    System.Gadget.Settings.writeString("userPassword", userPassword.value);
}
