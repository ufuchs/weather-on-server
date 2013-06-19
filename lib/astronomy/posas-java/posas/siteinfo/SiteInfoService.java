/* ##############################################################################
# Title:       SiteInfoService.java
# Description: Handling f�r BKK- Zu- und- Abg�nge
# Keywords:
# Partner:     z35@gmx.de <z35>
# Compiler:    JAVA 5
# Copyright:   Copyright(c) 2007-2008 Uli Fuchs
#
# maintenance history
# ---------------------
#
# 2008-JAN-04	z35	Bugfixing, Meth. 'convertInput2TimeZone':
#					�bergabe negativer Timezone liefert positiven Wert.			
################################################################################
# design issues
# --------------
################################################################################
#
# [ �ngstlich zu sinnen und zu denken, wie man es h�tte tun k�nnen, ]
# [ ist das �belste, was man tun kann.                              ]
# [                                          -Georg C. Lichtenberg- ]
#
##############################################################################*/
package de.z35.posas.siteinfo;

import de.z35.posas.core.InputSplitter;
import de.z35.util.MathEx;

import java.util.*;

/**
 * Singleton
 * @author fuchs
 *
 */
public final class SiteInfoService {
	
	private Vector locations;
	private boolean runForTest = false;
	
    ////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 */
	public SiteInfoService() {
		super();
		locations = new Vector();
	}
	
    ////////////////////////////////////////////////////////////////////////////
    // accessors
    ////////////////////////////////////////////////////////////////////////////

	/**
	 * Einh�ngen des MockDao anstatt von RecordStore-XML-Dao
	 * @param runForTest  
	 */
	public void setRunForTest(boolean runForTest) {
		this.runForTest = runForTest;
	}
	
	/**
	 * Liefert Referenz aus Location aus <code>locations</code>
	 * @param index ist der Index der gew�nschten Referenz in der Liste 
	 * @return Referenz auf Instanz vom Type <code>Location</code>
	 */
	public SiteInfo getLocation(final int index) {
		
		return (SiteInfo) locations.elementAt(index);
		
	}

	/**
	 * Liefert Anzahl aller Eintr�ge in <code>locations</code>
	 * @return Anzahl aller Eintr�ge
	 */
	public int getLocationCount() {
		
		return locations.size();
		
	}

    ////////////////////////////////////////////////////////////////////////////
    // list methodes
    ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Hinzuf�gen einer neuen Location
	 * @param name Bezeichnung des Ortes
	 * @param lon Geographische L�nge des Ortes(Osten plus, Westen minus)  
	 * @param lat Geographische Breite des Ortes(Norden plus, S�den minus)
	 * @param tzOffs
	 * @param DayLightSaving
	 */
	public void addLocation(String name, String lon, String lat, int tzOffs, 
			int dayLightSaving) throws IllegalArgumentException {
		
        InputSplitter is = new InputSplitter();
        
        is.splitLine(lon);
        double longitude = is.getAngle();

        is.splitLine(lat);
        double latitude = is.getAngle();

        addLocation(new SiteInfo(name, longitude, latitude, tzOffs, dayLightSaving));
        
	}
	
	/**
	 * Hinzuf�gen einer neuen Location
	 * @param name Bezeichnung des Ortes
	 * @param lon Geographische L�nge des Ortes(Osten plus, Westen minus)  
	 * @param lat Geographische Breite des Ortes(Norden plus, S�den minus)
	 * @param tzOffs
	 * @param DayLightSaving
	 */
	public void addLocation(final String name, final double lon,
			final double lat, final int tzOffs, final int dayLightSaving)
			throws IllegalArgumentException {

		addLocation(new SiteInfo(name, lon, lat, tzOffs, dayLightSaving));

	}

	/**
	 * Hinzuf�gen eines neuen Eintrages
	 * 
	 * @param l
	 * @throws IllegalArgumentException
	 */
	public void addLocation(final SiteInfo l) throws IllegalArgumentException {

        if (searchLocation(l) != null) 
        	//  Eintrag bereits vorhanden
        	throw new IllegalArgumentException();        	

        l.setState(SiteInfo.INSERTED, true);        
        
        locations.addElement(l);
		
	}
	
	/**
	 * �nderung eines Eintrages
	 * @param l Referenz auf Location <code>l</code>, welche die �nderungen beinhaltet.
	 */
	public void changeLocation(SiteInfo l) throws IllegalArgumentException {

		SiteInfo found = searchLocation(l);
		
		if (found == null) {
			//  Location nicht vorhanden 
			throw new IllegalArgumentException();
		}

		found.setName(l.getName());
		found.setLon(l.getLon());
		found.setLat(l.getLat());		
		found.setTzOffs(l.getTzOffs());
		found.setDayLightSaving(l.getDayLightSaving());
		
        found.setState(SiteInfo.CHANGED, true);		
		
	}

	/**
	 * Verwerfen der Location <code>l</code>.
	 * Dabei wird Feld <code>state</code> auf <code>DROPPED</code> gesetzt.  
	 * @param l Zu verwerfende Location
	 */
	public void dropLocation(final SiteInfo l) 
			throws IllegalArgumentException {

		final SiteInfo found = searchLocation(l);        
        
		if (found == null) {
			//  Location nicht vorhanden 
			throw new IllegalArgumentException();
		}
        
		locations.removeElement(found);
        
	}

