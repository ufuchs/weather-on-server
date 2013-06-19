package de.z35.posas.test.util;

import de.z35.posas.core.AngleFormatter;
import de.z35.util.TrigoEx;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;
import j2meunit.framework.Test;

/**
 * 
 * @author ufuchs
 *
 */
public class TrigoExTest extends J4METestCase {

	////////////////////////////////////////////////////////////////////////////
	//  constructor
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public TrigoExTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}

	/**
	 * 
	 *
	 */
	public TrigoExTest() {
		super();
	}
	
	
	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		ts.addTest(new TrigoExTest("testNormalizeAngle", new TestMethod() {
			public void run(TestCase tc) {
				((TrigoExTest) tc).testNormalizeAngle();
			}
		}));
		
		ts.addTest(new TrigoExTest("testDdmmss2Decimal", new TestMethod() {
			public void run(TestCase tc) {
				((TrigoExTest) tc).testDdmmss2DecimalToRad();
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
	protected void testNormalizeAngle() {
		
		double expected;
		double actual;
		
		expected = 20.0;
		
		actual = TrigoEx.normalizeAngle(380, 360.0d);
		
		assertEquals("normalizeAngle(380, 360.0d) : ", expected, actual,1);
		
	}

	/**
	 * 
	 */
	protected void testDdmmss2DecimalToRad() {
		
		double[][] input = {{13, 28, 50}, {52, 30, 0}};
		
		String[] output = {"13.4806", "52.5000"};
		
		String expected;
		String actual;
		
		int len = input.length;
		
		for (int i = 0; i < len; i++) {
			
			int deg = (int) input[i][0];
			int min = (int) input[i][1];
			int sec = (int) input[i][2];
			
			expected = output[i];
			
			actual = AngleFormatter.angle2Decimal(TrigoEx.ddmmss2Decimal(deg, min, sec, TrigoEx.DEG), 4);
			
			assertEquals(expected, actual);
			
		}
		
		
	}
	
	
		
	
	
	
}
