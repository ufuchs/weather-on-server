package de.z35.posas.core;

public interface BodyCoordinatesInt {

	////////////////////////////////////////////////////////////////////////////
	//  accessors
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Rigth Ascension of Sun
	 */
	double getRa();
	
	/**
	 * Declination of Sun
	 */
	double getDecl();

	/**
	 * Apparent Longitude of Sun
	 */
	double getAppLon();
	
	/**
	 * Radius Vector of Sun
	 */
	double getRadiusVector();
	
	/**
	 * 
	 * @return
	 */
	double getMeanObli();
	
	////////////////////////////////////////////////////////////////////////////
	//  production
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 * @param jd2k0
	 */
	void computeEphemerides(double jd2k0);

	
}
