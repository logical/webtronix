* IRTCLIB1.txt
* Models for PSpice
* Intuitive Research and Technology Corp
* www.irtc-hq.com
* Copyright 2007 - All Rights Reserved
*
* Models included:
* UC1845 - UC1845 PWM controller
* 555 - 555 timer - fixes problems with PSpice library model
* HCPL5201 - Optocoupler
* HCPL5230 - Dual Optocoupler
* UC1707 - Dual Channel Power Driver IC
* MAX707 - µP Supervisory IC
* TC4427 - Buffer/driver
* UCC1802 - PWM controller IC
* UCC1804 - PWM controller IC
* D1N3611 - 1N3611 diode
* OPAMPIB - near-ideal op amp macromodel
* OPAMPIC - near-ideal op amp macromodel
* BUFST - Schmitt trigger digital buffer macromodel
* VREGD - 3-terminal ideal regulator macromodel
* COMPI - near-ideal comparator
* ILOADB - current load macromodel
* EILIM - voltage source with current limit macromodel
*
* UC1845 PWM controller IC *
* connections: pins 1 - 8 sequential (8-pin pkge.)
.SUBCKT UC1845 COMP VFB CS RTCT GND OUT VCC VREF
R_R1         VCC GND  1.4k  
D_D7         GND VCC DZ34
R_R12         VCC $N_0001  10K  
R_R13         $N_0001 VREF  60K  
V_V1         $N_0002 GND DC 7.22V  
X_U21         $N_0003 $N_0004 $G_DPWR $G_DGND BUFST
X_U7         $N_0004 $N_0005  $G_DPWR $G_DGND INV
R_R8         $N_0006 0  1MEG  
C_C1         $N_0006 0  500p  
R_R7         $N_OUTST $N_0006  100  
D_D6         $N_0007 $N_0008 D1N3611 
D_D8         GND $N_0009 DZ1
D_D5         COMP $N_0007 D1N3611 
D_D9         VCC $N_0010 D1N3611 
E_E2         $N_0033 GND VREF GND 0.5
V_V5         $N_5V 0 DC 5V  
V_V5G         $N_5VG GND DC 5.1V  
X_U24         $N_0011 $N_0012 $G_DPWR $G_DGND BUFST
V_VOH         $N_0013 GND DC 2.5V  
X_U25         $N_0014 $N_0015 $G_DPWR $G_DGND BUFST
E_E1         $N_0003 0 VREF GND 1
V_VOL         $N_0016 GND DC 0.8V  
R_RO4         RTCT $N_0017  300  
C_C2         $N_0012 0  1p IC=4V 
X_U17         $N_0018 $N_0019 $G_DPWR $G_DGND BUFST
C_C3         $N_0019 0  1p IC=4V 
X_U26         $N_0001 $N_0002 $N_5VG GND VREF OPAMPIB PARAMS: VR=0.1
X_U27         $N_0016 RTCT $N_5V 0 $N_0011 OPAMPIB PARAMS: VR=0.1
X_U28         RTCT $N_0013 $N_5V 0 $N_0014 OPAMPIB PARAMS: VR=0.1
X_U30         CS $N_0009 $N_5V 0 $N_0018 OPAMPIB PARAMS: VR=0.1
X_U6         $N_0005 $N_0020 $N_0021 $N_0022 $N_OUTST $G_DPWR $G_DGND OR4
X_U15         $D_HI $D_LO $N_0019 $N_0020 $N_0025 $N_0022 $G_DPWR $G_DGND
+  DLATRSH
X_U31         $N_0026 $N_0020 $G_DPWR $G_DGND BUFST
X_UO3         $D_HI $D_LO $N_0012 $N_0015 $N_0026 $N_0029 $G_DPWR $G_DGND
+  DLATRSH
C_C4         $N_0030 0  1p IC=4V 
R_R14         $N_0030 0  1k  
X_U32         $D_HI $N_0020 $N_0030 $N_0021 $N_0032 $G_DPWR $G_DGND TFFRH
R_U33_Rp         $N_5VG GND  20K  
R_U33_RI1         $N_0033 0  1G  
R_U33_RI2         VFB 0  1G  
X_U33_H2    $N_0034 0 $N_0035 0 UC1845_H2 
C_U33_Cc         $N_0034 $N_0036  1000p  
E_U33_ABM45         $N_0036 0 VALUE { ((V($N_5VG,GND)-0.2)/{PI})*ATAN(4714*
+ {PI}*V($N_0035,0)/(V($N_5VG,GND)-0.2))+(V($N_5VG)+V(GND))/2    }
R_U33_Ro         $N_0036 COMP  20  
G_U33_ABM2I1         $N_0034 0 VALUE { LIMIT(7m*V($N_0033,VFB),-1m,1m) }
R_R4         $N_0008 $N_0009  10K  
R_R5         $N_0009 GND  5K  
X_SO1    $N_0026 0 $N_0017 GND UC1845_SO1 
X_S5    $N_0006 0 OUT GND UC1845_S5 
X_S6    $N_0006 0 $N_0010 OUT UC1845_S6 
.ENDS UC1845
*
.subckt UC1845_H2 1 2 3 4  
H_H2         3 4 VH_H2 -100
VH_H2         1 2 0V
.ends UC1845_H2
*
.subckt UC1845_SO1 1 2 3 4  
S_SO1         3 4 1 2 SW2ONA
RS_SO1         1 2 1G
.ends UC1845_SO1
*
.subckt UC1845_S5 1 2 3 4  
S_S5         3 4 1 2 SW2ONA
RS_S5         1 2 1G
.ends UC1845_S5
*
.subckt UC1845_S6 1 2 3 4  
S_S6         3 4 1 2 SW2OFFA
RS_S6         1 2 1G
.ends UC1845_S6
*
* 555 timer IC *
* connections: pins 1 - 8 sequential (8-pin pkge.)
.SUBCKT 555 GND TRIG OUT RES CTRL THR DIS VCC
R_R2         CTRL $N_0001  5K  
R_R3         $N_0001 GND  5K  
R_R1         VCC CTRL  5K  
V_V5         $N_5V 0 DC 5V  
X_U1         THR CTRL $N_5V 0 $N_0002 OPAMPIB PARAMS: VR=0.1
X_U2         $N_0001 TRIG $N_5V 0 $N_0003 OPAMPIB PARAMS: VR=0.1
E_E1         $N_0004 0 RES GND 1
X_U3         $N_0002 $N_0005 $G_DPWR $G_DGND BUFST
X_U4         $N_0003 $N_0006 $G_DPWR $G_DGND BUFST
X_U5         $N_0004 $N_0007 $G_DPWR $G_DGND BUFST
X_U6         $N_0007 $N_0008  $G_DPWR $G_DGND INV
X_U7         $N_0005 $N_0008 $N_0009 $G_DPWR $G_DGND OR2
X_U8         $D_HI $D_LO $N_0006 $N_0009 $N_0012 $N_0013 $G_DPWR $G_DGND
+  DLATRSH
C_C1         $N_0009 0  1p IC=4V 
R_R4         $N_0012 $N_0014  100  
R_R5         $N_0014 0  1MEG  
C_C2         $N_0014 0  500p  
D_D1         VCC $N_0015 D1N4148 
C_C4         $N_0015 OUT  1p  
C_C5         OUT GND  1p  
R_R6         $N_0012 $N_0016  100  
R_R7         $N_0016 0  1MEG  
C_C3         $N_0016 0  100p  
C_C6         DIS GND  1p  
X_S1    $N_0014 0 $N_0015 OUT 555_S1 
X_S2    $N_0014 0 OUT GND 555_S2 
X_S3    $N_0016 0 DIS GND 555_S3 
.ENDS 555
*
.subckt 555_S1 1 2 3 4  
S_S1         3 4 1 2 SW2OFFA
RS_S1         1 2 1G
.ends 555_S1
*
.subckt 555_S2 1 2 3 4  
S_S2         3 4 1 2 SW2ONA
RS_S2         1 2 1G
.ends 555_S2
*
.subckt 555_S3 1 2 3 4  
S_S3         3 4 1 2 SW2ONA
RS_S3         1 2 1G
.ends 555_S3
*
.PARAM PI=3.1416
*
* OPAMPIB near-ideal op amp *
* connections:   non-inverting input
*                | inverting input
*                | | positive power supply
*                | | | negative power supply
*                | | | | output
*                | | | | |
.SUBCKT OPAMPIB  1 2 3 4 5 PARAMS: VR=1
.PARAM AV=10K ; Open-loop gain
* VR = Rail-to-output voltage difference
* OUTPUT={(K2*ATAN(K1*V(1,2)))+VOFF}
* K2={(V(3)-V(4)-2*VR)/PI}, K1={AV/K2}, VOFF={(V(3)+V(4))/2}
Ri1 1  0  100Meg
Ri2 2  0  100Meg
Eo  6  0  VALUE={((V(3,4)-2*VR)/PI)*
+ ATAN(AV*PI*V(1,2)/(V(3,4)-2*VR))+(V(3)+V(4))/2}
Ro  6  5  10
Co  5  0  5p
Rp  3  4  50K
.ENDS OPAMPIB
*
* OPAMPIC near-ideal op amp *
* connections:   non-inverting input
*                | inverting input
*                | | positive power supply
*                | | | negative power supply
*                | | | | output
*                | | | | |
.SUBCKT OPAMPIC  1 2 3 4 5 PARAMS: VRP=1 VRN=1 AV=10K
* VRP = Positive rail-to-output voltage difference
* VRN = Negative rail-to-output voltage difference
* AV  = Open-loop gain
* OUTPUT={(K2*ATAN(K1*V(1,2)))+VOFF}
* K2={(V(3)-V(4)-VRP-VRN)/PI}, K1={AV/K2}
* VOFF={(V(3)+V(4)-VRP+VRN)/2}
Ri1 1  0  100Meg
Ri2 2  0  100Meg
Ci1 1  0  5p
Ci2 2  0  5p
Eo  6  0  VALUE={((V(3,4)-VRP-VRN)/PI)*
+ ATAN(AV*PI*V(1,2)/(V(3,4)-VRP-VRN))+(V(3)+V(4)-VRP+VRN)/2}
Ro  6  5  10
Co  5  0  5p
Rp  3  4  50K
.ENDS OPAMPIC
*
*  SCHMITT TRIGGER BUFFER *
.SUBCKT BUFST  I0  O
+	optional: DPWR=$G_DPWR DGND=$G_DGND
U1 BUF
+  DPWR  DGND
+  I0  O
+  D_DEF_ST IO_DEF_ST
.MODEL D_DEF_ST  UGATE
.MODEL IO_DEF_ST  UIO (
+	AtoD1="AtoD_STD_ST"	AtoD2="AtoD_STD_ST"
+	AtoD3="AtoD_STD_ST"	AtoD4="AtoD_STD_ST")
.ENDS BUFST
*
.MODEL SW2ONA VSWITCH(RON=0.01 ROFF=1E7 VON=2.5 VOFF=1.5)
*
.MODEL SW2OFFA VSWITCH(RON=0.01 ROFF=1E7 VON=1.5 VOFF=2.5)
*
.MODEL DZ1 D(BV=1 IBV=100u)
*
.MODEL DZ34 D(BV=34 IBV=100u)
*
.MODEL DZ13P5 D(BV=13.5 IBV=100u)
*
.MODEL D1N3611 D
+ IS=159.8E-9
+ N=1.797
+ RS=.1693
+ CJO=1.000E-12
+ M=.3333
+ VJ=.75
+ ISR=21.76E-9
+ BV=240
+ IBV=100.0E-6
+ TT=5.000E-9
*
* HCPL5201 Optocoupler *
.SUBCKT HCPL5201 DP DN VCC GND OUT
X_H1     $N_0001 DN $N_0002 GND HCPL5201_H1 
R_R1a    $N_0002 $N_0003  1K  
C_C1     $N_0004 GND  140p  
D_D1     DP $N_0001 DHCPL5230
R_R1b    $N_0003 $N_0004  1K  
D_D1Z    GND $N_0003 D5D
R_RFB1   $N_0004 OUT  60K  
V_VREF   $N_0005 GND DC 2.5V  
X_U1     $N_0004 $N_0005 VCC GND OUT OPAMPIC PARAMS: VRP=1.7 VRN=0.4
+  AV=1K
R_RP     GND VCC  1600  
.ENDS HCPL5201
*
.subckt HCPL5201_H1 1 2 3 4  
H_H1     3 4 VH_H1 5K
VH_H1    1 2 0V
.ends HCPL5201_H1
*
.MODEL DHCPL5230 D
+ IS=230.71E-24
+ N=1.1544
+ RS=1.0000E-3
+ EG=1.4200
+ CJO=20.0000E-12
+ M=.3333
+ VJ=.75
+ ISR=100.00E-12
+ NR=10
+ BV=10
+ IBV=100.00E-6
+ TT=5.0000E-9
*
.MODEL D5D D(BV=5 IBV=.1m)
*
* HCPL5230 Optocoupler *
.SUBCKT HCPL5230 D1P D1N D2P D2N VCC GND OUT1 OUT2
X_H1     $N_0001 D1N $N_0002 GND HCPL5230_H1 
X_H2     $N_0003 D2N $N_0004 GND HCPL5230_H2 
V_VREF   $N_0005 GND DC 2.5V  
R_R1a    $N_0002 $N_0006  1K  
R_R2a    $N_0004 $N_0007  1K  
C_C1     $N_0008 GND  140p  
C_C2     $N_0009 GND  140p  
D_D1     D1P $N_0001 DHCPL5230
D_D2     D2P $N_0003 DHCPL5230
X_U1     $N_0008 $N_0005 VCC GND OUT1 OPAMPIC PARAMS: VRP=1.7 VRN=0.4
+  AV=1K
X_U2     $N_0009 $N_0005 VCC GND OUT2 OPAMPIC PARAMS: VRP=1.7 VRN=0.4
+  AV=1K
R_R1b    $N_0006 $N_0008  1K  
R_R2b    $N_0007 $N_0009  1K  
D_D2Z    GND $N_0007 D5D
D_D1Z    GND $N_0006 D5D
R_RFB1   $N_0008 OUT1  60K  
R_RFB2   $N_0009 OUT2  60K  
R_RP     GND VCC  800  
.ENDS HCPL5230
*
.subckt HCPL5230_H1 1 2 3 4  
H_H1     3 4 VH_H1 5K
VH_H1    1 2 0V
.ends HCPL5230_H1
*
.subckt HCPL5230_H2 1 2 3 4  
H_H2     3 4 VH_H2 5K
VH_H2    1 2 0V
.ends HCPL5230_H2
*
* UC1707 Dual Channel Power Driver IC *
* connections: pins 1 - 16 sequential (exc. GND) (16-pin pkge.)
.SUBCKT UC1707 BI BNI LD GND OUTA SD VC STOPI STOPNI OUTB VIN ANI AI
E_E3         $N_0001 0 BNI GND 1
E_E4         $N_0002 0 BI GND 1
X_U5         $N_0001 $N_0003 $G_DPWR $G_DGND BUFST
X_U6         $N_0002 $N_0004 $G_DPWR $G_DGND BUFST
X_U8         $N_0003 $N_0005  $G_DPWR $G_DGND INV
V_V1         $N_0006 STOPI DC 0.13  
R_R1         $N_0007 SD  1k  
C_C1         $N_0008 0  1p IC=4V 
X_U11         $N_0009 $N_0010 $G_DPWR $G_DGND BUFST
X_U10         $D_HI $D_LO $N_0008 $N_0010 $N_0013 $N_0014 $G_DPWR $G_DGND
+  DLATRSH
R_R4         $N_0015 0  1MEG  
C_C3         $N_0015 0  500p  
X_U16         $N_0016 $N_0013 $N_0017 $G_DPWR $G_DGND OR2
X_U7         $N_0005 $N_0004 $N_0016 $G_DPWR $G_DGND OR2
R_R5         $N_0017 $N_0015  100  
E_E1         $N_0018 0 ANI GND 1
E_E2         $N_0019 0 AI GND 1
X_U1         $N_0018 $N_0020 $G_DPWR $G_DGND BUFST
X_U2         $N_0019 $N_0021 $G_DPWR $G_DGND BUFST
X_U3         $N_0020 $N_0022  $G_DPWR $G_DGND INV
R_R2         $N_0023 0  1MEG  
C_C2         $N_0023 0  500p  
X_U15         $N_0024 $N_0013 $N_0025 $G_DPWR $G_DGND OR2
R_R3         $N_0025 $N_0023  100  
X_U4         $N_0022 $N_0021 $N_0024 $G_DPWR $G_DGND OR2
R_R6         $N_5V $N_0007  5k  
X_U9         $N_0026 $N_0008 $G_DPWR $G_DGND BUFST
E_E6         $N_0009 0 SD GND 1
R_R8         $N_5V LD  30k  
X_S2    $N_0023 0 $N_0027 OUTA UC1707_S2 
X_S1    $N_0023 0 OUTA GND UC1707_S1 
X_S3    $N_0015 0 OUTB GND UC1707_S3 
X_S4    $N_0015 0 $N_0028 OUTB UC1707_S4 
X_U19         VIN $N_5V GND VREGD PARAMS: VO=5 IQ=10m VD=0.5
E_E5         $N_0026 0 LD GND 1
X_U20         STOPNI $N_0006 $N_5V GND $N_0007 GND COMPI
D_D3         VC $N_0027 D1N4148 
D_D4         VC $N_0028 D1N4148 
.ENDS UC1707
*
.subckt UC1707_S2 1 2 3 4  
S_S2         3 4 1 2 SW2OFFA
RS_S2         1 2 1G
.ends UC1707_S2
*
.subckt UC1707_S1 1 2 3 4  
S_S1         3 4 1 2 SW2ONA
RS_S1         1 2 1G
.ends UC1707_S1
*
.subckt UC1707_S3 1 2 3 4  
S_S3         3 4 1 2 SW2ONA
RS_S3         1 2 1G
.ends UC1707_S3
*
.subckt UC1707_S4 1 2 3 4  
S_S4         3 4 1 2 SW2OFFA
RS_S4         1 2 1G
.ends UC1707_S4
*
* TC4427 - Buffer/driver  *
.SUBCKT TC4427 IN OUT VDD GND
R_R3         $N_0001 GND  1Meg  
R_R1         $N_0002 OUT  7  
R_R2         IN $N_0001  100  
C_C1         $N_0001 GND  400p  
X_S1    $N_0001 GND VDD $N_0002 TC4427_S1 
X_S2    $N_0001 GND $N_0002 GND TC4427_S2 
.ENDS TC4427
*
.subckt TC4427_S1 1 2 3 4  
S_S1         3 4 1 2 SW2ONA
RS_S1         1 2 1G
.ends TC4427_S1
*
.subckt TC4427_S2 1 2 3 4  
S_S2         3 4 1 2 SW2OFFA
RS_S2         1 2 1G
.ends TC4427_S2
*
* 3-TERMINAL REGULATOR MACROMODEL WITH OUTPUT VOLTAGE PARAMETERS
* CONNECTIONS: INPUT
*              | OUTPUT
*              | | RTN
*              | | |         OUTPUT VOLTAGE
*              | | |         |    QUIESCENT CURRENT
*              | | |         |    |     dropout voltage
*              | | |         |    |     |
.SUBCKT VREGD  1 2 3 PARAMS: VO=5 IQ=1m VD=2
Eo  4  3  VALUE={LIMIT(VO,0,V(1,3)-VD)}
Rq  2  3  {VO/IQ} ; sets quiescent current
VS  4  2  0
Fi  1  3  VS  1
.ENDS VREGD
*
* Macro-model for ideal Comparator with Open Collector Output
* connections: non-inverting input
*              | inverting input
*              | | positive power supply
*              | | | negative power supply
*              | | | | output
*              | | | | | output rtn
.SUBCKT COMPI  2 1 3 4 5 6
.PARAM AV=10K ; Open-loop gain (adjustable)
.PARAM VR=0.1 ; Rail-to-driver voltage difference (adjustable)
.PARAM PI=3.1416
Ri1 1  0  100Meg
Ri2 2  0  100Meg
Eo  7  0 
+ VALUE={((V(3,4)-2*VR)/PI)*ATAN(AV*PI*V(1,2)/(V(3,4)-2*VR))+(V(3)+V(4))/2}
Ro  7  8  1K
Qo  5  8  6  Q2N2222
Rp  3  4  50K
.ENDS COMPI
*
* MAX707 µP Supervisory IC *
* connections: pins 1 - 5, 7, 8 sequential (8-pin pkge.)
.SUBCKT MAX707 MRn VCC GND PFI PFOn RESn RES
R_R1         VCC MRn  20K  
V_V1         $N_0001 GND DC 4.65  
X_U1         $N_0002 $N_0001 $N_5V 0 $N_0003 OPAMPIB PARAMS: VR=0.1
R_R5         VCC $N_0002  10K  
R_R6         $N_0002 $N_0003  1.2MEG  
X_S1    $N_0004 0 $N_0005 0 MAX707_S1 
V_V8         $N_0006 0 DC 6.32  
X_U29         $N_0005 $N_0006 $N_5V 0 $N_0015 OPAMPIB PARAMS: VR=0.1
R_U1_R1         $N_0011 0  1MEG  
C_U1_C1         $N_0011 0  500p  
R_U1_R2         $N_0015 $N_0011  100  
X_U1_S2    $N_0011 0 RESn GND MAX707_S1 
D_U1_D2         $N_0012 $N_0013 D1N3611 
X_U1_S1    $N_0011 0 $N_0013 RESn MAX707_S2 
D_U1_D1         VCC $N_0012 D1N3611 
X_U2_S1    $N_0014 0 RES GND MAX707_S2 
R_U2_R1         $N_0014 0  1MEG  
C_U2_C1         $N_0014 0  500p  
R_U2_R2         $N_0015 $N_0014  100  
D_U2_D1         VCC $N_0016 D1N3611 
X_U2_S2    $N_0014 0 $N_0017 RES MAX707_S1 
D_U2_D2         $N_0016 $N_0017 D1N3611 
V_V2         $N_0007 GND DC 1.25  
R_U3_R1         $N_0018 0  1MEG  
C_U3_C1         $N_0018 0  500p  
R_U3_R2         $N_0019 $N_0018  100  
X_U3_S2    $N_0018 0 PFOn GND MAX707_S1 
D_U3_D2         $N_0020 $N_0021 D1N3611 
X_U3_S1    $N_0018 0 $N_0021 PFOn MAX707_S2 
D_U3_D1         VCC $N_0020 D1N3611 
X_U2         PFI $N_0007 $N_5V 0 $N_0019 OPAMPIB PARAMS: VR=0.1
V_V7         $N_5V 0 DC 5  
V_V9         $N_10V 0 DC 10  
R_R7         $N_10V $N_0005  10K  
X_U16         $N_0008 $N_0009 $G_DPWR $G_DGND BUFST
X_U17         $N_0003 $N_0010 $G_DPWR $G_DGND BUFST
X_U27         $N_0009 $N_0010 $N_0004  $G_DPWR $G_DGND AND2
E_E1         $N_0008 0 MRn GND 1
R_XR1         RESn 0 1E24
R_XR2         RES 0 1E24
R_XR3         PFOn 0 1E24
R_XR4         MRn 0 1E24
R_R8         VCC GND  100K  
C_C1         $N_0005 0  20u IC=9.9V 
.ENDS MAX707
*
.subckt MAX707_S1 1 2 3 4  
S_S1         3 4 1 2 SW2OFFA
RS_S1         1 2 1G
.ends MAX707_S1
*
.subckt MAX707_S2 1 2 3 4  
S_S2         3 4 1 2 SW2ONA
RS_S2         1 2 1G
.ends MAX707_S2
*
* UCC1802 PWM controller IC *
* connections: pins 1 - 8 sequential (8-pin pkge.)
.SUBCKT UCC1802 COMP FB CS RC GND OUT VCC REF
R_RP         VCC GND  20K  
R_R3         $N_0002 $N_0001  20k  
R_R4         $N_0001 GND  20k  
R_RO1         $N_OUTD $N_0003  100  
R_RO2         $N_0003 0  1MEG  
C_CO         $N_0003 0  500p  
D_DZ1         GND $N_0001 DZ1
D_DZV         GND VCC DZ13P5
R_RD1         REF $N_REFh  1k  
V_VRVCC         $N_0004 GND DC 6.72V  
R_RD2         $N_REFh GND  1k  
X_U10         $N_REF0 $N_0005 $N_0006  $G_DPWR $G_DGND AND2
V_VROC         $N_0007 GND DC 1.5V  
X_U12         $D_HI $D_LO $N_0009 $N_0011 $N_0012 $N_0013 $G_DPWR $G_DGND
+  DLATRSH
X_U14         $N_0006 $N_0011  $G_DPWR $G_DGND INV
X_U15         $D_HI $D_LO $N_0009 $N_0016 $N_0017 $N_0018 $G_DPWR $G_DGND
+  DLATRSH
X_U16         $N_0006 $N_0019 $N_0009  $G_DPWR $G_DGND AND2
V_VRT1         $N_0020 0 DC 0.5V  
V_VRT2         $N_0021 0 DC 4V  
X_U19         $N_0012 $N_0017 $N_0022  $G_DPWR $G_DGND AND2
R_RB         $N_0022 $N_0023  10K  
Q_QC         $N_TSS $N_0023 0 Q2N2222
C_CTSS         $N_TSS 0  1.14uF  
X_U22         $N_REF0 $N_0013 $N_0024 $N_0025 $N_OUTD $G_DPWR $G_DGND AND4
D_D1         COMP $N_0002 D1N3611 
D_DO         VCC $N_0026 D1N3611 
X_U23         $D_LO $D_LO $N_OUTD $N_0031 $N_0032 $G_DPWR $G_DGND 74121
+  PARAMS: PULSE=140ns IO_LEVEL=0 MNTYMXDLY=0
V_V5         $N_5V 0 DC 5V  
E_E1         $N_REF0 0 REF GND 1
V_VREF         $N_0034 GND DC 5.125V  
E_ETSS         $N_TSSG GND $N_TSS 0 1
C_CCS         $N_CSBL GND  0.5p  
X_U7         $D_HI $D_LO $N_0036 $N_0038 $N_0025 $N_0039 $G_DPWR $G_DGND
+  DLATRSH
X_U8         $N_0040 $N_0004 $N_0034 GND REF OPAMPIC PARAMS: VRP=0.1 VRN=0.1
+  AV=100K
X_U11         $N_0007 $N_CSBL $N_5V 0 $N_0005 OPAMPIC PARAMS: VRP=0.1
+  VRN=0.1 AV=100K
X_U17         $N_0020 $N_TSS $N_5V 0 $N_0019 OPAMPIC PARAMS: VRP=0.1
+  VRN=0.1 AV=100K
X_U18         $N_TSS $N_0021 $N_5V 0 $N_0016 OPAMPIC PARAMS: VRP=0.1
+  VRN=0.1 AV=100K
X_U2         $N_REFh FB $N_TSSG GND $N_0041 OPAMPIC PARAMS: VRP=0.1 VRN=0.1
+  AV=100K
X_U3         $N_CSBL $N_0001 $N_5V 0 $N_0042 OPAMPIC PARAMS: VRP=0.1
+  VRN=0.1 AV=100K
R_R13         VCC $N_0040  10K  
R_R14         $N_0040 REF  11.5K  
X_UO1         RC $N_0043 $N_5V 0 $N_0044 OPAMPIC PARAMS: VRP=0.1 VRN=0.1
+  AV=100K
V_VOH         $N_0043 GND DC 2.5V  
R_RO4         RC $N_0045  125  
V_VOL         $N_0046 GND DC 0.2V  
X_EL1         COMP GND $N_0041 GND EILIM PARAMS:ILIMX=0.5m
X_U31         $N_0038 $N_0024  $G_DPWR $G_DGND INV
X_U32         $N_0047 $N_0038 $G_DPWR $G_DGND BUFST
X_U33         $N_0042 $N_0036 $G_DPWR $G_DGND BUFST
X_SL    $N_0003 0 OUT GND UCC1802_SL 
X_SH    $N_0003 0 $N_0026 OUT UCC1802_SH 
X_SBL    $N_0032 0 CS $N_CSBL UCC1802_SH 
X_SO1    $N_0047 0 $N_0045 GND UCC1802_SH 
X_X1         $N_REF0 $N_TSS ILOADB PARAMS: ID=1mA VD=0.2
C_C6         $N_0009 0  1p IC=4V 
C_C7         $N_0036 0  1p IC=4V 
C_C8         $N_0048 0  1p IC=4V 
X_UO2         $N_0046 RC $N_5V 0 $N_0048 OPAMPIC PARAMS: VRP=0.1 VRN=0.1
+  AV=100K
X_UO3         $D_HI $D_LO $N_0048 $N_0044 $N_0047 $N_0051 $G_DPWR $G_DGND
+  DLATRSH
.ENDS UCC1802
*
.subckt UCC1802_SL 1 2 3 4  
S_SL         3 4 1 2 SW2OFFA
RS_SL         1 2 1G
.ends UCC1802_SL
*
.subckt UCC1802_SH 1 2 3 4  
S_SH         3 4 1 2 SW2ONA
RS_SH         1 2 1G
.ends UCC1802_SH
*
.subckt ILOADB IN+ IN- PARAMS: ID=1 VD=1
J1  IN+ IN- IN- ILJ
.PARAM VTOI={-1*VD}
.PARAM BETI={ID/(VD*VD)}
.model ILJ NJF (VTO={VTOI} BETA={BETI})
.ends ILOADB
*
* Voltage Source with Current Limit, with Control Input
*              OUT+
*              |  OUT-
*              |  |  Output Voltage Control +
*              |  |  |  Output Voltage Control -
*              |  |  |  |          Limit Current
*              |  |  |  |          |
.SUBCKT EILIM  1  2  5  6  PARAMS: ILIMX=1m
HS  3  1  VD 1
ES  3  4  5  6  1 ; Controls Output Voltage
VS  4  2  0
DD  10 0  DX
HD  10 11 POLY(2) VS VL 0 -1MEG -1MEG
VD  0  11 0
VL  20 0  0
IL  0  20 {ILIMX} ; Limit Current
.MODEL DX D(IS=1E-15)
.ENDS EILIM
*
* UCC1804 PWM controller IC *
* connections: pins 1 - 8 sequential (8-pin pkge.)
.SUBCKT UCC1804 COMP FB CS RC GND OUT VCC REF
R_RP         VCC GND  20K  
R_R3         $N_0002 $N_0001  20k  
R_R4         $N_0001 GND  20k  
R_RO1         $N_OUTD $N_0003  100  
R_RO2         $N_0003 0  1MEG  
C_CO         $N_0003 0  500p  
D_DZ1         GND $N_0001 DZ1
D_DZV         GND VCC DZ13P5
R_RD1         REF $N_REFh  1k  
V_VRVCC         $N_0004 GND DC 6.72V  
R_RD2         $N_REFh GND  1k  
X_U10         $N_REF0 $N_0005 $N_0006  $G_DPWR $G_DGND AND2
V_VROC         $N_0007 GND DC 1.5V  
X_U12         $D_HI $D_LO $N_0009 $N_0011 $N_0012 $N_0013 $G_DPWR $G_DGND
+  DLATRSH
X_U14         $N_0006 $N_0011  $G_DPWR $G_DGND INV
X_U16         $N_0006 $N_0014 $N_0009  $G_DPWR $G_DGND AND2
V_VRT1         $N_0015 0 DC 0.5V  
V_VRT2         $N_0016 0 DC 4V  
X_U19         $N_0012 $N_0017 $N_0018  $G_DPWR $G_DGND AND2
R_RB         $N_0018 $N_0019  10K  
Q_QC         $N_TSS $N_0019 0 Q2N2222
C_CTSS         $N_TSS 0  1.14uF IC=4 
D_D1         COMP $N_0002 D1N3611 
D_DO         VCC $N_0020 D1N3611 
X_U23         $D_LO $D_LO $N_OUTD $N_0025 $N_0026 $G_DPWR $G_DGND 74121
+  PARAMS: PULSE=140ns IO_LEVEL=0 MNTYMXDLY=0
V_V5         $N_5V 0 DC 5V  
E_E1         $N_REF0 0 REF GND 1
V_VREF         $N_0028 GND DC 5.125V  
E_ETSS         $N_TSSG GND $N_TSS 0 1
C_CCS         $N_CSBL GND  0.5p  
X_U7         $D_HI $D_LO $N_0030 $N_0032 $N_0033 $N_0034 $G_DPWR $G_DGND
+  DLATRSH
X_U11         $N_0007 $N_CSBL $N_5V 0 $N_0005 OPAMPIC PARAMS: VRP=0.1
+  VRN=0.1 AV=100K
X_U17         $N_0015 $N_TSS $N_5V 0 $N_0014 OPAMPIC PARAMS: VRP=0.1
+  VRN=0.1 AV=100K
X_U18         $N_TSS $N_0016 $N_5V 0 $N_0035 OPAMPIC PARAMS: VRP=0.1
+  VRN=0.1 AV=100K
X_U3         $N_CSBL $N_0001 $N_5V 0 $N_0036 OPAMPIC PARAMS: VRP=0.1
+  VRN=0.1 AV=100K
R_R13         VCC $N_0037  10K  
R_R14         $N_0037 REF  11.5K  
X_UO1         RC $N_0038 $N_5V 0 $N_0039 OPAMPIC PARAMS: VRP=0.1 VRN=0.1
+  AV=100K
V_VOH         $N_0038 GND DC 2.5V  
R_RO4         RC $N_0040  125  
X_UO2         $N_0041 RC $N_5V 0 $N_0042 OPAMPIC PARAMS: VRP=0.1 VRN=0.1
+  AV=100K
V_VOL         $N_0041 GND DC 0.2V  
X_UO3         $D_HI $D_LO $N_0042 $N_0039 $N_0045 $N_0046 $G_DPWR $G_DGND
+  DLATRSH
X_EL1         COMP GND $N_0047 GND EILIM PARAMS:ILIMX=0.5m
X_U22         $N_REF0 $N_0013 $N_0048 $N_0049 $N_0033 $N_OUTD $G_DPWR
+  $G_DGND AND5
X_U33         $N_0032 $N_0049  $G_DPWR $G_DGND INV
X_U34         $N_0036 $N_0030 $G_DPWR $G_DGND BUFST
X_U35         $N_0045 $N_0032 $G_DPWR $G_DGND BUFST
X_U8         $N_0037 $N_0004 $N_0028 GND REF OPAMPIC PARAMS: VRP=0.1 VRN=0.1
+  AV=100K
X_U2         $N_REFh FB $N_TSSG GND $N_0047 OPAMPIC PARAMS: VRP=0.1 VRN=0.1
+  AV=100K
C_C6         $N_0030 0  1p IC=4V 
C_C7         $N_0042 0  1p IC=4V 
X_U15         $D_HI $D_LO $N_0009 $N_0035 $N_0017 $N_0052 $G_DPWR $G_DGND
+  DLATRSH
C_C5         $N_0009 0  1p IC=4V 
X_X1         $N_REF0 $N_TSS ILOADB PARAMS: ID=1mA VD=0.2
X_SL    $N_0003 0 OUT GND UCC1804_SL 
X_SH    $N_0003 0 $N_0020 OUT UCC1804_SH 
X_U36         $D_HI $N_0032 $N_0053 $N_0048 $N_0055 $G_DPWR $G_DGND TFFRH
R_R15         $N_0053 0  1k  
C_C8         $N_0053 0  1p IC=4V 
X_SO1    $N_0045 0 $N_0040 GND UCC1804_SH 
X_SBL    $N_0026 0 CS $N_CSBL UCC1804_SH 
.ENDS UCC1804
*
.subckt UCC1804_SL 1 2 3 4  
S_SL         3 4 1 2 SW2OFFA
RS_SL         1 2 1G
.ends UCC1804_SL
*
.subckt UCC1804_SH 1 2 3 4  
S_SH         3 4 1 2 SW2ONA
RS_SH         1 2 1G
.ends UCC1804_SH
*$
