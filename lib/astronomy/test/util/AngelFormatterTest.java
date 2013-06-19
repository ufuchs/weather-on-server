package de.z35.posas.test.util;

import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;

import de.z35.posas.core.AngleFormatter;

public class AngelFormatterTest extends TestCase {
	
	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public AngelFormatterTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}
	
	/**
	 * 
	 *
	 */
	public AngelFormatterTest() {
		super();
	}
	
	
	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		// testAngle2Decimal
		ts.addTest(new AngelFormatterTest("testAngle2Decimal", new TestMethod() {
			public void run(TestCase tc) {
				((AngelFormatterTest) tc).testAngle2Decimal();
			}
		}));
		
		// testAngle2Ddmm
		ts.addTest(new AngelFormatterTest("testAngle2Ddmm", new TestMethod() {
			public void run(TestCase tc) {
				((AngelFormatterTest) tc).testAngle2Ddmm();
			}
		}));

		// testAngle2Time
		ts.addTest(new AngelFormatterTest("testAngle2Time", new TestMethod() {
			public void run(TestCase tc) {
				((AngelFormatterTest) tc).testAngle2Time();
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
	protected void testAngle2Decimal() {
		
		double[][] input = {{22.22, 4}, {13.480555555555556, 6}, {13.480555555555556, 0}};
		
		String[] output = {"22.2200", "13.480556", "13.0"};
		
		int len = input.length;
		
		for (int i = 0; i < len; i++) {

			String expected = output[i];
			
			double angle = input[i][0];
			
			int decimals = (int) input[i][1];
			
			String actual = AngleFormatter.angle2Decimal(angle, decimals);
			
			boolean result = expected.equals(actual);
			
			assertEquals(expected, actual);
			
		}
		
	}

	/**
	 * 
	 */
	protected void testAngle2Ddmm() {
		
		double[][] input = {
				
				{22.22, (AngleFormatter.DELI_SPACE | AngleFormatter.HEMI_LON)},
				{-22.22, (AngleFormatter.DELI_SPACE | AngleFormatter.HEMI_LON)},
				{22.22, (AngleFormatter.DELI_SPACE | AngleFormatter.HEMI_LAT)},
				{-22.22, (AngleFormatter.DELI_SPACE | AngleFormatter.HEMI_LAT)},
				{-22.22, (AngleFormatter.WITH_SIGN | AngleFormatter.HEMI_LAT)}
				
		
		};
		
		String[] output = {
				"22 13 W", 
				"22 13 E", 
				"22 13 N",
				"22 13 S",
				"-22° 13.2'"
		};
		
		int len = input.length;
		
		for (int i = 0; i < len; i++) {

			String expected = output[i];
			
			double angle = input[i][0];
			
			int decimals = (int) input[i][1];
			
			String actual = AngleFormatter.angle2Ddmm(angle, decimals);
			
			boolean result = expected.equals(actual);
			
			assertEquals(expected, actual);
			
		}
		
	}
	
	/**
	 * 
	 */
	protected void testAngle2Time() {
		
		double[][] input = {
				
				{22.22, (AngleFormatter.TIME_DIGITAL)},
				{15.0, (AngleFormatter.TIME_DIGITAL)},
				{15.0, (AngleFormatter.TIME_ANALOG)},
				{22.0, (AngleFormatter.TIME_ANALOG)}
				
		
		};
		
		String[] output = {
				"01:29", 
				"01:00",
				"01h 00m 00s",
				"01h 28m 00s"
		};
		
		int len = input.length;
		
		for (int i = 0; i < len; i++) {

			String expected = output[i];
			
			double angle = input[i][0];
			
			int mode = (int) input[i][1];
			
			String actual = AngleFormatter.angle2Time(angle, mode);
			
			assertEquals(expected, actual);
			
		}
		
	}
	
}
