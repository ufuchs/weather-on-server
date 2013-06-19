package de.z35.posas.test.siteinfo;

import de.z35.posas.siteinfo.SiteInfo;
import de.z35.posas.siteinfo.SiteInfoService;
import de.z35.posas.test.util.J4METestCase;
import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;


public class SiteInfoServiceTest extends J4METestCase {

	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public SiteInfoServiceTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}
	
	/**
	 * 
	 *
	 */
	public SiteInfoServiceTest() {
		super();
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();
		
		//  testRetrieveAll()
		ts.addTest(new SiteInfoServiceTest("testRetrieveAll()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testRetrieveAll();
			}
		}));

		//  testAddLocation()
		ts.addTest(new SiteInfoServiceTest("testAddLocation()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testAddLocation();
			}
		}));
		
				
		//  testAddLocation()
		ts.addTest(new SiteInfoServiceTest("testLocationsWasChanged_CHANGED()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testLocationsWasChanged_CHANGED();
			}
		}));
		
		
		//  testAddLocation()
		ts.addTest(new SiteInfoServiceTest("testLocationsWasChanged_DROPPED()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testLocationsWasChanged_DROPPED();
			}
		}));
		
				
		//  testLocationsWasChanged_INSERTED()
		ts.addTest(new SiteInfoServiceTest("testLocationsWasChanged_INSERTED()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testLocationsWasChanged_INSERTED();
			}
		}));
		
		//  testDropLocation_BySiteInfo()
		ts.addTest(new SiteInfoServiceTest("testDropLocation_BySiteInfo()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testDropLocation_BySiteInfo();
			}
		}));
		
		//  testDropLocation_ByName()
		ts.addTest(new SiteInfoServiceTest("testDropLocation_ByName()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testDropLocation_ByName();
			}
		}));

		//  testChangeLocation()
		ts.addTest(new SiteInfoServiceTest("testChangeLocation()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testChangeLocation();
			}
		}));
		
		//  testConvertInput2Degree()
		ts.addTest(new SiteInfoServiceTest("testConvertInput2Degree()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testConvertInput2Degree();
			}
		}));
		
		//  testConvertInput2TimeZone_plus8()
		ts.addTest(new SiteInfoServiceTest("testConvertInput2TimeZone_plus8()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testConvertInput2TimeZone_plus8();
			}
		}));
		
		//  testConvertInput2TimeZone_minus8()
		ts.addTest(new SiteInfoServiceTest("testConvertInput2TimeZone_minus8()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoServiceTest) tc).testConvertInput2TimeZone_minus8();
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
	protected void testRetrieveAll() {
		
		SiteInfoService siv = new SiteInfoService();
		
		try {
			siv.setRunForTest(true);
			siv.retrieveAll();
		} catch (Exception e) {
			e.printStackTrace();
		}

		for (int i = 0; i < siv.getLocationCount(); i++) {

			SiteInfo l = siv.getLocation(i);

			if (i == 0) {

				assertEquals("Berlin", l.getName());
				assertEquals("", -13.47d, l.getLon(), 0.001d);
				assertEquals("", 52.50d, l.getLat(), 0.001d);
				assertEquals(0, l.getDayLightSaving());
				assertEquals(1, l.getTzOffs());

			} else if (i == 1) {

				assertEquals("Bad Elster", l.getName());
				assertEquals("", -12.14d, l.getLon(), 0.001d);
				assertEquals("", 50.17d, l.getLat(), 0.001d);
				assertEquals(0, l.getDayLightSaving());
				assertEquals(1, l.getTzOffs());

			}

		}
		
	}
	
	/**
	 * 
	 */
	public final void testAddLocation() {

		SiteInfoService siv = new SiteInfoService();
		
		try {
			
			siv.setRunForTest(true);			
			siv.retrieveAll();

			siv.addLocation("Stuttgart", -9.18, 48.78, 1, 0);
	
			SiteInfo si = siv.searchLocation("Stuttgart");
			
			assertEquals("", si != null, true);
			
//			siv.updateAll();
			
		} catch (Exception e) {
			fail("Exception wurde geworfen...");
		}
		
	}
	
	/**
	 * 
	 */
	public final void testLocationsWasChanged_CHANGED() {

		SiteInfoService siv = new SiteInfoService();
		
		try {
			siv.setRunForTest(true);
			siv.retrieveAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		for (int i = 0; i < siv.getLocationCount(); i++) {

			SiteInfo l = siv.getLocation(i);

			if (i == 0) {
				l.setState(SiteInfo.CHANGED, true);
			} 


		}
		
		boolean actual = siv.locationsWasChanged();
		
		assertEquals("", true, actual);		
		
	}
	
	/**
	 * 
	 */
	public final void testLocationsWasChanged_DROPPED() {

		SiteInfoService siv = new SiteInfoService();
		
		try {
			siv.setRunForTest(true);
			siv.retrieveAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		for (int i = 0; i < siv.getLocationCount(); i++) {

			SiteInfo l = siv.getLocation(i);

			if (i == 0) {
				l.setState(SiteInfo.DROPPED, true);
			} 


		}
		
		boolean actual = siv.locationsWasChanged();
		
		assertEquals("", true, actual);		
		
	}

	/**
	 * 
	 */
	public final void testLocationsWasChanged_INSERTED() {

		SiteInfoService siv = new SiteInfoService();
		
		try {
			siv.setRunForTest(true);
			siv.retrieveAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		for (int i = 0; i < siv.getLocationCount(); i++) {

			SiteInfo l = siv.getLocation(i);

			if (i == 0) {
				l.setState(SiteInfo.INSERTED, true);
			} 

		}
		
		boolean actual = siv.locationsWasChanged();
		
		assertEquals("", true, actual);		
		
	}
	
	/**
	 * 
	 */
	public final void testDropLocation_BySiteInfo() {

		SiteInfoService siv = new SiteInfoService();
		
		try {
			siv.setRunForTest(true);
			siv.retrieveAll();
		} catch (Exception e) {
			e.printStackTrace();
		}

		SiteInfo l = siv.getLocation(0);
		
		siv.dropLocation(l);
		
		l = siv.searchLocation(l);
		
		assertEquals(l, null);
		
	}

	/**
	 * 
	 */
	public final void testDropLocation_ByName() {

		SiteInfoService siv = new SiteInfoService();
		
		try {
			siv.setRunForTest(true);
			siv.retrieveAll();
		} catch (Exception e) {
			e.printStackTrace();
		}

		SiteInfo l = siv.getLocation(0);
		
		siv.dropLocation("Berlin");
		
		l = siv.searchLocation("Berlin");
		
		assertEquals(l, null);
		
	}
	
	/**
	 * 
	 */
	public final void testChangeLocation() {

		SiteInfoService siv = new SiteInfoService();
		
		try {
			siv.setRunForTest(true);
			siv.retrieveAll();
		} catch (Exception e) {
			e.printStackTrace();
		}

		SiteInfo l = siv.getLocation(0);
		
		l.setName("Timbuktu");
		
		siv.changeLocation(l);
		
		l = siv.searchLocation("Timbuktu");
		
		assertEquals("", true, l != null);
		
	}

	/**
	 * 
	 */
	public final void testConvertInput2Degree() {

		double actual = SiteInfoService.convertInput2Degree("13 28 O");
		
		assertEquals("", -13.47d, actual, 0.01);
	}
	
	/**
	 * 
	 */
	public final void testConvertInput2TimeZone_plus8() {

		double actual = SiteInfoService.convertInput2TimeZone("GMT + 8h");
		
		assertEquals("", 8, actual, 0.01);
	}

	/**
	 * 2008-01-04  z35 Bugfixing: Übergabe negativer Timezone liefert positiven Wert 
	 */
	public final void testConvertInput2TimeZone_minus8() {

		double actual = SiteInfoService.convertInput2TimeZone("GMT - 8h");
		
		assertEquals("", -8, actual, 0.01);
	}
	
		
	
	
}
