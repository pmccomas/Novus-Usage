<!--//
////////////////////////////////////////////////////////////////////////////////
//
//  Copyright © 2009 addgadget.com  All rights reserved.
//
//  http://addgadget.com/
//
////////////////////////////////////////////////////////////////////////////////
//-->
System.Gadget.settingsUI = "settings.html";
System.Gadget.onSettingsClosed = onSettingsClosed;

var timeout;
var userName;
var userPassword;

var downloadUsed = 0;
var downloadLimit = 0;
var uploadUsed = 0;
var uploadLimit = 0;
 
function onLoad()
{
    loadSettings();
    onTimer();
    setInterval("onTimer()", 5 * 60 * 1000);
}

function onUnload()
{
}

function onSettingsClosed()
{
    loadSettings();
    getUsageHtml();
}

function onTimer()
{
    getUsageHtml();
}

function getUsageHtml()
{
	try
    {
        error.style.visibility = "hidden";
		loading.style.visibility = "visible";
    	
	    loading.innerText = "Connecting...";					
		rssObj = new ActiveXObject("Msxml2.XMLHTTP");
		rssObj.open("GET", "https://internet.mynovus.ca/usagemanagement.php", true, userName, userPassword);
		
		rssObj.onreadystatechange = function()
		{
			if (rssObj.readyState === 4)
			{
				if (rssObj.status === 200)
				{	
					loading.style.visibility = "hidden";			

                    var myHTML = rssObj.responseText;
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = myHTML.replace(/<script(.|\s)*?\/script>/g, '');
                    rssXML = tempDiv;                    
					parseHtml();
					refreshdisplay();
					
					if (chkConn)
					{
						clearInterval(chkConn);
					}
				}
				else
				{
					var chkConn;
					loading.style.visibility = "hidden";
					error.innerText = "Service not available";
					error.style.visibility = "visible";

					chkConn = setInterval(getUsageHtml, 30 * 60000);
				}
			}
			else
			{
				loading.innerText = "Connecting...";
			}
		}	
		rssObj.send(null);
    }
    catch(e)
    {
	    loading.style.visibility = "hidden";
	    error.innerText = "Service not available";
	    error.style.visibility = "visible";
    }
}

function parseSize( sizeStr )
{
    size = parseFloat( sizeStr );
    if( sizeStr.search("MB") != -1 )
    {
        size /= 1024;
    }
    
    return size;
}

function parseHtml()
{
	rssItems = rssXML.getElementsByTagName("div");
	var downloadUsedTxt = 0;
	var downloadLimitTxt = 0;
	var uploadUsedTxt = 0;
	var uploadLimitTxt = 0;
	
	for (i=0; i<rssItems.length; i++)
	{	
	    if( rssItems[i].id != "eaccts" )	    
	        continue;
	        
	    tableElements = rssItems[i].getElementsByTagName("td");
	    for( ti=0; ti<tableElements.length; ti++ )
	    {
	        element = tableElements[ti];
	        if( element.innerText == "Download Limit:" )
	        {
	            downloadLimitTxt = tableElements[ti + 1].innerText;
	            ti++;
	        }
	        else if( element.innerText == "Download Used:" )
	        {
	            downloadUsedTxt = tableElements[ti + 1].innerText;
	            ti++;
	        }
	        if( element.innerText == "Upload Limit:" )
	        {
	            uploadLimitTxt = tableElements[ti + 1].innerText;
	            ti++;
	        }
	        else if( element.innerText == "Upload Used:" )
	        {
	            uploadUsedTxt = tableElements[ti + 1].innerText;
	            ti++;
	        }
	    }
	}
	
    downloadLimit = parseSize( downloadLimitTxt );
    downloadUsed = parseSize( downloadUsedTxt );
    uploadLimit = parseSize( uploadLimitTxt );
    uploadUsed = parseSize( uploadUsedTxt );
}

function daysInMonth(iMonth, iYear)
{
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

function refreshdisplay()
{
	background.src = "black_back_4.png";
	    
    tmpTotal.innerText = "Bandwidth Usage"; 
//    usgTotal.innerText = totalUsage + "%";

	var uploadUsedPercent = parseInt(Math.round(uploadUsed / uploadLimit * 100))
    upPercent.innerText = uploadUsedPercent + "%";
    
	var downloadUsedPercent = parseInt(Math.round(downloadUsed / downloadLimit * 100))
    downPercent.innerText = downloadUsedPercent +"%";    

	var downloadRemaining = downloadLimit - downloadUsed;
    downUsed.innerText = downloadUsed.toFixed(1) + "GB";
    
    var uploadRemaining = uploadLimit - uploadUsed;
    upUsed.innerText = uploadUsed.toFixed(1) + "GB";
    
	var today = new Date();
	var now = today.getDate();
	var year = today.getYear();
	var month = today.getMonth();
	var daysTotal = daysInMonth(month, year); 
	var daysLeft = daysTotal - now;
	
	var downloadPerDay = daysLeft == 0 ? downloadRemaining : downloadRemaining / daysLeft;
	downPerDay.innerText = downloadPerDay.toFixed(2) + "GB";

	var uploadPerDay = daysLeft == 0 ? uploadRemaining : uploadRemaining / daysLeft;
	upPerDay.innerText = uploadPerDay.toFixed(2) + "GB";
	
	var idealDownloadUsed = downloadLimit / daysTotal * now;
	var downloadQuota = downloadUsed / idealDownloadUsed;
	downQuota.innerText = downloadQuota.toFixed(2);
	
	try
    {
        upBar.style.width = parseInt( 0.4 * uploadUsedPercent );
        downBar.style.width = parseInt( 0.4 * downloadUsedPercent );
        downQuotaBar.style.width = parseInt( 112 * 0.5 * downloadQuota );
	}
	catch (ex)
	{
	}
}    
    

function loadSettings()
{
	userName = System.Gadget.Settings.readString("userName");
	userPassword = System.Gadget.Settings.readString("userPassword");
	
	refreshdisplay(); 
}

function runTaskManager()
{
	System.Shell.execute("taskmgr.exe");
}