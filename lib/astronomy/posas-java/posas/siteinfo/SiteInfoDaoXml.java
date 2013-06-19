package de.z35.posas.siteinfo;

import java.util.Vector;
import java.io.*;
import org.xml.sax.*;
import org.xml.sax.helpers.DefaultHandler;
import javax.xml.parsers.*;

import de.z35.sme.SmeRecordStore;
import de.z35.util.Commons;

public class SiteInfoDaoXml implements SiteInfoDaoInt {
	
	static final String LOCATIONS = "locations";
	static final String LOCATION = "location";	
	static final String NAME = "name";
	static final String COORDINATES = "coordinates";
	static final String LAT = "lat";
	static final String LON = "lon";
	static final String TIMEZONE = "timezone";	
	static final String OFFSET = "offset";

	/**
	 * 
	 * @par am is
	 */
	public SiteInfoDaoXml() {
		
		super();
		
	}

	/**
	 * 
	 */
	public Vector retrieveAll(Vector locations) throws Exception {
		
		locations.setSize(0);
		
		final byte[] xml = SmeRecordStore.retrieveLocations();
		
		final SAXParser saxParser = SAXParserFactory.newInstance().newSAXParser();
		
		saxParser.parse(new ByteArrayInputStream(xml), new EventHandler(locations));
		
		return locations;
		
	}

	/**
	 * 
	 * @param locations
	 */
	public void updateAll(Vector locations) throws IOException {

		StringBuffer xml = new StringBuffer();
		
		xml.append(Commons.XML_PREAMPLE);
		xml.append("<").append(LOCATIONS).append(">");
		
		for (int i = 0; i < locations.size(); i++) {
			
			SiteInfo l = (SiteInfo) locations.elementAt(i);
			
			if (l.getState(SiteInfo.DROPPED)) {
				continue;
			}

			//  <location name="Berlin">
			xml.append('<'); 
			xml.append(LOCATION);
			xml.append(Commons.addAttr(NAME, l.getName()));
			xml.append('>');

			//  <coordinates lon="13.47" lat="52.50"/>
			xml.append("<"); 
			xml.append(COORDINATES); 
			xml.append(Commons.addAttr(LON, Double.toString(l.getLon())));
			xml.append(Commons.addAttr(LAT, Double.toString(l.getLat())));
			xml.append("/>");			
			
			//  <timezone offset="1"/>
			xml.append("<"); 
			xml.append(TIMEZONE);
			xml.append(Commons.addAttr(OFFSET, Integer.toString(l.getTzOffs())));
			xml.append("/>");

			xml.append("</"); 
			xml.append(LOCATION); 
			xml.append(">");
			
		}
		
		xml.append("</").append(LOCATIONS).append(">");
		
		SmeRecordStore.updateAll(xml.toString().getBytes(), SmeRecordStore.LOCATIONS);
		
	}
	
	/**
	 * 2007-OCT-01  z35  Quelle: Aus Beispiel für S60 SDK
	 * 
	 * EventHandler extends DefaultHandler, which is the default base class for SAX2 event handlers.
	 * It utilises the following methods: startDocument(), startElement(), characters(), endElement() 
	 * and endDocument(). 
	 *
	 */
	public class EventHandler extends DefaultHandler {

		Vector locations;
		
		/**
		 * 
		 * @param locations
		 * @throws NullPointerException - falls <code>locations<code> = null
		 */
		public EventHandler(Vector locations) throws NullPointerException {
			
			if (locations == null)
				throw new NullPointerException();

			this.locations = locations;
			
		}
		
		/**
		 * 
		 */
	    public void startDocument() throws SAXException {}
	    
	    /**
	     * Receive notification of the start of an element.
	     * @param uri
	     * @param localName
	     * @param qName is the qualified name (with prefix), in this case "phone".
	     * @param attributes
	     */
	    public void startElement(String uri, String localName, String qName,
				Attributes attributes) throws SAXException {

	    	SiteInfo loc;    	
	    	
	    	if (LOCATIONS.equals(qName)) {
	    		//  Wurzel-Element getroffen
	    		return;
	    	}
	    	
			if (LOCATION.equals(qName)) {

				loc = new SiteInfo();

				loc.setName(attributes.getValue(NAME));

				locations.addElement(loc);

			} else {

				loc = (SiteInfo) locations.lastElement();

				if (qName.equals(COORDINATES)) {

					loc.setLon(Double.parseDouble(attributes.getValue(LON)));
					loc.setLat(Double.parseDouble(attributes.getValue(LAT)));

				} else if (qName.equals(TIMEZONE)) {
					
					loc.setTzOffs(Integer.parseInt(attributes.getValue(OFFSET)));				

				}
			}
			
		}

	    /**
		 * 
		 * @param ch
		 *            is an array of the characters to be parsed.
		 * @param start
		 *            is start value used for creating a String chars.
		 * @param length
		 *            is end value used for creating a String chars.
		 * @throws SAXException
		 * 
		 */
	    public void characters(char[] ch, int start, int length)
				throws SAXException {}

	    /**
		 * Receive notification of the end of an element. This method does only
		 * thing: it removes the object at the top of the stack (and would return
		 * that object as the value of this function).
		 * 
		 * @param uri
		 * @param localName
		 * @param qName
		 * @param attributes
		 * @throws SAXException
		 */
	    public void endElement(String uri, String localName, String qName,
				Attributes attributes) throws SAXException {}

	    /**
		 * Receive notification of the end of the document. A StringBuffer is
		 * created. The parsed data is appended to the StringBuffer and added to the
		 * MIDlet's Form by using MIDlet's alert() method.
		 * 
		 * @throws SAXException
		 */
	    public void endDocument() throws SAXException {}
		
	}
	

}
