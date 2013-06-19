package de.z35.posas.core;

import de.z35.util.MathEx;
import henson.midp.*;

/**
 * MEEUS, Chapter 25
 * @author   Uli Fuchs
 */
public class SolarCoordinates implements BodyCoordinatesInt, TimeBaseObserverInt {

	private static final double FACTOR = 1.0e-07;
	
	private static final double[] l = {
			
		403406.0,
		195207.0, 
		119433.0, 
		112392.0, 
		  3891.0, 
		  2819.0, 
		  1721.0, 
		     0.0, 
		   660.0, 
		   350.0, 
		   334.0, 
		   314.0, 
		   268.0, 
		   242.0, 
		   234.0, 
		   158.0, 
		   132.0, 
		   129.0, 
		   114.0, 
		    99.0, 
		    93.0, 
		    86.0, 
		    78.0, 
		    72.0, 
		    68.0, 
		    64.0, 
		    46.0, 
		    38.0, 
		    37.0, 
		    32.0, 
		    29.0, 
		    28.0, 
		    27.0, 
		    27.0, 
		    25.0, 
		    24.0, 
		    21.0, 
		    21.0, 
		    20.0, 
		    18.0, 
		    17.0, 
		    14.0, 
		    13.0, 
		    13.0, 
		    13.0, 
		    12.0, 
		    10.0, 
		    10.0, 
		    10.0, 
		    10.0
			     
			
	};

	private static final double[] r = {
			
		     0.0,
		-97597.0, 
		-59715.0, 
		-56188.0, 
		 -1556.0, 
		 -1126.0, 
		 -861.0, 
		 941.0, 
		 -264.0, 
		 -163.0, 
		 0.0, 
		 309.0, 
		 -158.0, 
		 0.0, 
		 -54.0, 
		 0.0, 
	   -93.0, 
	   -20.0, 
		 0.0, 
	   -47.0, 
		 0.0, 
		 0.0, 
	   -33.0, 
	   -32.0, 
		 0.0, 
	   -10.0, 
	   -16.0, 
		 0.0, 
		 0.0, 
		24.0, 
	   -13.0, 
		 0.0, 
		-9.0, 
		 0.0, 
	   -17.0, 
	   -11.0, 
		 0.0, 
		31.0, 
	   -10.0, 
		 0.0, 
	    -12.0, 
		  0.0, 
		 -5.0, 
		  0.0, 
		  0.0, 
		  0.0, 
		  0.0, 
		  0.0, 
		  0.0, 
		 -9.0
			
	};
	
	private static final double alpha[] = {
			
		4.721964,
		5.937458, 
		1.115589, 
		5.781616, 
		5.5474  , 
		1.5120  , 
		4.1897  , 
		1.163   , 
		5.415   , 
		4.315   , 
		4.553   , 
		5.198   , 
		5.989   , 
		2.911   , 
		1.423   , 
		0.061   , 
		2.317   , 
		3.193   , 
		2.828   , 
		0.52    , 
		4.65    , 
		4.35    , 
		2.75    , 
		4.50    , 
		3.23    , 
		1.22    , 
		0.14    , 
		3.44    , 
		4.37    , 
		1.14    , 
		2.84    , 
		5.96    , 
		5.09    , 
		1.72    , 
		2.56    , 
		1.92    , 
		0.09    , 
		5.98    , 
		4.03    , 
		4.27    , 
		0.79    , 
		4.24    , 
		2.01    , 
		2.65    , 
		4.98    , 
		0.93    , 
		2.21    , 
		3.59    , 
		1.50    , 
		2.55
			
	};
	
