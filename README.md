# North Star Bakery Website

I created this multi-page website for North Star Bakery as part of my Introduction to Web Development course. I first built the structure and content with HTML, then added a shared external stylesheet to create a warm, consistent design and a responsive layout.

The website includes home, products, about, and contact pages. I used Flexbox, a mobile-first layout, and a media query so the navigation, content sections, and form adjust for larger screens.

## How to View the Website

The easiest way to view my website is to open the live GitHub Pages link:

[View the North Star Bakery website](https://soriano-r.github.io/North-Star-Bakery/)

## How to Run It Locally

This is a static HTML and CSS website, so it does not require installation or extra dependencies.

1. Download the repository by selecting **Code** and then **Download ZIP**, or clone it with Git:

   ```bash
   git clone https://github.com/Soriano-R/North-Star-Bakery.git
   ```

2. Open the downloaded `North-Star-Bakery` folder.

3. Double-click `index.html` to open the home page in a web browser.

4. Use the navigation menu to visit the Products, About Us, and Contact and Preorders pages.

I can also run the website through a local development server. From inside the project folder, I can enter:

```bash
python3 -m http.server 8000
```

Then I can open [http://localhost:8000](http://localhost:8000) in a browser. I can stop the server by pressing `Control+C` in the terminal.
