package de.z35.posas.test.siteinfo;

import j2meunit.framework.Test;
import j2meunit.framework.TestCase;
import j2meunit.framework.TestMethod;
import j2meunit.framework.TestSuite;
//import de.z35.posas.peng.PosasEngine;
import de.z35.posas.siteinfo.SiteInfo;
//import de.z35.posas.test.peng.PosasEngineTest;
import de.z35.posas.test.util.J4METestCase;

public class SiteInfoTest extends J4METestCase {

	private static final String NAME = "Berlin";
	private static final double LON = -13.47;
	private static final double LAT = 52.50;
	private static final double TOLERANCE = 0.001;
	private static final int TZ_OFFS = 1;
	
	
	////////////////////////////////////////////////////////////////////////////
	//  constructors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param arg0
	 * @param arg1
	 */
	public SiteInfoTest(String arg0, TestMethod arg1) {
		super(arg0, arg1);
	}
	
	/**
	 * 
	 *
	 */
	public SiteInfoTest() {
		super();
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  suite
	////////////////////////////////////////////////////////////////////////////
	
	public Test suite() {

		TestSuite ts = new TestSuite();

	    ////////////////////////////////////////////////////////////////////////
	    // test accessors
	    ////////////////////////////////////////////////////////////////////////
		
		//  testGetName_Berlin()
		ts.addTest(new SiteInfoTest("testGetName_Berlin()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testGetName_Berlin();
			}
		}));

