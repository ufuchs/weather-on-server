package de.z35.posas.core;

import de.z35.util.MathEx;
import henson.midp.Float11;

/**
 * @author   ufuchs
 */
public class SolarCoordinatesMeeus implements BodyCoordinatesInt, TimeBaseObserverInt {

	// Geometric mean longitude of the Sun
	/**
	 * @uml.property  name="meanLon"
	 */
	private double meanLon;
	
	/**
	 * @uml.property  name="meanAnomaly"
	 */
	private double meanAnomaly;
	
	/**
	 * @uml.property  name="eccentricity"
	 */
	private double eccentricity;
	
	/**
	 * @uml.property  name="equationOfCenter"
	 */
	private double equationOfCenter;
	
	/**
	 * @uml.property  name="trueLon"
	 */
	private double trueLon;
	
	/**
	 * @uml.property  name="trueAnomaly"
	 */
	private double trueAnomaly;
	
	/**
	 * @uml.property  name="appLon"
	 */
	private double appLon;
	
	/**
	 * @uml.property  name="radiusVector"
	 */
	private double radiusVector;
	
	/**
	 * @uml.property  name="omega"
	 */
	private double omega;
	
	/**
	 * @uml.property  name="meanObli"
	 */
	private double meanObli;
	
	/**
	 * @uml.property  name="corrObli"
	 */
	private double corrObli;	
	
	/**
	 * @uml.property  name="ra"
	 */
	private double ra;
	
	/**
	 * @uml.property  name="decl"
	 */
	private double decl;
	
	// input
	private TimeBase tb;
	
	/**
	 * 
	 * @param tb
	 */
	public SolarCoordinatesMeeus(final TimeBase tb) {
		this.tb = tb;
	}

	////////////////////////////////////////////////////////////////////////////
	//  production
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @return  the appLon
	 * @uml.property  name="appLon"
	 */
	public final double getAppLon() {
		return appLon;
	}

	/**
	 * @return  the decl
	 * @uml.property  name="decl"
	 */
	public final double getDecl() {
		return decl;
	}

	/**
	 * @return  the eccentricity
	 * @uml.property  name="eccentricity"
	 */
	public final double getEccentricity() {
		return eccentricity;
	}

	/**
	 * @return  the equationOfCenter
	 * @uml.property  name="equationOfCenter"
	 */
	public final double getEquationOfCenter() {
		return equationOfCenter;
	}

	/**
	 * @return  the meanAnomaly
	 * @uml.property  name="meanAnomaly"
	 */
	public final double getMeanAnomaly() {
		return meanAnomaly;
	}

	/**
	 * @return  the meanLon
	 * @uml.property  name="meanLon"
	 */
	public final double getMeanLon() {
		return meanLon;
	}

	/**
	 * @return  the meanObli
	 * @uml.property  name="meanObli"
	 */
	public final double getMeanObli() {
		return meanObli;
	}

	/**
	 * @return  the corrObli
	 * @uml.property  name="corrObli"
	 */
	public final double getCorrObli() {
		return corrObli;
	}
	
	
	/**
	 * @return  the omega
	 * @uml.property  name="omega"
	 */
	public final double getOmega() {
		return omega;
	}

	/**
	 * @return  the ra
	 * @uml.property  name="ra"
	 */
	public final double getRa() {
		return ra;
	}

	/**
	 * @return  the radiusVector
	 * @uml.property  name="radiusVector"
	 */
	public final double getRadiusVector() {
		return radiusVector;
	}

	/**
	 * @return  the trueAnomaly
	 * @uml.property  name="trueAnomaly"
	 */
	public final double getTrueAnomaly() {
		return trueAnomaly;
	}

	/**
	 * @return  the trueLon
	 * @uml.property  name="trueLon"
	 */
	public final double getTrueLon() {
		return trueLon;
	}

	/**
	 * <font color="#0000ff">L<sub>0</sub></font> Geometric mean longitude of the Sun,
	 * referred to the ecliptic, measured from the vernal equinox.
	 * <p>
	 * MEEUS, (25.2)
	 *
	 */
	private void computeMeanLon(final double T) {
		
		final double C0 = 280.46646;
		final double C1 = 36000.76983; 
		final double C2 = 0.0003032;
		
		meanLon = MathEx.normalizeAngle(C0 + T * (C1 + T * C2), 360.0); 
		
	}

	/**
	 * <font color="#0000ff">M</font> The mean anomaly is the angular difference 
	 * between a mean circular orbit and the true elliptic orbit.
	 * <p>
	 * MEEUS, (25.3)
	 *
	 */
	private void computeMeanAnomaly(final double T) {
		
		final double C0 = 357.52911;
		final double C1 = 35999.05029; 
		final double C2 = 0.0001537;
		
		meanAnomaly = MathEx.normalizeAngle((C0 + T * (C1 - T * C2)), 360.0); 
		
	}

