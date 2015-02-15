*
.SUBCKT BAT54 1 3 
* The Resistor R1 does not reflect 
* a physical device.  Instead it
* improves modeling in the reverse 
* mode of operation.
*
R1 1 3 3.6E+07 
D1 1 3 BAT54  
*
.MODEL BAT54 D( 
+    IS = 2.117E-07 
+    N = 1.016 
+    BV = 36 
+    IBV = 1.196E-06 
+    RS = 2.637 
+    CJO = 1.114E-11 
+    VJ = 0.2013 
+    M = 0.3868 
+    FC = 0 
+    TT = 0 
+    EG = 0.69 
+    XTI = 2) 
*
.ENDS BAT54