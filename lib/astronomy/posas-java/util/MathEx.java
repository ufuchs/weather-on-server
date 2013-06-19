package de.z35.util;


public final class MathEx {

	public static final double TWOPI = Math.PI + Math.PI;

	// NOVAS-C : 57.295779513082321	
	public static final double RAD2DEG = 180.0d / Math.PI;	
	// NOVAS-C : 206264.806247096355
	public static final double RAD2SEC = 180.0d * 3600.0d / Math.PI;	
	// NOVAS-C : 0.017453292519943296
	public static final double DEG2RAD = Math.PI / 180.0d;	
	
	public static final double SEC_PER_DEGREE = 240.0d;	
	
	public static final int DEG  = 1;
	public static final int RAD  = 2;	

	public static final int DEGREE = 0;
	public static final int HOUR   = 0;
	public static final int MIN    = 1;
	public static final int SEC    = 2;
	public static final int SIGN   = 3;
	
    /**
	  * Don't let anyone instantiate this class.
	  */
    private MathEx() {}
	
    /**
     * 
     * @param a
     * @return
     */
    public static double frac(final double a) {
    	return a - (int) a;
    }
    
    /**
	 * 
	 * @param a
	 *            int
	 * @param b
	 *            int
	 * @return int
	 */
	public static int floorDiv(int a, int b) {

		return (a >= 0) ? a / b : -((-a + b - 1) / b);
		
	}

	/**
	 * 
	 * @param a
	 * @return
	 */
	public static long round(final double a) {
		return (long) Math.floor(a + 0.5d);
	} 	
	
	/**
	 * 
	 * @param a
	 *            int
	 * @param b
	 *            int
	 * @return int
	 */
	public static int floorMod(int a, int b) {
		
		return (a >= 0) ? a % b : a + ((-a + b - 1) / b) * b;
		
	}
	
	/**
	 * 
	 * @param a
	 * @param y
	 * @return
	 */
	public static double fmod(final double a, final double n)
	{

		double f;
		
		if (n != 0.0) {

			/* return f such that x = i * y + f for some integer i
			   such that |f| < |y| and f has the same sign as x */
			
			f = a - n * Math.floor(a / n);

			if ((a < 0.0) != (n < 0.0)) {
				f = f - n;
			}
			
		} else {
			
			f = 0.0;
			
		}
		
		return f;
		
	}	
	
	/**
	 * MEEUS, (3.0) 
	 * @param values
	 * @return
	 */
	public static double interpol(final double[] values, final double n) {

		final double y2 = values[1];
		final double a = y2 - values[0];
		final double b = values[2] - y2;
	
		return y2 + (n / 2.0) * (a + b + n * (b - a)); 
		
	}
	
	/**
	 * Normalisiert einen auf einen Wert zwischen 0° und 360°
	 * @param angle
	 * @param base Moegliche Werte <code>TWOPI</code> oder <code>360.0</code> 
	 * @return
	 */
	public static double normalizeAngle(final double angle, final double base) {
		
		double result = MathEx.fmod(angle, base);

		if (result < 0.0) {
			result += base;
		}
		
		return result;
		
	}

	/**
	 * Konvertiert die Winkel- Parameter <code>deg</code>, <code>min</code>,
	 * <code>sec</code> in die Einheit RAD bzw. DEG in Abhängigkeit des 
	 * Parameters <code>toUnit</code>.
	 * <p>
	 * Der Wertebereich von <code>toUnit</code><sup>th</sup> erstreckt sich auf:
	 * <ul>
	 * <li> 1: DEG
	 * <li> 2: RAD
	 * </ul> 
	 * <p>
	 * Die ermittelte Dezimal-Darstellung wird im Falle von <code>toUnit</code>
	 * gleich DEG in den Bereich von 0 bis 360grad normaisiert.
	 * Im Falle von RAD erfolgt die Normalisierung in den Bereich von 0 bis 2Pi.
	 * <p>
	 * Issues: Check bei "-0° 32' 16''" schlägt fehl, da Null kein Vorzeichen
	 * besitzt. Fix laut MEEUS: Parameter als Zeichenkette übergeben.
	 * <p>
	 * @param	deg		grad-Teil des des zu konvertierenden Winkels
	 * @param	min		min-Teil des des zu konvertierenden Winkels
	 * @param	sec		sec-Teil des des zu konvertierenden Winkels
	 * @param	toUnit	Zieleinheit RAD || DEG
	 * @return	Decimal-Darstellung der übergebenen Parameter
	 */
	public static double ddmmss2Decimal(int deg, int min, int sec, int toUnit) {
		
		double result = 0.0d;
		
		if (deg < 0) {
			
			if (min > 0) {
				min *= -1;
			}
			if (sec > 0) {
				sec *= -1;
			}
		}
		
		switch (toUnit) {
		
		case RAD :

			result = ((sec + 60 * (min + 60 * deg)) * Math.PI) / 648000.0;
			//  result *= Math.PI / 648000.0;
			result = normalizeAngle(result, TWOPI);
			break;
		
		case DEG :
			
			result = deg + min / 60.0d + sec / 3600.0d;
			result = normalizeAngle(result, 360.0d);
			break;
		
		}
		
		return result;
		
	}
	
	/**
	 * Wandelt Winkel in Dezimalgrad in das Format DD° MM' SS'
	 * @param deg
	 * @return
	 */
	public static int[] deg2Ddmmss(final double deg) {
		
		int ddmmss[] = new int[4];

		ddmmss[SIGN] = (deg < 0.0) ? 1 : 0;
		
		final double degAbs = Math.abs(deg);
		
		final int dd = (int) degAbs;
		
		final double mmss = (degAbs - dd) * 60.0;
		
		ddmmss[DEGREE] = dd;
		ddmmss[MIN] = (int) MathEx.round(mmss) ;
		ddmmss[SEC] = 0;
		
		return ddmmss; 
	}
	
	/**
	 * Konvertiert den Winkel <code>angle</code> in das Zeitmass
	 * <code>hh:mm:ss</code>.
	 * 
	 * @param	angle   Winkel im Decimal-Format (z.B. '13.47')
	 * @return	int[]   [0] = hour, [1] = min, [2] = sec
	 */
    public static int[] deg2Hhmmss(final double deg) {
    	
        final int h = Math.abs((int) (deg * SEC_PER_DEGREE)); 

    	int hhmmss[] = new int[3];        
        
        hhmmss[HOUR] = h / 3600;
        hhmmss[MIN]  = h % 3600;
        hhmmss[SEC]  = hhmmss[MIN] % 60;
        hhmmss[MIN]  = hhmmss[MIN] / 60;
        
        return hhmmss;
        
    }
    
}