	private static final double[] nu = {
			
		1.621043,
		62830.348067, 
		62830.821524, 
		62829.634302, 
		125660.5691, 
		125660.9845, 
		62832.4766, 
		0.813, 
		125659.310, 
		57533.850, 
		-33.931, 
		777137.715, 
		78604.191, 
		5.412, 
		39302.098, 
		-34.861, 
		115067.698, 
		15774.337, 
		5296.670, 
		58849.27, 
		5296.11, 
		-3980.70, 
		52237.69, 
		55076.47, 
		261.08, 
		15773.85, 
		188491.03, 
		-7756.55, 
		264.89, 
		117906.27, 
		55075.75, 
		-7961.39, 
		188489.81, 
		2132.19, 
		109771.03, 
		54868.56, 
		25443.93, 
		-55731.43, 
		60697.74, 
		2132.79, 
		109771.63, 
		-7752.82, 
		188491.91, 
		207.81, 
		29424.63, 
		-7.99, 
		46941.14, 
		-68.29, 
		21463.25, 
		157208.40
			
	};

/*	
	private SolarTerm[] terms = 
		{
			new SolarTerm(403406.0,     0.0, 4.721964,     1.621043),
			new SolarTerm(195207.0, -97597.0, 5.937458, 62830.348067), 
			new SolarTerm(119433.0, -59715.0, 1.115589, 62830.821524), 
			new SolarTerm(112392.0, -56188.0, 5.781616, 62829.634302), 
			new SolarTerm(  3891.0,  -1556.0, 5.5474  , 125660.5691 ), 
			new SolarTerm(  2819.0,  -1126.0, 1.5120  , 125660.9845 ), 
			new SolarTerm(  1721.0,   -861.0, 4.1897  ,  62832.4766 ), 
			new SolarTerm(     0.0,    941.0, 1.163   ,      0.813  ), 
			new SolarTerm(   660.0,   -264.0, 5.415   , 125659.310  ), 
			new SolarTerm(   350.0,   -163.0, 4.315   ,  57533.850  ), 
			new SolarTerm(   334.0,      0.0, 4.553   ,    -33.931  ), 
			new SolarTerm(   314.0,    309.0, 5.198   , 777137.715  ), 
			new SolarTerm(   268.0,   -158.0, 5.989   ,  78604.191  ), 
			new SolarTerm(   242.0,      0.0, 2.911   ,      5.412  ), 
			new SolarTerm(   234.0,    -54.0, 1.423   ,  39302.098  ), 
			new SolarTerm(   158.0,      0.0, 0.061   ,    -34.861  ), 
			new SolarTerm(   132.0,    -93.0, 2.317   , 115067.698  ), 
			new SolarTerm(   129.0,    -20.0, 3.193   ,  15774.337  ), 
			new SolarTerm(   114.0,      0.0, 2.828   ,   5296.670  ), 
			new SolarTerm(    99.0,    -47.0, 0.52    ,  58849.27   ), 
			new SolarTerm(    93.0,      0.0, 4.65    ,   5296.11   ), 
			new SolarTerm(    86.0,      0.0, 4.35    ,  -3980.70   ), 
			new SolarTerm(    78.0,    -33.0, 2.75    ,  52237.69   ), 
			new SolarTerm(    72.0,    -32.0, 4.50    ,  55076.47   ), 
			new SolarTerm(    68.0,      0.0, 3.23    ,    261.08   ), 
			new SolarTerm(    64.0,    -10.0, 1.22    ,  15773.85   ), 
			new SolarTerm(    46.0,    -16.0, 0.14    ,  188491.03  ), 
			new SolarTerm(    38.0,      0.0, 3.44    ,   -7756.55  ), 
			new SolarTerm(    37.0,      0.0, 4.37    ,     264.89  ), 
			new SolarTerm(    32.0,    -24.0, 1.14    ,  117906.27  ), 
			new SolarTerm(    29.0,    -13.0, 2.84    ,   55075.75  ), 
			new SolarTerm(    28.0,      0.0, 5.96    ,   -7961.39  ), 
			new SolarTerm(    27.0,     -9.0, 5.09    ,  188489.81  ), 
			new SolarTerm(    27.0,      0.0, 1.72    ,    2132.19  ), 
			new SolarTerm(    25.0,    -17.0, 2.56    ,  109771.03  ), 
			new SolarTerm(    24.0,    -11.0, 1.92    ,   54868.56  ), 
			new SolarTerm(    21.0,      0.0, 0.09    ,   25443.93  ), 
			new SolarTerm(    21.0,     31.0, 5.98    ,  -55731.43  ), 
			new SolarTerm(    20.0,    -10.0, 4.03    ,   60697.74  ), 
			new SolarTerm(    18.0,      0.0, 4.27    ,    2132.79  ), 
			new SolarTerm(    17.0,    -12.0, 0.79    ,  109771.63  ), 
			new SolarTerm(    14.0,      0.0, 4.24    ,   -7752.82  ), 
			new SolarTerm(    13.0,     -5.0, 2.01    ,  188491.91  ), 
			new SolarTerm(    13.0,      0.0, 2.65    ,     207.81  ), 
			new SolarTerm(    13.0,      0.0, 4.98    ,   29424.63  ), 
			new SolarTerm(    12.0,      0.0, 0.93    ,      -7.99  ), 
			new SolarTerm(    10.0,      0.0, 2.21    ,   46941.14  ), 
			new SolarTerm(    10.0,      0.0, 3.59    ,     -68.29  ), 
			new SolarTerm(    10.0,      0.0, 1.50    ,   21463.25  ), 
			new SolarTerm(    10.0,     -9.0, 2.55    ,  157208.40  )
		};
*/
	//  production
	/**
	 * @uml.property  name="ra"
	 */
	private double ra;
	/**
	 * @uml.property  name="decl"
	 */
	private double decl;
	/**
	 * @uml.property  name="radiusVector"
	 */
	private double radiusVector;
	private double apparentLon;	
	/**
	 * @uml.property  name="meanObli"
	 */
	private double meanObli;
	
