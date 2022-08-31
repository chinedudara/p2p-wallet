![Moni Logo](https://global-uploads.webflow.com/619220ea93ebf686940fc117/61cec870f1c081dc9efc2cbd_Moni%20logo.svg)

# **Peer-To-Peer Wallet**

#### **Submission Links**

- API Production Link: [p2pwallet.herokuapp.com/](https://p2pwallet.herokuapp.com)
- Github Repository: [chinedudara/p2p-wallet](https://github.com/chinedudara/p2p-wallet)
- Postman Collection: [View Postman API documentation](https://documenter.getpostman.com/view/6147899/VUxNRnb1)

---

This documents provides information about my implementation of the Moni Backend Engineering Assessment
which requires that I build a simple P2P wallet system with the following features:

- Users should be able to fund their wallets on the system
- Users should be able to send funds to other users on the system

The document is divided into several sections, listed below

## **High Level System Design**

The diagram below shows the various components of the system as can be inferred from its requirements. This is a simplified representation of the system.

![high level diagram](https://res.cloudinary.com/class-attend/image/upload/v1660737498/class-attend/high_level_diagram_gllicu.jpg)

The API services users' request from both mobile and web platforms.

The database system used here is PostgreSQL. The app and database are hosted on Heroku.

## **Design Assumptions**

- A unique 10 digit Account Number(Wallet) is automatically created for a user on sign up, this holds the user's digital assets
- A user must first set an 4 digit account PIN for transfers to be authorized
  > Just like the password this PIN is hashed before storage on the database.
- A single User can only have one Wallet
  > This assumption is made primarily for the sake of simplicity. Since the generated account number is unique, the system can easily be extended to allow for multiple wallets for a single user (even in multiple currencies)
- The recipient of a transfer can be identified either by his account number or username
- The system integrates **Paystack** (or a similar service) for receiving inflows into the system
- To confirm user payments, the system provides a webhook (POST endpoint) which listens for an event from the payment provider(Paystack). It receives data on all payments made and proceeds with the required account funding action.
  > This is a publicly available URL and is secured by HMAC SHA512 signature validation to verify the event originated from the payment provider. It can be further protected by IP whitelisting. Some metadata has to be sent along with received event payload to help identify the user account for which the payment was made.
- Money transfer between users is done at the virtual account level.
  > This means a user can only credit another user's wallet account and cannot send funds directly to another user's external bank account

## **Implementation Details**

The major features of the app,

- Accounts
- Deposits
- Transfers
- Deposit History
- Transfer History

### **Account Feature:**

The account feature, which we might also refer to as the virtual wallet of the system allow users to hold digital assets, which can be transferred to other users of the system or exchanged for value (in the form of services).

### **Deposit Feature:**

The deposit feature is how users are able to fund their account (wallet) with digital assets (the `money` or `value` of the system). This feature handles the integration with payment providers (like Paystack) to convert users assets in monetary value to the form used within our system.

### **Transfer Feature:**

With this feature a user of the system can send digital assets (funds) held in his/her account (or wallet) to another user of the system.

In order to guarantee data validity (of the user account balance), the funds transfer operation are done within database transactions, having ACID properties.

### **Deposit and Transfer History:**

This holds all CREDIT and DEBIT transactions on users' accounts. Transactions here refer to a record of all events that results in the increment or decrement of a user's account balance.

The transaction types available in the system are:

1. CREDIT
   - Fund Account (from bank transfer, cards etc)
   - Receive inflow from other Users
2. DEBIT
   - Transfer to Other Users

## **Database Models**

This section describes the various tables in which data is stored and the relationship between them. Below an image showing the tables. For simplicity the relationships between tables are kept minimal. 
![Database Schema](https://i.ibb.co/ygD1fnG/p2p-wallet-ER-diagram.png)

> Note that the diagram does not explicitly specify the relationship that exists between the tables

### **User Table**

The users table as shown in the diagram above holds the primary data of each user, as collected during signup. The `id` is automatically generated and the `password` is encrypted before being stored to the database.

### **Account Table**

This table holds information about users' fund. It can also be referred to as the Wallet of the user. The balance column holds the Naira (or funding currency) equivalent with which the user funded his or her wallet.

This table has a **one-to-one** relationship with the users table as a single user can only possess a single wallet (as earlier stated in the design assumptions)

### **Deposit Log Table**

This holds all deposit transactions from the payment provider.

This table has a **one-to-many** relationship with the `user` table

### **Transfer Log Table**

This holds all transfers within the system

This table has a **one-to-many** relationship with the `user` table

## **Data Flow Diagram**

This section demonstrates how data flows across the system using the flowchart diagram below.

### **Project Folder Structure**

This section describes the structure of the files/folders which hold the project code.

![Project folder structure](https://i.ibb.co/9WXmfdq/p2p-wallet-project-structure.png)