	/**
	 * <font color="#0000ff">e</font> Eccentricity of the orbit of the Earth 
	 * around the Sun
	 * <p>
	 * The eccentricity is the ratio between the semi-major axis and the 
	 * difference between the semi-major and semi-minor axis of the elliptic 
	 * orbit of the Earth around the Sun.
	 * <p> 
	 * MEEUS, (25.4)
	 *  
	 * @param T
	 */
	private void computeEccentricity(final double T) {
		
		final double C0 = 0.016708634;
		final double C1 = 0.000042037;
		final double C2 = 0.0000001267;
		
		eccentricity = C0 - T * (C1 - T * C2);
		
	}

	
	/**
	 * <font color="#0000ff">C</font>
	 * Equation of the center 
	 */
	private void computeEquationOfCenter(final double T) {
		
		final double M = meanAnomaly * MathEx.DEG2RAD; 
		
		final double T0 = (1.914602 - T * (0.004817 - T * 0.000014)) * Math.sin(M);
		
		final double T1 = (0.019993 - T * 0.000101) * Math.sin(2 * M);
		
		final double T2 = 0.000289 * Math.sin(3 * M); 
		
		equationOfCenter = (T0 + T1 + T2);
		
	}
	
	/**
	 * True longitude of the Sun
	 *
	 */
	private void computeTrueLon() {
		
		trueLon = meanLon + equationOfCenter;
		
	}
	
	/**
	 * True anomaly of the Sun
	 *
	 */
	private void computeTrueAnomaly() {
		
		trueAnomaly = meanAnomaly + equationOfCenter;
		
	}

	
	/**
	 * The distance from a planet (here is the Earth) to the Sun, expressed in AU. AU (Astronomical Unit) is the mean distance of the Earth from the Sun, about 150 millions Kms.
	 *
	 */
	private void computeRadiusVector() {
		
		final double nom = 1.000001018 * (1 - (eccentricity * eccentricity));
		
		final double denom = 1 + eccentricity * Math.cos(trueAnomaly * MathEx.DEG2RAD);
		
		radiusVector = nom / denom;
		
	}
	
	/**
	 * 
	 * Longitude of the Moon's ascending node
	 * <p>
	 * MEEUS, (25.5+), wird nicht unter diesem Stichwort erwähnt.
	 */
	private void computeOmega(final double T) {
		
		omega = 125.04452 - T * (1934.136261 + T * (0.0020708 + T * (1.0 / 450000.0)));
		
//		omega = TrigoEx.normalizeAngle(omega, 360.0);
		
	}
	
	/**
	 * Apperant longitude of Sun
	 * 
	 * MEEUS, (25.5+)
	 *
	 */
	private void computeAppLon() {
		
		appLon = trueLon - 0.00569 - 0.00478 * Math.sin(omega * MathEx.DEG2RAD);
		
	}
	
	/**
	 * mean obliquity of the ecliptic.
	 * <p>
	 * MEEUS, (22.2)
	 * "The adjective 'mean' indicates that the correction for nutation is NOT taken into account!"
	 */
	private void computeMeanObliquity(final double T) {
		// (3)
		//  23° 26' 21''.448 in arcsec's
		//  = 23 * 3600'' + 26 * 60'' + 21.448''
		//  = 82800'' + 1560'' + 21.448''
		//  = 84381.448
        final double C1 = 84381.448d;  // 23° 26' 21''.448 in arcsec's        
        final double C2 = 46.8150d;
        final double C3 = 0.00059d;        
        final double C4 = 0.001813d;
        
        //  (22.2)
        meanObli = ((C1 -  T * (C2 - T * (C3 + T * C4))) / 3600.0);
		
	}

	/**
	 * 
	 * @param T
	 */
	private void computeCorrObliquity(final double T) {
        
        //  (25.8)
        corrObli = meanObli + .00256 * Math.cos(omega * MathEx.DEG2RAD);
		
	}
	
	
	/**
	 * 
	 */
	private void computeRightAscensionAndDeclination() {
		
		//  (4)
		final double sinAppLon = Math.sin(appLon * MathEx.DEG2RAD); 
		
		final double radCorrObli = corrObli * MathEx.DEG2RAD;
		
		double rigthAsc = Float11.atan2((Math.cos(radCorrObli) * sinAppLon), 
				Math.cos(appLon * MathEx.DEG2RAD));
		
		ra = MathEx.normalizeAngle(rigthAsc  * MathEx.RAD2DEG, 360.0);
		
		//  (5)
		decl = Float11.asin(Math.sin(radCorrObli) * sinAppLon) * MathEx.RAD2DEG;
		
	}
	
	/**
	 * 
	 * @param jd2k0
	 */
	public void computeEphemerides(final double jd2k0) {
		
		final double T = jd2k0 / 36525.0;
		
		computeMeanLon(T);
		computeMeanAnomaly(T);
		computeEccentricity(T);
		computeEquationOfCenter(T);
		computeTrueLon();
		computeTrueAnomaly();
		computeRadiusVector();
		computeOmega(T);
		computeAppLon();
		computeMeanObliquity(T);
		computeCorrObliquity(T);
		computeRightAscensionAndDeclination();
		
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  production
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	public void updateTimeBaseObservers() {
		computeEphemerides(tb.getJD2K0());
	}
	
}