	/**
	 * Verwerfen der Location <code>l</code>.
	 * Dabei wird Feld <code>state</code> auf <code>DROPPED</code> gesetzt.  
	 * @param l Zu verwerfende Location
	 */
	public void dropLocation(final String name) 
			throws IllegalArgumentException {

		final SiteInfo found = searchLocation(name);        
        
		if (found == null) {
			//  Location nicht vorhanden 
			throw new IllegalArgumentException();
		}
        
		locations.removeElement(found);
        
	}
	
	
	////////////////////////////////////////////////////////////////////////////
	// dao wrapper methods
	////////////////////////////////////////////////////////////////////////////
	
    /**
     * Bef�llen von <code>location</code> aus dem persistenten Layer
     */
    public void retrieveAll() throws Exception {
    	
    	// Bleibt 'SiteInfoDaoXml()' nicht auf Grund von 'locations' am Leben?
    	if (runForTest) {
    		locations = new SiteInfoDaoMock().retrieveAll(this.locations);
    	} else {
    		locations = new SiteInfoDaoXml().retrieveAll(this.locations);
    		    		
    	}
    	
    }

    /**
     * Schreiben von <code>location</code> in den persistenten Layer
     */
    public void updateAll() throws Exception {
    	
    	if (locationsWasChanged()) {
    		
    		if (runForTest) {
    			new SiteInfoDaoMock().updateAll(locations);
    		} else {
    			new SiteInfoDaoXml().updateAll(locations);
    		}
    		
    	}
    	
    }

	/**
	 * Test, ob Inhalt von <code>locations</code> ver�ndert wurde
	 * @return
	 */
	public boolean locationsWasChanged() {
		
		boolean result = false;
		
		final int size = locations.size(); 
		
        for (int i = 0; i < size && !result ; i++) {
        	
        	SiteInfo si = (SiteInfo) locations.elementAt(i);

        	// Abbruch bei 'true' �ber Schleifenk�rper!        	
        	result = si.getState(SiteInfo.WAS_CHANGED);
        	
        }

        return result;
		
	}
    
    
	////////////////////////////////////////////////////////////////////////////
	// common methods
	////////////////////////////////////////////////////////////////////////////

	/**
	 * Durchsuchen von <code>location</code> nach Location <code>l</code>  
	 * @param l Aufzusp�render Eintrag
	 * @return Referenz auf gefundenen Eintrag, falls gefunden. Anderenfalls <code>null</code> 
	 */
	public SiteInfo searchLocation(final SiteInfo l) {
		
		SiteInfo result = null;
		
		final int size = locations.size(); 
		
        for (int i = 0; i < size; i++) {
        	
        	SiteInfo si = (SiteInfo) locations.elementAt(i);
        	
        	if (l.equals(si)) {
        		//  Eintrag aufgesp�rt...
        		result = si;
        		break;
        	}
        }

        return result;
	}
    
	/**
	 * Durchsuchen von <code>location</code> nach Location <code>l</code>  
	 * @param l Aufzusp�render Eintrag
	 * @return Referenz auf gefundenen Eintrag, falls gefunden. Anderenfalls <code>null</code> 
	 */
	public SiteInfo searchLocation(final String name) {
		
		SiteInfo result = null;
		
		final int size = locations.size();
		
        for (int i = 0; i < size; i++) {
        	
        	SiteInfo si = (SiteInfo) locations.elementAt(i);
        	
        	if (name.equals(si.getName())) {
        		//  Eintrag aufgesp�rt...
        		result = si;
        		break;
        	}
        	
        }

        return result;
	}
	
	/**
	 * 
	 * @param hemi
	 * @return
	 */
	public static int getSignOfHemi(char hemi) {

		int result = 1;
		
		if ((hemi == 'E') || (hemi == 'S') || (hemi == 'O')) {
			result = -1;
		}
		
		return result;
	}
	
	/**
	 * 
	 * @param input in der Form e.g. 'GMT - 8h'
	 * @return Zeizzone in der Form e.g. '-8'
	 */
	public static int convertInput2TimeZone(String input) {

		String values[] = InputSplitter.split(input);		

		//  2.Vorzeichen
		char sign = values[1].charAt(0);
		
		//  3.Offset e.g. '8h'
		int len = values[2].length(); 

		char[] tz = values[2].toCharArray();
		
		for (int i = 0; i < len; i++) {

			if (!Character.isDigit(tz[i])) {
				//  e.g. 'h' durch Leerzeichen ersetzen
				tz[i] = ' ';
			}
			
		}
		
		String s = new String(tz).trim();

		int result = Integer.parseInt(s);
		
		if (sign == '-') {
			result *= -1;
		}
		
		return result;
		
	}
	
	/**
	 * 
	 * @param input
	 * @param si
	 * @return
	 */
	public static double convertInput2Degree(String input)
			throws IllegalArgumentException {

		char hemi[] = new char[1];
		
		int sign;
		
		String values[] = InputSplitter.split(input);
		
		double value = 0.0;
		
		int fieldCnt = values.length;

		switch (fieldCnt) {
		
		// input: '13.47 O'
		case 2 :
			
			// '13.47'
			value = Double.parseDouble(values[0]);
			// 'O'
			values[1].getChars(0, 1, hemi, 0);
			
			sign = getSignOfHemi(hemi[0]);
			
			//  'S' und 'E' neg. Vorzeichen
			value *= (double) sign;
			break;
			
		// input: '13 28 O'			
		case 3 :
			
			// 'O'
			values[2].getChars(0, 1, hemi, 0);
			
			sign = getSignOfHemi(hemi[0]);
			
			value = MathEx.ddmmss2Decimal(Integer.parseInt(values[0]),
					Integer.parseInt(values[1]), 0, MathEx.DEG) * sign;
			
			break;
			
		//  input: something else e.g. 'adad 7878 ?'	
		default :
			throw new IllegalArgumentException();
		}
		
		return value;
		
	}

	
	
}
