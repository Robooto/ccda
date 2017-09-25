/*
 * xslt.js
 *
 * Copyright (c) 2005-2008 Johann Burkard (<mailto:jb@eaio.com>)
 * <http://eaio.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
 
 /* 
 * Changes made 2016:
 * Copyright (c) 2016 Bryn Lewis (<mailto:brynlewis@intelsoft.com.au>)
 * Updates made to allow usage in Internet Explorer 11.
 * Adapted to load C-CDA secitons in viewer
 */

/**
 * Constructor for client-side XSLT transformations.
 * 
 * @author <a href="mailto:jb@eaio.com">Johann Burkard</a>
 * @version $Id: xslt.js,v 1.7 2008/08/29 21:22:55 Johann Exp $
 * @constructor
 */
var isIE=("ActiveXObject" in window)

export class Transformation {
    constructor() {

    }

    xml;
    
    xmlDoc;
    
    xslt;
    
    xsltDoc;

    callback;
    
    /**
     * Sort of like a fix for Opera who doesn't always get readyStates right.
     */
    transformed = false;
        
    /**
     * Returns the URL of the XML document.
     * 
     * @return the URL of the XML document
     * @type String
     */
    getXml() {
        this.xml;
    }
    
    /**
     * Returns the XML document.
     * 
     * @return the XML document
     */
    getXmlDocument() {
        this.xmlDoc
    }
    
    /**
     * Sets the URL of the XML document.
     * 
     * @param x the URL of the XML document
     * @return this
     * @type Transformation
     */
    setXml(x) {
        this.xml = x;
        return this;
    }
    
    /**
     * Returns the URL of the XSLT document.
     * 
     * @return the URL of the XSLT document
     * @type String
     */
    getXslt() {
        return this.xslt;
    }
    
    /**
     * Returns the XSLT document.
     * 
     * @return the XSLT document
     */
    getXsltDocument() {
        return this.xsltDoc;
    }
    
    /**
     * Sets the URL of the XSLT document.
     * 
     * @param x the URL of the XML document
     * @return this
     * @type Transformation
     */
    setXslt(x) {
        this.xslt = x;
        return this;
    }
    
    /**
     * Returns the callback function.
     * 
     * @return the callback function
     */
    getCallback() {
        return this.callback;
    }
    
    /**
     * Sets the callback function
     * 
     * @param c the callback function
     * @return this
     * @type Transformation
     */
    setCallback(c) {
        this.callback = c;
        return this;
    }
    
    /**
     * Sets the target element to write the transformed content to and <em>asynchronously</em>
     * starts the transformation process.
     * <p>
     * <code>target</code> is the ID of an element. 2DO
     * <p>
     * This method may only be called after {@link #setXml} and {@link #setXslt} have
     * been called.
     * <p>
     * Note that the target element must exist once this method is called. Calling
     * this method before <code>onload</code> was fired will most likely
     * not work.
     * 
     * @param target the ID of an element
     */
    transform(target, postTransform?) {
        // if (!browserSupportsXSLT()) {
		// 	alert('This browser does not support XSLT in javascript, so we cannot continue, sorry.')
        //    return;
        // }
        var str = /^\s*</;
        var t = this;

		var transformed = false;

		var xm: XMLHttpRequest;
        var xs: XMLHttpRequest;
        var xmXMLResponse;
        var xsXMLResponse;
		
        if (isIE) {
            var change = function() {
                var c = 4; // 'complete';
                if (xm.readyState == c && xs.readyState == c) {
                    window.setTimeout(function() {

						// var source = new ActiveXObject("Msxml2.DOMDocument.3.0");
						// source.async = false;
						// source.load(xml);
						// var stylesheet = new ActiveXObject("Msxml2.DOMDocument.3.0");
						// stylesheet.async = false
						// stylesheet.load("cda.xsl");
						// document.getElementById(target).innerHTML = source.transformNode(stylesheet)
                        // callback(t);
						
                    }, 50);
                }
            };

        }
        else {
            var change = () => {
                if(!xm && xs.readyState == 4 && !transformed) {
                    // var parser = new DOMParser();
                    // var xmlDoc = parser.parseFromString(xmXMLResponse, "application/xml");

                    this.xsltDoc = xs.responseXML;
                    var resultDoc;
                    var processor = new XSLTProcessor();
                                       
                    processor.importStylesheet(this.xsltDoc);
                    resultDoc = processor.transformToFragment(xmXMLResponse, document);

                    document.getElementById(target).innerHTML = '';
                    document.getElementById(target).appendChild(resultDoc);

                    this.callback()                    
                    transformed = true;
                }


                if (xm && xm.readyState == 4 && xs.readyState == 4 && !transformed) {
					if(xm.responseXML!=null)
						xmlDoc = xm.responseXML
					else{
						var parser = new DOMParser();
						var xmlDoc = parser.parseFromString(xmXMLResponse, "application/xml");
					}
                    this.xsltDoc = xs.responseXML;
                    var resultDoc;
                    var processor = new XSLTProcessor();
                                       
                    // if (typeof processor.transformDocument == 'function') {
                    //     // obsolete Mozilla interface
                    //     resultDoc = document.implementation.createDocument("", "", null);
                    //     processor.transformDocument(xm.responseXML, xs.responseXML, resultDoc, null);
                    //     var out = new XMLSerializer().serializeToString(resultDoc);
                    //     document.getElementById(target).innerHTML = out;
                    //     callback(t);
                    // }
                    //else {
                        processor.importStylesheet(this.xsltDoc);
                        resultDoc = processor.transformToFragment(xmlDoc, document);

                        // document.getElementById(target).innerHTML = '';
                        // document.getElementById(target).appendChild(resultDoc);

						this.callback(resultDoc)
                    //}
                    
                    transformed = true;
                }
            };

        }

		if (str.test(this.xml)) {
			xmXMLResponse = new DOMParser().parseFromString(this.xml, "text/xml");
			// if($(xm.responseXML.documentElement).text().indexOf('XML Parsing Error')>-1){
			// 	alert($(xm.responseXML.documentElement).text())
			// }
			// if($(xm.responseXML.documentElement).text().indexOf('This page contains the following errors:')>-1){
			// 	alert($(xm.responseXML.documentElement).text())
			// }
		}
		else {
			xm = new XMLHttpRequest();
			xm.onreadystatechange = change;
			try{
				xm.open("GET", this.xml,true);			
			}
			catch(e){alert(e)}
			xm.send(null);
		}

		if (str.test(this.xslt)) {
			xsXMLResponse = new DOMParser().parseFromString(this.xslt, "text/xml");
			change();
		}
		else {
			xs = new XMLHttpRequest();
			xs.onreadystatechange = change;
			xs.open("GET", this.xslt);
			xs.send(null);
		}

	}

}

/**
 * Returns whether the browser supports XSLT.
 * 
 * @return the browser supports XSLT
 * @type boolean
 */
// function browserSupportsXSLT() {
//     var support = false;
//     if (isIE) { // IE 5+
//         support = true;
//     }
//     else if (XMLHttpRequest != undefined && XSLTProcessor != undefined) { // Mozilla 0.9.4+, Opera 9+
//        var processor = new XSLTProcessor();
//        if (typeof processor.transformDocument == 'function') {
//            support = XMLSerializer != undefined;
//        }
//        else {
//            support = true;
//        }
//     }
//     return support;
// }
