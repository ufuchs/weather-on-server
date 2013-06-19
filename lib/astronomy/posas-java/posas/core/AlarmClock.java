package de.z35.posas.core;

/**
 * @author   ufuchs
 */
public final class AlarmClock extends Thread {

	/**
	 * @uml.property  name="sleepTime"
	 */
	private int sleepTime = 1000;
	private TimeBase tb;
	/**
	 * @uml.property  name="keepRunning"
	 */
	private boolean keepRunning = true;
	/**
	 * @uml.property  name="suspend"
	 */
	private boolean suspend = false;
	
	/**
	 * 
	 *
	 */
	public AlarmClock(final TimeBase tb) {
		
		super();
		this.tb = tb;
		
	}

	/**
	 * @param  lock
	 * @uml.property  name="suspend"
	 */
	public void setSuspend(final boolean suspend) {
		this.suspend = suspend;
	}
	
	/**
	 * @return
	 * @uml.property  name="sleepTime"
	 */
	public int getSleepTime() {
		return sleepTime;
	}
	
	/**
	 * @param  sleepTime
	 * @uml.property  name="sleepTime"
	 */
	public void setSleepTime(final int sleepTime) {
		this.sleepTime = sleepTime;
	}
	
	/**
	 * @param  keepRunning
	 * @uml.property  name="keepRunning"
	 */
	public void setKeepRunning(final boolean keepRunning) {
		this.keepRunning = keepRunning;
	}
	
	/**
	 * 
	 */
	public void run() {

		while (keepRunning) {
		
			try {
				Thread.sleep(sleepTime);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
	
			if (!suspend) {
				
				try {
					tb.updateTimeBase(0);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			
		}
		
	}
	
}