	// input
	private TimeBase tb;
	
	/**
	 * 
	 * @param tb
	 */
	public SolarCoordinates(final TimeBase tb) {
		this.tb = tb;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  accessors
	////////////////////////////////////////////////////////////////////////////

	/**
	 * Rigth Ascension of Sun
	 * @uml.property  name="ra"
	 */
	public double getRa() {
		return ra;
	}
	
	/**
	 * Declination of Sun
	 * @uml.property  name="decl"
	 */
	public double getDecl() {
		return decl;
	}

	/**
	 * True Longitude of Sun
	 */
	public double getAppLon() {
		return apparentLon;
	}
	
	/**
	 * True Longitude of Sun
	 * @uml.property  name="radiusVector"
	 */
	public double getRadiusVector() {
		return radiusVector;
	}

	/**
	 * True Longitude of Sun
	 * @uml.property  name="meanObli"
	 */
	public double getMeanObli() {
		return meanObli;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  production
	////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	private double computeApparentLon(final double U) {
		// (1)
		
		double sumLon = 0.0;
		double sumR = 0.0;		
		double arg;

		// Später mal in Thread schicken...
		for (int i = 0; i < 50; i++) {

			arg = alpha[i] + nu[i] * U;

			sumLon += l[i] * Math.sin(arg);

			sumR += r[i] * Math.cos(arg);			
			
		}
		
		apparentLon = MathEx.normalizeAngle(4.9353929 + 62833.1961680 * U 
				+ FACTOR * sumLon, MathEx.TWOPI);
		
		return sumR;
		
	}

	/**
	 *  
	 */
	private void computeRadiusVector(final double R) {
		// (2)		
		radiusVector = 1.0001026d + FACTOR * R;
		
	}
	
	/**
	 * mean obliquity of the ecliptic.
	 */
	private void computeMeanObliquity(final double U) {
		// (3)
        final double C1 = 84381.448d;  // 23° 26' 21''.448 in arcsec's        
        final double C2 = 46.8150d;
        final double C3 = 0.00059d;        
        final double C4 = 0.001813d;
        
        final double T = U * 100.0;
        
        //  (22.2)
        meanObli = (C1 -  T * (C2 - T * (C3 + T * C4))) / MathEx.RAD2SEC;
		
	}

	/**
	 * 
	 */
	private void computeRightAscensionAndDeclination() {
		
		//  (4)
		final double sinAppLon = Math.sin(apparentLon); 
		
		double rigthAsc = Float11.atan2((Math.cos(meanObli) * sinAppLon), 
				Math.cos(apparentLon));
		
		ra = MathEx.normalizeAngle(rigthAsc * MathEx.RAD2DEG, 360.0);
		
		//  (5)
		decl = Float11.asin(Math.sin(meanObli) * sinAppLon) * MathEx.RAD2DEG;
		
	}

	/**
	 * 
	 */
	public void updateTimeBaseObservers() {
		computeEphemerides(tb.getJD2K());
	}
	
	/**
	 * 
	 */
	public void computeEphemerides(final double jd2k0) {
		
		final double U = jd2k0 / 3652500.0;
		double sumR;
		
		sumR = computeApparentLon(U);
		computeRadiusVector(sumR);
		computeMeanObliquity(U);
		computeRightAscensionAndDeclination();
		
	}

	
}
