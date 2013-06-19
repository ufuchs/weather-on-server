package de.z35.posas.siteinfo;

import de.z35.sme.prefs.SmePrefsService;
import java.util.Vector;

/**
 * @author   ufuchs
 */
public class SiteInfoEngine {

	private static SiteInfoEngine sieng = new SiteInfoEngine();
	private boolean initialized;
	/**
	 * @uml.property  name="defSiteInfoIndex"
	 */
	private int defSiteInfoIndex;
	private SiteInfo defSiteInfo; 
	
	// workers
	SiteInfoService siteInfoSvc;
	Vector siteInfoObservers;

	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 *
	 */
	private SiteInfoEngine() {
		
		siteInfoObservers = new Vector();
		
	}
	
	/**
	 * 
	 * @return
	 */
	public static SiteInfoEngine getInstance() {
		return sieng;
	}
	
	/**
	 * 
	 *
	 */
	public void initialize() throws Exception {
		
		if (!initialized) {

			initialized = true;

//			dao = new SiteInfoDaoMock();

//			dao = new SiteInfoDaoXml();
			siteInfoSvc = new SiteInfoService();
			siteInfoSvc.retrieveAll();

		}

	}
	
	/**
	 * 
	 */
	public void doFinalize() {
		
		try {
			siteInfoSvc.updateAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	////////////////////////////////////////////////////////////////////////////
	//  accessors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @param  defSiteInfoIndex
	 * @uml.property  name="defSiteInfoIndex"
	 */
	public void setDefSiteInfoIndex(int defSiteInfoIndex) {
		
		this.defSiteInfoIndex = defSiteInfoIndex;
		defSiteInfo = siteInfoSvc.getLocation(this.defSiteInfoIndex);
		//  Änderungen an Beobachter übermitteln
		updateObservers(defSiteInfo);
		SmePrefsService.getInstance().setSiteInfoIndex(defSiteInfoIndex);
		
	}

	/**
	 * @return
	 * @uml.property  name="defSiteInfoIndex"
	 */
	public int getDefSiteInfoIndex() {
		return defSiteInfoIndex;
	}
	
	/**
	 * @return
	 * @uml.property  name="defSiteInfo"
	 */
	public SiteInfo getDefSiteInfo() {
		return defSiteInfo; 
	}
	
	/**
	 * Liefert <code>SiteInfo</code> an Position <code>index</code>
	 * @param index
	 * @return
	 */
	public SiteInfo getSiteInfo(int index) {
		return siteInfoSvc.getLocation(index);
	}

	/**
	 * Liefert Anzahl aller SiteInfo's
	 * @return
	 */
	public int getSiteInfoCount() {
		return siteInfoSvc.getLocationCount();
	}

	////////////////////////////////////////////////////////////////////////////
	//  production
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param index
	 */
	public void dropSiteInfo(int index) {
		SiteInfo si = siteInfoSvc.getLocation(index);
		siteInfoSvc.dropLocation(si);
	}
	
	/**
	 * 
	 * @param si
	 */
	public void addSiteInfo(SiteInfo si) {
		
		siteInfoSvc.addLocation(si);
		
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  observer
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @param observer
	 */
	public void attach(SiteInfoObserverInt observer) {
		
		if (observer == null) {
			throw new IllegalArgumentException();
		}
		
		siteInfoObservers.addElement(observer);
	}
	
	/**
	 * 
	 * @param observer
	 */
	public void detach(SiteInfoObserverInt observer) {
		siteInfoObservers.removeElement(observer);
	}
	
	/**
	 * 
	 *
	 */
	public void updateObservers(SiteInfo siteInfo) {
		
//		System.out.println("SiteInfoEngine.updateObservers()");
		
		for (int i = 0; i < siteInfoObservers.size(); i++) {
			((SiteInfoObserverInt)siteInfoObservers.elementAt(i))
				.updateSiteInfoObserver(siteInfo);
		}
		
	}
	
}
