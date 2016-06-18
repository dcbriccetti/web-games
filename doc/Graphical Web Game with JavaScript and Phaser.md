# Graphical Web Game with JavaScript and Phaser

## Resources
- [Phaser API Reference](http://phaser.io/docs/2.4.8/)
- Mozilla Developer Network
    - [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
    - [Introduction to the Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [Mozilla Breakout Game Tutorial](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser)

# Session 1
### Goals
- Understand a very simple Web app with JavaScript
- Become familiar with Phaser via the [sandbox](http://phaser.io/sandbox)
- Learn to use an integrated development environment (IDE) for web development
- Learn to clone or copy code from Github
- Learn to enhance a simple Phaser program in the IDE

### Introduction
#### [JavaScript](https://en.wikipedia.org/wiki/JavaScript)
#### [Phaser](http://phaser.io)

### Activities
- Walk through a [very simple Web app](https://github.com/dcbriccetti/web-games/tree/master/simple-js/index.html)
with JavaScript

## Phaser [Sandbox](http://phaser.io/sandbox) Challenges

### Platformer
- Change how high the character jumps
- Add another platform
- Let the character leave the screen
- Replace the character graphic

### Shoot ’em Up
- Change how fast the player moves
- Change how fast the bullets move
- Change how quickly the bullets fire
- Make the sprite move in all four directions

## Getting Code from Github
Go to Dave’s [web-games](https://github.com/dcbriccetti/web-games) Github
repository and clone it (if you know how), or download a zip and extract all the files.
Store your copy of the repository (a directory called `web-games-master`) in a location you will remember.

## Using NetBeans
In NetBeans, create a project using the repository:
- Choose File -> New Project, then HTML5 Application with Existing Sources
- Set the Site Root to the `web-games-master` directory.
- Push `Finish`
- Expand the project in the Project window and under Site Root, expand simple-js
- Double-click index.html
- Right-click in the large window showing index.html and choose Run File. Your browser should now show
a simple web app that displays a random number.

## The Simple Web App
- Add a feature to have the random number update every second

## The Simple Phaser Game
Open the directory called simple-game, and open the index.html within. Run it. Make these improvements:
- Replace the graphic with one that you draw or find, considering appropriate use
  - Consider using [Creative Commons Search](https://search.creativecommons.org/)
- Make the character move in all four directions
- Change the movement speed
- Experiment with different `drag` values

## Questions
- What is NetBeans?
- What is an IDE?
- What is Phaser?
- What is JavaScript?
- What are the names of some functions used in a Phaser program?
- What are some things about particle emitters that are adjustable?
- What is one way to call a JavaScript function over and over, at
a specified interval?
- What’s an oscillator?

## Homework
- Brainstorm game ideas
- Review what we learned
- Optional
  - Make some art
  - Make some music and sound effects


# Session 2

## Review Previous Questions and Homework

## More JavaScript
Create a program to insert lots of random numbers into the page.

## More Phaser
- Copy the simple-game directory into your own project (separate from the web-games-master project).
- Add an enemy character

## Questions

- How did we make lots of random numbers?
- How can JavaScript code find an HTML element in the page?

# Session 3

## More Phaser, Continued
- Have the enemy slowly chase the player
- Kill a sprite on collision
- Rotate a sprite

# Session 4

## Review Questions
- How did we make the enemy chase the player?
- How did we handle collisions?
- How did we make a sprite rotate?

## New Program: Jack Bites the Dust
- Demo
- Explain
    - Game states

## Animation
- See the new version of the simple-game for walk-right and walk-left animations. Both animations are in
the same sprite sheet.

## Questions
- Describe tweeening
- How do you load and play audio?
- Describe degrees and radians
- How do you animatio a sprite?