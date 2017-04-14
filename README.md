GOAL
------

The schematic is the language of electronics. Webtronix exists to simplify posting of schematics and improve discussion of electronic circuits.The output is SVG so it will open in most browsers. It uses Emscripten compiled Gnucap to do simulation.

Webtronix is not meant to replace professional tools, it is meant to complement them. I feel that free tools are a necessity and open source and standardization have a great advantage.

1.To create schematics that can easily be shared for discussion and improvements.

2.To create Schematics that can simulate and verify circuits.

3.To use the web in ways that benefit the users.

I have big ideas for web based engineering tools and I would love to be part of a related project. My blog is at http://wikitronic.blogspot.com/.
 
DEMO
------


[Try the Demo.](http://logical.github.io/webtronix/schematic.html) 


If you have problems running the demo or if you have suggestions, please send me an email or create an issue.

This demo stores gnucap-ugly.js in browser cache to keep from re-downloading it.It is 3.8mb.


STATUS 
------

Lately I have slacked off on browser compatibility testing.I will always test in firefox,sometimes chrome, and seldom internet explorer.

The code is javascript originally based on Richdraw. It can save and open svg files. It has a small part library. 

I was hoping for a few volunteers and more community involvement. If you would like to contribute, you can do so by opening issues for bugs, helping me solve open issues or just suggesting improvements. Webtronics is almost out of alpha phase. Which means I have decided on the core features. You might be able to add your name to the list of contributors.

LATEST
------
Mostly I am using webtronix myself because I only run linux and there are not a lot of choicese for simulating circuits. 
Fixing all the features I tried to add. I tried to do too much at once. The code is getting bigger but is still maintainable when I am familiar with it.
I would like to be able to create subcircuits from the editor and be able to use them as equivalents when actual models are not available. 
This may create dependancy problems where part A includes part B and I haven't figured out how to deal with those yet.

