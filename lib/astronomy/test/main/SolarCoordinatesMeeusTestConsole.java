package de.z35.posas.test.main;

import de.z35.posas.core.*;
import de.z35.posas.core.AngleFormatter;


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


public class SolarCoordinatesMeeusTestConsole {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		TimeBase tb = new TimeBase();

		tb.setParams(2007, 12, 14, 13, 54, 30);		
		
//		tb.setParams(2007, 10, 18, 13, 54, 30);
		
//		tb.setParams(1992, 10, 13, 0, 0, 0);		
		
//	  http://www.nrel.gov/midc/solpos/spa.html

		
		String s;
		
		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(tb);
		
		sc.computeEphemerides(tb.getJD2K0());

		s = AngleFormatter.angle2Decimal(tb.computeGmst0(), 5);
		System.out.println("GMST0           : " + s);

		/*
		s = AngleFormatter.angle2Decimal(tb.computeLmst0(), 5);
		System.out.println("LMST0           : " + s);
		*/
		s = AngleFormatter.angle2Decimal(sc.getMeanLon(), 5);
		System.out.println("Mean longitude  : " + s);

		s = AngleFormatter.angle2Decimal(sc.getMeanAnomaly(), 5);
		System.out.println("Mean anomaly    : " + s);
		
		s = AngleFormatter.angle2Decimal(sc.getEccentricity(), 9);
		System.out.println("Eccentricity    : " + s);
		
		s = AngleFormatter.angle2Decimal(sc.getEquationOfCenter(), 5);
		System.out.println("EquationOfCenter: " + s);
		
		s = AngleFormatter.angle2Decimal(sc.getTrueLon(), 5);
		System.out.println("True longitude  : " + s);		
		
		s = AngleFormatter.angle2Decimal(sc.getTrueAnomaly(), 5);
		System.out.println("True anomaly    : " + s);		
		
		s = AngleFormatter.angle2Decimal(sc.getRadiusVector(), 5);
		System.out.println("Radius vector   : " + s);		
		
		s = AngleFormatter.angle2Decimal(sc.getOmega(), 5);
		System.out.println("Moon Asc. Node  : " + s);
		
		s = AngleFormatter.angle2Decimal(sc.getAppLon(), 5);
		System.out.println("Apparent Lon    : " + s);		
		
		s = AngleFormatter.angle2Decimal(sc.getMeanObli(), 5);
		System.out.println("Mean obliquity  : " + s);		
		
		s = AngleFormatter.angle2Decimal(sc.getCorrObli(), 5);
		System.out.println("Corr. obliquity : " + s);		
		
		s = AngleFormatter.angle2Decimal(sc.getRa(), 5);
		System.out.println("Rigth asc.      : " + s);		
		
		s = AngleFormatter.angle2Decimal(sc.getDecl(), 5);
		System.out.println("Declination     : " + s);
		
		SolarCoordinates sc0 = new SolarCoordinates(tb);

		sc0.computeEphemerides(tb.getJD2K0());
		
		s = AngleFormatter.angle2Decimal(sc0.getRa(), 5);
		System.out.println("Rigth asc.      : " + s);		
		
		s = AngleFormatter.angle2Decimal(sc0.getDecl(), 5);
		System.out.println("Declination     : " + s);
		
	}

}
