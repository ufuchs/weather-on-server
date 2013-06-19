package de.z35.posas.test.main;

import de.z35.posas.test.util.AngelFormatterTest;
import de.z35.posas.test.util.MathExTest;
import de.z35.posas.test.util.TrigoExTest;
import de.z35.posas.test.core.SolarCoordinatesMeeusTest;
import de.z35.posas.test.core.TimeBaseTest;
import de.z35.posas.test.core.RiseAndSetTest;
import de.z35.posas.test.core.RiseAndSetServiceTest;
import de.z35.posas.test.peng.PosasEngineTest;
import de.z35.posas.test.siteinfo.SiteInfoTest;
import de.z35.posas.test.siteinfo.SiteInfoServiceTest;

import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestSuite;

/**
 * 
 * @author ufuchs
 *
 */
public class PosasTestSuite extends TestCase {

	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	public Test suite() {
		
		TestSuite ts = new TestSuite("Posas tests");
		
		ts.addTest(new MathExTest().suite());
		
		ts.addTest(new AngelFormatterTest().suite());
		
		ts.addTest(new TrigoExTest().suite());

		ts.addTest(new SiteInfoTest().suite());
		
		ts.addTest(new SiteInfoServiceTest().suite());

		ts.addTest(new TimeBaseTest().suite());		
		
		ts.addTest(new SolarCoordinatesMeeusTest().suite());
		
		ts.addTest(new RiseAndSetTest().suite());
		
		ts.addTest(new RiseAndSetServiceTest().suite());
		
		ts.addTest(new PosasEngineTest().suite());
		
		return ts;
		
	}
	
	
}
