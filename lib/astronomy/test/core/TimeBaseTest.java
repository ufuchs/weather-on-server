package de.z35.posas.test.core;

import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;
import de.z35.posas.core.AngleFormatter;
import de.z35.posas.core.TimeBase;
import de.z35.posas.test.util.J4METestCase;

public class TimeBaseTest extends J4METestCase{

	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public TimeBaseTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}

	/**
	 * 
	 *
	 */
	public TimeBaseTest() {
		super();
	}

	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		//  Julian Day Number
		ts.addTest(new TimeBaseTest("testJd()", new TestMethod() {
			public void run(TestCase tc) {
				((TimeBaseTest) tc).testJd();
			}
		}));

		//  Julian Day Number at 00:00
		ts.addTest(new TimeBaseTest("testJd0()", new TestMethod() {
			public void run(TestCase tc) {
				((TimeBaseTest) tc).testJd0();
			}
		}));
		
		//  Julian Day Number at 00:00
		ts.addTest(new TimeBaseTest("testJd2k0()", new TestMethod() {
			public void run(TestCase tc) {
				((TimeBaseTest) tc).testJd2k0();
			}
		}));

		//  Julian Day Number at 00:00
		ts.addTest(new TimeBaseTest("testGmst0()", new TestMethod() {
			public void run(TestCase tc) {
				((TimeBaseTest) tc).testGmst0();
			}
		}));
		
		//  Julian Day Number at 00:00
		ts.addTest(new TimeBaseTest("testGmst()", new TestMethod() {
			public void run(TestCase tc) {
				((TimeBaseTest) tc).testGmst();
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
	protected void testJd() {

		TimeBase tb = new TimeBase();
		
		tb.setParams(1987, 4, 10, 19, 21, 00);
		
		String expected = "2446896.30625"; 
		
		String s = Double.toString(tb.getJD());
		
		assertEquals("Julian Day Number :", expected, s);
		
	}

	/**
	 * 
	 */
	protected void testJd0() {

		TimeBase tb = new TimeBase();
		
		tb.setParams(1987, 4, 10, 19, 21, 00);
		
		String expected = "2446895.5"; 
		
		String s = Double.toString(tb.getJD0());
		
		assertEquals("Julian Day Number at 00:00:", expected, s);
		
	}
	
	/**
	 * 
	 */
	protected void testJd2k0() {

		TimeBase tb = new TimeBase();
		
		tb.setParams(1987, 4, 10, 19, 21, 00);
		
		String expected = "-4649.5"; 
		
		String s = Double.toString(tb.getJD2K0());
		
		assertEquals("Julian Day's since 2000-JAN-01 00:00:", expected, s);
		
	}

	/**
	 * 
	 */
	protected void testGmst0() {

		TimeBase tb = new TimeBase();
		
		tb.setParams(1987, 4, 10, 19, 21, 00);
		
		String expected = "13h 10m 46s"; 
		
		String s = AngleFormatter.angle2Time(tb.getGmst0(), AngleFormatter.TIME_ANALOG);
		
		assertEquals("", expected, s);
		
	}
	
	/**
	 * 
	 */
	protected void testGmst() {

		TimeBase tb = new TimeBase();
		
		tb.setParams(1987, 4, 10, 19, 21, 00);
		
		String expected = "08h 34m 57s"; 
		
		String s = AngleFormatter.angle2Time(tb.getGmst(), AngleFormatter.TIME_ANALOG);
		
		assertEquals("", expected, s);
		
	}
	
}
