package de.z35.posas.test.main;

import de.z35.posas.core.*;
import de.z35.posas.siteinfo.SiteInfo;

public class RiseAndSetTestConsole {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		String s;
		
		double[] decl = new double[3];
		double[] ra = new double[3];
		
//		int YY = 2007; int MM = 12; int DD = 15; int HH = 0; int mm = 0; int ss = 0;
		int YY = 2007; int MM = 12; int DD = 23; int HH = 0; int mm = 0; int ss = 0;		
		
		StringBuffer sb = new StringBuffer();
		
		sb.append("Datum        : ");
		
		sb.append(YY).append("-").append(MM).append("-").append(DD);
		
		System.out.println(sb.toString());
		
		TimeBase tb = new TimeBase();
		
//		SiteInfo si = new SiteInfo("Boston", 71.0833, 42.3333, 1, 0);
//		SiteInfo si = new SiteInfo("Berlin", -13.41, 52.51, 1, 0);		
		SiteInfo si = new SiteInfo("Bad Elster", -12.23, 50.28, 1, 0);
		
//		SolarCoordinates sc = new SolarCoordinates(tb);
		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(tb);
		
		// Tag davor 
		tb.setParams(YY, MM, DD-1, 10, 0, 0);		
		sc.computeEphemerides(tb.getJD2K0());
		decl[0] = sc.getDecl();
		ra[0] = sc.getRa();
		/*
		s = AngleFormatter.angle2Decimal(sc.getRa(), 5);
		System.out.println("ra-1         : " + s);
		s = AngleFormatter.angle2Decimal(sc.getDecl(), 5);
		System.out.println("decl-1       : " + s);
		*/

		// Tag danach
		tb.setParams(YY, MM, DD+1, 10, 0, 0);		
		sc.computeEphemerides(tb.getJD2K0());
		decl[2] = sc.getDecl();
		ra[2] = sc.getRa();
		/*
		s = AngleFormatter.angle2Decimal(sc.getRa(), 5);
		System.out.println("ra-3         : " + s);
		s = AngleFormatter.angle2Decimal(sc.getDecl(), 5);
		System.out.println("decl-3       : " + s);
		*/
		
		// Jeweiliger Tag 
		tb.setParams(YY, MM, DD, 10, 0, 0);		
		sc.computeEphemerides(tb.getJD2K0());
		decl[1] = sc.getDecl();
		ra[1] = sc.getRa();
		
		/*
		s = AngleFormatter.angle2Decimal(sc.getRa(), 5);
		System.out.println("ra-2         : " + s);
		s = AngleFormatter.angle2Decimal(sc.getDecl(), 5);
		System.out.println("decl-2       : " + s);
		*/
		
		RiseAndSet rs = new RiseAndSet(tb, sc, ra, decl);
		
		rs.updateSiteInfoObserver(si);

		s = AngleFormatter.angle2Decimal(tb.computeGmst0(), 5);
		System.out.println("GMST0        : " + s);
		
		s = AngleFormatter.angle2Time(rs.getTimeOverHorizont(), AngleFormatter.TIME_ANALOG);
		
		System.out.println("TagesLänge   : " + s);
		
		s = AngleFormatter.angle2Time(rs.getRise() * 360.0, AngleFormatter.TIME_ANALOG);
		System.out.println("Aufgang      : " + s);

		s = AngleFormatter.angle2Time(rs.getTransit() * 360.0, AngleFormatter.TIME_ANALOG);
		System.out.println("Transit      : " + s);
		
		s = AngleFormatter.angle2Time(rs.getSet() * 360.0, AngleFormatter.TIME_ANALOG);
		System.out.println("Untergang    : " + s);
		
	}
	
}
