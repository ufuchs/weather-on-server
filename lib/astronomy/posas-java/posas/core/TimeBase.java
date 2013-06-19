package de.z35.posas.core;

import de.z35.util.MathEx;
import java.util.Calendar;
import java.util.Vector;

/*Sun, Moon & Earth - 5.73     © 1998-2007 Juergen Giesen
User: replace
  Location:  Berlin
  Latitude:  52.51° N = 52° 30.6' N
  Longitude: 13.41° E = 13° 24.6' E
  Date/Time: Fri Dec 14 14:54:30 CET 2007
  UT:        Fri Dec 14 13:54:30 UT 2007
  Time Zone: UT + 1:00 h
  Jul. Day:  2454449.079513889
  Equation of Time        = 5:28 min  = prev. day  -28.4 s
  Local Sidereal Time     = 304.8939° = 304° 53.6' = 20h 19m 34.5s
  Greenwich Sidereal Time = 291.4839° = 291° 29.0' = 19h 25m 56.1s
  SUN:
    Right Asc. RA = 261.494° = 17h 25m 58.6s
    Ecl. Long. L  = 262.1869° = 262° 11.2' (Sagittarius 22° 11.2')
    Distance from Earth = 0.984357 AU,  Diameter = 32.5'
    Declin.= 23.2101° S = 23° 12.6' S
    GHA    = 29.98° = 29° 58.8'
    LHA    = 43.39° = 43° 23.4'
    Altit. = 5.44° = 5° 26.4'
    Azim.  = 219.4°   (SW)
    Begin astr. twilight  06:02   02:07 h before rise
    Begin naut. twilight  06:44   01:26 h before rise
    Begin civil twilight  07:28   00:42 h before rise
    Sunrise               08:09   Azim. = 128.9°(SE), Moon Azim. null
                                  daz = 0.0°,  dalt null
    Transit               12:01   Altit.= 14.3°
    Sunset                15:52   Azim. = 231.1° (SW), Moon Azim. null
                                  daz = 0.0°,  dalt null
    End civil twilight    16:34   00:42 h after set
    End naut. twilight    17:18   01:26 h after set
    End astr. twilight    17:59   02:07 h after set
    Minimum altitude at   00:01   -60.6°
    Length of Day:   7 h 42.9 min = length of prev. day  - 0.9 min
  MOON:
    Prev. New Moon: Sat 2007 Dec  9 at 17:38 UT
    Moon Age 4.8447 d = 04 d 20 h 16 m 
    waxing crescent
    Next New Moon:  Mon 2008 Jan  8 at 11:36 UT
    Illum. Frac.  = 21.5 % (+)
    Bright limb angle   = -97° to zenith
    Distance from Earth = 387858 km,  Diameter = 30.98'
    Declin.= 16.6831° S = 16° 41' S
    Right Asc. RA = 322.2908° = 21h 29m 9.8s
    Ecl. Long. L  = 317.3838° = 317° 23.0' (Aquarius 17° 23.0')
    GHA    = 331.3° = 331° 18.0'
    LHA    = 344.71° = 344° 42.6'
    Altit. = 18.7°
    Azim.  = 164.5°  (SSE)
    Rise     11:27   Azim. = 119.7° (ESE)
    Transit  16:03   Altit.= 20.2°
    Set      20:41   Azim. = 243.8° (WSW)   Above horizon:   09:15 hours
    Geocentric Elong. = 55.2°

    Local         SUN          SUN         MOON         MOON
    Time        Altit.     Azimuth       Altit.      Azimuth
    0:00        -60.7        359.7        -39.1        289.3
    1:00        -58.6         26.8        -46.8        304.6
    2:00        -52.9         49.3        -52.9        323.4
    3:00        -45.2         66.8        -56.5        346.1
    4:00        -36.4         80.9        -56.5         10.7
    5:00        -27.3         93.1        -53.0         33.6
    6:00        -18.3        104.5        -46.9         52.5
    7:00         -9.8        115.6        -39.2         67.9
    8:00         -2.0        127.1        -30.6         80.9
    9:00          4.7        139.1        -21.7         92.6
   10:00          9.8        152.0        -12.8        103.6
   11:00         13.1        165.7         -4.3        114.6
   12:00         14.3        179.8          3.4        126.1
   13:00         13.2        193.9         10.2        138.4
   14:00         10.0        207.6         15.5        151.6
   15:00          4.8        220.5         18.9        165.8
   16:00         -1.8        232.6         20.2        180.6
   17:00         -9.5        244.0         19.1        195.4
   18:00        -18.1        255.2         15.9        209.8
   19:00        -27.1        266.5         10.8        223.2
   20:00        -36.2        278.7          4.3        235.7
   21:00        -45.0        292.7         -3.3        247.5
   22:00        -52.7        310.1        -11.6        258.9
   23:00        -58.5        332.4        -20.1        270.3
   24:00        -60.7        359.5        -28.7        282.5

*/


