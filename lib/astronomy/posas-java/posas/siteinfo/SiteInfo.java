package de.z35.posas.siteinfo;

//import de.z35.util.TrigoEx;


/**
 * Daten-Container für Ortsangaben
 * @author  Uli Fuchs
 */
public final class SiteInfo {

	public final static int UNTOUCHED = 0;
	public final static int INSERTED = 1;
	public final static int CHANGED = 2;
	public final static int DROPPED = 4;
	public final static int WAS_CHANGED = INSERTED | CHANGED | DROPPED;   
	
	//  Zum Auseinanderhalten der TextField-Eingaben
	public final static int LAT = 1;
	public final static int LON = 2;
	
	private int state;
	
    //  Ort, e.g. 'Berlin'
    /**
	 * @uml.property  name="name"
	 */
    private String name;
    //  Länge, Repräsentation in e.g. '13.47°' 
    /**
	 * @uml.property  name="lon"
	 */
    private double lon = Double.NaN;
    //  Breite, Repräsentation in e.g. '52.30°'
    /**
	 * @uml.property  name="lat"
	 */
    private double lat = Double.NaN;
    //  Offset in Stunden zur UTC + 00h
    /**
	 * @uml.property  name="tzOffs"
	 */
    private int tzOffs = 0;
    //  Sommerzeit
    /**
	 * @uml.property  name="dayLightSaving"
	 */
    private int dayLightSaving = 0;

    ////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////

    /**
     * 
     */
    public SiteInfo() {
    	super();
    }

    /**
     * 
     * @param name
     * @param lon
     * @param lat
     * @param tzOffs
     * @param dayLightSaving
     */
    public SiteInfo(final String name, final double lon, final double lat, final int tzOffs, 
    		final int dayLightSaving) 
    		throws IllegalArgumentException {
    	
    	super();
    	setName(name);
    	setLon(lon);
    	setLat(lat);
    	setTzOffs(tzOffs);
    	setDayLightSaving(dayLightSaving);
    	
    }

    /**
     * copy constructor
     * @param location
     */
    public SiteInfo(final SiteInfo loc) 
    		throws IllegalArgumentException {

		this(loc.getName(), loc.getLon(), loc.getLat(), loc.getTzOffs(), loc
				.getDayLightSaving());

	}
    
    ////////////////////////////////////////////////////////////////////////////
    // accessors
    ////////////////////////////////////////////////////////////////////////////

    /**
     * 
     */
    public boolean getState(final int state) {
    	
    	int x = this.state & state;
    	
//    	return (this.state & state) == state;
    	return x != 0;
    	
    }
    
    /**
	 * Bezeichnung des Ortes auslesen
	 * @return  String- Repräsentation des Ortes
	 * @uml.property  name="name"
	 */
    public String getName() {
        return name;
    }

    /**
	 * Längengrad als Real auslesen
	 * @return  - Real- Repräsentation des Längengrades
	 * @uml.property  name="lon"
	 */
    public double getLon() {
        return lon;
    }

    /**
	 * Breitengrad auslesen
	 * @return  Real- Repräsentation des Breitengrades
	 * @uml.property  name="lat"
	 */
    public double getLat() {
        return lat;
    }

    /**
	 * Wahrheits-Wert der Sommerzeit als Boolean auslesen
	 * @return  Boolean- Repräsentation des Wahrheits-Wertes auslesen
	 * @uml.property  name="dayLightSaving"
	 */
    public int getDayLightSaving() {
        return dayLightSaving;
    }

    /**
	 * Zeitzonen-Offset auslesen
	 * @return  Integer- Repräsentation des Zeitzonen-Offsets
	 * @uml.property  name="tzOffs"
	 */
    public int getTzOffs() {
        return tzOffs;
    }

    /**
     * Zeitzonen-Offset als String auslesen
     * @return String- Repräsentation des Zeitzonen-Offsets
     */
    public String getTzOffsAsString() {
    	//  Sollte verschoben werden...
		StringBuffer s = new StringBuffer("UTC");
		
		int t = tzOffs;
		
		if (t < 0) {
			s.append(" - ");
			t *= -1; // Absolute-Wert bilden
		} else {
			s.append(" + ");
		}
		
		if (t < 10) {
			s.append("0"); // Führende Null einbringen
		}
		
		s.append(t).append("h");
		
		return s.toString();
		
	}
    
    ////////////////////////////////////////////////////////////////////////////
    // mutators
    ////////////////////////////////////////////////////////////////////////////

    /**
     * 
     */
    public void setState(final int state, final boolean enable) {

    	this.state = (enable) ? this.state | state : this.state & ~state;  
    	
    }
    
    /**
	 * Ort-Name übergeben
	 * @param val  - Bezeichnung des Ortes
	 * @uml.property  name="name"
	 */
    public void setName(final String val) 
    		throws IllegalArgumentException {
    	
    	if (val == null) {
    		throw new IllegalArgumentException();
    	}
    	
    	name = val.trim();
    	
    	if (name.equals("")) {
    		throw new IllegalArgumentException();
    	}
    	
    }

