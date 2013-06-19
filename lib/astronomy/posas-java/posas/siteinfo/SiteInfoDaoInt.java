/**
 * 
 */
package de.z35.posas.siteinfo;

import java.io.IOException;
import java.util.*;

/**
 * @author Uli Fuchs
 *
 */
public interface SiteInfoDaoInt  {

	Vector retrieveAll(Vector locations) throws Exception;
	
	void updateAll(Vector locations) throws IOException;
}
