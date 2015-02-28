* AD8221 SPICE Macro-model
* Description: Amplifier 
* Generic Desc: 30/36V Bipolar,  IN AMP, Hi CMRR ,Single
* Developed by: PRB IAP ADI
* Revision History: 08/10/2012 - Updated to new header style
* 1.0 (10/2010) - Changed Negative Zero stage to remove the
*     negative capacitor value.  
* Copyright 2012 by Analog Devices.
*
* Refer to http://www.analog.com/Analog_Root/static/techSupport/designTools/spiceModels/license/spice_general.html for License Statement. Use of this model
* indicates your acceptance with the terms and provisions in the License Statement.
*
* BEGIN Notes:
*
* Not Modeled:
* Temperature effects
* PSRR
* Parameters modeled include: 
*
* END Notes
*
* Node assignments
*                 inverting input
*                 |   RG
*                 |   |    RG
*                 |   |    |  non_inverting input
*                 |   |    |    |    negative supply
*                 |   |    |    |    |    ref
*                 |   |    |    |    |    |   output
*                 |   |    |    |    |    |    |     positive supply
*                 |   |    |    |    |    |    |     |
.SUBCKT AD8221  IN-  RG-  RG+  IN+  -Vs   REF  VOUT  +Vs         
** INPUT STAGER1 sub_out sub_neg 10E3
R1 sub_out sub_neg 10E3
R2 sub_neg Inverting_Out 10E3
R3 sub_pos noninverting_out 10001
R4 REF sub_pos 10k
R5 RG- N003 24700
R6 RG+ N010 24724
D3 N003 P001 D
D4 P002 N003 D
V3 P002 VNEGx 0.94
V4 VPOSx P001 .71
D5 N010 P003 D
D6 P004 N010 D
V5 P004 VNEGx 0.94
V6 VPOSx P003 .71
D7 N005 P005 D
D8 P006 N005 D
V7 P006 VNEGx 2.0
V8 VPOSx P005 1.7
D9 N016 P007 D
D10 P008 N016 D
V9 P008 VNEGx 2.0
V10 VPOSx P007 1.7
D11 N009 P009 D
D12 P010 N009 D
V11 P010 N017 1.7
V12 N008 P009 1.7
D13 REF P011 D
D14 P012 REF D
V13 P012 VNEGx .3
V14 VPOSx P011 .3
D15 sub_pos P013 D
D16 P014 sub_pos D
V15 P014 VNEGx 0.9
V16 VPOSx P013 0.9
E4 Inverting_Out 0 N003 0 1
E5 noninverting_out 0 N010 0 1
V1 VBIAS +Vs 20
I1 VBIAS Pos_Fdbk 20E-6
I2 VBIAS Inv_Fdbk 20E-6
C1 N003 Inv_Fdbk 9.235e-12
C2 N010 Pos_Fdbk 9.2e-12
E8 N002 0 N005 0 1
E9 N013 0 N016 0 1
VOSI_Neg N004 IN- 25E-6
VOSI_Pos IN+ N014 24E-6
VOSO VOUT N009 300E-6
C3 RG- 0 .200e-12
C4 RG+ 0 .135e-12
I23 IN- 0 1.4E-9
I24 IN+ 0 0.8E-9
G1 0 IN+ N018 N019 .0025e-9
R13 IN+ N018 10e9
R14 N018 IN- 10e9
R15 +Vs N019 10e9
R16 N019 -Vs 10e9
G2 0 IN- N018 N019 .0025e-9
E10 VPOSx 0 +Vs 0 1
I3 +Vs -Vs 900E-6
G3 +Vs -Vs +Vs -Vs 1e-6
E11 VNEGx 0 -Vs 0 1

H3 N006 N004 V24 4.5
V24 N001 0 0
R19 N001 0 .0166
H4 VX sub_out V25 64
V25 N007 0 0
R20 N007 0 .0166
H5 N015 N014 V26 4.5
V26 N011 0 0
R21 N011 0 .0166
G4 0 N005 N006 N005 1
G5 0 N016 N015 N016 1
G6 0 N003 VBIAS Inv_Fdbk 1
G7 0 N010 VBIAS Pos_Fdbk 1
G8 0 sub_out sub_pos sub_neg 1
R10 N005 0 10e9
R7 N003 0 10E9
R11 N016 0 10E9
R8 N010 0 10E9
R9 sub_out 0 10E9
Q1 Pos_Fdbk N013 RG+ 0 NPN
Q2 Inv_Fdbk N002 RG- 0 NPN
G9 0 N012 VY N009 1
G10 0 N009 N012 0 .002
R12 N012 0 1e10
R17 N009 0 500
C5 N012 0 1.4e-7
C6 N009 0 700e-12
C8 VY 0 1e-9
*G11 0 VY VALUE = { LIMIT( 1*V(VX,VY), .002, -.002) }
g11 0 vy vx vy fit ( -18, -.002 18, .002 ) order=1 above=.002 below=-.002
R22 VY 0 1e9
R18 VBIAS Inv_Fdbk 1e9
R23 Pos_Fdbk VBIAS 1e9
D1 sub_out P015 D
V2 VPOSx P015 1.7
D2 P016 sub_out D
V17 P016 VNEGx 1.7

H1 VPOSx N008 POLY(1) VOSO 0 0 8000
H2 N017 VNEGx POLY(1) VOSO 0 0 8000

* MODELS USED
*
.model D D
.model NPN NPN
.ENDS AD8221

