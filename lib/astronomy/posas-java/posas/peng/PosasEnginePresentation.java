package de.z35.posas.peng;

import de.z35.posas.core.AngleFormatter;
import de.z35.posas.core.RiseAndSet;

public class PosasEnginePresentation {

	String BELOW_HORIZ = "--:--";	
	String ABOVE_HORIZ = "**:**";
	String AU = "AU";
	
	PosasEngine peng;
	
	StringBuffer sb = new StringBuffer();
	
    ////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	public PosasEnginePresentation(PosasEngine peng) {
		
		super();
		
		this.peng = peng;
		
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  accessors
	////////////////////////////////////////////////////////////////////////////

	/**
	 * Date and time
	 */
	public String getDateTime() {
		
		return peng.getDateTime();

	}
	
	
	/**
	 * Julian date
	 */
	public String getJd() {
		
		return AngleFormatter.angle2Decimal(peng.getJd(), 5);
		
	}
	
	/**
	 * Julian day number since 2000-JAN-01 00:00
	 */
	public String getJd2k() {

		return AngleFormatter.angle2Decimal(peng.getJd2k(), 5);
		
	}
	
	/**
	 * Greenwich mean siderial time 
	 */
	public String getGmst() {
		
		return AngleFormatter.angle2Time(peng.getGmst(),
				AngleFormatter.TIME_ANALOG); 
		
	}
	
	/**
	 * True longitude of Sun
	 */
	public String getTrueLonOfSun() {
		
		sb.setLength(0);
		sb.append(AngleFormatter.angle2Decimal(peng.getTrueLonOfSun() * 180.0
				/ Math.PI, 5));
		sb.append("°");
		
		return sb.toString(); 
		
	}
	
	/**
	 * Radius vector of Sun
	 */
	public String getRadiusVectorOfSun() {
		
		sb.setLength(0);
		sb.append(AngleFormatter.angle2Decimal(peng.getRadiusVectorOfSun(), 4));
		sb.append(" ");
		sb.append(AU);
 
		return sb.toString(); 
		
	}

	/**
	 * Right ascant of Sun
	 */
	public String getRaOfSun(int how) {

		double d = peng.getRaOfSun();
		
		sb.setLength(0);

		switch (how) {
		
		case 1 : 
			
			sb.append(AngleFormatter.angle2Decimal(d, 5)).append("°");
			break;
			
		case 2 :
			
			sb.append(AngleFormatter.angle2Time(d, AngleFormatter.TIME_ANALOG));
			break;
		
		}
		
		return sb.toString();
		
	}

	/**
	 * Declination of Sun
	 */
	public String getDeclOfSun() {
 
		sb.setLength(0);
		
//		System.out.println(peng.getDeclOfSun());
		
		sb.append(AngleFormatter.angle2Ddmm(peng.getDeclOfSun(), AngleFormatter.HEMI_LAT));
//		sb.append("°");
		
		return sb.toString(); 
		
	}
	
	/**
	 * Rise time
	 */
	public String getRise() {
 
		String riseTime = BELOW_HORIZ;
		
		switch (peng.getState()) {
		
//		case RiseAndSet.ALL_DAY_BELOW_HORIZ :
//
//			riseTime = BELOW_HORIZ;
//			break;
		
		case RiseAndSet.RISE_AND_SET_ON_DAY :

			riseTime = AngleFormatter.angle2Time(peng.getRise() * 360.0,
					AngleFormatter.TIME_DIGITAL);
			break;
			
		case RiseAndSet.ALL_DAY_ABOVE_HORIZ :
			
			riseTime = ABOVE_HORIZ;
			break;
			
		}
		
		return riseTime; 
		
	}

	/**
	 * Transit time
	 */
	public String getTransit() {
 
		String transit = BELOW_HORIZ;
		
		switch (peng.getState()) {
		
//		case RiseAndSet.ALL_DAY_BELOW_HORIZ :
//			
//			transit = BELOW_HORIZ;
//			break;
		
		case RiseAndSet.RISE_AND_SET_ON_DAY :
			
			transit = AngleFormatter.angle2Time(peng.getTransit() * 360.0,
					AngleFormatter.TIME_DIGITAL);
			break;
			
		case RiseAndSet.ALL_DAY_ABOVE_HORIZ :
			
			transit = ABOVE_HORIZ;
			break;
			
		}
		
		return transit; 
		
	}
	
	/**
	 * Set time
	 */
	public String getSet() {

		String setTime = BELOW_HORIZ;
		
		switch (peng.getState()) {
		
//		case RiseAndSet.ALL_DAY_BELOW_HORIZ :
//			
//			setTime = BELOW_HORIZ;
//			break;
		
		case RiseAndSet.RISE_AND_SET_ON_DAY :
			
			setTime = AngleFormatter.angle2Time(peng.getSet() * 360.0,
					AngleFormatter.TIME_DIGITAL);
			break;
			
		case RiseAndSet.ALL_DAY_ABOVE_HORIZ :
			
			setTime = ABOVE_HORIZ;
			break;
			
		}
		
		return setTime; 
		
	}

	/**
	 * Transit time
	 */
	public String getTimeOverHorizont() {

		//  default 'ALL_DAY_BELOW_HORIZ'
		String timeAboveHoriz = "00:00";
		
		switch (peng.getState()) {
		
//		case RiseAndSet.ALL_DAY_BELOW_HORIZ :
//			
//			timeAboveHoriz = "00:00";
//			break;
		
		case RiseAndSet.RISE_AND_SET_ON_DAY :
			
			timeAboveHoriz = AngleFormatter.angle2Time(peng
					.getTimeOverHorizont(), AngleFormatter.TIME_DIGITAL);
			break;
			
		case RiseAndSet.ALL_DAY_ABOVE_HORIZ :
			
			timeAboveHoriz = "24:00";
			break;
			
		}
		
		sb.setLength(0);
		sb.append(timeAboveHoriz).append("h");
		
		return sb.toString(); 
		
	}
	
}
