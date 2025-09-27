# Borí Cano KDS - Interactive Menu Prototype

This project is a high-fidelity, clickable prototype of an interactive restaurant menu for a fictional restaurant, "Borí Cano". It's designed to run directly in a browser, allowing customers to browse the menu, customize items, and build a multi-person order directly from their table.

The application is built with modern frontend technologies and focuses on a clean, intuitive user experience.

## ✨ Features

- **Dynamic Table ID**: The app automatically detects the table number from a URL parameter (e.g., `?table=mesa_5`), personalizing the welcome message.
- **Menu Navigation**: Browse the menu through well-defined categories, including a special, highlighted section for "Especiales del Día" (Chef's Specials).
- **Detailed Item View**: Each menu item has a dedicated detail screen with:
    - High-quality photos.
    - Detailed descriptions.
    - Pricing information.
    - Dietary and special badges (e.g., "Vegano", "Sin Gluten", "Del Chef").
    - (Simulated) Audio descriptions for an accessible experience.
- **Item Customization**: Users can personalize their orders with:
    - Single-choice options (e.g., steak cooking temperature).
    - Multiple-choice options (e.g., add-ons).
    - Price adjustments based on selected options.
    - Custom notes for the kitchen staff.
- **Multi-Guest Ordering**:
    - The cart supports orders for multiple guests at the same table.
    - Users can easily add guests and assign specific items to each person.
- **Comprehensive Cart**:
    - A clear summary of the entire order.
    - Ability to adjust item quantities or remove them.
    - A dedicated section for general order notes and allergy information.
    - Automatic calculation of subtotal, taxes, and service charges.
- **Order Confirmation**: After submitting the order, a confirmation screen appears with a unique order ID and an estimated preparation time.
- **Responsive Design**: The UI is designed to work seamlessly on various device sizes, from mobile phones to tablets.
- **Zero Build Setup**: Runs directly in the browser using ES Modules and an import map, requiring no complex build process.

## 💻 Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/) (v19) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API for cart management.
- **Module System**: Native ES Modules with [Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap).

## 📂 Project Structure

The project is organized into logical directories to maintain clean and scalable code.

```
.
├── components/         # Reusable React components (Header, Badge, Icons)
│   └── icons/          # SVG icon components
├── contexts/           # React Context for global state (CartContext.tsx)
├── data/               # Mock data for the application (menuData.ts)
├── screens/            # Top-level components for each screen of the app
├── App.tsx             # Main component, handles screen navigation
├── constants.ts        # Application-wide constants (tax rates, etc.)
├── index.html          # The single HTML entry point for the application
├── index.tsx           # The root of the React application
├── metadata.json       # Project metadata
├── types.ts            # TypeScript type definitions for data structures
└── README.md           # You are here!
```

## 🚀 Getting Started

This project is designed to be run without a build step. All you need is a local web server.

### Prerequisites

- A modern web browser that supports ES Modules and Import Maps (Chrome, Firefox, Edge, Safari).
- A simple local web server. If you have Python or Node.js installed, you're all set.

### Running the Application

1.  **Clone the repository or download the source code.**

2.  **Navigate to the project's root directory** in your terminal.

3.  **Start a local web server.** Here are a few common ways:

    - **Using Python:**
      ```bash
      # For Python 3.x
      python -m http.server
      ```

    - **Using Node.js (with the `serve` package):**
      ```bash
      # If you don't have 'serve' installed, run this first: npm install -g serve
      serve .
      ```

4.  **Open the application in your browser.**
    - The server will typically start on a local port like `8000`, `5000`, or `3000`. Open your browser and go to `http://localhost:8000` (or the port specified by your server).
    - To simulate being at a specific table, add a query parameter to the URL. For example: `http://localhost:8000/?table=mesa_12`

## 📖 How to Use

1.  Upon loading, you'll see a **Welcome Screen** personalized with your table number.
2.  Click **"Ver el Menú"** to navigate to the **Categories Screen**.
3.  Select a category to view the **Item List Screen**.
4.  Tap on any item to open its **Item Detail Screen**.
5.  Customize your item using the available options, adjust the quantity, and add any special notes.
6.  Select which guest the item is for (e.g., "Persona 1"). You can add more guests if needed.
7.  Click the **"Añadir"** button to add the item to your cart. You will be taken back to the previous screen to continue ordering.
8.  At any time, click the **Cart Icon** in the header to go to the **Cart Screen**.
9.  In the cart, you can review all items for all guests, add general notes, specify allergies, and see the total cost.
10. When ready, click **"Enviar a Cocina"** to place the order.
11. A **Confirmation Screen** will appear with your order ID. From here, you can choose to start a new order to add more items.
