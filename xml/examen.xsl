<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <head>
<!--    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
-->
<!--    <link rel="stylesheet" type="text/css" media='screen and (min-width: 961px)' href='../css/xslexamend.css'></link>
    <link rel="stylesheet" type="text/css" media='screen and (max-width: 960px)' href='../css/xslexamenm.css'></link>   -->
    <link rel="stylesheet" type="text/css" media='screen and (min-width: 961px)' href='css/xslexamend.css'></link>
    <link rel="stylesheet" type="text/css" media='screen and (max-width: 960px)' href='css/xslexamenm.css'></link>
  </head>
  <body>
  <h2>Hollywood University correction sheet</h2>
  <table>
    <tr>
      <th>Questions</th>
      <th>Options and Solutions</th>
      <th>Answers</th>
    </tr>
    <xsl:for-each select="quiz/question">
    <tr>
      <td><xsl:value-of select="title"/></td>
<!-- Options and correct ones  -->
      <td>
	<xsl:for-each select="answer">
	  <xsl:choose>
<!-- options type TEXT  -->
	    <xsl:when test="../type = 'text'">
	      <span>
	        <xsl:value-of select="text()"/>
	      </span>
	    </xsl:when>
	  </xsl:choose>
	</xsl:for-each>
<!-- options type different from TEXT  -->
	<xsl:for-each select="option">
	  <xsl:variable name="optposition" select="position()-1"/>
          <xsl:variable name="optiontext" select="text()"/>
	  <xsl:if test="$optiontext!=''">
	  <xsl:value-of select="text()"/>
	  <xsl:for-each select="../answer">
	    <xsl:variable name="correctanswer" select="text()"/>
	    <xsl:if test="$optposition=$correctanswer">
<!--	      <span class='correct'>✓</span>   -->
<!--	      <span class='correct'><img src='../img/correct.png' alt='correct.png'/></span>   -->
	      <span class='correct'><img src='img/correct.png' alt='correct.png'/></span>
	    </xsl:if>
	  </xsl:for-each>
          <br/>
	  </xsl:if>
	</xsl:for-each>
      </td>
<!-- Answers and correct ones  -->	    
      <td>
	<xsl:for-each select="useranswer">
	  <xsl:variable name="useranswers" select="text()"/>
	  <xsl:value-of select="text()"/>
	  <xsl:for-each select="../answer">
	    <xsl:choose>
<!-- answers type TEXT  -->
	      <xsl:when test="../type = 'text'">    
<!--	      <xsl:when test="(../type = 'text') or (../type = 'select') or (../type = 'radio')">  -->
	        <xsl:variable name="correctanswertext" select="text()"/>
	        <xsl:if test="$useranswers=$correctanswertext">
<!-- show correct sign -->
<!--	      <span class='correct'>✓</span>   -->
<!--	      <span class='correct'><img src='../img/correct.png' alt='correct.png'/></span>   -->
	      <span class='correct'><img src='img/correct.png' alt='correct.png'/></span>
	        </xsl:if>
<!-- show INcorrect sign  		      
	      <xsl:if test="$useranswers!=$correctanswertext">
	      <span class='incorrect'><img src='img/incorrect.png' alt='incorrect.png'/></span>
	      </xsl:if>   -->
		    </xsl:when>
	      <xsl:otherwise>
<!-- answers type other than TEXT  -->		    
	        <xsl:variable name="correctanswer" select="text()"/>
		      <xsl:if test="$useranswers=$correctanswer">    
<!-- show correct sign -->			
			      <span class='correct'><img src='img/correct.png' alt='correct.png'/></span>
	        	</xsl:if>
	      </xsl:otherwise>
	    </xsl:choose>
	  </xsl:for-each>

<!--	<xsl:if test="usercorrect">
	<xsl:if test="usercorrect='s'">
-->
<!-- show correct sign -->			
<!--	      <span class='correct'><img src='img/correct.png' alt='correct.png'/></span>
	</xsl:if>
	<xsl:if test="usercorrect='n'">
-->
<!-- show INcorrect sign -->			
<!--	      <span class='incorrect'><img src='img/incorrect.png' alt='incorrect.png'/></span>
	</xsl:if>
	</xsl:if>
-->
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
