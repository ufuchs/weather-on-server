package de.z35.posas.core;

import de.z35.posas.siteinfo.SiteInfo;
import de.z35.posas.siteinfo.SiteInfoObserverInt;

/**
 * @author   ufuchs
 */
public final class RiseAndSetService implements TimeBaseObserverInt, SiteInfoObserverInt {
	
	private double currJd2k0;
	
	private RiseAndSet ras;
	private BodyCoordinatesInt bc;
	private TimeBase tb;
	
	//  Stützstellen-Arrays für Interpolation
	double[] decl;
	double[] ra;

    ////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param tb
	 * @param sc
	 */
	public RiseAndSetService(final TimeBase tb, final BodyCoordinatesInt bc) {
		
		super();
		
		this.bc = bc;
		this.tb = tb;
		
		initialize();
		
	} 
	
	/**
	 * 
	 *
	 */
	private void initialize() {

		this.ra = new double[3];
		this.decl = new double[3];
		this.ras = new RiseAndSet(tb, bc, ra, decl);		
		
	}

    ////////////////////////////////////////////////////////////////////////////
    // mutators
    ////////////////////////////////////////////////////////////////////////////

	/**
	 * @param deltaT ist die Differenz zur Dynamic Time in Sekunden
	 */
	public void setDeltaT(final double deltaT) {
		ras.setDeltaT(deltaT);
	}
	
	/**
	 * 
	 * @param refrac ist die Refraktion bei Auf-und Untergang für das 
	 * 			gewünschte Object
	 */
	public void setRefrac(final double refrac) {
		ras.setInterestedAltitude(refrac);
	}
	
	/**
	 * 
	 * @param siteInfo
	 */
	public void setSiteInfo(final SiteInfo siteInfo) {
		ras.setSiteInfo(siteInfo);
	}
	
	/**
	 * 
	 * @param bc
	 */
	public void setBodyCoordinatesInt(final BodyCoordinatesInt bc) {
		
		if (!this.bc.equals(bc)) {
			
			// 'bc' wurde gewechselt 
			computeSamplePoints(currJd2k0, bc);		
		
			this.bc = bc;
		
		}
		
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  accessors
	////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 */
	public final int getState() {
		return ras.getState();
	}
	
	/**
	 * 
	 * @return
	 */
	public final double getTimeOverHorizont() {
		return ras.getTimeOverHorizont();
	}
	
	/**
	 * 
	 * @return time of rise
	 */
	public final double getRise() {
		return ras.getRise();
	}
	
	/**
	 * 
	 * @return time of set
	 */
	public final double getSet() {
		return ras.getSet();
	}
	
	/**
	 * 
	 * @return
	 */
	public final double getTransit() {
		return ras.getTransit();
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  production
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Ermitteln der Stützstellen für die Interpolation
	 * @param jd2k0
	 */
	private void computeSamplePoints(final double jd2k0, final BodyCoordinatesInt bc) {

		if (jd2k0 != currJd2k0) {

			// day before
			bc.computeEphemerides(jd2k0 - 1);
			decl[0] = bc.getDecl();
			ra[0] = bc.getRa();
			
			// day after
			bc.computeEphemerides(jd2k0 + 1);
			decl[2] = bc.getDecl();
			ra[2] = bc.getRa();
			
			// on day
			bc.computeEphemerides(jd2k0);
			decl[1] = bc.getDecl();
			ra[1] = bc.getRa();
			
			currJd2k0 = jd2k0;
			
		}
	}
	
	/**
	 * 
	 *
	 */
	public void compute() {
			
		computeSamplePoints(tb.getJD2K0(), this.bc);
		
		ras.compute();
		
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  observer
	////////////////////////////////////////////////////////////////////////////

	/**
	 * 
	 */
	synchronized public void updateSiteInfoObserver(final SiteInfo siteInfo) {
		
//		System.out.println("RiseAndSetService.updateSiteInfoObserver()");
		
		ras.updateSiteInfoObserver(siteInfo);
		
	}
	
	/**
	 * 
	 */
	synchronized public void updateTimeBaseObservers() {

//		System.out.println("RiseAndSetService.updateTimeBaseObservers()");
		
		/*
		double jd2k0 = tb.getJD2K0();
		
		if (jd2k0 != currJd2k0) {
		
			computeSamplePoints(jd2k0, this.bc);
			
			currJd2k0 = jd2k0; 
		
		}
		*/
		computeSamplePoints(tb.getJD2K0(), this.bc);		
		
		ras.updateTimeBaseObservers();
		
	}
	
	
}
