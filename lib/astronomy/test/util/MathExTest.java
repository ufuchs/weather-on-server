package de.z35.posas.test.util;

import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;

import de.z35.util.MathEx;

/**
 * 
 * @author ufuchs
 *
 */
public class MathExTest extends J4METestCase {
	
	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public MathExTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}

	/**
	 * 
	 *
	 */
	public MathExTest() {
		super();
	}

	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		//  MathEx - testFmod
		ts.addTest(new MathExTest("testFmod", new TestMethod() {
			public void run(TestCase tc) {
				((MathExTest) tc).testFmod();
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
	protected void testFmod() {
		
		double[][] fmodData = { { 3, 4, 3 }, { 4, 3, 1 }, { 4, 4, 0 }, { -3, 4, -3 },
				{ -4, -2, 0 }, { -4, -3, -1 }, { -4, 0, 0 } };
		
		int len = fmodData.length;
		
		for (int i = 0; i < len; i++) {

			double expected = fmodData[i][2];
			
			double a = fmodData[i][0];
			
			double n = fmodData[i][1];
			
			double actual = MathEx.fmod(a, n);
	
			assertEquals("", expected, actual,1);
			
		}
		
	}
	
}