		//  testGetName_Null()
		ts.addTest(new SiteInfoTest("testGetName_Null()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testGetName_Null();
			}
		}));
		
		//  testGetName_Empty()
		ts.addTest(new SiteInfoTest("testGetName_Empty()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testGetName_Empty();
			}
		}));

		//  testGetLon()
		ts.addTest(new SiteInfoTest("testGetLon()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testGetLon();
			}
		}));
		
		//  testGetLat()
		ts.addTest(new SiteInfoTest("testGetLat()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testGetLat();
			}
		}));

		//  testGetTzOffs()
		ts.addTest(new SiteInfoTest("testGetTzOffs()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testGetTzOffs();
			}
		}));
		
		//  testGetTzOffs()
		ts.addTest(new SiteInfoTest("testGetTzOffs()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testGetTzOffs();
			}
		}));

		//  testGetTzOffsAsString()
		ts.addTest(new SiteInfoTest("testGetTzOffsAsString()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testGetTzOffsAsString();
			}
		}));
		
	    ////////////////////////////////////////////////////////////////////////
	    // test copy constructor
	    ////////////////////////////////////////////////////////////////////////
		
		//  testCopyCtor()
		ts.addTest(new SiteInfoTest("testCopyCtor()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testCopyCtor();
			}
		}));

	    ////////////////////////////////////////////////////////////////////////
	    // test mutators
	    ////////////////////////////////////////////////////////////////////////
				
		//  testSetName_Null()
		ts.addTest(new SiteInfoTest("testSetName_Null()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetName_Null();
			}
		}));

		//  testSetName_()
		ts.addTest(new SiteInfoTest("testSetName_()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetName_();
			}
		}));
		
		//  testSetName_Trim()
		ts.addTest(new SiteInfoTest("testSetName_Trim()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetName_Trim();
			}
		}));

		//  testSetLon_minus180dot01()
		ts.addTest(new SiteInfoTest("testSetLon_minus180dot01()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetLon_minus180dot01();
			}
		}));
		
		//  testSetLon_minus180dot00()
		ts.addTest(new SiteInfoTest("testSetLon_minus180dot00()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetLon_minus180dot00();
			}
		}));

		//  testSetLon_180dot01()
		ts.addTest(new SiteInfoTest("testSetLon_180dot01()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetLon_180dot01();
			}
		}));
		
		//  testSetLon_180dot00()
		ts.addTest(new SiteInfoTest("testSetLon_180dot00()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetLon_180dot00();
			}
		}));
		
		//  testSetLat_minus90dot01()
		ts.addTest(new SiteInfoTest("testSetLat_minus90dot01()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetLat_minus90dot01();
			}
		}));
		
		//  testSetLat_minus90dot00()
		ts.addTest(new SiteInfoTest("testSetLat_minus90dot00()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetLat_minus90dot00();
			}
		}));
		
		//  testSetLat_90dot01()
		ts.addTest(new SiteInfoTest("testSetLat_90dot01()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetLat_90dot01();
			}
		}));
		
		//  testSetLat_90dot00()
		ts.addTest(new SiteInfoTest("testSetLat_90dot00()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetLat_90dot00();
			}
		}));
		
		//  testSetDayLightSaving_minus1
		ts.addTest(new SiteInfoTest("testSetDayLightSaving_minus1", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetDayLightSaving_minus1();
			}
		}));
		
		//  testSetDayLightSaving_0
		ts.addTest(new SiteInfoTest("testSetDayLightSaving_0", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetDayLightSaving_0();
			}
		}));

		//  testSetDayLightSaving_1
		ts.addTest(new SiteInfoTest("testSetDayLightSaving_1", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetDayLightSaving_1();
			}
		}));
		
		//  testSetDayLightSaving_3
		ts.addTest(new SiteInfoTest("testSetDayLightSaving_3", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetDayLightSaving_3();
			}
		}));

		//  testSetDayLightSaving_N
		ts.addTest(new SiteInfoTest("testSetDayLightSaving_N", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetDayLightSaving_N();
			}
		}));
		
		//  testSetDayLightSaving_Y
		ts.addTest(new SiteInfoTest("testSetDayLightSaving_Y", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetDayLightSaving_Y();
			}
		}));

		//  testSetDayLightSaving_J
		ts.addTest(new SiteInfoTest("testSetDayLightSaving_J", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testSetDayLightSaving_J();
			}
		}));

		//  testMemento()
		ts.addTest(new SiteInfoTest("testMemento()", new TestMethod() {
			public void run(TestCase tc) {
				((SiteInfoTest) tc).testMemento();
			}
		}));
		
		return ts;
	}
	
    ////////////////////////////////////////////////////////////////////////////
    // test accessors
    ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * testGetName_Berlin()
	 */
	protected void testGetName_Berlin() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);
		
		assertEquals(NAME, l.getName());
		
	}
	
	/**
	 * testGetName_Null()
	 */
	protected void testGetName_Null() {

		SiteInfo l;
		
		try {
			l = new SiteInfo(null, LON, LAT, TZ_OFFS, 0);
			assertEquals("", l.getName());
		} catch (Exception e) {
			
		}
		
	}

	/**
	 * testGetName_Empty()
	 */
	protected void testGetName_Empty() {

		SiteInfo l;
		
		try {
			l = new SiteInfo("", LON, LAT, TZ_OFFS, 0);
			assertEquals("", l.getName());
		} catch (Exception e) {
			
		}
		
	}
	
	/**
	 * testGetLon()
	 */
	protected void testGetLon() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);
		
		assertEquals("", LON, l.getLon(), TOLERANCE);
		
	}

	/**
	 * testGetLat()
	 */
	protected void testGetLat() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);
		
		assertEquals("", LAT, l.getLat(), TOLERANCE);
		
	}
	
	/**
	 * testGetTzOffs()
	 */
	protected void testGetTzOffs() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);
		
		assertEquals(TZ_OFFS, l.getTzOffs());
		
	}
	
	/**
	 * testGetTzOffsAsString()
	 */
	protected void testGetTzOffsAsString() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);
		
		assertEquals("GMT + 01h", l.getTzOffsAsString());
		
	}
	
    ////////////////////////////////////////////////////////////////////////////
    // test copy constructor
    ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	protected final void testCopyCtor() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);
		
		SiteInfo l1 = new SiteInfo(l);
		
		assertNotNull(l1);
		
		assertEquals(NAME, l1.getName());
		assertEquals("", LON, l1.getLon(), TOLERANCE);
		assertEquals("", LAT, l1.getLat(), TOLERANCE);
		assertEquals(0, l1.getDayLightSaving());
		assertEquals(TZ_OFFS, l1.getTzOffs());
		
		l1 = null;
		
	}
	
    ////////////////////////////////////////////////////////////////////////////
    // test mutators
    ////////////////////////////////////////////////////////////////////////////

	/**
	 * setName()
	 */
	protected final void testSetName() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);		
		
		// test auf NULL
		try {
			l.setName(null);
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		

		// test auf ""        
		try {
			l.setName("");
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		

        // test auf "   xxxx   "
		l.setName(" Adorf  ");
		assertEquals("Adorf", l.getName());
        
	}
	
	/**
	 * testSetName_Null()
	 */
	protected final void testSetName_Null() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);		
		
		// test auf NULL
		try {
			l.setName(null);
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		

	}
	
	/**
	 * setName()
	 */
	protected final void testSetName_() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);		
		
		// test auf ""        
		try {
			l.setName("");
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		

	}

	/**
	 * testSetName_Trim()
	 */
	protected final void testSetName_Trim() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);		

        // test auf "   xxxx   "
		l.setName(" Adorf  ");
		assertEquals("Adorf", l.getName());
        
	}
	
	/**
	 * setLon()
	 * gültiger Wertebereich (-180.0..180.0)
	 */
	public final void testSetLon_minus180dot01() {

		SiteInfo l = new SiteInfo();		
		
		//  test auf -180.01
		try {
			l.setLon(-180.01);
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		
		
	}

	/**
	 * setLon()
	 * gültiger Wertebereich (-180.0..180.0)
	 */
	public final void testSetLon_minus180dot00() {

		SiteInfo l = new SiteInfo();		
		
        //  test auf -180.0
        l.setLon(-180.0d);
		assertEquals("", -180.0d, l.getLon(), TOLERANCE);		

	}
	
	/**
	 * setLon()
	 * gültiger Wertebereich (-180.0..180.0)
	 */
	public final void testSetLon_180dot01() {

		SiteInfo l = new SiteInfo();		
		
		//  test auf 180.01
		try {
			l.setLon(180.01);
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		

	}

	/**
	 * setLon()
	 * gültiger Wertebereich (-180.0..180.0)
	 */
	public final void testSetLon_180dot00() {

		SiteInfo l = new SiteInfo();		
		
        //  test auf 180.0
        l.setLon(180.0d);
		assertEquals("", 180.0d, l.getLon(), TOLERANCE);		

	}

	/**
	 * setLat()
	 * gültiger Wertebereich (-90.0..90.0)
	 */
	public final void testSetLat_minus90dot01() {

		SiteInfo l = new SiteInfo();		
		
		//  test auf -90.01
		try {
			l.setLat(-90.01);
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		
		
	}
	
	/**
	 * setLat()
	 * gültiger Wertebereich (-90.0..90.0)
	 */
	public final void testSetLat_minus90dot00() {

		SiteInfo l = new SiteInfo();		
		
        //  test auf -90.0
        l.setLat(-90.0d);
		assertEquals("", -90.0d, l.getLat(), TOLERANCE);		
		
	}
	
	/**
	 * setLat()
	 * gültiger Wertebereich (-90.0..90.0)
	 */
	public final void testSetLat_90dot01() {

		SiteInfo l = new SiteInfo();		
		
		//  test auf 90.01
		try {
			l.setLat(90.01);
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		
		
	}
	
	/**
	 * setLat()
	 * gültiger Wertebereich (-90.0..90.0)
	 */
	public final void testSetLat_90dot00() {

		SiteInfo l = new SiteInfo();		
		
        //  test auf 90.0
        l.setLat(90.0d);
		assertEquals("", 90.0d, l.getLat(), TOLERANCE);		
		
	}
	
	/**
	 * setDayLightSaving()
	 * gültiger Wertebereich (0,1) oder ('N','Y') bzw. ('N','J')
	 */
	public final void testSetDayLightSaving_minus1() {
		
		SiteInfo l = new SiteInfo();		
		
		// test auf -1
		try {
			l.setDayLightSaving(-1);
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		
        
	}
	
	/**
	 * setDayLightSaving()
	 * gültiger Wertebereich (0,1) oder ('N','Y') bzw. ('N','J')
	 */
	public final void testSetDayLightSaving_0() {
		
		SiteInfo l = new SiteInfo();		

		// test auf 0        
        l.setDayLightSaving(0);
        assertEquals(0, l.getDayLightSaving());
        
	}

	/**
	 * setDayLightSaving()
	 * gültiger Wertebereich (0,1) oder ('N','Y') bzw. ('N','J')
	 */
	public final void testSetDayLightSaving_1() {
		
		SiteInfo l = new SiteInfo();		

		// test auf 1        
        l.setDayLightSaving(1);
        assertEquals(1, l.getDayLightSaving());
        
	}
	/**
	 * setDayLightSaving()
	 * gültiger Wertebereich (0,1) oder ('N','Y') bzw. ('N','J')
	 */
	public final void testSetDayLightSaving_3() {
		
		SiteInfo l = new SiteInfo();		
        
        //  test auf 3
		try {
			l.setDayLightSaving(3);
            fail("Hier sollte eine IllegalArgumentException erscheinen...");
        } catch (IllegalArgumentException expected) {
            ; // Expected - intentional
        }		
        
	}
	/**
	 * setDayLightSaving()
	 * gültiger Wertebereich (0,1) oder ('N','Y') bzw. ('N','J')
	 */
	public final void testSetDayLightSaving_N() {
		
		SiteInfo l = new SiteInfo();		

		// test auf (N)o        
        l.setDayLightSaving('N');
        assertEquals(0, l.getDayLightSaving());
        
	}
	/**
	 * setDayLightSaving()
	 * gültiger Wertebereich (0,1) oder ('N','Y') bzw. ('N','J')
	 */
	public final void testSetDayLightSaving_Y() {
		
		SiteInfo l = new SiteInfo();		

		// test auf (Y)es, (J)a        
        l.setDayLightSaving('Y');
        assertEquals(1, l.getDayLightSaving());

	}
	/**
	 * setDayLightSaving()
	 * gültiger Wertebereich (0,1) oder ('N','Y') bzw. ('N','J')
	 */
	public final void testSetDayLightSaving_J() {
		
		SiteInfo l = new SiteInfo();		

        l.setDayLightSaving('J');
        assertEquals(1, l.getDayLightSaving());
        
	}
	
    ////////////////////////////////////////////////////////////////////////////
    // test memento
    ////////////////////////////////////////////////////////////////////////////

	public final void testMemento() {

		SiteInfo l = new SiteInfo(NAME, LON, LAT, TZ_OFFS, 0);		
		
		assertEquals(NAME, l.getName());
		assertEquals("", LON, l.getLon(), TOLERANCE);
		assertEquals("", LAT, l.getLat(), TOLERANCE);
		assertEquals(0, l.getDayLightSaving());
		assertEquals(TZ_OFFS, l.getTzOffs());

		SiteInfo.Memento mem = (SiteInfo.Memento) l.saveToMemento();

		l.setName("Bad Elster");
		l.setLon(12.14d);
		l.setLat(50.17d);
		l.setTzOffs(2);
		l.setDayLightSaving(1);
		
		assertEquals("Bad Elster", l.getName());
		assertEquals("", 12.14d, l.getLon(), TOLERANCE);
		assertEquals("", 50.17d, l.getLat(), TOLERANCE);
		assertEquals(1, l.getDayLightSaving());
		assertEquals(2, l.getTzOffs());
		
		l.restoreMemento(mem);
		
		assertEquals(NAME, l.getName());
		assertEquals("", LON, l.getLon(), TOLERANCE);
		assertEquals("", LAT, l.getLat(), TOLERANCE);
		assertEquals(0, l.getDayLightSaving());
		assertEquals(TZ_OFFS, l.getTzOffs());
		
	}
	
	
}
