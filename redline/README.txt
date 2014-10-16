Michael Tran
COMP 20 Redline Lab

Hours Spent: ~5 

Correctly Implemented:
	  - renders a google map in the browser window
	  - finds the location of the user
	  - attempts to parse the json data
Not Correctly Implemented: 
    	  - does not render the markers
	  - I had a lot of Trouble accessing the elements of the javascript
	    object based on 
	    		http://www.mbta.com/uploadedfiles/Description.pdf

Is it possible to request the real-time data from the MBTA using
  XMLHttpRequest?
  -No, by the Same Origin policy, the origin does not match the MBTA,
   because of this the request does not work. Due to security pages are
   not able to run scrips oriniting from different hosts. The xmlhttprequest 
   status is 0 when being printed to the console. 
