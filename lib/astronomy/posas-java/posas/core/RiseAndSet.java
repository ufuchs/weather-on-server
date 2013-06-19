package de.z35.posas.core;

import de.z35.posas.core.BodyCoordinatesInt;
import de.z35.posas.core.TimeBase;
import de.z35.posas.siteinfo.SiteInfo;
import de.z35.posas.siteinfo.SiteInfoObserverInt;
import de.z35.util.MathEx;
import henson.midp.*;

/**
 * Benötigt 1.0 TimeBase ------------- - jd2k0  Referenz zur Epoche J2000.0 - tb.computeGmst0() 2.0 SiteInfo ------------- - getLon() - getLat(); 3.0 BodyCoordinatesInt ----------------------- - getDecl() - getRa()
 * @see http://www.stjarnhimlen.se/comp/riset.html
 * @author   Uli Fuchs
 */
public final class RiseAndSet implements TimeBaseObserverInt, SiteInfoObserverInt {

	public final static double HOUR_PER_DAY = 1.0d / 24.0d;
	
	public final static int ALL_DAY_BELOW_HORIZ = 1;
	public final static int RISE_AND_SET_ON_DAY = 0;
	public final static int ALL_DAY_ABOVE_HORIZ = -1;
	
	/**
	 * h = 0 degrees: Center of Sun's disk touches a mathematical horizon
	 * h = -0.25 degrees: Sun's upper limb touches a mathematical horizon
	 * h = -0.583 degrees: Center of Sun's disk touches the horizon; 
	 * 		atmospheric refraction accounted for
	 * h = -0.833 degrees: Sun's supper limb touches the horizon; 
	 * 		atmospheric refraction accounted for
	 * h = -6 degrees: Civil twilight 
	 * 		(one can no longer read outside without artificial illumination)
	 * h = -12 degrees: Nautical twilight 
	 * 		(navigation using a sea horizon no longer possible)
	 * h = -15 degrees: Amateur astronomical twilight 
	 * 		(the sky is dark enough for most astronomical observations)
	 * h = -18 degrees: Astronomical twilight 
	 * 		(the sky is completely dark)
	 * @uml.property  name="refrac"
	 */
	private double interestedAltitude;// = -0.8333;
	
	/**
	 * @uml.property  name="deltaT"
	 */
	private double deltaT;// = 68.0;
	private double tzOffs;
	
	private TimeBase tb;
	private BodyCoordinatesInt bc;
	private SiteInfo siteInfo;
	
	/**
	 * @uml.property  name="timeOverHorizont"
	 */
	private double timeOverHorizont;
	private double[] m;  
	private double[] ra;
	private double[] decl;
	private int state;
	
