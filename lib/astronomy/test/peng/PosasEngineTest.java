package de.z35.posas.test.peng;

import de.z35.posas.peng.PosasEngine;
import de.z35.posas.test.util.J4METestCase;
import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;

public class PosasEngineTest extends J4METestCase {

	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public PosasEngineTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}
	
	
	public PosasEngineTest() {
		super();
	}

	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		//  testPEng()
		ts.addTest(new PosasEngineTest("testPEng()", new TestMethod() {
			public void run(TestCase tc) {
				((PosasEngineTest) tc).testPEng();
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
	protected void testPEng() {

		PosasEngine peng = PosasEngine.getInstance();
		peng.initialize();
		
	}
	
	
}