/**
 * @author  ufuchs
 */
public final class TimeBase {

    // Korrekturwert zum 1.1.2000 00:00UT, 2451545
    public static final double JD_CORR_TO_2000 = 2451545.0; 	
    
    //  Anzahl Stunden pro Tag, 24
    static final int HOURS_PER_DAY = 24; 
    
    //  Tage pro Jahrhundert, 36525
    public static final double DAYS_PER_CENTURY = 36525.0;     
	
    private double ut;
    private double jd;
    
    private double jd0;
    private double jd2k;
    private double jd2k0; 
    /**
	 * @uml.property  name="dateTime"
	 */
    private String dateTime;
    /**
	 * @uml.property  name="gmst0"
	 */
    private double gmst0;  // Siderial time at Greenwich at 0:00h
    /**
	 * @uml.property  name="gmst"
	 */
    private double gmst;   // at any given time
    
    private Vector timeBaseObservers = new Vector();
    
//    Calendar cal = Calendar.getInstance();
    
    ////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////

    /**
     * 
     */
    public TimeBase() {
    	super();
    }
    
    /**
	 * 
	 * @param yy
	 * @param mm
	 * @param dd
	 */
	public TimeBase(final int yy, final int mm, final double dd) {

		super();

		jd = julianDay(yy, mm, dd);

		update();

	}    
    
    // //////////////////////////////////////////////////////////////////////////
    // accessors
    ////////////////////////////////////////////////////////////////////////////

    /**
	 * @uml.property  name="gmst"
	 */
    public double getGmst() {
    	return gmst;
    }
    
    
    /**
	 * @uml.property  name="gmst0"
	 */
    public double getGmst0() {
    	return gmst0;
    }
    
    /**
	 * @return  the dateTime
	 * @uml.property  name="dateTime"
	 */
    public String getDateTime() {
    	return dateTime;
    }
    
    /**
     * Liefert Julian Date
     * @return Julian Date
     */
    public double getJD() {
    	return jd;
    }

    /**
     * Liefert Julian Date eines betreffenden Tages für 0:00 UT.
     * Ist bereits eine neues Julian Date angebrochen, so wurde dieses 
     * korrigiert. 
     * @return Auf 0:00UT normalisiertes Julian Date 
     */
    public double getJD0() {
    	return jd0;
    }

    /**
     * @return Auf Jahr 2000 normalisiertes JD
     */
    public double getJD2K() {
    	return jd2k;
    }

    /**
     * 
     * @return Auf Jahr 2000 0:00UT normalisiertes JD
     */
    public double getJD2K0() {
    	return jd2k0; 
    }
    
    /**
     * 
     * @return
     */
    public double getUT() {
    	return ut;
    }

    /**
     * 
     */
    public void update() {
    	
    	///////////////////////////////
    	// update 'jd0'
    	//////////////////////////////
    	
    	double k = 0.0; 
    	
    	if ((jd - (int)jd) < .5d)
    		// Nachkomma-Teil deutet auf eine Zeit nach 12Uhr Mittags hin,
    		// was die Julian Date Number um eins erhöht hat.
    		// Dies ist per Subtraktion zu korrigieren. 
    		k = 1.0;

    	jd0 = Math.floor(jd - k) + .5d;
    	
    	///////////////////////////////
    	// update 'jd2k0'
    	//////////////////////////////

    	jd2k0 = jd0 - JD_CORR_TO_2000;    	

    	///////////////////////////////
    	// update 'jd2k'
    	//////////////////////////////
    	
    	jd2k = jd - JD_CORR_TO_2000;

    	///////////////////////////////
    	// update 'gmst0'
    	//////////////////////////////
    	
    	gmst0 = computeGmst0();

    	///////////////////////////////
    	// update 'gmst'
    	//////////////////////////////
    	
    	gmst = computeGmst();
    	
    }
    
    ////////////////////////////////////////////////////////////////////////////
    // mutators
    ////////////////////////////////////////////////////////////////////////////
    
   /**
    * 
    * @param yy
    * @param mm
    * @param dd
    * @param hh
    * @param min
    * @param ss
    */
   public void setParams(final int yy, final int mm, final int dd, final int hh, 
		   final int min, final int ss) {

		this.ut = hhmmss2Dec(hh, min, ss);

		jd = julianDay(yy, mm, dd + this.ut);
		
		update();

	}

