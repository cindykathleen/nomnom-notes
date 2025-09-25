# NomNom Notes

This full-stack web application enables users to create and manage personalized restaurant lists, add reviews for restaurants they've visited, and visualize their lists on an interactive map. Users can search for restaurants using the Google Places API and add them to specific lists. Each restaurant entry allows users to log dishes with custom fields for the dish name, reviews, and an optional image upload. Users can also collaborate on lists by inviting other users to contribute by adding their own reviews to restaurants and dishes in the list. All data is stored and managed in a MongoDB database.

## Features

### Profile features
* User can create an account and sign in

### List features
* User can create, edit, and delete lists
* User can add an image (by URL link or file upload) for their list
* User can add a description for their list
* User can sort the restaurants in each list by "Recently added" or by "Name"
* User can remove restaurants from their list
* User can set the list visibility to private or public

### Search features
* User can search for restaurants by name
* User can see basic restaurant details (name, restaurant type, address, cover photo)
* User can view the restaurant in Google Maps
* User can choose what list to save the restaurant to
* User can only submit 100 new search queries per 24 hours

### Restaurant features
* User can add a review for each restaurant
* User can create, edit, and delete dishes for each restaurant
* User can add an image (by URL link or file upload) for their dish
* User can add a review for each dish

### Map features
* An interactive map will show the locations of the restaurants in each list
* User can only load the map 250 times per 24 hours

### Collaboration features
* User can choose to share their lists with other registered users
* Collaborators can add and remove restaurants and dishes in the list
* Collaborators can add their own reviews for all restaurants and dishes in the list

## Tech Stack

**Frontend:** React, Next.js, Tailwind CSS

**Backend:** Node.js, MongoDB, Better Auth

**APIs:** Google Places API, Google Photos API, Google Maps JavaScript API

## Screenshots
![A sign up page](./images/signup-page.png)
A page where users can sign up for an account.

![A sign in page](./images/signin-page.png)
A page where users can sign in to their account.

![A page with all of the user's lists](./images/lists-page.png)
A page showing all of the custom lists that the user has created or is a collaborator of. The user can drag-and-drop each list to change the order of how they appear. The user can also create a new list by clicking on the gray tile with the plus icon. This page can also be accessed by clicking on "Lists" in the sidebar.

![Editing a list](./images/lists-edit.png)
A pop-up modal that allows the user to make edits to a specific list. When the visibility is set to private, only the list owner and collaborators can view the list. When the visibility is set to public, anybody with the list link can view the list. The user can choose to use an external image URL or upload their own image file. If the user chooses to use an external image URL, it will be checked if the image is valid before allowing the user to use it. An image preview will appear for any image URL added or image file uploaded.

![Sharing a list](./images/lists-share.png)
The owner of the list can choose to share their list with other registered users. They can share via a unique link that will be generated when the "Copy invitation link" button is clicked. They can also view who is currently has access to the list. They can remove existing collaborators on the list by clicking the "X" button.

![A page inviting a user to collaborate on a list](./images/invitation-page.png)
A page where a user is being invited to collaborate on a list. 

![Search page](./images/search-page-default.png)
The default search page where a user can search for specific restaurants by entering the name into the input bar or view recommendations for top-rated restaurants, varying by cuisine.

![Searching for restaurants](./images/search-page-results.png)
The search page results where related results will appear (maximum of 20), and the user can select on which one to add to their list. The user can also click on the "Google Maps" link to view it there. This page can also be accessed by clicking on "Search" in the sidebar.

![A list page with all of the restaurants saved](./images/list-page.png)
A page for each custom list with the restaurants that were saved into the list. The user can sort the list by "Recently added" or by "Name". The user can edit restaurant description and ratings, or delete them from the list. All of the restaurants' locations on the list are added to an interactive map that the user can scroll and click around.

![A restaurant page with all of the dishes saved](./images/restaurant-page.png)
A page for each restaurant with the dishes that were added. The user can drag-and-drop each dish to change the order of how they appear. The user can also create a new dish by clicking on the gray tile with the plus icon.

![Adding a dish](./images/dish-add.png)
A pop-up modal that allows the user to add a dish to a specific restaurant. Only the name is a required field. To set a rating, the user can hover over the stars and click on the rating they would like to give (by half-star increments). If no image is provided, a default placeholder image will be used.

![Multiple reviews](./images/dish-reviews.png)
A pop-up modal that shows all of the reviews for a restaurant or dish.

## Future improvements
* **Responsive design:** Make the web application dynamically adapt to various screen sizes and devices for optimal user experience and accessibility. 
* **Host the site:** Deploy the web application to make it publicly accessible in a live environment.