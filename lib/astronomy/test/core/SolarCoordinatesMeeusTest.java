package de.z35.posas.test.core;

import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;

import de.z35.posas.core.AngleFormatter;
import de.z35.posas.core.SolarCoordinatesMeeus;
import de.z35.posas.test.util.J4METestCase;
import de.z35.posas.test.util.MathExTest;

public class SolarCoordinatesMeeusTest extends J4METestCase{
	
	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public SolarCoordinatesMeeusTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}

	/**
	 * 
	 *
	 */
	public SolarCoordinatesMeeusTest() {
		super();
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		//  testMeanLon()
		ts.addTest(new SolarCoordinatesMeeusTest("testMeanLon()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testMeanLon();
			}
		}));

		//  testMeanLon()
		ts.addTest(new SolarCoordinatesMeeusTest("testMeanAnomaly()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testMeanAnomaly();
			}
		}));
		
		//  testEccentricity()
		ts.addTest(new SolarCoordinatesMeeusTest("testEccentricity()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testEccentricity();
			}
		}));

		//  testEquationOfCenter()
		ts.addTest(new SolarCoordinatesMeeusTest("testEquationOfCenter()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testEquationOfCenter();
			}
		}));
		
		//  testTrueLon()
		ts.addTest(new SolarCoordinatesMeeusTest("testTrueLon()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testTrueLon();
			}
		}));
		
		
		//  testTrueAnomaly()
		ts.addTest(new SolarCoordinatesMeeusTest("testTrueAnomaly()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testTrueAnomaly();
			}
		}));
		
		//  testRadiusVector()
		ts.addTest(new SolarCoordinatesMeeusTest("testRadiusVector()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testRadiusVector();
			}
		}));
		
		//  testOmega()
		ts.addTest(new SolarCoordinatesMeeusTest("testOmega()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testOmega();
			}
		}));

		//  testAppLon()
		ts.addTest(new SolarCoordinatesMeeusTest("testAppLon()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testAppLon();
			}
		}));
		
		//  testMeanObli()
		ts.addTest(new SolarCoordinatesMeeusTest("testMeanObli()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testMeanObli();
			}
		}));

		//  testCorrObli()
		ts.addTest(new SolarCoordinatesMeeusTest("testCorrObli()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testCorrObli();
			}
		}));
		
		//  testRa()
		ts.addTest(new SolarCoordinatesMeeusTest("testRa()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testRa();
			}
		}));

		//  testDecl()
		ts.addTest(new SolarCoordinatesMeeusTest("testDecl()", new TestMethod() {
			public void run(TestCase tc) {
				((SolarCoordinatesMeeusTest) tc).testDecl();
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
	protected void testMeanLon() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "201.80720"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getMeanLon(), 5);
		
		assertEquals("Mean longitude : ", expected, s);
		
	}
	
	/**
	 * 
	 */
	private void testMeanAnomaly() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "278.99397"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getMeanAnomaly(), 5);
		
		assertEquals("Mean anomaly : ", expected, s);
		
	}

	/**
	 * 
	 */
	private void testEccentricity() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "0.016711669"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getEccentricity(), 9);
		
		assertEquals("Eccentricity : ", expected, s);
		
	}
	
	/**
	 * 
	 */
	private void testEquationOfCenter() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "-1.89732"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getEquationOfCenter(), 5);
		
		assertEquals("EquationOfCenter : ", expected, s);
		
	}

	/**
	 * 
	 */
	private void testTrueLon() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "199.90987"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getTrueLon(), 5);
		
		assertEquals("True longitude : ", expected, s);
		
	}
	
	/**
	 * 
	 */
	private void testTrueAnomaly() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "277.09664"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getTrueAnomaly(), 5);
		
		assertEquals("True anomaly : ", expected, s);
		
	}

	/**
	 * 
	 */
	private void testRadiusVector() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "0.99766"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getRadiusVector(), 5);
		
		assertEquals("True anomaly : ", expected, s);
		
	}
	
	/**
	 * 
	 */
	private void testOmega() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "264.65711"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getOmega(), 5);
		
		assertEquals("Moon Asc. Node : ", expected, s);
		
	}

	/**
	 * 
	 */
	private void testAppLon() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "199.90894"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getAppLon(), 5);
		
		assertEquals("Apparent Lon : ", expected, s);
		
	}

	/**
	 * 
	 */
	private void testMeanObli() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "23.44023"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getMeanObli(), 5);
		
		assertEquals("Mean obliquity : ", expected, s);
		
	}
	
	/**
	 * 
	 */
	private void testCorrObli() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "23.43999"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getCorrObli(), 5);
		
		assertEquals("Corr. obliquity : ", expected, s);
		
	}

	/**
	 * 
	 */
	private void testRa() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "198.38083"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getRa(), 5);
		
		assertEquals("Rigth asc. : ", expected, s);
		
	}

	/**
	 * 
	 */
	private void testDecl() {

		SolarCoordinatesMeeus sc = new SolarCoordinatesMeeus(null);
		
		sc.computeEphemerides(2448908.5 - 2451545.0);
		
		String expected = "-7.78507"; 
		
		String s = AngleFormatter.angle2Decimal(sc.getDecl(), 5);
		
		assertEquals("Declination : ", expected, s);
		
	}
	
}
