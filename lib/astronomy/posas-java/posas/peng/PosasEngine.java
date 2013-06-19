package de.z35.posas.peng;

import de.z35.posas.core.AlarmClock;
import de.z35.posas.core.BodyCoordinatesInt;
import de.z35.posas.core.RiseAndSetService;
import de.z35.posas.core.SolarCoordinates;
import de.z35.posas.core.TimeBase;
import de.z35.posas.core.TimeBaseObserverInt;
import de.z35.posas.siteinfo.SiteInfo;
import de.z35.posas.siteinfo.SiteInfoObserverInt;
import java.util.Vector;

/**
 * @author   ufuchs
 */
public final class PosasEngine implements SiteInfoObserverInt{

	private final static PosasEngine peng = new PosasEngine(); 
	private boolean initialized;
	private Vector siteInfoObservers;
	
	//  worker
	private TimeBase timeBase;
	private BodyCoordinatesInt solarCoordinates;
	private AlarmClock alarmClock;
	private RiseAndSetService riseAndSetSvc;
	
	/**
	 * 
	 *
	 */
	private PosasEngine() {
		super();

		siteInfoObservers = new Vector();
	}
	
	/**
	 * 
	 * @return
	 */
	public static PosasEngine getInstance() {
		
		return peng;
		
	}

	/**
	 * 
	 *
	 */
	public void initialize() {
		
		if (!initialized) {
			
			initialized = true;

			timeBase = new TimeBase();
			solarCoordinates = new SolarCoordinates(timeBase);
			
			riseAndSetSvc = new RiseAndSetService(timeBase, solarCoordinates);
			riseAndSetSvc.setRefrac(-0.8333);
			riseAndSetSvc.setDeltaT(68.0);
			
			//  'solarCoordinates' im Takt aktualisieren 
			timeBase.attach((TimeBaseObserverInt)solarCoordinates);

			//  'riseAndSet' im Takt aktualisieren
			timeBase.attach((TimeBaseObserverInt)riseAndSetSvc);
			
			//this.attach(riseAndSet);
			
			/* 2008-JAN-31  z35 'AlarmClock' ausgeschaltet 
			alarmClock = new AlarmClock(timeBase);
			alarmClock.start();
			*/
		}
		
	}
	
	/**
	 * 
	 *
	 */
	public void doFinialize() {

		if (!initialized) {
			
			if (alarmClock != null) {
			
				synchronized (this) {
					alarmClock.setKeepRunning(false);	
				}
				
				try {
					alarmClock.join();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				
			}
			
		}
		
	}

	////////////////////////////////////////////////////////////////////////////
	//  methodes of 'AlarmClock'
	////////////////////////////////////////////////////////////////////////////
	
	public void setAlarmClockSuspend(final boolean suspend) {
		if (alarmClock != null) {
			alarmClock .setSuspend(suspend);
		}
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  methodes of 'TimeBase'
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	public void addRollerClient(final TimeBaseObserverInt client) {
		timeBase.attach(client);
	}

	/**
	 * 
	 * @param client
	 */
	public void removeRollerClient(TimeBaseObserverInt client) {
		timeBase.detach(client);
	}
	
	/**
	 * 
	 * @return
	 */
	public double getGmst0() {
		return timeBase.getGmst0();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getGmst() {
		return timeBase.getGmst();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getJd() {
		return timeBase.getJD();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getJd0() {
		return timeBase.getJD0();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getJd2k0() {
		return timeBase.getJD2K0();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getJd2k() {
		return timeBase.getJD2K();
	}
	
	/**
	 * 
	 * @return
	 */
	public String getDateTime() {
		return timeBase.getDateTime();
	}
	
	/**
	 * @return
	 * @uml.property  name="riseAndSet"
	 */
	public RiseAndSetService getRiseAndSetSvc() {
		return riseAndSetSvc;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  methodes of 'SolarCoordinatesInt'
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	public double getRaOfSun() {
		return solarCoordinates.getRa();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getDeclOfSun() {
		return solarCoordinates.getDecl();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getTrueLonOfSun() {
		return solarCoordinates.getAppLon();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getRadiusVectorOfSun() {
		return solarCoordinates.getRadiusVector();
	}
	
	/**
	 * 
	 * @return
	 */
	public double getMeanObli() {
		return solarCoordinates.getMeanObli();
	}

	////////////////////////////////////////////////////////////////////////////
	//  methodes of 'TimeBase'
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	public void updateTimeBase() {
		timeBase.updateTimeBase(0);
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  methodes of 'RiseAndSetService'
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	public double getRise() {
		
		return riseAndSetSvc.getRise();
		
	}

	/**
	 * 
	 * @return
	 */
	public final double getTransit() {
		
		return riseAndSetSvc.getTransit();
		
	}
	
	/**
	 * 
	 */
	public double getSet() {
		
		return riseAndSetSvc.getSet();
		
	}
	
	/**
	 * 
	 * @return
	 */
	public final double getTimeOverHorizont() {
		return riseAndSetSvc.getTimeOverHorizont();
	}
	
	/**
	 * 
	 * @return
	 */
	public final int getState() {
		return riseAndSetSvc.getState();
	}
	
	
	////////////////////////////////////////////////////////////////////////////
	//  observer
	////////////////////////////////////////////////////////////////////////////

	/**
	 * @param observer
	 */
	synchronized public void attach(final SiteInfoObserverInt observer) {
		siteInfoObservers.addElement(observer);
	}
	
	/**
	 * 
	 * @param observer
	 */
	synchronized public void detach(final SiteInfoObserverInt observer) {
		siteInfoObservers.removeElement(observer);
	}
	
	/**
	 * 
	 */
	public void updateSiteInfoObserver(final SiteInfo siteInfo) {
		
//		System.out.println("PosasEngine.updateSiteInfoObserver");
		
		for (int i = 0; i < siteInfoObservers.size(); i++) {
			((SiteInfoObserverInt)siteInfoObservers.elementAt(i)).updateSiteInfoObserver(siteInfo);
		}
		
	}
	
 }