    /**
	 * Längengrad übergeben
	 * @param val  - Längengrad des Ortes
	 * @uml.property  name="lon"
	 */
    public void setLon(final double val) 
    		throws IllegalArgumentException {
    	
    	if ((val > 180.0d) || (val < -180.0d)) {
    		throw new IllegalArgumentException();
    	}
        lon = val;
        
    }

    /**
	 * Breitengrad übergeben
	 * @param val  - Breitengrad des Ortes
	 * @uml.property  name="lat"
	 */
    public void setLat(final double val) 
    		throws IllegalArgumentException {
    	
    	if ((val > 90.0d) || (val < -90.0d)) {
    		throw new IllegalArgumentException();
    	}
        lat = val;
        
    }
    
    /**
	 * Zeitzonen-Offset in Stunden übergeben
	 * @param val  - Zeitzonen-Offset( Osten negativ! )
	 * @uml.property  name="tzOffs"
	 */
    public void setTzOffs(final int val)
    		throws IllegalArgumentException {
    
    	if ((val > 12) || (val < -12)) {
    		throw new IllegalArgumentException();
    	}
        tzOffs = val;
    }

    /**
	 * Wahrheits-Wert der Sommerzeit übergeben  
	 * @param val  - Wahrheits-Wert
	 * @uml.property  name="dayLightSaving"
	 */
    public void setDayLightSaving(final int val)
    		throws IllegalArgumentException {
    	
    	if ((val > 1) || (val < 0)) {
    		throw new IllegalArgumentException();
    	}
    	
        dayLightSaving = val;
    }

    /**
     * Wahrheits-Wert der Sommerzeit in Char-Form übergeben
     * @param val - (Y)es oder (N)o
     */
    public void setDayLightSaving(final char val) 
    		throws IllegalArgumentException {
		switch (val) {
		case 'N':
		case 'n':
			dayLightSaving = 0;
			break;
		default:
			dayLightSaving = 1;
		}
	}

	////////////////////////////////////////////////////////////////////////////
	//  methodes
	////////////////////////////////////////////////////////////////////////////
    
    /**
	 * 
	 * @return
	 */
    public Object saveToMemento() {
    	return new Memento(name, lon, lat, tzOffs, dayLightSaving);
    }

    /**
     * 
     * @param m
     */
    public void restoreMemento(final Object o) {

    	final Memento m = (Memento) o; 
    	
    	name = m.getName();
    	lon = m.getLon();
    	lat = m.getLat();
    	tzOffs = m.getTzOffs();
    	dayLightSaving = m.getDayLightSaving();
    	
    }

    /**
     * 
     */
    public boolean equals(final SiteInfo siteInfo) {
    	
    	if (siteInfo == null) {
    		return false;
    	}
    	
    	return name.equals(siteInfo.getName());
    	
    }
    
    /**
	 * Memento, Gof, Object Behavioral, p.283
	 * @author  Uli Fuchs
	 */
    public final class Memento {

        //  Ort, e.g. 'Berlin'
        /**
		 * @uml.property  name="name"
		 */
        private String name;
        //  Länge, Repräsentation in e.g. '13.47°' 
        /**
		 * @uml.property  name="lon"
		 */
        private double lon;
        //  Breite, Repräsentation in e.g. '52.30°'
        /**
		 * @uml.property  name="lat"
		 */
        private double lat;
        //  Offset in Stunden zur UTC + 00h
        /**
		 * @uml.property  name="tzOffs"
		 */
        private int tzOffs;
        //  Sommerzeit
        /**
		 * @uml.property  name="dayLightSaving"
		 */
        private int dayLightSaving = 0;

        ////////////////////////////////////////////////////////////////////////
        // accessors
        ////////////////////////////////////////////////////////////////////////
        
        /**
		 * @return
		 * @uml.property  name="dayLightSaving"
		 */
        public int getDayLightSaving() {
        	return dayLightSaving;
        }
        
        /**
		 * @return
		 * @uml.property  name="name"
		 */
        public String getName() {
        	return name;
        }

        /**
		 * @return
		 * @uml.property  name="lon"
		 */
        public double getLon() {
        	return lon;
        }
        
        /**
		 * @return
		 * @uml.property  name="lat"
		 */
        public double getLat() {
        	return lat;
        }

        /**
		 * @return
		 * @uml.property  name="tzOffs"
		 */
        public int getTzOffs() {
        	return tzOffs;
        }
        
        /**
         * 
         * @param name
         * @param lon
         * @param lat
         * @param tzOffs
         * @param dayLightSaving
         */
        public Memento(final String name, final double lon, final double lat, final int tzOffs, 
        		final int dayLightSaving) {

        	super();
        	this.name = name;
        	this.lon = lon;
        	this.lat = lat;
        	this.tzOffs = tzOffs; 
        	this.dayLightSaving = dayLightSaving; 
        	
        }
        
    }  //  Memento
    
}
