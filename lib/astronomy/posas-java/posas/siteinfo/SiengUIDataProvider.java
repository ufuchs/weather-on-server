/* ##############################################################################
# Title:       SiengUIDataProvider.java
# Description: Formatieren der Daten der SiteInfoEngine zur Ausgabe im UI
# Keywords:
# Partner:     z35@gmx.com <z35>
# Compiler:    JAVA 5
# Copyright:   Copyright(c) 2007-2008 Uli Fuchs
#
# maintenance history
# ---------------------
#
# 2008-JAN-10	z35	initial layout
################################################################################
# design issues
# --------------
################################################################################
#
# [ Das Verh�ngnis unserer Kultur ist, da� sie sich materiell viel st�rker ]
# [ entwickelt hat als geistig.                                            ]
# [                                                    -Albert SChweitzer- ]
#
##############################################################################*/
package de.z35.posas.siteinfo;

import de.z35.posas.core.AngleFormatter;

/**
 * 
 * @author fuchs
 *
 */
public class SiengUIDataProvider {

	private SiteInfoEngine sieng;

	//  production
	private StringBuffer sb;
	private SiteInfo si;

    ////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 
	 */
	public SiengUIDataProvider(SiteInfoEngine sieng) {
		
		super();
		
		this.sieng = sieng;
		
		initialize();
		
	}
	
	/**
	 *
	 */
	private void initialize() {
		
		sb = new StringBuffer();
		
	}
	
	////////////////////////////////////////////////////////////////////////////
	//  accessors
	////////////////////////////////////////////////////////////////////////////

	/**
	 * Liefert qualifizierten Namen in der Form 'Name@-13.42/52.50/GMT + 01h'
	 */
	public String getNameQualified() {

		determineDefSiteInfo();
		
    	sb.setLength(0);
    	
    	//  Name
    	sb.append(si.getName()).append("@");
    	
    	//  Longitude
    	sb.append(AngleFormatter.angle2Decimal(si.getLon(), 2)).append("�");
    	sb.append("/");

    	//  Latitude
    	sb.append(AngleFormatter.angle2Decimal(si.getLat(), 2)).append("�");
    	sb.append("/");
    	
    	//  Timezone
    	sb.append(si.getTzOffsAsString());    	
		
		return sb.toString();
		
	}
	

	
	/**
	 * Ermittelt aktuell benutzte <code>SiteInfo</code>
	 *
	 */
	private void determineDefSiteInfo() {
		
		this.si = sieng.getDefSiteInfo();
		
	}
}
