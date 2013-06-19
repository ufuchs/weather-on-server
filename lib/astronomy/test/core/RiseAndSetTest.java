package de.z35.posas.test.core;

import de.z35.posas.core.AngleFormatter;
import de.z35.posas.core.RiseAndSet;
import de.z35.posas.core.SolarCoordinatesMeeus;
import de.z35.posas.core.BodyCoordinatesInt;
import de.z35.posas.core.TimeBase;
import de.z35.posas.siteinfo.SiteInfo;
import de.z35.posas.test.util.J4METestCase;
import de.z35.util.SamplingPointCalcer;
import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;

/**
 * 
 * @author Uli Fuchs
 *
 */
public class RiseAndSetTest extends J4METestCase{

	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public RiseAndSetTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}

	/**
	 * 
	 *
	 */
	public RiseAndSetTest() {
		super();
	}

	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		//  Julian Day Number
		ts.addTest(new RiseAndSetTest("testBerlin_2007JAN30", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetTest) tc).testBerlin_2007JAN30();
			}
		}));

		//  Julian Day Number
		ts.addTest(new RiseAndSetTest("testBerlin_2007MAR30", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetTest) tc).testBerlin_2007MAR30();
			}
		}));
		
		//  Julian Day Number
		ts.addTest(new RiseAndSetTest("testBerlin_2007MAY30", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetTest) tc).testBerlin_2007MAY30();
			}
		}));
		
		//  Julian Day Number
		ts.addTest(new RiseAndSetTest("testCapeTown_2007MAY30", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetTest) tc).testCapeTown_2007MAY30();
			}
		}));

		//  Julian Day Number
		ts.addTest(new RiseAndSetTest("testRioDeJaneiro_2007MAY30", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetTest) tc).testRioDeJaneiro_2007MAY30();
			}
		}));
		
		//  Julian Day Number
		ts.addTest(new RiseAndSetTest("testNewYorkCity_2007MAY30()", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetTest) tc).testNewYorkCity_2007MAY30();
			}
		}));
		
						
		
		return ts;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  test methodes
	////////////////////////////////////////////////////////////////////////////

	/**
	 * Benötigt
	 * - SiteInfo
	 * - TimeBase
	 * - BodyCoordinatesInt
	 * - SamplingPointCalcer
	 */
	protected void testBerlin_2007JAN30() {

		String actual;
		
		int version = 0;
		
		double[] decl = new double[3];
		double[] ra = new double[3];
		
		int YY = 2007; int MM = 1; int DD = 30; 
		//  int HH = 0; int mm = 0; int ss = 0;		

		SiteInfo si = new SiteInfo("Berlin", -13.41, 52.51, 1, 0);		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 10, 0, 0);		
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		

		if (version == 1) {
		
			SamplingPointCalcer spc = new SamplingPointCalcer(bc, tb.getJD2K0(), ra, decl);
			spc.determineSamplePoints();

		} else {
			
			double jd2k0 = tb.getJD2K0();
			
			bc.computeEphemerides(jd2k0 - 1);
			decl[0] = bc.getDecl();
			ra[0] = bc.getRa();
			
			bc.computeEphemerides(jd2k0 + 1);
			decl[2] = bc.getDecl();
			ra[2] = bc.getRa();
			
			bc.computeEphemerides(jd2k0);
			decl[1] = bc.getDecl();
			ra[1] = bc.getRa();
			
		}
		
		RiseAndSet rs = new RiseAndSet(tb, bc, ra, decl);
		rs.setInterestedAltitude(-0.8333);
		rs.setDeltaT(68.0);

		rs.updateSiteInfoObserver(si);
		
		String expectedRise = "07h 51m 54s";
		actual = AngleFormatter.angle2Time(rs.getRise() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Berlin - sunrise :", expectedRise, actual);
		
		String expectedSet = "16h 47m 56s";
		actual = AngleFormatter.angle2Time(rs.getSet() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Berlin - sunset :", expectedSet, actual);
		
	}

	/**
	 * 
	 */
	protected void testBerlin_2007MAR30() {

		String actual;
		
		double[] decl = new double[3];
		double[] ra = new double[3];
		
		int YY = 2007; int MM = 3; int DD = 21; 
		//  int HH = 0; int mm = 0; int ss = 0;		

		SiteInfo si = new SiteInfo("Berlin", -13.41, 52.51, 1, 0);		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 10, 0, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		

		double jd2k0 = tb.getJD2K0();
		
		bc.computeEphemerides(jd2k0 - 1);
		decl[0] = bc.getDecl();
		ra[0] = bc.getRa();
		
		bc.computeEphemerides(jd2k0 + 1);
		decl[2] = bc.getDecl();
		ra[2] = bc.getRa();
		
		bc.computeEphemerides(jd2k0);
		decl[1] = bc.getDecl();
		ra[1] = bc.getRa();
		
		RiseAndSet rs = new RiseAndSet(tb, bc, ra, decl);
		rs.setInterestedAltitude(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.updateSiteInfoObserver(si);
		
		String expectedRise = "05h 46m 38s";
		actual = AngleFormatter.angle2Time(rs.getRise() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Berlin - sunrise :", expectedRise, actual);
		
		String expectedSet = "18h 36m 21s";
		actual = AngleFormatter.angle2Time(rs.getSet() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Berlin - sunset :", expectedSet, actual);
		
		
	}
	
	/**
	 * 
	 */
	protected void testBerlin_2007MAY30() {

		String actual;
		
		double[] decl = new double[3];
		double[] ra = new double[3];
		
		int YY = 2007; int MM = 5; int DD = 30; 
		//  int HH = 0; int mm = 0; int ss = 0;		

		SiteInfo si = new SiteInfo("Berlin", -13.41, 52.51, 1, 0);		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 10, 0, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		

		double jd2k0 = tb.getJD2K0();
		
		bc.computeEphemerides(jd2k0 - 1);
		decl[0] = bc.getDecl();
		ra[0] = bc.getRa();
		
		bc.computeEphemerides(jd2k0 + 1);
		decl[2] = bc.getDecl();
		ra[2] = bc.getRa();
		
		bc.computeEphemerides(jd2k0);
		decl[1] = bc.getDecl();
		ra[1] = bc.getRa();
		
		RiseAndSet rs = new RiseAndSet(tb, bc, ra, decl);
		rs.setInterestedAltitude(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.updateSiteInfoObserver(si);
		
		String expectedRise = "03h 51m 49s";
		actual = AngleFormatter.angle2Time(rs.getRise() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Berlin - sunrise :", expectedRise, actual);
		
		String expectedSet = "20h 16m 35s";
		actual = AngleFormatter.angle2Time(rs.getSet() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Berlin - sunset :", expectedSet, actual);
		
		
	}

	/**
	 * 
	 */
	protected void testCapeTown_2007MAY30() {

		String actual;
		
		double[] decl = new double[3];
		double[] ra = new double[3];
		
		int YY = 2007; int MM = 5; int DD = 30; 
		//  int HH = 0; int mm = 0; int ss = 0;		

		SiteInfo si = new SiteInfo("Cape Town", -18.48, -33.92, 2, 0);		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 10, 0, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		

		double jd2k0 = tb.getJD2K0();
		
		bc.computeEphemerides(jd2k0 - 1);
		decl[0] = bc.getDecl();
		ra[0] = bc.getRa();
		
		bc.computeEphemerides(jd2k0 + 1);
		decl[2] = bc.getDecl();
		ra[2] = bc.getRa();
		
		bc.computeEphemerides(jd2k0);
		decl[1] = bc.getDecl();
		ra[1] = bc.getRa();
		
		RiseAndSet rs = new RiseAndSet(tb, bc, ra, decl);
		rs.setInterestedAltitude(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.updateSiteInfoObserver(si);
		
		String expectedRise = "07h 41m 11s";
		actual = AngleFormatter.angle2Time(rs.getRise() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Cape Town - sunrise :", expectedRise, actual);
		
		String expectedSet = "17h 45m 42s";
		actual = AngleFormatter.angle2Time(rs.getSet() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Cape Town - sunset :", expectedSet, actual);
		
	}
	
	/**
	 * 
	 */
	protected void testRioDeJaneiro_2007MAY30() {

		String actual;
		
		double[] decl = new double[3];
		double[] ra = new double[3];
		
		int YY = 2007; int MM = 5; int DD = 30; 
		//  int HH = 0; int mm = 0; int ss = 0;		

		SiteInfo si = new SiteInfo("Rio De Janeiro", 43.2, -22.9, -3, 0);		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 10, 0, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		

		double jd2k0 = tb.getJD2K0();
		
		bc.computeEphemerides(jd2k0 - 1);
		decl[0] = bc.getDecl();
		ra[0] = bc.getRa();
		
		bc.computeEphemerides(jd2k0 + 1);
		decl[2] = bc.getDecl();
		ra[2] = bc.getRa();
		
		bc.computeEphemerides(jd2k0);
		decl[1] = bc.getDecl();
		ra[1] = bc.getRa();
		
		RiseAndSet rs = new RiseAndSet(tb, bc, ra, decl);
		rs.setInterestedAltitude(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.updateSiteInfoObserver(si);
		
		String expectedRise = "06h 25m 06s";
		actual = AngleFormatter.angle2Time(rs.getRise() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Rio De Janeiro - sunrise :", expectedRise, actual);
		
		String expectedSet = "17h 15m 21s";
		actual = AngleFormatter.angle2Time(rs.getSet() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("Rio De Janeiro - sunset :", expectedSet, actual);
		
	}

	/**
	 * 
	 */
	protected void testNewYorkCity_2007MAY30() {

		String actual;
		
		double[] decl = new double[3];
		double[] ra = new double[3];
		
		int YY = 2007; int MM = 5; int DD = 30; 
		//  int HH = 0; int mm = 0; int ss = 0;		

		SiteInfo si = new SiteInfo("New York City", 74.0, 40.72, -5, 0);		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 10, 0, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		

		double jd2k0 = tb.getJD2K0();
		
		bc.computeEphemerides(jd2k0 - 1);
		decl[0] = bc.getDecl();
		ra[0] = bc.getRa();
		
		bc.computeEphemerides(jd2k0 + 1);
		decl[2] = bc.getDecl();
		ra[2] = bc.getRa();
		
		bc.computeEphemerides(jd2k0);
		decl[1] = bc.getDecl();
		ra[1] = bc.getRa();
		
		RiseAndSet rs = new RiseAndSet(tb, bc, ra, decl);
		rs.setInterestedAltitude(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.updateSiteInfoObserver(si);
		
		String expectedRise = "04h 28m 06s";
		actual = AngleFormatter.angle2Time(rs.getRise() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("New York City - sunrise :", expectedRise, actual);
		
		String expectedSet = "19h 18m 31s";
		actual = AngleFormatter.angle2Time(rs.getSet() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("New York City - sunset :", expectedSet, actual);
		
	}
	
	
}