    ////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 *
	 */
	public RiseAndSet(final TimeBase tb, final BodyCoordinatesInt bc, final double[] ra, final double[] decl) {
		super();
		this.tb = tb;
		this.bc = bc;
		this.ra = ra;
		this.decl = decl;
		m = new double[3];
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  accessors
	////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 */
	public final int getState() {
		return state;
	}
	
	/**
	 * @return
	 * @uml.property  name="timeOverHorizont"
	 */
	public final double getTimeOverHorizont() {
		return timeOverHorizont;
	}
	
	/**
	 * 
	 * @return
	 */
	public final double getRise() {
		
		return m[1] + this.tzOffs;
	}
	
	/**
	 * 
	 * @return
	 */
	public final double getSet() {
		
		double m2 = m[2];
		
		if (m2 < m[1]) {
			// Für den Fall, dass UTC-Zeit des Untergangs in den neuen Tag reicht.
			// Beispiel NewYork, 30.MAY, ohne diese Korrektur:
			// Untergang UTC : 00h 18m 31s
			// Untergang UTC - 5 : 04h 41m 28s
			m2 += 1;
		}

		return m2 + (this.tzOffs);
	}
	
	/**
	 * 
	 * @return
	 */
	public final double getTransit() {

		return m[0] + (this.tzOffs);
	}
	
    ////////////////////////////////////////////////////////////////////////////
    // mutators
    ////////////////////////////////////////////////////////////////////////////

	/**
	 * @param deltaT  ist die Differenz zur Dynamic Time in Sekunden
	 * @uml.property  name="deltaT"
	 */
	public void setDeltaT(final double deltaT) {
		
		this.deltaT = deltaT;
		
	}
	
	/**
	 * @param refrac  ist die Refraktion bei Auf-und Untergang für das   gewünschte Object
	 * @uml.property  name="refrac"
	 */
	public void setInterestedAltitude(final double refrac) {
		
		this.interestedAltitude = refrac;
		
	}
	
	/**
	 * 
	 * @param bc
	 */
	public void setBodyCoordinatesInt(final BodyCoordinatesInt bc) {
		this.bc = bc;
	}
	
	/**
	 * @param  siteInfo
	 * @uml.property  name="siteInfo"
	 */
	public void setSiteInfo(final SiteInfo siteInfo) {
		this.siteInfo = siteInfo;
		computeTzOffs();
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  production
	////////////////////////////////////////////////////////////////////////////

	private void computeTzOffs() {
		
		if (siteInfo != null) {
			this.tzOffs = siteInfo.getTzOffs() * RiseAndSet.HOUR_PER_DAY;
		} else {
			this.tzOffs = .0;
		}
	}
	
	/**
	 * 
	 *
	 */
	public final void compute() {
		
		if (siteInfo != null) {
			
			final double lon = siteInfo.getLon();
			
			final double lat = siteInfo.getLat();
			
			final double gmst0 = tb.getGmst0();
			
			final double H0 = computeLocalHourAngle(interestedAltitude);
			
			timeOverHorizont = H0 * 2;
			
			computeMValues(H0);
			
			normalizeMValues();	
			
			interpol(lon, lat, interestedAltitude, gmst0, m, ra, decl, deltaT );			

			// 2008-JAN-12  z35  Bugfixing New York, Transit = 36:12
			normalizeMValues();			
			
		}
		
	}
	
	/**
	 * (15.1) 
	 * 
	 * 
	 *          sin (h) - sin (lat) * sin (decl)
	 * cos LHA = ---------------------------------------
	 *          cos (lat) * cos (decl)
	 *
	 */
	public double computeLocalHourAngle(double refrac) {
		// OK
		final double rLat = siteInfo.getLat() * MathEx.DEG2RAD;
		
		final double rDecl = bc.getDecl() * MathEx.DEG2RAD;
		
		final double rSinRefrac = Math.sin(refrac * MathEx.DEG2RAD);
		
		final double nom = rSinRefrac - Math.sin(rLat) * Math.sin(rDecl);
		
		final double denom = Math.cos(rLat) * Math.cos(rDecl);
		
		final double nom_div_den = nom / denom;

		if (nom_div_den < -1.0) {
			state = ALL_DAY_ABOVE_HORIZ;
//			System.out.println("ALL_DAY_ABOVE_HORIZ");
		} else if (nom_div_den > 1.0) {
			state = ALL_DAY_BELOW_HORIZ;
//			System.out.println("ALL_DAY_BELOW_HORIZ");
		} else {
			state = RISE_AND_SET_ON_DAY;
//			System.out.println("RISE_AND_SET_ON_DAY");
		}
		
		double result = Float11.acos(nom_div_den) * MathEx.RAD2DEG;
		
		return result;

	}
	
	/**
	 * 
	 *
	 */
	private final void computeMValues(final double H) {
		// OK
		final double m0 = (bc.getRa() + siteInfo.getLon() - tb.getGmst0()) / 360.0;

		final double div360 = H / 360.0;		
		
		//  Transit
		m[0] = m0;
		
		//  Rise
		m[1] = m0 - div360;
		
		//  Set
		m[2] = m0 + div360;
		
	}
	
	/**
	 * 
	 * @param m
	 */
	private final void normalizeMValues() {
		
		final int len = m.length;
		
		for (int i = 0; i < len; i++) {
		
			final double mx = m[i]; 
			
			if (mx < .0) {
				m[i] = mx + 1.0; 
			} else {
				if (mx > 1.0) {
					m[i] = mx - 1.0;
				}
			}
			
		}
		
	}
	

	/**
	 * MEUSS, (13.6)
	 * @param lat
	 * @param decl
	 * @param H
	 * @return
	 */
	private double calcAltitude(double lat, double decl, double H) {
		
		lat *= MathEx.DEG2RAD;
		decl *= MathEx.DEG2RAD;
		H *= MathEx.DEG2RAD;

		double sinh = Math.sin(lat) * Math.sin(decl) + Math.cos(lat)
				* Math.cos(decl) * Math.cos(H);

		return Float11.asin(sinh) * MathEx.RAD2DEG;
		
	}

	/**
	 * MEEUS, Chapter 15, p.103
	 * @param h
	 * @param h0
	 * @param lat
	 * @param decl
	 * @param H
	 * @return
	 */
	private double calc_deltaM(double h, double h0, double lat, double decl, double H) {
		
		lat *= MathEx.DEG2RAD;
		decl *= MathEx.DEG2RAD;
		H *= MathEx.DEG2RAD;

		double nom = h - h0;  //  values in degree
		double denom = 360.0 * Math.cos(lat) * Math.cos(decl) * Math.sin(H); 

		return nom / denom;
		
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  interpolation
	////////////////////////////////////////////////////////////////////////////
	
	public void interpol(double lon, double lat, double h_0, double gmst0, double[] m, double[] ra, double[] decl, double deltaT ) {
		
		final double m0 = m[0];
		final double m1 = m[1];
		final double m2 = m[2];
		
		//  MEEUS, chapter 12
		//  mean sidereal time at Greenwich for any instant
		final double gmstM0 = MathEx.normalizeAngle(gmst0 + 360.985647 * m0, 360.0);
		final double gmstM1 = MathEx.normalizeAngle(gmst0 + 360.985647 * m1, 360.0);
		final double gmstM2 = MathEx.normalizeAngle(gmst0 + 360.985647 * m2, 360.0);
		
		final double n0 = m0 + (deltaT / 864000);
		final double n1 = m1 + (deltaT / 864000);		
		final double n2 = m2 + (deltaT / 864000);		
			
		final double ra0 = MathEx.interpol(ra, n0);
		final double ra1 = MathEx.interpol(ra, n1);		
		final double ra2 = MathEx.interpol(ra, n2);		
		
		final double decl1 = MathEx.interpol(decl, n1);		
		final double decl2 = MathEx.interpol(decl, n2);		
		
		//  'local hour angle' mit interpolierten Werten neu berechnen 
		final double H0 = gmstM0 - lon - ra0;
		final double H1 = gmstM1 - lon - ra1;
		final double H2 = gmstM2 - lon - ra2;
		
		final double h1 = calcAltitude(lat, decl1, H1);
		final double h2 = calcAltitude(lat, decl2, H2);
			
		final double deltaM0 = - (H0 / 360.0);
		final double deltaM1 = calc_deltaM(h1, h_0, lat, decl1, H1);
		final double deltaM2 = calc_deltaM(h2, h_0, lat, decl2, H2);
			
		m[0] = m0 + deltaM0; 
		m[1] = m1 + deltaM1;
		m[2] = m2 + deltaM2;		
		
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  observer
	////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 */
	synchronized public void updateSiteInfoObserver(final SiteInfo siteInfo) {
		this.setSiteInfo(siteInfo);
		compute();
	}
	
	/**
	 * 
	 */
	synchronized public void updateTimeBaseObservers() {
		compute();
	}
	
}
