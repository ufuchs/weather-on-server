package de.z35.posas.siteinfo;

import java.io.IOException;
import java.util.Vector;

public class SiteInfoDaoMock implements SiteInfoDaoInt {
	
	/**
	 * 
	 */
	public Vector retrieveAll(Vector locations) throws Exception {
		
		Vector siteInfos = new Vector();
		
		SiteInfo si;
		
		si = new SiteInfo("Berlin", -13.47, 52.50, 1, 0);
		
		siteInfos.addElement(si);

		si = new SiteInfo("Bad Elster", -12.14, 50.17d, 1, 0);
		
		siteInfos.addElement(si);
		
		/*
		si = new SiteInfo("Stuttgart", -9.18, 48.78, 1, 0);
		
		siteInfos.addElement(si);
		*/
		return siteInfos;
	}

	public void updateAll(Vector locations) throws IOException {
		// TODO Auto-generated method stub

	}

}
