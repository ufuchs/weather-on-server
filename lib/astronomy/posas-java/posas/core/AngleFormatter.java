/**
 * 
 */
package de.z35.posas.core;

import de.z35.util.MathEx;

/**
 * @author Uli Fuchs
 *
 */
public final class AngleFormatter {

	private static final StringBuffer sb = new StringBuffer(); 
	
	public static final char hemiLat[] = {'N', 'S'};
	public static final char hemiLon[] = {'W', 'E'};

	// modes of 'angle2Ddmm' 
	public static final int WITH_SIGN = 1;
	public static final int HEMI_LON = 2;
	public static final int HEMI_LAT = 4;
	public static final int HEMI_ALL = HEMI_LON | HEMI_LAT; 
	public static final int DELI_SPACE = 8;	
	
	
	// modes of 'angle2Time'
	public static final int TIME_ANALOG = 1;
	public static final int TIME_DIGITAL = 2;
	
	/**
	 * 
	 */
	private AngleFormatter() {
		// TODO Auto-generated constructor stub
	}

	/**
     * Formatiert einen Winkel mit Nachkommastellen auf einen Wert mit nur 
     * mit nur <code>decimals</code> Nachkommastellen.
     * <p>
     * Anwendung bei der Darstellung im UI.
     * <p>
     * Beispiel:    52.51° N = 52° 30.6' N
     * <t>
     *     angle	= 13.288888
     *     decimals	= 3
     *     return	= 13.289 
     * <p>
	 * @param 	angle	Winkel in DEG
	 * @return  Winkel in DEG mit <code>decimals</code> Nachkomma-Stellen  
	 */
	public static String angle2Decimal(final double angle,
			final int decimals) {
		// OK
		
		int j; 
		
		double multiplier = 1.0d;

		for (int i = 1; i <= decimals; i++) {
			multiplier *= 10.0d;
		}

		double x = (MathEx.round(angle * multiplier)) / multiplier;

		String s = Double.toString(x);		
		
		sb.setLength(0);

		sb.append(s);		
		
		for (j = 0; j < sb.length(); j++) {
			if (sb.charAt(j) == '.') {
				break;
			}
		}

		int targetLen = j + decimals;
		
		for (int k = sb.length(); k <= targetLen; k++) {
			sb.append('0');
		}
		
		return sb.toString();

	}
	
	/**
	 * Formatiert einen Winkel in Abhänigkeit von <code>mode</code>.
	 * WITH_SIGN	"-15° 47'"
	 * HEMI_LAT, 
	 * HEMI_LON		"15° 47' O"
	 * DELI_SPACE 	"15 47 O"
	 * <p>
	 * Anwendung bei der Darstellung im UI.
	 * <p>
	 * Beispiel: <t> angle = 13.47 return = 13° 28'
	 * <p>
	 * 
	 * @param angle
	 *            Winkel in DEG
	 * @return Winkel in DEG
	 */
	public static String angle2Ddmm(final double angle, final int mode) {
		// OK
		int theInt = (int) angle;

		double frac = Math.abs(angle) - Math.abs(theInt);

		frac *= 3600.0d;

		// Auf eine Nachkomma-Stelle formatieren
		frac = MathEx.round(frac) / 60.0d;
		
		// 2008-JAN-30 z35 Fixing this 41.93333333333333
//		frac = frac * 10;
//		
//		frac = MathEx.round(frac);
//		
//		frac = frac / 10.0d;
		
		//  Formatieren auf EINE Nachkommastelle
		frac = MathEx.round(frac * 10) / 10.0d;
		
		if ((mode & DELI_SPACE) != 0) {
			//  Ganzzahl-Ausgabe erwünscht
			frac = MathEx.round(frac);
		}

		////////////////////////////////////////////////////////////////////////
		// pre
		////////////////////////////////////////////////////////////////////////
		
		sb.setLength(0);

		if ((mode & WITH_SIGN) == 0) {
			//  kein Vorzeichen erwünscht
			theInt = Math.abs(theInt);
		}

		////////////////////////////////////////////////////////////////////////
		// process
		////////////////////////////////////////////////////////////////////////

		//
        // Degree
		//
		if ((theInt < 10.0) && (theInt > -10.0)) {
			sb.append("0");
		}
		sb.append(Integer.toString(theInt));

		if ((mode & DELI_SPACE) == 0) {
			//  Einheit erwünscht		
			sb.append("°");
		}
		sb.append(" ");
		
		//
        // Minutes
		//
		if ((frac < 10.0) && (frac > -10.0)) {
			sb.append("0");
		}
		
		if ((mode & DELI_SPACE) != 0) {
			//  Ganzzahl
			sb.append(Integer.toString((int)frac));	
		} else {
			//  Mit  Nachkomma-Anteil
			sb.append(Double.toString(frac));
		}

		if ((mode & DELI_SPACE) == 0) {		
			//  Einheit erwünscht
			sb.append("'");
		}
		
		////////////////////////////////////////////////////////////////////////
		// post
		////////////////////////////////////////////////////////////////////////
		
		if ( ((mode & WITH_SIGN) == 0) || ((mode & DELI_SPACE) != 0) ) {
			
			sb.append(" ");
			
			switch (mode & HEMI_ALL) {
			
			case HEMI_LON :
				sb.append(hemiLon[(angle < 0) ? 1 : 0]);
				break;
				
			case HEMI_LAT :
				sb.append(hemiLat[(angle < 0) ? 1 : 0]);
				break;
			}
			
		}
		
		return sb.toString();
		
	}
	
	/**
	 * Formatiert einen Winkel <code>angle</code> in Abhängigkeit von
	 * <code>mode</code> ins Zeit-Format.
	 * <p>
	 * Anwendung bei der Darstellung im UI.
	 * <p>
	 * 
	 * @param angle
	 *            Winkel in DEG
	 * @return Zeitangabe, z.B. "12h 23m 45s" || "12:24"
	 */
	public static String angle2Time(final double angle, final int mode) {
		
		//  TODO Zusammenfassen mit angle2Time_Hhmm_Digital
        final int[] hhmmss = MathEx.deg2Hhmmss(angle);

        int hour = hhmmss[MathEx.HOUR]; 
        
        int min = hhmmss[MathEx.MIN];
        
        int sec = hhmmss[MathEx.SEC];
        
        sb.setLength(0);
        
        ////////////////////////////////
        //  Rundungen
        ////////////////////////////////

        if (mode == TIME_DIGITAL) {        
        
	        // Rundung auf nächste Minute
	        if (sec > 30) {
	            min += 1;
	        }
	        
	        // Rundung auf nächste Stunde
	        if (min == 60) {
	            hour += 1;
	            min = 0;
	        }
	        
	        // Rundung auf nächsten Tag
	        if (hour == 24) {
	            hour = 0;
	        }
        
        }
        
        ////////////////////////////////////////////////////////////////////////
        //  Formatierungen
        ////////////////////////////////////////////////////////////////////////
        
        if (hour < 10) {
        	sb.append("0");
        }
        sb.append(Integer.toString(hour));
        
        switch (mode) {
        
        case TIME_ANALOG :
        	sb.append("h ");
        	break;

        case TIME_DIGITAL :
        	sb.append(":");
        	break;
        	
        }
        
        if (min < 10) {
        	sb.append("0");
        }
        sb.append(Integer.toString(min));

        if (mode == TIME_ANALOG) {
        	
	        sb.append("m ");
	        
	        if (sec < 10) {
	        	sb.append("0");
	        }
	        sb.append(Integer.toString(sec));
	
	        sb.append("s");        

        }
        
        return sb.toString();  

    }
   
}
