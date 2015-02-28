* AD8630 SPICE Macro-model
* Description: Amplifier
* Generic Desc: 2.7/5V, CMOS, OP, Zero Drift, RRIO, 4X
* Developed by: RM / ADSiv
* Revision History: 08/10/2012 - Updated to new header style
* 1.0 (07/2010)
* Copyright 2010, 2012 by Analog Devices
*
* Refer to http://www.analog.com/Analog_Root/static/techSupport/designTools/spiceModels/license/spice_general.html for License Statement. Use of this model 
* indicates your acceptance of the terms and provisions in the License Statement.
*
* BEGIN Notes: 
*
* Not Modeled:
*    
* Parameters modeled include: 
*
* END Notes
*
* Node Assignments
*			noninverting input
*			|	inverting input
*			|	|	 positive supply
*			|	|	 |	 negative supply
*			|	|	 |	 |	 output
*			|	|	 |	 |	 |
*			|	|	 |	 |	 |
.SUBCKT AD8630		1	2	99	50	45
* 
* INPUT STAGE
*
M1   4  7  8  8 PIX L=1E-6 W=174.1E-6
M2   6  2  8  8 PIX L=1E-6 W=174.1E-6
M3  11  7 10 10 NIX L=1E-6 W=174.1E-6
M4  12  2 10 10 NIX L=1E-6 W=174.1E-6
RC1  4 14 0.001E+3
RC2  6 16 0.001E+3
RC3 17 11 0.001E+3
RC4 18 12 0.001E+3
RC5 14 50 6E+3
RC6 16 50 6E+3
RC7 99 17 6E+3
RC8 99 18 6E+3
*Set teh secondary pole at 17MHz using c1,c2 and RC5..
C1  14 16 5.40E-12
C2  17 18 5.40E-12
I1  99  8 100E-6
I2  10 50 100E-6
V1  99  9 0.3
V2  13 50 0.3
D1   8  9 DX
D2  13 10 DX
* POLY font rewritten to make it work under gnucap
* EOS  7  1 POLY(3) (22,98) (73,98) (81,98) 1E-6 1 1 1
EOS1 7 1 22 98 .5
EOS2 7 1 73 98 .5
EOS3 1 1 81 98 .5



IOS  1  2 25E-12
*
* CMRR 120dB, ZERO AT 20Hz
*
ECM1 21 98 POLY(2) (1,98) (2,98) 0 .5 .5
RCM1 21 22 50E+6
CCM1 21 22 159E-12
RCM2 22 98 50
*
* PSRR=115dB, ZERO AT 20Hz
*
RPS1 70  0 1E+6
RPS2 71  0 1E+6
CPS1 99 70 1E-5
CPS2 50 71 1E-5
EPSY 98 72 POLY(2) (70,0) (0,71) 0 1 1
RPS3 72 73 28.9E+6
CPS3 72 73 .25E-9
RPS4 73 98 40
*
* VOLTAGE NOISE REFERENCE OF 20nV/rt(Hz)
*
VN1 80 98 0
RN1 80 98 16.45E-3
HN  81 98 VN1 20
RN2 81 98 1
*
* INTERNAL VOLTAGE REFERENCE
*
EREF 98  0 POLY(2) (99,0) (50,0) 0 .5 .5
GSY  99 50 (99,50) 44E-6 
EVP  97 98 (99,50) 0.5
EVN  51 98 (50,99) 0.5
*
* LHP ZERO AT 17MHz, POLE AT 50.3MHz
*
E1 32 98 POLY(2) (4,6) (11,12) 0 .6689 .6689
R2 32 33 3.164E+3
R3 33 98 9.362E+3
C3 32 33 1E-12
*
* GAIN STAGE
*
G1 98 30 (33,98) 25E-6
R1 30 98 2.46E+9
CF 45 30 12.4E-12
D3 30 97 DX
D4 51 30 DX
*
* OUTPUT STAGE
*
M5  45 46 99 99 POX L=1E-6 W=1.47E-3
M6  45 47 50 50 NOX L=1E-6 W=1.90E-3
EG1 99 46 POLY(1) (98,30) 0.5303 1
EG2 47 50 POLY(1) (30,98) 0.5058 1
*
* MODELS
*
.MODEL POX PMOS (LEVEL=2,KP=10E-6,VTO=-0.328,LAMBDA=0.01,RD=0)
.MODEL NOX NMOS (LEVEL=2,KP=10E-6,VTO=+0.328,LAMBDA=0.01,RD=0)
.MODEL PIX PMOS (LEVEL=2,KP=100E-6,VTO=-1,LAMBDA=0.01)
.MODEL NIX NMOS (LEVEL=2,KP=100E-6,VTO=+1,LAMBDA=0.01)
.MODEL DX D(IS=1E-14,RS=5)
.ENDS AD8630
*






