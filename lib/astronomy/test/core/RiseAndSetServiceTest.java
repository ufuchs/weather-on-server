package de.z35.posas.test.core;

import de.z35.posas.siteinfo.SiteInfo;
import de.z35.posas.test.util.J4METestCase;
import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;

import de.z35.posas.core.AngleFormatter;
import de.z35.posas.core.RiseAndSet;
import de.z35.posas.core.RiseAndSetService;
import de.z35.posas.core.SolarCoordinatesMeeus;
import de.z35.posas.core.TimeBase;
import de.z35.posas.core.BodyCoordinatesInt;



/**
 * 
 * @author ufuchs
 *
 */
public class RiseAndSetServiceTest extends J4METestCase {

	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public RiseAndSetServiceTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}

	/**
	 * 
	 *
	 */
	public RiseAndSetServiceTest() {
		super();
	}

	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		//  testBerlin_2007JAN30()
		ts.addTest(new RiseAndSetServiceTest("testBerlin_2007JAN30()", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetServiceTest) tc).testBerlin_2007JAN30();
			}
		}));

		//  testBerlin_2007MAR30()
		ts.addTest(new RiseAndSetServiceTest("testBerlin_2007MAR30()", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetServiceTest) tc).testBerlin_2007MAR30();
			}
		}));
		
		
		//  testBerlin_2007MAY30()
		ts.addTest(new RiseAndSetServiceTest("testBerlin_2007MAY30()", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetServiceTest) tc).testBerlin_2007MAY30();
			}
		}));

		//  testCapeTown_2007MAY30()
		ts.addTest(new RiseAndSetServiceTest("testCapeTown_2007MAY30()", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetServiceTest) tc).testCapeTown_2007MAY30();
			}
		}));
				
		//  testRioDeJaneiro_2007MAY30()
		ts.addTest(new RiseAndSetServiceTest("testRioDeJaneiro_2007MAY30()", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetServiceTest) tc).testRioDeJaneiro_2007MAY30();
			}
		}));
		
		//  testNewYorkCity_2007MAY30()
		ts.addTest(new RiseAndSetServiceTest("testNewYorkCity_2007MAY30()", new TestMethod() {
			public void run(TestCase tc) {
				((RiseAndSetServiceTest) tc).testNewYorkCity_2007MAY30();
			}
		}));
		
		
		return ts;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  test methodes
	////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 */
	protected void testBerlin_2007JAN30() {

		String actual;
		
		int YY = 2007; int MM = 1; int DD = 30;		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 0, 0, 0);

		SiteInfo si = new SiteInfo("Berlin", -13.41, 52.51, 1, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		
		
		RiseAndSetService rs = new RiseAndSetService(tb, bc);		
		rs.setSiteInfo(si);
		rs.setRefrac(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.compute();
		
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
		
		int YY = 2007; int MM = 3; int DD = 30;		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 0, 0, 0);

		SiteInfo si = new SiteInfo("Berlin", -13.41, 52.51, 1, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		
		
		RiseAndSetService rs = new RiseAndSetService(tb, bc);		
		rs.setSiteInfo(si);
		rs.setRefrac(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.compute();
		
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
		
		int YY = 2007; int MM = 5; int DD = 30;		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 0, 0, 0);

		SiteInfo si = new SiteInfo("Berlin", -13.41, 52.51, 1, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		
		
		RiseAndSetService rs = new RiseAndSetService(tb, bc);		
		rs.setSiteInfo(si);
		rs.setRefrac(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.compute();
		
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
		
		int YY = 2007; int MM = 5; int DD = 30;		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 0, 0, 0);

		SiteInfo si = new SiteInfo("Cape Town", -18.48, -33.92, 2, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		
		
		RiseAndSetService rs = new RiseAndSetService(tb, bc);		
		rs.setSiteInfo(si);
		rs.setRefrac(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.compute();
		
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
		
		int YY = 2007; int MM = 5; int DD = 30;		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 0, 0, 0);

		SiteInfo si = new SiteInfo("Rio De Janeiro", 43.2, -22.9, -3, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		
		
		RiseAndSetService rs = new RiseAndSetService(tb, bc);		
		rs.setSiteInfo(si);
		rs.setRefrac(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.compute();
		
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
		
		int YY = 2007; int MM = 5; int DD = 30;		
		
		TimeBase tb = new TimeBase();
		tb.setParams(YY, MM, DD, 0, 0, 0);

		SiteInfo si = new SiteInfo("New York City", 74.0, 40.72, -5, 0);
		
		BodyCoordinatesInt bc = new SolarCoordinatesMeeus(tb);		
		
		RiseAndSetService rs = new RiseAndSetService(tb, bc);		
		rs.setSiteInfo(si);
		rs.setRefrac(-0.8333);
		rs.setDeltaT(68.0);
		
		rs.compute();
		
		String expectedRise = "04h 28m 06s";
		actual = AngleFormatter.angle2Time(rs.getRise() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("New York City - sunrise :", expectedRise, actual);
		
		String expectedSet = "19h 18m 31s";
		actual = AngleFormatter.angle2Time(rs.getSet() * 360.0, AngleFormatter.TIME_ANALOG);
		assertEquals("New York City - sunset :", expectedSet, actual);
		
	}
	
}
