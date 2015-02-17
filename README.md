GOAL
------

The schematic is the language of electronics. Webtronics exists to simplify posting of schematics and improve discussion of electronic circuits.The output is SVG so it will open in most browsers. It uses Emscripten compiled Gnucap to do simulation.

I have big ideas for web based engineering tool and I would love to be part of a related project. I feel that free tools are a neccesity and open source and standardization have a great advantage.

1.To create schematics that can easily be shared for discussion and improvements.

2.To create Schematics that contain spice information to simulate and verify circuits.

3.To improve version control of schematics.
 
Demo
------

[Try the Demo.](http://logical.github.io/webtronix/schematic.html) 


If you have problems running the demo or if you have suggestions, please send me an email or create an issue.

This demo stores gnucap-ugly.js in browser cache to keep from re-downloading it.It is 3.8mb.


STATUS
------

Lately I have slacked off on browser compatibility testing.I will always test in firefox,sometimes chrome, and seldom internet explorer.

The code is javascript based on Richdraw. It can save and open svg files. It has a small part library. It has a chip maker that makes rectangles with up to 200 pins. If you want to download Webtronics please use Subversion to get the latest version. 

I was hoping for a few volunteers and more community involvement. If you would like to contribute, you can do so by opening issues for bugs, helping me solve open issues or just suggesting improvements. Webtronics is almost out of alpha phase. Which means I have decided on the core features. You might be able to add your name to the list of contributors.

LATEST
------

After using the program a while I noticed I spent a lot of time doing some actions that could be automated. I am making changes to automate some of those actions.
 
Improved image output 
