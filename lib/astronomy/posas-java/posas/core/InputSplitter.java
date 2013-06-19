package de.z35.posas.core;

/**
 * @author  ufuchs
 */
public class InputSplitter {

	/**
	 * @uml.property  name="angle"
	 */
	double angle;
	/**
	 * @uml.property  name="lastErr"
	 */
	int lastErr;

	////////////////////////////////////////////////////////////////////////////
	//  constructor
	////////////////////////////////////////////////////////////////////////////

	/**
	 *
	 * @param s String
	 */
	public InputSplitter() {
		super();
	}

	////////////////////////////////////////////////////////////////////////////
	//  accessors
	////////////////////////////////////////////////////////////////////////////

	/**
	 * @return  - Winkel in DEG
	 * @uml.property  name="angle"
	 */
	public double getAngle() {
		return this.angle;
	}

	/**
	 * @return  - Letzter aufgetretener Fehler
	 * @uml.property  name="lastErr"
	 */
	public int getLastErr() {
		return this.lastErr;
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  functions, instance
	////////////////////////////////////////////////////////////////////////////

	/**
	 *
	 */
	public void splitLine(String rawLine) {

		//  input is like '13° 28' E'
		StringBuffer d = new StringBuffer();
		StringBuffer m = new StringBuffer();

		double min;
		double degree;
		int i;
		char c = ' ';
		int len;

		String line = rawLine.trim();
		len = line.length(); 
		
		if (len == 0)
			return;

		/* extract degrees */
		for (i = 0; i < len; i++) {
			c = line.charAt(i);
			// NOTE: Ein 'switch' greift hier nicht... (???) 
			if (c == '°') {
				i++;
				break;
			}
			d.append(c);
		}
		
		degree = Double.parseDouble(d.toString());		

		/* extract minutes */
		for (; i < len; i++) {
			c = line.charAt(i);
			switch (c) {
			case ' ':
				continue;
			case '\'':
				i++;
				break;
			default:
				m.append(c);
			}
		}

		min = Double.parseDouble(m.toString());

		if (degree < 0)
			min = -Math.abs(min);
		
		/* extract hemi */
		for (; i < len; i++) {
			c = line.charAt(i);
			if (c == ' ') {
				continue;
			}
			break;
		}

		// 'W' && 'N' liefern positives Resultat...
		if (!((c == 'W' || c == 'w') || (c == 'N' || c == 'n'))) {
			degree *= -1;
		}
		
		this.angle = degree + min; 

	}
	
	/**
	 * 
	 * @param str
	 * @return
	 */
	public static String[] split(String str) throws IllegalArgumentException{

		char c;
		int i = 0;
		int j = 0;
		int k = 0;
		
		str = str.trim();
		
		int len = str.length();
		
		if (len == 0)
			throw new IllegalArgumentException();
		
		char b[] = new char[len + 1];
		
		str.getChars(0, len, b, 0);
		b[len] = '\0';

		while ((c = b[i]) != '\0') {
			
			if (c == ' ') {
				j++;
			}
			
			i++;
			
		}
		
		String result[] = new String[j + 1];

		i = 0;
		j = 0;
		while ((c = b[i]) != '\0') {
			
			if (c == ' ') {
				result[k++] = new String(b, j, i - j);
				j = i + 1;
			}
			
			i++;
			
		}

		result[k] = new String(b, j, i - j);//.toUpperCase();
		
		return result;
		
	}
	
	
	
	
	
}
