﻿<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <head>
<!--    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
-->
    <link rel="stylesheet" type="text/css" media='screen and (min-width: 961px)' href='../css/xslexamend.css'></link>
    <link rel="stylesheet" type="text/css" media='screen and (max-width: 960px)' href='../css/xslexamenm.css'></link>
  </head>
  <body>
  <h2>Hollywood University cheat sheet</h2>
  <table>
    <tr>
      <th>Questions</th>
      <th>Options</th>
      <th>Solutions</th>
    </tr>
    <xsl:for-each select="quiz/question">
    <tr>
      <td><xsl:value-of select="title"/></td>
      <td>
<!--	<xsl:for-each select="answer">
	  <xsl:choose>
	    <xsl:when test="../type = 'text'">
	      <span>
	        <xsl:value-of select="text()"/>
	      </span>
	    </xsl:when>
	  </xsl:choose>
	</xsl:for-each>
	<xsl:for-each select="option">
	  <xsl:variable name="optposition" select="position()-1"/>

          <xsl:variable name="optiontext" select="text()"/>
	  <xsl:if test="$optiontext!=''">


	  <xsl:value-of select="text()"/>
	  <xsl:for-each select="../answer">
	    <xsl:variable name="correctanswer" select="text()"/>
	    <xsl:if test="$optposition=$correctanswer">   -->
<!--	      <span class='correct'>✓</span>   -->
<!--	      <span class='correct'><img src='../img/correct.png' alt='correct.png'/></span>
	    </xsl:if>
	  </xsl:for-each>
          <br/>

	  </xsl:if>

	</xsl:for-each>  -->

         <xsl:for-each select="option">
          <xsl:value-of select="position()-1"/>: <xsl:value-of select="text()"/><br/>
         </xsl:for-each>

      </td>
      <td>
       <xsl:for-each select="answer">
	<xsl:value-of select="text()"/>
	<br/>
       </xsl:for-each>       
      </td>

    </tr>
    </xsl:for-each>
  </table>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>