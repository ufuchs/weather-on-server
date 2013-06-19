package de.z35.util;

import javax.microedition.lcdui.Image;

public final class Commons {

	public static final String XML_PREAMPLE = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>";
	
	/**
	 * 
	 * @param name
	 * @param value
	 * @return
	 */
	public static String addAttr(String name, String value) {
		
		StringBuffer xml = new StringBuffer(); 
		
		xml.append(" ");
		xml.append(name);			
		xml.append("=\"");
		xml.append(value);
		xml.append("\"");
		
		return xml.toString();
		
	}
	
    /**
     * 
     * @param filename
     * @return
     */
    public static Image createImage(final String filename)
    {
        Image image = null;
        try {
			image = Image.createImage(filename);
		} catch (java.io.IOException ex) {
			// just let return value be null
		}
        return image;
    }
	
}