   /**
	 * 
	 * @param yy
	 *            Jahr
	 * @param mm
	 *            Monat
	 * @param dd
	 *            Tag in der Form '12.35'
	 */
   public void setParams(final int yy, final int mm, final double dd) {

	   this.ut = dd - (int)dd; 
	   
	   jd = julianDay(yy, mm, dd);
	   
	   update();
	   
   }

   /**
    * 
    * @param yy Jahr
    * @param mm Monat
    * @param dd Tag
    * @param ut Universal Time in der Notation '18.5' für 18:30
    */
   public void setParams(final int yy, final int mm, final int dd, 
		   final double ut) {

	   this.ut = ut / HOURS_PER_DAY;
	   
	   jd = julianDay(yy, mm, dd + this.ut);
	   
	   update();
	   
   }

   /**
    * MEEUS, (12.4)
    * @param jd
    * @return
    */
   private double computeGmstFormal(final double jd) {
	   
		final double T = jd2k0 / DAYS_PER_CENTURY;
		
		final double C1 = 280.46061837d;
		final double C2 = 360.98564736629d;
		final double C3 = 0.000387933d;
		final double C4 = 1 / 38710000.0d;
		
//		double result = C1 + C2 * (jd - 2451545.0) + T * T * (C3 - T * C4);
		double result = C1 + C2 * (jd - 2451545.0) + T * (0 + T * (C3 - T * C4));		
		
		return MathEx.normalizeAngle(result, 360.0d);
	   
   }

   /**
    * 
    * @return
    */
   public double computeGmst() {
	   return computeGmstFormal(jd);
   }
   
	/**
	 * Mitternacht
	 *
	 */
	public double computeGmst0() {
		return computeGmstFormal(jd0);
	}
   
	   
	/**
	 * Konvertiert Kalender-Datum nach Julian Date 
	 * @param yy - Jahr
	 * @param mm - Monat
	 * @param dd - Tag zuzüglich Anzahl Stunden in Decimal-Foramt e.g. dd.5 für 12Uhr Mittags  
	 * @return Anzahl Tage seit 4716 vor Christus
	 */
	public static double julianDay(final int yy, final int mm, final double dd) {

		int Y;
		int M;
		final double D = dd;

		if (mm > 2) {
			Y = yy;
			M = mm;
		} else {
			Y = yy -1;
			M = mm + 12;
		}

		// Konstante für Zeitspanne von 1900-03-01 bis 2100-02-28
		// nach MEEUS, Astronomical Algorithms, p62
		int B = -13;

		return ((int) (365.25d * (Y + 4716))) 
		+ 
		((int) (30.6001d * (M + 1)))
		+
		D
		+
		B
		-
		1524.5d;

	}

	/**
	 * Konvertiert hh:mm:ss nach 0,xxx..
	 * @param hh - Stunden
	 * @param mm - Minuten
	 * @param ss - Sekunden
	 * @return Nachkomma-Stellen für Julian Date
	 */
	public static double hhmmss2Dec(final int hh, final int mm, final int ss) {
	
		return hh/24.0d + mm/1440.0d + ss/86400.0d; 
		
	}
	
	/**
	 * 
	 */
	synchronized public void updateTimeBase(int aspects) {

//		System.out.println("TimeBase.updateTimeBase(int aspects)");		
		
		Calendar cal = Calendar.getInstance();
		
		dateTime = cal.getTime().toString();

		// setParams(2007,11,3,21,48,41);

		setParams(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal
				.get(Calendar.DAY_OF_MONTH), cal.get(Calendar.HOUR_OF_DAY), cal
				.get(Calendar.MINUTE), cal.get(Calendar.SECOND));

		updateObservers();
		
	}

	////////////////////////////////////////////////////////////////////////////
	//  Observer-Pattern
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	synchronized public void attach(final TimeBaseObserverInt client) {
		timeBaseObservers.addElement(client);
	}
	
	/**
	 * 
	 */
	synchronized public void detach(final TimeBaseObserverInt client) {
		timeBaseObservers.removeElement(client);
	}

	/**
	 * 
	 */
	private void updateObservers() {
		
		BodyCoordinatesInt sc = null;
		TimeBaseObserverInt trc;
		
		final int size = timeBaseObservers.size(); 
		
		for (int i = 0; i < size; i++ ) {
			
			if (i == 0) {
				
				sc = (BodyCoordinatesInt)timeBaseObservers.elementAt(i);
				((TimeBaseObserverInt)sc).updateTimeBaseObservers();
				
			} else {
			
				trc = (TimeBaseObserverInt)timeBaseObservers.elementAt(i);
				trc.updateTimeBaseObservers();
			}
			
		}
		
	}
	
}
